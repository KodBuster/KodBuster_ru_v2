import { expect, test, type Page } from "@playwright/test";
import { validateLead } from "../src/lib/lead-validation";

async function dismissCookies(page: Page) {
  const decline = page.getByRole("button", { name: "Отказаться" });
  if (await decline.isVisible().catch(() => false)) await decline.click();
}

test("landing page exposes the primary journey", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await dismissCookies(page);
  await expect(page).toHaveTitle(/KodBuster/);
  await expect(page.getByRole("heading", { level: 1 }).first()).toContainText("Не просто сайт");
  await expect(page.getByRole("link", { name: /Получить разбор/ }).first()).toHaveAttribute("href", "#contact");
  await expect(page.getByRole("heading", { name: "РамПадел" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Синоним" })).toBeVisible();
  await expect(page.locator("#packages").getByText("70 000 ₽", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Запросить предварительный разбор" })).toBeAttached();
  await expect(page.locator("#contact form")).toHaveCount(1);
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  expect(errors).toEqual([]);
});

test("mobile navigation opens and reaches sections", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only behavior");
  await page.goto("/");
  await dismissCookies(page);
  const toggle = page.getByRole("button", { name: "Открыть меню" });
  await toggle.click();
  const closeToggle = page.getByRole("button", { name: "Закрыть меню" });
  await expect(closeToggle).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("navigation", { name: "Мобильная навигация" }).getByRole("link", { name: /Услуги/ }).click();
  await expect(page.locator("#services")).toBeInViewport();
  await expect(page.getByRole("button", { name: "Открыть меню" })).toHaveAttribute("aria-expanded", "false");
});

test("lead form requires consent and validates phone on real devices", async ({ page }) => {
  await page.goto("/#contact");
  await dismissCookies(page);
  const form = page.locator("#contact form");
  const alert = form.getByRole("alert");
  const submit = form.getByRole("button", { name: "Запросить разбор" });
  await expect(submit).toBeDisabled();
  await form.getByLabel("Как к вам обращаться").fill("Тест");
  await expect(submit).toBeDisabled();
  await form.getByRole("checkbox", { name: /Соглашаюсь/ }).check();
  await expect(submit).toBeEnabled();
  // Mobile form navigation can take longer than the 3-second antibot window.
  // Wait to test phone validation deterministically, then verify timer separately.
  await page.waitForTimeout(3100);
  await submit.click();
  await expect(alert).toContainText("Укажите мобильный номер");
});

test("page has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await dismissCookies(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("antibot minimum duration rejects too-fast requests deterministically", () => {
  const now = Date.now();
  const payload = {
    name: "Иван",
    phone: "+7 (916) 984-27-63",
    comment: "Обращение: предварительный разбор бизнеса",
    consent: true,
    website: "",
    form_started_at: now - 1000,
  };
  expect(validateLead(payload, now)).toContain("Попробуйте ещё раз");
  expect(validateLead({ ...payload, form_started_at: now - 3200 }, now)).toBeNull();
});
