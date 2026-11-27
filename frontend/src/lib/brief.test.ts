import { describe, expect, it } from "vitest";
import { exampleDraft, generateSummary, hasVisibleContent, validateBrief } from "./brief";

describe("必填可見內容驗證", () => {
  it.each([
    "", " \t\n\u3000", "\u200b", "\u200c\u200d", "\u2060\ufeff",
    "\u200e\u202e\u2066\u2069", "\u00ad\u034f\ufe0f", "\u0000\u001b",
    " \u200b\u200d\ufe0f\u3000",
  ])("拒絕只有空白或不可見內容 %j", (value) => {
    expect(hasVisibleContent(value)).toBe(false);
    expect(validateBrief({
      ...exampleDraft, brand: value, audience: value, action: "其他", otherAction: value,
    })).toEqual({
      brand: "請填品牌或專案名稱，暫名也可以。",
      audience: "請用白話描述，這一頁主要想給誰看。",
      otherAction: "請填寫你希望訪客完成的動作。",
    });
  });

  it.each([
    "山角工作室", "XK Studio", "👩‍💻", "👨‍👩‍👧‍👦", "🏳️‍🌈", "☕️",
    "山角 👩‍💻 Studio", "می‌روم", "\u200b可見文字\u200d",
  ])("保留合法中文、英文、emoji及連接字元 %j", (value) => {
    expect(hasVisibleContent(value)).toBe(true);
    const draft = { ...exampleDraft, brand: value, audience: value, action: "其他", otherAction: value };
    expect(validateBrief(draft)).toEqual({});
    expect(generateSummary(draft)).toContain(`我想替${value}做一頁式網站`);
    expect(generateSummary(draft)).toContain(`希望訪客完成的主要動作：${value}`);
    expect(draft.brand).toBe(value);
  });
});

describe("自由輸入動作摘要", () => {
  it.each(["下載型錄", "我想讓客人下載型錄", "我想讓客人下載型錄。"])(
    "以獨立敘述保留短語或完整句子：%s", (otherAction) => {
      const summary = generateSummary({ ...exampleDraft, action: "其他", otherAction });
      expect(summary.split("\n")[1]).toBe(`希望訪客完成的主要動作：${otherAction}`);
      expect(summary).not.toContain("看完後我想");
      expect(summary).not.toContain("。。");
    },
  );
});
