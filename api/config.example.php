<?php
// Скопируйте в api/config.local.php на хостинге и заполните.
// config.local.php не коммитится (см. .gitignore).
return [
  // Название сайта — подставляется в текст сообщения.
  'SITE_NAME' => 'KodBuster',

  // Telegram: токен бота от @BotFather и chat_id получателей через запятую.
  // chat_id узнать через @userinfobot или GET https://api.telegram.org/bot<TOKEN>/getUpdates
  'TELEGRAM_BOT_TOKEN' => '',
  'TELEGRAM_CHAT_IDS' => '',

  // MAX: токен бота из @MasterBot и числовые user_id получателей через запятую.
  // Это не slug из ссылки max.ru/u/…, а числовой идентификатор пользователя.
  'MAX_BOT_TOKEN' => '',
  'MAX_RECIPIENT_IDS' => '',

  // Домены, с которых разрешено отправлять форму (CORS). Через запятую, без завершающего слэша.
  'ALLOWED_ORIGINS' => 'https://kodbuster.github.io,http://localhost:3000',
];
