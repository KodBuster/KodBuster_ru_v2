import { expect, test } from "@playwright/test";
import { packageComparison } from "../src/data/site";

test("FOMO + CASES NEXT + 3D tariff comparison coexist after merge", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kb-cookie-choice", "decline"));
  await page.goto("/");

  // The CASES NEXT carousel is present, instead of the earlier portfolio reel.
  await expect(page.locator("#cases article")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: /Пять проектов/ })).toBeVisible();

  // Preserve the original tariff information in the new semantic 3D table.
  await expect(page.locator("#packages table.pkg-table tbody tr")).toHaveCount(packageComparison.rows.length);
  await expect(page.locator("#packages table.pkg-table thead th[scope=col]")).toHaveCount(4);
  await expect(page.locator("#packages .pkg-card")).toHaveCount(3);

  // Preserve the latest first-variant FOMO copy, exactly six compact 3D cards.
  const shorts = page.locator('#packages [data-variant="attention"]');
  await expect(shorts.locator("li")).toHaveCount(6);
  await expect(shorts.getByText("Пока клиент знакомится с вашей компанией, он уже решает, стоит ли обращаться. Помогите ему увидеть ваш уровень.")).toBeVisible();
  await expect(shorts.getByText("Скидка 10%", { exact: true })).toBeVisible();
  await expect(page.locator("#packages .package-terms")).toHaveCount(0);

  // Original FOMO sales funnels are still accessible on the same homepage.
  await expect(page.locator("#contact form")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Посмотреть на мой сайт глазами клиента/ })).toHaveAttribute("href", "/#contact");
});

test("combined layout has no horizontal page overflow at 390 and 1440", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kb-cookie-choice", "decline"));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator('#packages [data-variant="attention"] li')).toHaveCount(6);
    await expect(page.locator("#cases article")).toHaveCount(5);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});
