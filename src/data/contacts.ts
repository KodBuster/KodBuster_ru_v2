const clean = (value: string | undefined) => (value ?? "").trim();

const phone = clean(process.env.NEXT_PUBLIC_PHONE);
const telegramUrl = clean(process.env.NEXT_PUBLIC_TELEGRAM_URL) || "https://t.me/kodbuster";
const maxUrl = clean(process.env.NEXT_PUBLIC_MAX_URL);
const leadEndpoint = clean(process.env.NEXT_PUBLIC_LEAD_ENDPOINT);

/**
 * Контакты студии. Значения приходят из переменных окружения на этапе сборки,
 * чтобы в репозитории не было выдуманных номеров и ссылок.
 * Пустое значение означает, что канал не показывается на сайте.
 */
export const contacts = {
  phone: phone || null,
  phoneHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null,
  telegramUrl,
  telegramLabel: telegramUrl.replace(/^https?:\/\/(www\.)?/, ""),
  maxUrl: maxUrl || null,
  leadEndpoint: leadEndpoint || null,
} as const;

export const contactAnchor = "#contact";
