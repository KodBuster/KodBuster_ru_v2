// Локальное зеркало api/lead.php для разработки: та же валидация, отправка в Telegram и MAX.
// Без токенов работает в режиме dry-run: печатает заявку в консоль и отвечает ok.
//
//   node scripts/lead-dev-server.mjs            # порт 8787
//   LEAD_PORT=9000 node scripts/lead-dev-server.mjs
//
// Переменные окружения: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS, MAX_BOT_TOKEN, MAX_RECIPIENT_IDS, SITE_NAME.
// В .env.local сайта укажите NEXT_PUBLIC_LEAD_ENDPOINT=http://localhost:8787/api/lead

import { createServer } from "node:http";

const PORT = Number(process.env.LEAD_PORT ?? 8787);
const MIN_SECONDS = 3;
const MAX_SECONDS = 7200;
const SITE_NAME = process.env.SITE_NAME ?? "KodBuster";

const list = (value) => (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
const telegram = { token: process.env.TELEGRAM_BOT_TOKEN ?? "", chats: list(process.env.TELEGRAM_CHAT_IDS) };
const max = { token: process.env.MAX_BOT_TOKEN ?? "", users: list(process.env.MAX_RECIPIENT_IDS) };

function phoneDigits(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("9")) digits = `7${digits}`;
  return digits.slice(0, 11);
}

function isFakePhone(digits) {
  if (digits.length !== 11 || !digits.startsWith("79")) return true;
  const code = Number(digits.slice(1, 4));
  if (code < 900 || code > 999) return true;
  const tail = digits.slice(4);
  return /^(\d)\1{6}$/.test(tail) || /^(0123456|1234567|7654321|9876543)$/.test(tail);
}

function isBadName(name) {
  const trimmed = String(name ?? "").trim();
  if (trimmed.length < 2 || trimmed.length > 80) return true;
  if (/https?:\/\/|www\.|@/i.test(trimmed)) return true;
  return /^[\d\s\-+()]+$/.test(trimmed);
}

function validate(payload) {
  if (payload.website) return "Не удалось отправить заявку. Попробуйте позже.";
  const elapsed = (Date.now() - Number(payload.form_started_at || 0)) / 1000;
  if (!payload.form_started_at || elapsed < MIN_SECONDS || elapsed > MAX_SECONDS) return "Не удалось отправить заявку. Попробуйте ещё раз.";
  if (isBadName(payload.name)) return "Напишите, как к вам обращаться.";
  if (isFakePhone(phoneDigits(payload.phone))) return "Укажите мобильный номер в формате +7 (9XX) XXX-XX-XX.";
  if (String(payload.comment ?? "").length > 1000) return "Комментарий слишком длинный.";
  if (!payload.consent) return "Нужно согласие на обработку данных.";
  return null;
}

async function postJson(url, body, headers = {}) {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`http ${response.status}: ${(await response.text()).slice(0, 200)}`);
}

async function deliver(text) {
  const tasks = [];
  if (telegram.token && telegram.chats.length) {
    for (const chat of telegram.chats) {
      tasks.push(postJson(`https://api.telegram.org/bot${telegram.token}/sendMessage`, { chat_id: chat, text, disable_web_page_preview: true }));
    }
  }
  if (max.token && max.users.length) {
    for (const user of max.users) {
      tasks.push(postJson(`https://platform-api.max.ru/messages?user_id=${encodeURIComponent(user)}`, { text, notify: true }, { Authorization: max.token }));
    }
  }
  if (!tasks.length) {
    console.log("[dry-run] no tokens configured, message:\n" + text + "\n");
    return true;
  }
  const results = await Promise.allSettled(tasks);
  for (const result of results) if (result.status === "rejected") console.error("delivery error:", result.reason?.message ?? result.reason);
  return results.some((result) => result.status === "fulfilled");
}

function respond(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return void res.writeHead(204).end();
  if (req.method !== "POST" || !req.url?.startsWith("/api/lead")) return respond(res, 404, { ok: false, error: "Not found" });

  let raw = "";
  for await (const chunk of req) raw += chunk;
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return respond(res, 400, { ok: false, error: "Некорректный запрос." });
  }

  const problem = validate(payload);
  if (problem) return respond(res, 400, { ok: false, error: problem });

  const digits = phoneDigits(payload.phone);
  const pretty = `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  const packages = new Set(["Старт", "Рост", "Система"]);
  const lines = [`Новая заявка с сайта «${SITE_NAME}»`, "", `Имя: ${String(payload.name).trim()}`, `Телефон: ${pretty}`];
  if (packages.has(payload.package)) lines.push(`Пакет: «${payload.package}»`);
  if (payload.comment?.trim()) lines.push(`Комментарий: ${payload.comment.trim()}`);
  if (payload.page) lines.push(`Страница: ${payload.page}`);
  lines.push(`Время: ${new Date().toLocaleString("ru-RU")}`);

  const ok = await deliver(lines.join("\n"));
  if (!ok) return respond(res, 502, { ok: false, error: "Не удалось доставить заявку. Попробуйте позже или напишите нам в мессенджер." });
  respond(res, 200, { ok: true });
}).listen(PORT, () => {
  console.log(`lead dev server: http://localhost:${PORT}/api/lead (${telegram.token || max.token ? "live" : "dry-run"})`);
});
