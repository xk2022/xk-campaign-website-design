import { expect, test, type Page } from "@playwright/test";

async function load(page: Page) {
  await page.goto("./");
  await expect(page.getByRole("button", { name: "帶入示範資料" })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [375, 1440]) {
  test(`${width}px：頁尾提供可點選的回頂入口，回頂後收起並聚焦頁首`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await load(page);
    const backToTop = page.getByRole("link", { name: "回到最上面", exact: true });
    await expect(backToTop).toBeHidden();

    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(backToTop).toBeVisible();
    const box = await backToTop.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(48);
    expect(box!.height).toBeGreaterThanOrEqual(48);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(812);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width);

    await backToTop.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    expect(new URL(page.url()).hash).toBe("#top");
    await expect(page.locator("#top")).toBeFocused();
    await expect(backToTop).toBeHidden();
  });
}

test("減少動態效果時可用 Enter 回頂，保留手填草稿且不產生或送出摘要", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page);
  const brand = page.getByLabel(/品牌或專案名稱/);
  const audience = page.getByLabel(/想給誰看/);
  const action = page.getByLabel(/希望訪客做什麼/);
  const notes = page.getByLabel(/想補充的事/);
  await brand.fill("手填回頂測試工作室");
  await audience.fill("正在比較網站方案的店主");
  await action.selectOption("詢價");
  await page.getByLabel("Logo", { exact: true }).check();
  await page.getByLabel("照片", { exact: true }).check();
  await notes.fill("先確認品牌與作品素材。\n回頂後保留這段補充。");

  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  const backToTop = page.getByRole("link", { name: "回到最上面", exact: true });
  await expect(backToTop).toBeVisible();
  await backToTop.focus();
  await backToTop.press("Enter");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("#top")).toBeFocused();
  await expect(backToTop).toBeHidden();
  expect(new URL(page.url()).hash).toBe("#top");
  expect(new URL(page.url()).search).toBe("");
  await expect(brand).toHaveValue("手填回頂測試工作室");
  await expect(audience).toHaveValue("正在比較網站方案的店主");
  await expect(action).toHaveValue("詢價");
  await expect(page.getByLabel("Logo", { exact: true })).toBeChecked();
  await expect(page.getByLabel("照片", { exact: true })).toBeChecked();
  await expect(notes).toHaveValue("先確認品牌與作品素材。\n回頂後保留這段補充。");
  await expect(page.getByLabel("需求摘要全文")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "產生需求摘要" })).toBeEnabled();
});
