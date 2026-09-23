<?php
declare(strict_types=1);

/**
 * Защита формы от ботов. Правила совпадают с src/lib/lead-validation.ts.
 * Сообщения ботам нейтральные, без описания ловушек.
 */

const ANTIBOT_MIN_SECONDS = 3;
const ANTIBOT_MAX_SECONDS = 7200;

function antibot_check_request(array $payload): ?string
{
  if (!empty($payload['website'])) {
    return 'Не удалось отправить заявку. Попробуйте позже.';
  }

  $startedAt = (float) ($payload['form_started_at'] ?? 0);
  if ($startedAt <= 0) {
    return 'Не удалось отправить заявку. Попробуйте ещё раз.';
  }
  $elapsed = (microtime(true) * 1000 - $startedAt) / 1000;
  if ($elapsed < ANTIBOT_MIN_SECONDS || $elapsed > ANTIBOT_MAX_SECONDS) {
    return 'Не удалось отправить заявку. Попробуйте ещё раз.';
  }

  return null;
}

function antibot_phone_digits(string $value): string
{
  $digits = preg_replace('/\D/', '', $value) ?? '';
  if (str_starts_with($digits, '8')) {
    $digits = '7' . substr($digits, 1);
  }
  if (strlen($digits) === 10 && str_starts_with($digits, '9')) {
    $digits = '7' . $digits;
  }
  return substr($digits, 0, 11);
}

function antibot_is_fake_phone_digits(string $digits): bool
{
  if (strlen($digits) !== 11 || !str_starts_with($digits, '79')) {
    return true;
  }
  $code = (int) substr($digits, 1, 3);
  if ($code < 900 || $code > 999) {
    return true;
  }
  $tail = substr($digits, 4);
  if (preg_match('/^(\d)\1{6}$/', $tail)) {
    return true;
  }
  if (preg_match('/^(0123456|1234567|7654321|9876543)$/', $tail)) {
    return true;
  }
  return false;
}

function antibot_is_bad_name(string $name): bool
{
  $trimmed = trim($name);
  $length = mb_strlen($trimmed);
  if ($length < 2 || $length > 80) {
    return true;
  }
  if (preg_match('~https?://|www\.|@~i', $trimmed)) {
    return true;
  }
  if (preg_match('/^[\d\s\-+()]+$/', $trimmed)) {
    return true;
  }
  return false;
}
