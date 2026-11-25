import { expect, test, type Page } from "@playwright/test";

const shareImage = "brand/xk-logo-primary.png";
const pagesUrl = "https://web.xplorekaleidoscope.com/";

const brand = (page: Page) => page.getByLabel(/品牌或專案名稱/);
const audience = (page: Page) => page.getByLabel(/想給誰看/);
const scenario = (page: Page) => page.getByLabel(/使用情境/);
const action = (page: Page) => page.getByLabel(/希望訪客做什麼/);
const notes = (page: Page) => page.getByLabel(/想補充的事/);
const generate = (page: Page) => page.getByRole("button", { name: "產生需求摘要" });
const summary = (page: Page) => page.getByLabel("需求摘要全文");

async function load(page: Page) {
  await page.goto("./");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "帶入示範資料" })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

async function assertNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
}

async function captureFullPage(page: Page, path: string) {
  // Capture from the top so the offscreen fixed skip link stays outside the image.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({ path, fullPage: true });
}

for (const width of [375, 390, 768, 1024, 1280, 1440]) {
  test(`${width}px：首頁、表單、長品牌與多行摘要不水平溢位`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await load(page);
    await assertNoOverflow(page);
    // Trigger the footer's lazy brand image before a full-page capture.
    await page.locator(".closing img").scrollIntoViewIfNeeded();
    await expect(page.locator(".closing img")).toHaveJSProperty("complete", true);
    expect(await page.locator(".closing img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await captureFullPage(page, testInfo.outputPath(`home-${width}.png`));
    await brand(page).fill("山角工作室".repeat(18) + "LongBrandNameWithoutSpaces".repeat(5));
    await audience(page).fill("正在找客製木作且想了解尺寸與用途的店主");
    await action(page).selectOption("詢價");
    await notes(page).fill("想展示訂製木桌與店面層架。\n希望可以先看作品，再帶尺寸詢問。\n".repeat(4));
    await generate(page).click();
    await expect(summary(page)).toBeVisible();
    await expect(page.getByRole("heading", { name: "你的建站需求摘要" })).toBeFocused();
    const textarea = await summary(page).evaluate((element: HTMLTextAreaElement) => ({ width: element.clientWidth, scrollWidth: element.scrollWidth, height: element.clientHeight, scrollHeight: element.scrollHeight, value: element.value }));
    expect(textarea.scrollWidth).toBeLessThanOrEqual(textarea.width + 1);
    expect(textarea.scrollHeight).toBeGreaterThan(100);
    expect(textarea.scrollHeight).toBeLessThanOrEqual(textarea.height + 1);
    expect(textarea.value).toContain("LongBrandNameWithoutSpaces");
    await assertNoOverflow(page);
    await captureFullPage(page, testInfo.outputPath(`summary-${width}.png`));
  });
}

for (const height of [667, 812]) {
  test(`375×${height} 首屏能直接操作主要與作品入口`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height });
    await load(page);
    for (const name of ["整理我的建站需求", "看看網站作品"]) {
      const link = page.getByRole("link", { name, exact: true });
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(height);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
}

test("三個情境入口只更新情境並保留手填草稿，焦點到情境欄", async ({ page }) => {
  await load(page);
  await brand(page).fill("手動品牌");
  await audience(page).fill("附近居民");
  await action(page).selectOption("其他");
  await page.getByLabel(/其他主要動作/).fill("下載型錄");
  await page.getByLabel("Logo", { exact: true }).check();
  await notes(page).fill("保留補充內容");
  const entries = page.getByRole("link", { name: "用這個情境開始" });
  for (const [index, value] of ["local", "business", "campaign"].entries()) {
    await entries.nth(index).click();
    await expect(scenario(page)).toHaveValue(value);
    await expect(scenario(page)).toBeFocused();
    await expect(brand(page)).toHaveValue("手動品牌");
    await expect(audience(page)).toHaveValue("附近居民");
    await expect(action(page)).toHaveValue("其他");
    await expect(page.getByLabel(/其他主要動作/)).toHaveValue("下載型錄");
    await expect(page.getByLabel("Logo", { exact: true })).toBeChecked();
    await expect(notes(page)).toHaveValue("保留補充內容");
    expect(new URL(page.url()).hash).toBe("#brief");
  }
});

test("直接填表：必填純空白、其他動作驗證與第一錯誤焦點", async ({ page }) => {
  await load(page);
  await page.getByRole("link", { name: "整理我的建站需求", exact: true }).click();
  await brand(page).fill("   ");
  await audience(page).fill("　");
  await generate(page).click();
  await expect(brand(page)).toBeFocused();
  await expect(page.getByText("請填品牌或專案名稱，暫名也可以。")).toBeVisible();
  await brand(page).fill("暫名");
  await generate(page).click();
  await expect(audience(page)).toBeFocused();
  await audience(page).fill("店家老闆");
  await generate(page).click();
  await expect(action(page)).toBeFocused();
  await action(page).selectOption("其他");
  await page.getByLabel(/其他主要動作/).fill("   ");
  await generate(page).click();
  await expect(page.getByLabel(/其他主要動作/)).toBeFocused();
  await page.getByLabel(/其他主要動作/).fill("下載產品型錄");
  await generate(page).click();
  await expect(summary(page)).toHaveValue(/希望訪客完成的主要動作：下載產品型錄/);
});

test("不可見必填文字被拒絕，完整句動作及 emoji 品牌保留原意", async ({ page }) => {
  await load(page);
  await brand(page).fill("\u200b\u2060");
  await audience(page).fill("\u200d\u200e");
  await action(page).selectOption("其他");
  await page.getByLabel(/其他主要動作/).fill("\u200b");
  await generate(page).click();
  await expect(brand(page)).toBeFocused();
  await expect(brand(page)).toHaveAttribute("aria-invalid", "true");
  await expect(audience(page)).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel(/其他主要動作/)).toHaveAttribute("aria-invalid", "true");
  await brand(page).fill("👩‍👩‍👦 山角工作室");
  await audience(page).fill("正在比較服務的店家");
  await page.getByLabel(/其他主要動作/).fill("我想讓客人下載型錄");
  await generate(page).click();
  await expect(summary(page)).toHaveValue(/👩‍👩‍👦 山角工作室/);
  await expect(summary(page)).toHaveValue(/希望訪客完成的主要動作：我想讓客人下載型錄/);
  await expect(summary(page)).not.toHaveValue(/看完後我想讓/);
});

