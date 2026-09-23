<?php
declare(strict_types=1);

/**
 * Загружает настройки приёмника заявок.
 * Приоритет: api/config.local.php → переменные окружения → пустые значения.
 */
function kb_config(): array
{
  static $config = null;
  if ($config !== null) {
    return $config;
  }

  $defaults = [
    'SITE_NAME' => 'KodBuster',
    'TELEGRAM_BOT_TOKEN' => '',
    'TELEGRAM_CHAT_IDS' => '',
    'MAX_BOT_TOKEN' => '',
    'MAX_RECIPIENT_IDS' => '',
    'ALLOWED_ORIGINS' => '',
  ];

  $local = [];
  $localPath = __DIR__ . '/config.local.php';
  if (is_file($localPath)) {
    $loaded = require $localPath;
    if (is_array($loaded)) {
      $local = $loaded;
    }
  }

  $config = [];
  foreach ($defaults as $key => $default) {
    $value = $local[$key] ?? getenv($key);
    $config[$key] = is_string($value) && $value !== '' ? trim($value) : $default;
  }

  return $config;
}

function kb_split_list(string $value): array
{
  return array_values(array_filter(array_map('trim', explode(',', $value)), static fn(string $item): bool => $item !== ''));
}
