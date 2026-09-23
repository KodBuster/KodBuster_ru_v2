/**
 * Правила валидации заявки. Те же правила продублированы в api/lead.php
 * и scripts/lead-dev-server.mjs — при изменении обновить все три места.
 */

export const ANTIBOT_MIN_SECONDS = 3;
export const ANTIBOT_MAX_SECONDS = 7200;

export const PACKAGE_CHOICES = ["Старт", "Рост", "Система"] as const;
export type PackageChoice = (typeof PACKAGE_CHOICES)[number];

export function packageChoice(value: unknown): PackageChoice | null {
  if (typeof value !== "string") return null;
  return (PACKAGE_CHOICES as readonly string[]).includes(value) ? (value as PackageChoice) : null;
}

export type LeadPayload = {
  name: string;
  phone: string;
  comment: string;
  consent: boolean;
  website: string;
  form_started_at: number;
  package?: string;
};

export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("9")) digits = `7${digits}`;
  return digits.slice(0, 11);
}

export function formatPhone(value: string): string {
  const digits = phoneDigits(value);
  if (!digits) return "";
  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

export function isFakePhone(digits: string): boolean {
  if (digits.length !== 11 || !digits.startsWith("79")) return true;
  const code = Number(digits.slice(1, 4));
  if (code < 900 || code > 999) return true;
  const tail = digits.slice(4);
  if (/^(\d)\1{6}$/.test(tail)) return true;
  if (/^(0123456|1234567|7654321|9876543)$/.test(tail)) return true;
  return false;
}

export function isBadName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return true;
  if (/https?:\/\/|www\.|@/i.test(trimmed)) return true;
  if (/^[\d\s\-+()]+$/.test(trimmed)) return true;
  return false;
}

export function validateLead(payload: LeadPayload, now = Date.now()): string | null {
  if (payload.website) return "Не удалось отправить заявку. Попробуйте позже.";
  const elapsed = (now - Number(payload.form_started_at || 0)) / 1000;
  if (!payload.form_started_at || elapsed < ANTIBOT_MIN_SECONDS || elapsed > ANTIBOT_MAX_SECONDS) {
    return "Не удалось отправить заявку. Попробуйте ещё раз.";
  }
  if (isBadName(payload.name)) return "Напишите, как к вам обращаться.";
  if (isFakePhone(phoneDigits(payload.phone))) return "Укажите мобильный номер в формате +7 (9XX) XXX-XX-XX.";
  if (payload.comment.length > 1000) return "Комментарий слишком длинный.";
  if (!payload.consent) return "Нужно согласие на обработку данных.";
  return null;
}