test("長摘要在切換寬度後仍顯示全文，手動選取涵蓋末段", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await load(page);
  await page.getByRole("button", { name: "帶入示範資料" }).click();
  await notes(page).fill("希望先看作品，再帶尺寸詢問。\n".repeat(35) + "這是摘要最後一段。");
  await generate(page).click();
  for (const width of [768, 375, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => summary(page).evaluate((element: HTMLTextAreaElement) => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1);
    await assertNoOverflow(page);
  }
  await summary(page).focus();
  await summary(page).press("ControlOrMeta+A");
  expect(await summary(page).evaluate((element: HTMLTextAreaElement) => element.value.slice(element.selectionStart, element.selectionEnd))).toBe(await summary(page).inputValue());
});

test("手機表單功能性說明至少14px，放大文字後仍可操作及換行", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await load(page);
  for (const selector of [".field-label", ".field-meta", ".field-help", ".form-notice", ".form-required-note", ".text-button"]) {
    const sizes = await page.locator(selector).evaluateAll((elements) => elements.map((element) => parseFloat(getComputedStyle(element).fontSize)));
    expect(sizes.length).toBeGreaterThan(0);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(14);
  }
  // Double the form's actual text sizes to exercise wrapping and reflow.
  await page.locator(".brief-tool").evaluate((tool) => {
    const elements = [...tool.querySelectorAll<HTMLElement>("*")];
    const sizes = elements.map((element) => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => { element.style.fontSize = `${sizes[index] * 2}px`; });
  });
  await assertNoOverflow(page);
  await page.getByRole("button", { name: "帶入示範資料" }).click();
  await generate(page).click();
  await expect(summary(page)).toHaveValue(/山角木作工作室/);
});

test("摘要產生後同寬放大文字，仍可讀取及選取最後一段", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await load(page);
  await page.getByRole("button", { name: "帶入示範資料" }).click();
  await notes(page).fill("需要先看完整內容。".repeat(30) + "最後一段也要保留。");
  await generate(page).click();
  await summary(page).evaluate((element: HTMLTextAreaElement) => { element.style.fontSize = "32px"; });
  await summary(page).focus();
  const dimensions = await summary(page).evaluate((element: HTMLTextAreaElement) => ({
    hidden: getComputedStyle(element).overflowY === "hidden",
    overflow: element.scrollHeight > element.clientHeight + 1,
  }));
  expect(dimensions.hidden && dimensions.overflow).toBe(false);
  await summary(page).press("ControlOrMeta+A");
  expect(await summary(page).evaluate((element: HTMLTextAreaElement) => element.value.slice(element.selectionStart, element.selectionEnd))).toContain("最後一段也要保留。");
  await assertNoOverflow(page);
});

