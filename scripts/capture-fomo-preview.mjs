import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const out = "docs/previews";
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ["scripts/serve-static.mjs"], { stdio: "inherit" });

async function waitServer() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch("http://127.0.0.1:3000");
      if (res.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("local preview did not respond");
}
async function capture(page, selector, file, quality = 60) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  await element.screenshot({ path: `${out}/${file}`, type: "jpeg", quality, animations: "disabled" });
  console.log(`Saved ${out}/${file}`);
}
let browser;
try {
  await waitServer();
  browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor:1, locale:"ru-RU", reducedMotion:"reduce"});
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000", {waitUntil:"networkidle"});
  const decline = page.getByRole("button", {name:"Отказаться"});
  if (await decline.isVisible().catch(() => false)) await decline.click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
  await page.screenshot({path:`${out}/01-desktop-hero.jpg`, type:"jpeg", quality:72});
  await capture(page, "#compare", "02-desktop-comparison.jpg");
  await capture(page, "#packages", "03-desktop-packages.jpg");
  await capture(page, "#contact", "04-desktop-contact.jpg");

  const mobile = await browser.newContext({viewport:{width:390,height:844}, deviceScaleFactor:1, isMobile:true, hasTouch:true, locale:"ru-RU", reducedMotion:"reduce"});
  const m = await mobile.newPage();
  await m.goto("http://127.0.0.1:3000", {waitUntil:"networkidle"});
  const mdecline = m.getByRole("button", {name:"Отказаться"});
  if(await mdecline.isVisible().catch(()=>false)) await mdecline.click();
  await m.evaluate(() => window.scrollTo(0, 0));
  await m.screenshot({path:`${out}/05-mobile-hero.jpg`, type:"jpeg", quality:78});
  await capture(m, "#compare", "06-mobile-comparison.jpg", 65);
  await capture(m, "#contact", "07-mobile-contact.jpg", 65);
  console.log("Capture completed without touching production");
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}
