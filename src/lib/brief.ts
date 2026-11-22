import { scenarios, type Material, type ScenarioId } from "@/config/campaign";

export type BriefDraft = {
  brand: string;
  scenario: ScenarioId;
  audience: string;
  action: string;
  otherAction: string;
  materials: Material[];
  notes: string;
};

export type BriefErrors = Partial<
  Record<"brand" | "audience" | "action" | "otherAction", string>
>;

export const emptyDraft: BriefDraft = {
  brand: "",
  scenario: "",
  audience: "",
  action: "",
  otherAction: "",
  materials: [],
  notes: "",
};

// Only an explicit request to load this example replaces a visitor's draft.
export const exampleDraft: BriefDraft = {
  brand: "山角木作工作室（虛構示範）",
  scenario: "business",
  audience: "正在找客製木作的店主",
  action: "詢價",
  otherAction: "",
  materials: ["Logo", "照片"],
  notes: "想展示訂製木桌和店面層架，讓客人先了解作品，再帶著尺寸和用途來討論。",
};

export function changeScenario(
  draft: BriefDraft,
  scenario: ScenarioId,
): BriefDraft {
  return { ...draft, scenario };
}

export function toggleMaterial(
  materials: Material[],
  material: Material,
): Material[] {
  if (materials.includes(material))
    return materials.filter((item) => item !== material);
  if (material === "尚未準備") return ["尚未準備"];
  return [...materials.filter((item) => item !== "尚未準備"), material];
}

// Check for visible information without rewriting the visitor's actual text.
// Joiners and variation selectors alone are empty; emoji that use them stay valid.
export function hasVisibleContent(value: string): boolean {
  return value.replace(
    /[\p{White_Space}\p{Default_Ignorable_Code_Point}\p{Cc}]/gu,
    "",
  ).length > 0;
}

export function validateBrief(draft: BriefDraft): BriefErrors {
  const errors: BriefErrors = {};
  if (!hasVisibleContent(draft.brand))
    errors.brand = "請填品牌或專案名稱，暫名也可以。";
  if (!hasVisibleContent(draft.audience))
    errors.audience = "請用白話描述，這一頁主要想給誰看。";
  if (!hasVisibleContent(draft.action))
    errors.action = "請選一個最希望訪客完成的動作。";
  if (draft.action === "其他" && !hasVisibleContent(draft.otherAction))
    errors.otherAction = "請填寫你希望訪客完成的動作。";
  return errors;
}

const actionPhrases: Record<string, string> = {
  導航: "使用導航到店",
  詢價: "提出詢價",
  報名: "完成報名",
  整理預留需求: "整理預留或團訂需求",
};

export function generateSummary(draft: BriefDraft): string {
  const actionSentence =
    draft.action === "其他"
      ? `希望訪客完成的主要動作：${draft.otherAction.trim()}`
      : `最希望訪客看完後${actionPhrases[draft.action] ?? draft.action.trim()}。`;
  const scenario =
    draft.scenario === "other"
      ? "其他"
      : scenarios.find((item) => item.id === draft.scenario)?.label;
  let materials = "素材準備狀況尚待確認。";
  if (draft.materials.includes("尚未準備")) materials = "目前尚未準備素材。";
  else if (draft.materials.length)
    materials = `目前已有 ${draft.materials.join("、")}。`;
  return [
    `我想替${draft.brand.trim()}做一頁式網站，主要給${draft.audience.trim()}看。`,
    actionSentence,
    ...(scenario ? [`使用情境是${scenario}。`] : []),
    materials,
    ...(draft.notes.trim() ? [`另外想補充：${draft.notes.trim()}`] : []),
  ].join("\n");
}