test("靜態產物版本可對照來源與實際掛載路徑", async ({ request, baseURL }) => {
  test.skip(!process.env.PLAYWRIGHT_SERVER_COMMAND?.includes("preview:pages"), "version.json 僅由 Pages 靜態建置產生");
  const response = await request.get(new URL("version.json", baseURL!).href);
  expect(response.status()).toBe(200);
  const version = await response.json();
  expect(version.basePath).toBe(new URL(baseURL!).pathname.replace(/\/$/, ""));
  expect(version.sourceSha).toMatch(/^[a-f0-9]{40}$/);
  expect(Number.isNaN(Date.parse(version.builtAt))).toBe(false);
  if (process.env.GITHUB_SHA) {
    expect(version.sourceSha).toBe(process.env.GITHUB_SHA);
    expect(version.sourceState).toBe("clean");
  }
});

test("已有素材可複選且尚未準備雙向互斥", async ({ page }) => {
  await load(page);
  await page.getByLabel("Logo", { exact: true }).check();
  await page.getByLabel("照片", { exact: true }).check();
  await page.getByLabel("尚未準備", { exact: true }).check();
  await expect(page.getByLabel("Logo", { exact: true })).not.toBeChecked();
  await expect(page.getByLabel("照片", { exact: true })).not.toBeChecked();
  await page.getByLabel("文案", { exact: true }).check();
  await expect(page.getByLabel("尚未準備", { exact: true })).not.toBeChecked();
  await expect(page.getByLabel("文案", { exact: true })).toBeChecked();
  await page.getByLabel("社群或既有網站", { exact: true }).check();
  await expect(page.getByLabel("文案", { exact: true })).toBeChecked();
  await expect(page.getByLabel("社群或既有網站", { exact: true })).toBeChecked();
});

test("示範→摘要→返回改動作→再次產生→真實剪貼簿，使用最新文字", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await load(page);
  await page.getByRole("button", { name: "帶入示範資料" }).click();
  await generate(page).click();
  await expect(summary(page)).toHaveValue(/提出詢價/);
  await page.getByRole("button", { name: "返回修改" }).click();
  await action(page).selectOption("報名");
  await generate(page).click();
  const latest = await summary(page).inputValue();
  expect(latest).toContain("完成報名");
  expect(latest).not.toContain("提出詢價");
  await page.getByRole("button", { name: "複製需求摘要" }).click();
  await expect(page.getByRole("status")).toHaveText("已複製，可自行貼給 XK");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(latest);
  await expect(page.getByRole("link", { name: "查看 XK 聯絡資訊" })).toHaveAttribute("href", "https://www.xplorekaleidoscope.com/contact/");
});

test("剪貼簿拒絕時保留全文且提供手動全文選取", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new DOMException("Denied", "NotAllowedError"); } } }));
  await load(page);
  await page.getByRole("button", { name: "帶入示範資料" }).click();
  await generate(page).click();
  const text = await summary(page).inputValue();
  await page.getByRole("button", { name: "複製需求摘要" }).click();
  await expect(page.getByRole("status")).toContainText("瀏覽器未允許自動複製");
  await expect(page.getByText("已複製，可自行貼給 XK", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "選取摘要全文" }).click();
  await expect(summary(page)).toBeFocused();
  expect(await summary(page).evaluate((element: HTMLTextAreaElement) => element.value.slice(element.selectionStart, element.selectionEnd))).toBe(text);
});

test("草稿留在頁面記憶體，重新整理後清空", async ({ page }) => {
  await load(page);
  const draftMarker = "campaign-test-draft";
  const siteOrigin = new URL(page.url()).origin;
  const draftRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["GET", "HEAD"].includes(request.method()) || url.origin !== siteOrigin || url.href.includes(draftMarker)) {
      draftRequests.push(`${request.method()} ${url.href}`);
    }
  });
  await brand(page).fill(draftMarker);
  await audience(page).fill("本地訪客");
  await action(page).selectOption("導航");
  await generate(page).click();
  await expect(summary(page)).toHaveValue(/campaign-test-draft/);
  expect(draftRequests).toEqual([]);
  expect(page.url()).not.toContain(draftMarker);
  const storage = await page.evaluate(() => ({ local: JSON.stringify(localStorage), session: JSON.stringify(sessionStorage) }));
  expect(storage.local).not.toContain(draftMarker);
  expect(storage.session).not.toContain(draftMarker);
  await page.reload();
  await expect(brand(page)).toHaveValue("");
  await expect(audience(page)).toHaveValue("");
  await expect(action(page)).toHaveValue("");
  await expect(scenario(page)).toHaveValue("");
});

