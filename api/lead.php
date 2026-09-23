<?php
declare(strict_types=1);

/**
 * Приёмник заявок с сайта KodBuster.
 * POST JSON { name, phone, comment, consent, website, form_started_at, page, package }
 * → сообщение в Telegram (Bot API) и MAX (Bot API).
 * Ответ: { "ok": true } или { "ok": false, "error": "…" }.
 *
 * Размещается на PHP-хостинге отдельно от статики (GitHub Pages не выполняет PHP).
 * Настройки — в api/config.local.php, см. config.example.php.
 */

require __DIR__ . '/config.php';
require __DIR__ . '/antibot.php';

$config = kb_config();

kb_send_cors_headers($config);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  kb_respond(405, 'Метод не поддерживается.');
}

$raw = file_get_contents('php://input') ?: '';
$payload = json_decode($raw, true);
if (!is_array($payload)) {
  kb_respond(400, 'Некорректный запрос.');
}

$antibotError = antibot_check_request($payload);
if ($antibotError !== null) {
  kb_respond(400, $antibotError);
}

$name = trim((string) ($payload['name'] ?? ''));
$phoneDigits = antibot_phone_digits((string) ($payload['phone'] ?? ''));
$comment = trim((string) ($payload['comment'] ?? ''));
$consent = !empty($payload['consent']);
$page = trim((string) ($payload['page'] ?? ''));

if (antibot_is_bad_name($name)) {
  kb_respond(400, 'Напишите, как к вам обращаться.');
}
if (antibot_is_fake_phone_digits($phoneDigits)) {
  kb_respond(400, 'Укажите мобильный номер в формате +7 (9XX) XXX-XX-XX.');
}
if (mb_strlen($comment) > 1000) {
  kb_respond(400, 'Комментарий слишком длинный.');
}
if (!$consent) {
  kb_respond(400, 'Нужно согласие на обработку данных.');
}

$phonePretty = sprintf(
  '+7 (%s) %s-%s-%s',
  substr($phoneDigits, 1, 3),
  substr($phoneDigits, 4, 3),
  substr($phoneDigits, 7, 2),
  substr($phoneDigits, 9, 2),
);

$package = trim((string) ($payload['package'] ?? ''));
$allowedPackages = ['Старт', 'Рост', 'Система'];

$lines = [
  "Новая заявка с сайта «{$config['SITE_NAME']}»",
  '',
  "Имя: {$name}",
  "Телефон: {$phonePretty}",
];
if (in_array($package, $allowedPackages, true)) {
  $lines[] = "Пакет: «{$package}»";
}
if ($comment !== '') {
  $lines[] = "Комментарий: {$comment}";
}
if ($page !== '' && filter_var($page, FILTER_VALIDATE_URL)) {
  $lines[] = "Страница: {$page}";
}
$lines[] = 'Время: ' . date('d.m.Y H:i:s');
$text = implode("\n", $lines);

$telegramTargets = kb_split_list($config['TELEGRAM_CHAT_IDS']);
$maxTargets = kb_split_list($config['MAX_RECIPIENT_IDS']);
$hasTelegram = $config['TELEGRAM_BOT_TOKEN'] !== '' && $telegramTargets !== [];
$hasMax = $config['MAX_BOT_TOKEN'] !== '' && $maxTargets !== [];

if (!$hasTelegram && !$hasMax) {
  error_log('lead.php: no delivery channel configured');
  kb_respond(500, 'Приём заявок временно недоступен. Напишите нам в мессенджер.');
}

$delivered = 0;
$errors = [];

if ($hasTelegram) {
  foreach ($telegramTargets as $chatId) {
    $ok = kb_post_json(
      "https://api.telegram.org/bot{$config['TELEGRAM_BOT_TOKEN']}/sendMessage",
      ['chat_id' => $chatId, 'text' => $text, 'disable_web_page_preview' => true],
      [],
      $error,
    );
    if ($ok) {
      $delivered++;
    } else {
      $errors[] = "telegram {$chatId}: {$error}";
    }
  }
}

if ($hasMax) {
  foreach ($maxTargets as $userId) {
    $ok = kb_post_json(
      'https://platform-api.max.ru/messages?user_id=' . rawurlencode($userId),
      ['text' => $text, 'notify' => true],
      ['Authorization: ' . $config['MAX_BOT_TOKEN']],
      $error,
    );
    if ($ok) {
      $delivered++;
    } else {
      $errors[] = "max {$userId}: {$error}";
    }
  }
}

if ($errors !== []) {
  error_log('lead.php delivery errors: ' . implode('; ', $errors));
}
if ($delivered === 0) {
  kb_respond(502, 'Не удалось доставить заявку. Попробуйте позже или напишите нам в мессенджер.');
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
exit;

// ---------------------------------------------------------------------------

function kb_send_cors_headers(array $config): void
{
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowed = kb_split_list($config['ALLOWED_ORIGINS']);
  if ($origin !== '' && in_array(rtrim($origin, '/'), $allowed, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 600');
  }
}

function kb_respond(int $status, string $error): never
{
  http_response_code($status);
  echo json_encode(['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
  exit;
}

function kb_post_json(string $url, array $body, array $headers, ?string &$error): bool
{
  $error = null;
  $ch = curl_init($url);
  if ($ch === false) {
    $error = 'curl init failed';
    return false;
  }
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
  ]);
  $response = curl_exec($ch);
  $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $curlError = curl_error($ch);
  curl_close($ch);

  if ($response === false) {
    $error = $curlError !== '' ? $curlError : 'network error';
    return false;
  }
  if ($status < 200 || $status >= 300) {
    $error = "http {$status}: " . mb_substr((string) $response, 0, 200);
    return false;
  }
  return true;
}
