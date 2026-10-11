const clean = (value: string | undefined) => (value ?? "").trim();

const phone = clean(process.env.NEXT_PUBLIC_PHONE) || "+7 (993) 365-43-30";
const telegramUrl = clean(process.env.NEXT_PUBLIC_TELEGRAM_URL) || "https://t.me/kodbuster";
const maxUrl = clean(process.env.NEXT_PUBLIC_MAX_URL) || "https://max.ru/u/test";
const leadEndpoint = clean(process.env.NEXT_PUBLIC_LEAD_ENDPOINT) || "/api/lead.php";

/**
 * Контакты студии. Переменные окружения подставляются при сборке.
 * Если переменная пустая, остаётся публичное значение по умолчанию.
 * Адрес формы по умолчанию — /api/lead.php на том же домене (хостинг с PHP).
 */
export const contacts = {
  phone: phone || null,
  phoneHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null,
  telegramUrl,
  telegramLabel: telegramUrl.replace(/^https?:\/\/(www\.)?/, ""),
  maxUrl: maxUrl || null,
  leadEndpoint: leadEndpoint || null,
} as const;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Ведёт на форму заявки с любой страницы, не только с главной. */
export const contactAnchor = `${basePath}/#contact`;