test("語系、metadata、展示版索引及外部連結皆正確", async ({ page, request }) => {
  await load(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
  await expect(page).toHaveTitle("一頁式網站建置｜Xplore Kaleidoscope（XK）");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /XK/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "一頁式網站建置｜Xplore Kaleidoscope（XK）");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new URL(shareImage, pagesUrl).href);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  const robots = await request.get(new URL("robots.txt", page.url()).href);
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  const crawlRules = await robots.text();
  expect(crawlRules).toMatch(/^User-agent:\s*\*$/im);
  const allow = crawlRules.match(/^Allow:[ \t]*(\S+)[ \t]*$/im)?.[1];
  expect(["/", new URL(page.url()).pathname]).toContain(allow);
  expect(crawlRules).not.toMatch(/^(Disallow|Sitemap):/im);
  const sitemap = await request.get(new URL("sitemap.xml", page.url()).href);
  expect(sitemap.status()).toBe(404);
  for (const [label, href] of [["XK 官網", "https://www.xplorekaleidoscope.com/"], ["完整服務", "https://www.xplorekaleidoscope.com/services/"], ["技術作品集", "https://www.xplorekaleidoscope.com/portfolio/"]]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
});

test("鍵盤能啟動示範、選動作、產生與返回修改，且可見焦點", async ({ page }) => {
  await load(page);
  await page.getByRole("button", { name: "帶入示範資料" }).press("Enter");
  await expect(brand(page)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(scenario(page)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(audience(page)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(action(page)).toBeFocused();
  const focus = await action(page).evaluate((element) => ({ style: getComputedStyle(element).outlineStyle, width: getComputedStyle(element).outlineWidth }));
  expect(focus.style).toBe("solid");
  expect(focus.width).toBe("2px");
  await action(page).press("ArrowDown");
  await generate(page).press("Enter");
  await expect(page.getByRole("heading", { name: "你的建站需求摘要" })).toBeFocused();
  await page.getByRole("button", { name: "返回修改" }).press("Enter");
  await expect(action(page)).toBeFocused();
});

test("JavaScript 尚未啟用時停用送出，草稿不會被原生表單帶入網址", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("./");
  await expect(generate(page)).toBeDisabled();
  await expect(page.getByRole("button", { name: "帶入示範資料" })).toBeDisabled();
  await expect(page.locator(".brief-tool input[name], .brief-tool select[name], .brief-tool textarea[name]")).toHaveCount(0);
  await expect(brand(page)).toBeDisabled();
  await expect(audience(page)).toBeDisabled();
  await expect(action(page)).toBeDisabled();
  expect(new URL(page.url()).search).toBe("");
  await context.close();
});

test("部署路徑上的正式 Logo、圖示與分享圖可載入，沒有資產 404", async ({ page, request, baseURL }) => {
  const failedAssets: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400 && ["image", "stylesheet", "script", "font"].includes(response.request().resourceType())) {
      failedAssets.push(`${response.status()} ${response.url()}`);
    }
  });
  await load(page);
  const basePath = new URL(baseURL!).pathname.replace(/\/$/, "");
  for (const [selector, filename] of [[".brand-link img", "xk-logo-horizontal.svg"], [".closing img", "xk-logo-symbol.svg"]]) {
    const image = page.locator(selector);
    await expect(image).toHaveAttribute("src", `${basePath}/brand/${filename}`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    const response = await request.get(new URL(`brand/${filename}`, baseURL).toString());
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  }
  const icon = page.locator('link[rel="icon"]');
  await expect(icon).toHaveAttribute("type", "image/svg+xml");
  const iconUrl = new URL((await icon.getAttribute("href")) ?? "", page.url());
  expect(iconUrl.pathname).toBe(`${basePath}/icon.svg`);
  const [favicon, image] = await Promise.all([
    request.get(iconUrl.href),
    request.get(new URL(shareImage, page.url()).href),
  ]);
  expect(favicon.status()).toBe(200);
  expect(favicon.headers()["content-type"]).toContain("image/svg+xml");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect(failedAssets).toEqual([]);
});
