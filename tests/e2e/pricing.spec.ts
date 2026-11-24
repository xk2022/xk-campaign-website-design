import { expect, test, type Page } from "@playwright/test";
import { materialOptions, pricing } from "../../src/config/campaign";

const pricingEnabled =
  pricing.status === "published" || process.env.XK_PRICING_PREVIEW === "true";
const planCta = "先整理需求，再確認方案";

async function load(page: Page) {
  await page.goto("./");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "帶入示範資料" })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("未核定且未開預覽時，不刊登價格區或方案費用入口", async ({ page }) => {
  test.skip(pricingEnabled, "僅驗證預設未刊登的價格草案");
  await load(page);

  await expect(page.locator("#pricing")).toHaveCount(0);
  await expect(page.locator('a[href="#pricing"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { name: pricing.title })).toHaveCount(0);
  await expect(page.getByRole("link", { name: planCta })).toHaveCount(0);
  await expect(page.getByText(pricing.draftNotice, { exact: true })).toHaveCount(0);
  for (const plan of pricing.plans) {
    const amount = new Intl.NumberFormat("zh-TW").format(plan.amount);
    await expect(
      page.getByText(new RegExp(`${escapeRegExp(pricing.currencyLabel)}\\s*${escapeRegExp(amount)}`)),
    ).toHaveCount(0);
  }
});

test("啟用價格時，375×667 首屏看得到預算入口，三方案清楚標示幣別與起價", async ({ page }) => {
  test.skip(!pricingEnabled, "價格未刊登；請以 XK_PRICING_PREVIEW=true 驗證草案");
  await page.setViewportSize({ width: 375, height: 667 });
  await load(page);

  const budgetEntry = page.locator('.hero a[href="#pricing"]');
  await expect(budgetEntry).toBeVisible();
  const box = await budgetEntry.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(667);
  await expect(budgetEntry).toContainText(pricing.currencyLabel);
  await budgetEntry.click();
  expect(new URL(page.url()).hash).toBe("#pricing");

  const section = page.locator("#pricing");
  await expect(section.getByRole("heading", { name: pricing.title })).toBeVisible();
  await expect(section.getByRole("article")).toHaveCount(3);
  for (const plan of pricing.plans) {
    const card = section.getByRole("article", { name: plan.name, exact: true });
    const amount = new Intl.NumberFormat("zh-TW").format(plan.amount);
    const price = new RegExp(
      `${escapeRegExp(pricing.currencyLabel)}\\s*${escapeRegExp(amount)}\\s*${escapeRegExp(pricing.priceSuffix)}`,
    );
    await expect(card.getByRole("heading", { name: plan.name, exact: true })).toBeVisible();
    await expect(card).toContainText(price);
    await expect(card.getByRole("link", { name: planCta, exact: true })).toHaveAttribute("href", "#brief");
  }
  if (pricing.status === "draft") {
    await expect(section.getByText(pricing.draftNotice, { exact: true })).toBeVisible();
  } else {
    await expect(section.getByText(pricing.draftNotice, { exact: true })).toHaveCount(0);
  }
});

test("各方案入口只前往整理需求，保留手動草稿且不代替訪客選擇方案", async ({ page }) => {
  test.skip(!pricingEnabled, "價格未刊登；請以 XK_PRICING_PREVIEW=true 驗證草案");
  await load(page);
  const draft = {
    brand: "手動填寫的品牌",
    scenario: "other",
    audience: "正在比較服務的店主",
    action: "其他",
    otherAction: "下載產品型錄",
    notes: "先保留我手動補充的交付問題。",
    materials: ["Logo", "社群或既有網站"],
  };
  await page.getByLabel(/品牌或專案名稱/).fill(draft.brand);
  await page.getByLabel(/使用情境/).selectOption(draft.scenario);
  await page.getByLabel(/想給誰看/).fill(draft.audience);
  await page.getByLabel(/希望訪客做什麼/).selectOption(draft.action);
  await page.getByLabel(/其他主要動作/).fill(draft.otherAction);
  await page.getByLabel(/想補充的事/).fill(draft.notes);
  for (const material of draft.materials) {
    await page.getByLabel(material, { exact: true }).check();
  }

  for (const plan of pricing.plans) {
    const card = page.locator("#pricing").getByRole("article", { name: plan.name, exact: true });
    await card.getByRole("link", { name: planCta, exact: true }).click();
    expect(new URL(page.url()).hash).toBe("#brief");
    expect(new URL(page.url()).search).toBe("");
    await expect(page.getByLabel(/品牌或專案名稱/)).toHaveValue(draft.brand);
    await expect(page.getByLabel(/使用情境/)).toHaveValue(draft.scenario);
    await expect(page.getByLabel(/想給誰看/)).toHaveValue(draft.audience);
    await expect(page.getByLabel(/希望訪客做什麼/)).toHaveValue(draft.action);
    await expect(page.getByLabel(/其他主要動作/)).toHaveValue(draft.otherAction);
    await expect(page.getByLabel(/想補充的事/)).toHaveValue(draft.notes);
    for (const material of materialOptions) {
      if (draft.materials.includes(material)) {
        await expect(page.getByLabel(material, { exact: true })).toBeChecked();
      } else {
        await expect(page.getByLabel(material, { exact: true })).not.toBeChecked();
      }
    }
  }

  await page.getByRole("button", { name: "產生需求摘要" }).click();
  const summary = page.getByLabel("需求摘要全文");
  await expect(summary).toHaveValue(new RegExp(draft.brand));
  await expect(summary).toHaveValue(new RegExp(draft.otherAction));
  await expect(summary).toHaveValue(new RegExp(draft.notes));
  for (const plan of pricing.plans) {
    await expect(summary).not.toHaveValue(new RegExp(plan.name));
  }
  await expect(summary).not.toHaveValue(/NT\$|15,000|22,000|30,000/);
});
