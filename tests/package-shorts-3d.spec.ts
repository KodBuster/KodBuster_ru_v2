import { expect, test } from "@playwright/test";

const expected = [
  ["Старт", "Пока клиент знакомится с вашей компанией, он уже решает, стоит ли обращаться. Помогите ему увидеть ваш уровень."],
  ["Рост", "Реклама привлекает внимание. Важно не потерять его в момент, когда человек сравнивает вас с другими."],
  ["Система", "У каждой вашей услуги есть причины для выбора. Дайте клиенту возможность увидеть их отдельно."],
  ["Оплата в три шага", "Не нужно оплачивать всё сразу. 50% до старта, 30% после согласования макета, 20% перед публикацией."],
  ["Скидка 10%", "Если после разбора решите действовать, скидка 10% сохранится при первой оплате в течение трёх рабочих дней."],
  ["От вас — минимум", "Фото, доступ к карточке на Картах и телефон для кодов регистратора. Остальное настроим мы."],
] as const;

async function load(page: import("@playwright/test").Page) {
  await page.addInitScript(() => localStorage.setItem("kb-cookie-choice", "decline"));
  await page.goto("/#packages");
  const section = page.locator('#packages [data-variant="attention"]');
  await expect(section.getByRole("heading", { name: "Если совсем коротко" })).toBeVisible();
  return section;
}

test("first FOMO text variant is complete and terms are not duplicated", async ({ page }) => {
  const section = await load(page);
  const items = section.locator("li");
  await expect(items).toHaveCount(6);
  for (const [i, [title, content]] of expected.entries()) {
    await expect(items.nth(i).getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(items.nth(i).locator("p")).toHaveText(content);
    await expect(items.nth(i).locator('div[aria-hidden="true"]')).toHaveCount(1);
  }
  await expect(page.locator("#packages .package-terms")).toHaveCount(0);
  await expect(page.locator("#packages .package-after")).toHaveCount(0);
  await expect(section).toContainText("Реклама в Яндекс Директе, отслеживание звонков и сбор заявок в CRM подключаем отдельно после запуска.");
  await expect(section).toContainText("Обсудим на разборе, когда будет понятно, что нужно именно вам.");
  await expect(section.getByRole("link", { name: /Посмотреть на мой сайт глазами клиента/ })).toHaveAttribute("href", "/#contact");
});

test("desktop uses three columns, tablet two, mobile one without overflow", async ({ page }) => {
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 850 : 900 });
    const section = await load(page);
    const grid = section.locator("ul").first();
    const dims = await grid.evaluate((node) => {
      const styles = getComputedStyle(node);
      const bounds = node.getBoundingClientRect();
      return {
        cols: styles.gridTemplateColumns.split(" ").filter(Boolean).length,
        left: bounds.left,
        right: bounds.right,
      };
    });
    expect(dims.cols, `columns at ${width}px`).toBe(width >= 900 ? 3 : width > 560 ? 2 : 1);
    expect(dims.left).toBeGreaterThanOrEqual(-1);
    expect(dims.right).toBeLessThanOrEqual(width + 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `page overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test("CTA goes to the working lead form and tariff comparison remains intact", async ({ page }) => {
  const section = await load(page);
  await expect(page.locator("#packages .pkg-table tbody tr")).toHaveCount(16);
  await expect(page.locator("#packages .pkg-card")).toHaveCount(3);
  await section.getByRole("link", { name: /Посмотреть на мой сайт глазами клиента/ }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact form")).toHaveCount(1);
});

test("short-card animation respects reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const section = await load(page);
  const transition = await section.locator("li").first().evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(transition.split(",").every((v) => v.trim() === "0s")).toBeTruthy();
});
