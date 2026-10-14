import { expect, test } from "@playwright/test";

async function boot(page: import("@playwright/test").Page) {
  await page.addInitScript(() => localStorage.setItem("kb-cookie-choice", "decline"));
  await page.goto("/");
}

test("ROI FLOW 3D preserves the original break-even mathematics", async ({ page }) => {
  await boot(page);
  const calc = page.locator("#economy");
  await expect(calc.locator(".roi-flow-stage")).toHaveCount(3);
  await expect(calc.locator(".roi-flow-operator")).toHaveText(["÷", "="]);
  const answer = calc.locator(".roi-flow-answer strong");
  await expect(answer).toHaveText("6");
  await expect(calc.locator(".roi-flow-stage").first()).toContainText("120 000 ₽");
  await expect(calc.locator(".roi-flow-stage").nth(1)).toContainText("20 000 ₽");

  await calc.getByRole("button", { name: /Система/ }).click();
  await expect(answer).toHaveText("9");
  await expect(calc.locator(".roi-flow-stage").first()).toContainText("170 000 ₽");
  await calc.getByLabel("Прибыль с одного дополнительного заказа").fill("50000");
  await expect(answer).toHaveText("4");
  await calc.getByLabel("Прибыль с одного дополнительного заказа").fill("0");
  await expect(answer).toHaveText("—");
  await expect(calc).toContainText("Это математическая модель, а не прогноз");
  await expect(calc.getByRole("link", { name: /Разобрать мой бизнес/ })).toHaveAttribute("href", "#contact");
});

test("3D request form retains real fields, consent, phone validation and endpoint workflow", async ({ page }) => {
  await boot(page);
  const section = page.locator("#contact");
  const form = section.locator("form");
  await expect(section).toHaveClass(/final-cta--3d/);
  await expect(section.locator(".contact-3d-decor")).toHaveCount(2);
  await expect(form).toHaveCount(1);
  const radius = await form.evaluate(el => getComputedStyle(el).borderTopLeftRadius);
  expect(parseFloat(radius)).toBeGreaterThan(10);
  await expect(form.getByLabel("Как к вам обращаться")).toBeVisible();
  await expect(form.getByLabel("Мобильный телефон")).toBeVisible();
  await expect(form.getByLabel("Направление бизнеса")).toBeVisible();
  await expect(form.getByLabel("Сайт или Яндекс Карты")).toBeVisible();
  await expect(form.getByLabel("Что хотите улучшить")).toBeVisible();
  const submit = form.getByRole("button", { name: "Запросить разбор" });
  await expect(submit).toBeDisabled();
  await form.getByLabel("Как к вам обращаться").fill("Тест");
  await form.getByRole("checkbox", { name: /Соглашаюсь/ }).check();
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(form.getByRole("alert")).toContainText("Укажите мобильный номер");
  await expect(section).toContainText("без выдуманных диагнозов и обещаний роста продаж");
});

test("ROI FLOW & 3D contact stay within all device viewports", async ({ page }, info) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await boot(page);
    const wrap = page.locator("#economy .roi-flow-track");
    const grid = await wrap.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length);
    expect(grid, `ROI columns at ${width}`).toBe(width <= 600 ? 1 : 5);
    await expect(page.locator("#contact form")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(1);
    if ([390, 1440].includes(width)) {
      await page.locator("#economy").screenshot({path:`test-results/roi-flow-next-${width}-${info.project.name}.png`, animations:"disabled"});
      await page.locator("#contact").screenshot({path:`test-results/contact-next-3d-${width}-${info.project.name}.png`, animations:"disabled"});
    }
  }
});
