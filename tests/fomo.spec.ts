import { expect, test } from "@playwright/test";

test("sector comparison updates its factual illustration", async ({ page }) => {
  await page.goto("/");
  const compare = page.locator("#compare");
  await expect(compare.getByRole("heading", { name: /Ваш бизнес может быть сильнее/ })).toBeAttached();
  await compare.getByRole("button", { name: "Косметология" }).click();
  await expect(compare.getByRole("button", { name: "Косметология" })).toHaveAttribute("aria-pressed", "true");
  await expect(compare.locator(".fomo-preview-better h4")).toHaveText("Консультация специалиста");
  await compare.getByRole("button", { name: /Рассмотреть подробнее/ }).first().click();
  await expect(compare.locator(".fomo-insights")).toContainText("ЧЕГО НЕ ХВАТАЕТ");
  await compare.getByRole("button", { name: /Рассмотреть подробнее/ }).last().click();
  await expect(compare.locator(".fomo-insights")).toContainText("ЧТО ПОМОГАЕТ");
  await expect(compare.getByRole("link", { name: /Запросить разбор/ })).toHaveAttribute("href", "#contact");
});

test("break-even math updates by tier and profit", async ({ page }) => {
  await page.goto("/");
  const calc = page.locator("#economy");
  const output = calc.locator(".fomo-economy-result");
  await expect(output.locator("strong")).toHaveText("6");
  await calc.getByRole("button", { name: /Старт/ }).click();
  await expect(output.locator("strong")).toHaveText("4");
  await calc.getByLabel("Прибыль с одного дополнительного заказа").fill("10000");
  await expect(output.locator("strong")).toHaveText("7");
  await calc.getByLabel("Прибыль с одного дополнительного заказа").fill("0");
  await expect(output).toContainText("Укажите положительную прибыль");
});

test("FOMO content avoids guarantees, fake scarcity and invented ROI", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#compare")).toContainText("учебное сравнение");
  await expect(page.locator("#economy")).toContainText("не прогноз");
  await expect(page.locator("#audit")).toContainText("Сначала факты");
  await expect(page.locator("#compare a[href='#contact']")).toHaveCount(1);
});

test("FOMO sections remain within viewport", async ({ page }) => {
  await page.goto("/");
  const { overflow, elements } = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return {
      overflow: document.documentElement.scrollWidth - vw,
      elements: Array.from(document.querySelectorAll("body *"))
        .map((element) => {
          const bounds = element.getBoundingClientRect();
          const styles = window.getComputedStyle(element);
          return {
            tag: element.tagName,
            className: typeof element.className === "string" ? element.className.slice(0, 90) : "",
            right: Math.round(bounds.right * 10) / 10,
            left: Math.round(bounds.left * 10) / 10,
            position: styles.position,
          };
        })
        .filter((item) => item.right > vw + 1 && item.left < vw && item.position !== "fixed")
        .sort((a, b) => b.right - a.right)
        .slice(0, 15),
    };
  });
  expect(overflow, JSON.stringify(elements)).toBeLessThanOrEqual(1);
});
