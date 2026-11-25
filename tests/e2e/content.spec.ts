import { expect, test, type Page } from "@playwright/test";
import { pricing } from "../../src/config/campaign";

const emailHref = "mailto:system.xk2022@gmail.com";
const verifiedShowcases = [
  { name: "三月手工湯包", href: "https://showcase.xplorekaleidoscope.com/march-tangbao/", image: "march-tangbao.webp" },
  { name: "宏能興業", href: "https://honest.xplorekaleidoscope.com/", image: "honest-diecut.webp" },
  { name: "宏家燕窩", href: "https://honbird.xplorekaleidoscope.com/", image: "hongjia-birdnest.webp" },
] as const;

async function load(page: Page) {
  await page.goto("./");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: "帶入示範資料" })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

test("頁面先呈現需求與可操作展示，再比較費用、認識合作方式及整理需求", async ({ page }) => {
  await load(page);
  const showPricing = pricing.status === "published" || process.env.XK_PRICING_PREVIEW === "true";
  const expectedOrder = ["needs", "scenarios", "showcases", ...(showPricing ? ["pricing"] : []), "process", "about", "faq", "brief"];
  const actualOrder = await page.locator("main section[id]").evaluateAll((sections, ids) =>
    sections.map((section) => section.id).filter((id) => ids.includes(id)), expectedOrder);
  expect(actualOrder).toEqual(expectedOrder);
  for (const id of expectedOrder) {
    const section = page.locator(`#${id}`);
    await expect(section).toHaveCount(1);
    await expect(section.getByRole("heading", { level: 2 })).toHaveCount(1);
  }
  await expect(page.getByRole("link", { name: "看看網站作品", exact: true })).toHaveAttribute("href", "#showcases");
  await page.getByRole("link", { name: "看看網站作品", exact: true }).click();
  expect(new URL(page.url()).hash).toBe("#showcases");
  await expect(page.getByRole("link", { name: "Email 詢問", exact: true })).toHaveAttribute("href", emailHref);
});

test("三個展示保留可開啟的核對網址、誠實分類及本機延後載入截圖", async ({ page, request, baseURL }) => {
  const showcaseRequests: string[] = [];
  page.on("request", (request) => {
    if (verifiedShowcases.some((showcase) => new URL(request.url()).origin === new URL(showcase.href).origin)) {
      showcaseRequests.push(request.url());
    }
  });
  await load(page);
  const section = page.locator("#showcases");
  await expect(section.getByRole("article")).toHaveCount(verifiedShowcases.length);
  const siteOrigin = new URL(page.url()).origin;
  const basePath = new URL(baseURL!).pathname.replace(/\/$/, "");

  for (const showcase of verifiedShowcases) {
    const card = section.getByRole("article", { name: showcase.name, exact: true });
    await expect(card.getByText("自主展示", { exact: true })).toBeVisible();
    await expect(card.getByText(/自主展示，非客戶委託交付/)).toBeVisible();
    const link = card.getByRole("link", { name: `查看展示：${showcase.name}（另開分頁）`, exact: true });
    await expect(link).toHaveAttribute("href", showcase.href);
    await expect(link).toHaveAttribute("target", "_blank");
    expect((await link.getAttribute("rel"))?.split(/\s+/)).toContain("noopener");
    const image = card.getByRole("img", { name: `${showcase.name}自主展示網站的首頁畫面`, exact: true });
    await expect(image).toHaveAttribute("loading", "lazy");
    const imageUrl = new URL((await image.getAttribute("src"))!, page.url());
    expect(imageUrl.origin).toBe(siteOrigin);
    const localPath = `${basePath}/showcases/${showcase.image}`;
    expect(imageUrl.pathname.includes("/_next/image") ? imageUrl.searchParams.get("url") : imageUrl.pathname).toBe(localPath);
    const response = await request.get(new URL(localPath, siteOrigin).href);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    await expect(image).toHaveJSProperty("complete", true);
  }
  // Browsing the campaign loads local screenshots, not the external demos.
  expect(showcaseRequests).toEqual([]);
});

