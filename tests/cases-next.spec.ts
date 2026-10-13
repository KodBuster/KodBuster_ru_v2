import { expect, test } from "@playwright/test";

async function openCases(page: import("@playwright/test").Page) {
  await page.goto("/#cases");
  const decline = page.getByRole("button", { name: "Отказаться" });
  if (await decline.isVisible().catch(() => false)) await decline.click();
  await expect(page.getByRole("heading", { name: /Пять проектов/ })).toBeVisible();
}

test("five real websites are presented with three case-study parts", async ({ page }) => {
  await openCases(page);
  const cases = page.locator("#cases article");
  await expect(cases).toHaveCount(5);
  for (const card of await cases.all()) {
    await expect(card.getByText("Задача", { exact: true })).toBeVisible();
    await expect(card.getByText("Решение", { exact: true })).toBeVisible();
    await expect(card.getByText(/Результат/)).toBeVisible();
    await expect(card.getByRole("button", { name: /Посмотреть кейс/ })).toBeEnabled();
  }
  const texts = await cases.allTextContents();
  expect(texts.join(" ")).not.toMatch(/\+\s*\d+\s*%/);
});

test("case details are accessible and link to the real website", async ({ page }) => {
  await openCases(page);
  await page.getByRole("button", { name: "Посмотреть кейс РамПадел" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "РамПадел" })).toBeVisible();
  await expect(dialog.getByText("Задача", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Решение", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Результат", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Открыть работающий сайт/ })).toHaveAttribute("href", "https://rampadel.ru/");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Посмотреть кейс РамПадел" })).toBeFocused();
});

test("carousel arrows and keyboard control change navigation progress", async ({ page }) => {
  await openCases(page);
  const progress = page.getByRole("progressbar", { name: "Просмотр проектов" });
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await page.getByRole("button", { name: "Следующие проекты" }).click();
  await expect(progress).toHaveAttribute("aria-valuenow", "2");
  const gallery = page.getByRole("region", { name: "Галерея проектов KodBuster" });
  await gallery.focus();
  await gallery.press("ArrowRight");
  await expect(progress).toHaveAttribute("aria-valuenow", "3");
});

test("cases layout fits common viewport widths without page overflow", async ({ page }) => {
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 900 });
    await openCases(page);
    const metrics = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.documentElement.clientWidth,
      cards: document.querySelectorAll("#cases article").length,
    }));
    expect.soft(metrics.document, `document overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect.soft(metrics.body, `body overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(metrics.cards).toBe(5);
    await page.locator("#cases").screenshot({ path: `test-results/cases-next-${width}.png` });
  }
});

test("reduced motion disables decorative case animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openCases(page);
  const animated = page.locator('#cases [class*="donut"]').first();
  await expect(animated).toBeVisible();
  const animationName = await animated.evaluate((node) => getComputedStyle(node).animationName);
  expect(animationName).toBe("none");
});
