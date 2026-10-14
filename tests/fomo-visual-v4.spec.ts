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
  // Screenshot-extracted JPEG assets must load at their genuine resolution.
  await compare.getByRole("button",{name:"Детейлинг"}).click();
  const images = compare.locator(".fomo-mock-photo img");
  await expect(images).toHaveCount(2);
  const sources = await images.evaluateAll(nodes => nodes.map(n => (n as HTMLImageElement).currentSrc));
  expect(sources[0]).toContain("fomo-mercedes-service.jpg");
  expect(sources[1]).toContain("fomo-ppf-install.jpg");
  await expect(images.nth(0)).toHaveJSProperty("naturalWidth",530);
  await expect(images.nth(0)).toHaveJSProperty("naturalHeight",240);
  await expect(images.nth(1)).toHaveJSProperty("naturalWidth",531);
  await expect(images.nth(1)).toHaveJSProperty("naturalHeight",240);
  const heroBackground = await compare.locator(".fomo-lab-top--media").evaluate(el => getComputedStyle(el,"::before").backgroundImage);
  expect(heroBackground).toContain("fomo-mercedes-hero.jpg");

  await compare.getByRole("button",{name:"Косметология"}).click();
  const beautyImages = compare.locator(".fomo-mock-photo img");
  await expect(beautyImages).toHaveCount(2);
  for (const image of await beautyImages.all()) {
    await expect(image).toHaveAttribute("src",/hero-cosmetology-owner.webp/);
    await expect(image).not.toHaveJSProperty("naturalWidth",0);
  }
  await compare.getByRole("button",{name:"Ремонт"}).click();
  await expect(compare.locator(".fomo-mock-photo svg")).toHaveCount(2);
  await expect(compare.locator(".fomo-mock-photo img")).toHaveCount(0);
});

test("unified comparison controls stay accessible on phone and desktop", async ({ page }, testInfo) => {
  for (const width of [360,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    const compare = await openDemo(page);
    if (width === 390 || width === 1440) {
      await compare.locator(".fomo-lab").screenshot({path: `test-results/fomo-visual-v4-${width}-${testInfo.project.name}.png`, animations: "disabled"});
    }
    await expect(compare.getByRole("button",{name:"Косметология"})).toBeVisible();
    await compare.getByRole("button",{name:"Косметология"}).click();
    await expect(compare.locator(".fomo-preview-better h4")).toHaveText("Консультация специалиста");
    const bodyOverflow = await page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(bodyOverflow,`overflow ${width}`).toBeLessThanOrEqual(1);
  }
});

test("extracted photos keep proportions and never stretch on different screens", async ({ page }) => {
  for (const width of [360,390,768,1280,1440]) {
    await page.setViewportSize({width,height:900});
    const compare = await openDemo(page);
    const photos = compare.locator(".fomo-mock-photo--extracted");
    await expect(photos).toHaveCount(2);
    for (const photo of await photos.all()) {
      const geometry = await photo.evaluate(el => {
        const img = el.querySelector("img")!;
        const { width, height } = el.getBoundingClientRect();
        const style = getComputedStyle(img);
        return { ratio: width/height, fit:style.objectFit, complete:img.complete, imageRatio:img.naturalWidth/img.naturalHeight };
      });
      expect(geometry.fit).toBe("contain");
      expect(geometry.complete).toBe(true);
      expect(geometry.ratio).toBeCloseTo(530/240,1);
      expect(Math.abs(geometry.imageRatio - geometry.ratio)).toBeLessThan(.03);
    }
  }
});

test("reference fidelity: detailing colors, framing and default desktop/mobile screenshots", async ({ page }, testInfo) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const compare = await openDemo(page);
    const photos = compare.locator(".fomo-mock-photo--extracted");
    await expect(photos).toHaveCount(2);

    const left = await photos.first().evaluate(el => ({
      filter: getComputedStyle(el).filter,
      radius: getComputedStyle(el).borderRadius,
      src: (el.querySelector("img") as HTMLImageElement).currentSrc,
      fit: getComputedStyle(el.querySelector("img")!).objectFit,
    }));
    expect(left.filter).toBe("none");
    expect(left.radius).toBe("0px");
    expect(left.src).toContain("fomo-mercedes-service.jpg");
    expect(left.fit).toBe("contain");

    const right = await photos.nth(1).locator("img");
    await expect(right).toHaveJSProperty("naturalWidth", 531);
    await expect(right).toHaveJSProperty("naturalHeight", 240);
    const hero = await compare.locator(".fomo-lab-top--media").evaluate(node => ({
      background: getComputedStyle(node,"::before").backgroundImage,
      size: getComputedStyle(node,"::before").backgroundSize,
    }));
    expect(hero.background).toContain("fomo-mercedes-hero.jpg");
    if (width === 1440) {
      expect(hero.size).toContain("58%");
    }

    // Capture the INITIAL detailing state, not a different industry selected
    // during other interaction tests. These screenshots are visual approval assets.
    await compare.locator(".fomo-lab").screenshot({
      path: `test-results/fomo-visual-v4-reference-${width}-${testInfo.project.name}.png`,
      animations: "disabled",
    });
  }
});
