import { expect, test } from "@playwright/test";

async function openDemo(page: import("@playwright/test").Page) {
  await page.addInitScript(() => localStorage.setItem("kb-cookie-choice", "decline"));
  await page.goto("/#compare");
  const compare = page.locator("#compare");
  await expect(compare.getByRole("heading", { name: /Ваш бизнес может быть сильнее/ })).toBeAttached();
  return compare;
}

test("unified pill system is applied to comparison tabs and sales CTA", async ({ page }) => {
  const compare = await openDemo(page);
  const primary = compare.getByRole("link", { name: /Запросить разбор своего бизнеса/ });
  const detail = compare.getByRole("link", { name: "Обсудить услугу" });
  const sector = compare.getByRole("button", { name: "Детейлинг" });
  const selectors = [primary,detail,sector];
  const radii = await Promise.all(selectors.map(node => node.evaluate(el => getComputedStyle(el).borderRadius)));
  expect(radii).toEqual([radii[0],radii[0],radii[0]]);
  await expect(primary).toHaveAttribute("href","#contact");
  await expect(detail).toHaveAttribute("href","#contact");
  await expect(sector).toHaveAttribute("aria-pressed","true");
});

test("service details switch meaningfully rather than behaving as decorative chips", async ({ page }) => {
  const compare = await openDemo(page);
  const detail = compare.locator(".fomo-service-detail");
  await expect(detail).toContainText("Фотографии зон оклейки");
  await compare.getByRole("button", {name:"Условия",exact:true}).click();
  await expect(detail).toContainText("выбор плёнки");
  await expect(compare.getByRole("button", {name:"Условия",exact:true})).toHaveAttribute("aria-pressed","true");
  await compare.getByRole("button", {name:"Этапы",exact:true}).click();
  await expect(detail).toContainText("монтаж плёнки");
  await compare.getByRole("button", {name:"Косметология"}).click();
  await expect(detail).toContainText("Квалификация");
  await expect(compare.locator(".fomo-preview-better h4")).toHaveText("Консультация специалиста");
  await compare.getByRole("button", {name:"Ремонт",exact:true}).click();
  await expect(detail).toContainText("перечень работ");
  await expect(compare.locator(".fomo-preview-better h4")).toHaveText("Ремонт квартиры под ключ");
});

test("all sectors have relevant visual media and no blank image placeholder", async ({ page }) => {
  const compare = await openDemo(page);
  for (const [sector,contains] of [
    ["Детейлинг","new_hero_1.png"],
    ["Косметология","hero-cosmetology-owner.webp"],
  ] as const) {
    await compare.getByRole("button",{name:sector}).click();
    const images = compare.locator(".fomo-mock-photo img");
    await expect(images).toHaveCount(2);
    const srcs = await images.evaluateAll(nodes => nodes.map(n => (n as HTMLImageElement).currentSrc));
    expect(srcs.every(src => src.includes(contains))).toBe(true);
    await expect(images.first()).toHaveJSProperty("complete",true);
    await expect(images.first()).not.toHaveJSProperty("naturalWidth",0);
  }
  await compare.getByRole("button",{name:"Ремонт"}).click();
  await expect(compare.locator(".fomo-mock-photo svg")).toHaveCount(2);
  await expect(compare.locator(".fomo-mock-photo img")).toHaveCount(0);
});

test("unified comparison controls stay accessible on phone and desktop", async ({ page }) => {
  for (const width of [360,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    const compare = await openDemo(page);
    await expect(compare.getByRole("button",{name:"Косметология"})).toBeVisible();
    await compare.getByRole("button",{name:"Косметология"}).click();
    await expect(compare.locator(".fomo-preview-better h4")).toHaveText("Консультация специалиста");
    const bodyOverflow = await page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(bodyOverflow,`overflow ${width}`).toBeLessThanOrEqual(1);
  }
});