test("FAQ可用鍵盤開關，結構化資料與畫面答案一致且沒有虛構Offer或評價", async ({ page }) => {
  await load(page);
  const faq = page.locator("#faq");
  const details = faq.locator("details");
  expect(await details.count()).toBeGreaterThan(0);
  const schemaScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schemas = schemaScripts.map((text) => JSON.parse(text));
  const types: string[] = [];
  function collectTypes(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(collectTypes);
    } else if (value && typeof value === "object") {
      const object = value as Record<string, unknown>;
      const type = object["@type"];
      if (typeof type === "string") types.push(type);
      else if (Array.isArray(type)) type.forEach((entry) => { if (typeof entry === "string") types.push(entry); });
      Object.values(object).forEach(collectTypes);
    }
  }
  schemas.forEach(collectTypes);
  expect(types).toContain("FAQPage");
  for (const fabricatedType of ["Offer", "AggregateOffer", "Review", "AggregateRating"]) {
    expect(types).not.toContain(fabricatedType);
  }
  const faqSchema = JSON.parse((await faq.locator('script[type="application/ld+json"]').textContent())!);
  expect(faqSchema["@context"]).toBe("https://schema.org");
  expect(faqSchema["@type"]).toBe("FAQPage");
  expect(faqSchema.mainEntity).toHaveLength(await details.count());
  for (let index = 0; index < await details.count(); index += 1) {
    const item = details.nth(index);
    const summary = item.locator("summary");
    const answer = item.locator("p");
    await expect(item).not.toHaveAttribute("open");
    await expect(answer).not.toBeVisible();
    await summary.press("Enter");
    await expect(item).toHaveAttribute("open", "");
    await expect(answer).toBeVisible();
    expect(faqSchema.mainEntity[index]).toEqual({
      "@type": "Question",
      name: await summary.innerText(),
      acceptedAnswer: { "@type": "Answer", text: await answer.innerText() },
    });
    await summary.press("Space");
    await expect(item).not.toHaveAttribute("open");
    await expect(answer).not.toBeVisible();
  }
});

test("詢價Email只含收件地址，修改摘要後也不把草稿附加於網址", async ({ page }) => {
  await load(page);
  const draftMarker = "private-content-draft";
  await page.getByLabel(/品牌或專案名稱/).fill(draftMarker);
  await page.getByLabel(/想給誰看/).fill("正在比較服務的店主");
  await page.getByLabel(/希望訪客做什麼/).selectOption("詢價");
  await page.getByRole("button", { name: "產生需求摘要" }).click();
  await page.getByRole("button", { name: "返回修改" }).click();
  await page.getByLabel(/希望訪客做什麼/).selectOption("其他");
  await page.getByLabel(/其他主要動作/).fill("我想讓客人下載型錄");
  await page.getByRole("button", { name: "產生需求摘要" }).click();
  await expect(page.getByLabel("需求摘要全文")).toHaveValue(/private-content-draft/);
  await expect(page.getByLabel("需求摘要全文")).toHaveValue(/我想讓客人下載型錄/);
  await expect(page.getByLabel("需求摘要全文")).not.toHaveValue(/提出詢價/);
  await expect(page.locator(".contact-handoff").getByRole("link", { name: "Email 專案詢價", exact: true })).toHaveAttribute("href", emailHref);
  const emailLinks = page.locator('a[href^="mailto:"]');
  expect(await emailLinks.count()).toBeGreaterThanOrEqual(2);
  for (const link of await emailLinks.all()) {
    const href = await link.getAttribute("href");
    expect(href).toBe(emailHref);
    const emailUrl = new URL(href!);
    expect(emailUrl.search).toBe("");
    expect(emailUrl.hash).toBe("");
    expect(href).not.toContain(draftMarker);
  }
  await expect(page.getByRole("link", { name: "查看 XK 聯絡資訊", exact: true })).toHaveAttribute("href", "https://www.xplorekaleidoscope.com/contact/");
  expect(new URL(page.url()).search).toBe("");
  expect(page.url()).not.toContain(draftMarker);
});
