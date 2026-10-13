import { expect, test } from "@playwright/test";
import { packageComparison, packages } from "../src/data/site";

async function openPricing(page: import("@playwright/test").Page) {
  await page.addInitScript(() => window.localStorage.setItem("kb-cookie-choice", "decline"));
  await page.goto("/#packages");
  await expect(page.locator("#package-compare-title")).toHaveText(packageComparison.title);
}

test("3D table preserves every feature and all tariff values", async ({ page }) => {
  await openPricing(page);
  const table = page.locator("#packages table.pkg-table");
  await expect(table).toHaveCount(1);
  await expect(table.locator("thead th[scope=col]")).toHaveCount(4);
  await expect(table.locator("tbody tr")).toHaveCount(packageComparison.rows.length);
  const cols = ["start", "growth", "system"] as const;

  for (const [index, feature] of packageComparison.rows.entries()) {
    const tr = table.locator("tbody tr").nth(index);
    await expect(tr.locator("th[scope=row]")).toContainText(feature.feature);
    for (const [colIndex, name] of cols.entries()) {
      const cell = tr.locator("td").nth(colIndex);
      const value = feature[name];
      if (value === true) await expect(cell.getByRole("img", { name: "Включено" })).toHaveCount(1);
      else if (value === false) await expect(cell.locator('[aria-label="Не включено"]')).toHaveCount(1);
      else if (value.startsWith("✓")) await expect(cell).toContainText(value.replace(/^✓\s*/, ""));
      else await expect(cell).toContainText(value);
    }
  }
  for (const item of packages) {
    await expect(table.getByRole("link", { name: new RegExp("Выбрать " + item.label) })).toHaveCount(1);
  }
});

test("3D plan selection connects to existing contact form", async ({ page }) => {
  await openPricing(page);
  const table = page.locator("#packages table.pkg-table");
  await table.getByRole("link", { name: /Выбрать Рост/ }).click();
  await expect(page).toHaveURL(/#contact$/);
  const selection = await page.evaluate(() => window.sessionStorage.getItem("kb-package"));
  expect(selection).toBe("Рост");
  await expect(page.locator("#contact form")).toHaveCount(1);
});

test("table stays readable and contained at responsive widths", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 850 : 900 });
    await openPricing(page);
    const table = page.locator("#packages table.pkg-table");
    const wrap = page.locator("#packages .pkg-table-wrap");
    const metrics = await page.evaluate(() => ({
      fullPageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(metrics.fullPageOverflow, `document overflow ${width}`).toBeLessThanOrEqual(1);
    await expect(table.locator("tbody tr")).toHaveCount(packageComparison.rows.length);
    if (width <= 700) {
      const position = await table.locator("tbody tr").first().locator("th").evaluate((node) => getComputedStyle(node).position);
      expect(position).toBe("sticky");
      await page.getByRole("button", { name: "Показать тариф Рост" }).click();
      await expect(page.getByRole("button", { name: "Показать тариф Рост" })).toHaveAttribute("aria-pressed", "true");
      const left = await wrap.evaluate((node) => node.scrollLeft);
      expect(left).toBeGreaterThan(0);
      await page.getByRole("button", { name: "Показать тариф Система" }).click();
      expect(await wrap.evaluate((node) => node.scrollLeft)).toBeGreaterThan(left);
    }
    await page.locator("#packages .pkg-table-wrap").screenshot({
      path: `test-results/tariff-comparison-3d-${width}-${testInfo.project.name}.png`,
      animations: "disabled",
    });
  }
});

test("legacy tariff cards, prices and package pages are still present", async ({ page }) => {
  await openPricing(page);
  await expect(page.locator("#packages .pkg-card")).toHaveCount(3);
  await expect(page.locator('#packages [data-variant="attention"] li')).toHaveCount(6);
  await expect(page.locator("#packages .pkg-table tbody tr.is-price")).toHaveCount(1);
  for (const item of packages) {
    await expect(page.locator("#packages .pkg-table")).toContainText(item.price);
    await expect(page.locator(`#packages a[href="/packages/${item.slug}/"]`)).toBeVisible();
  }
});
