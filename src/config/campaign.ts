const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const campaign = {
  brand: {
    name: "Xplore Kaleidoscope",
    shortName: "XK",
    logo: `${basePath}/brand/xk-logo-horizontal.svg`,
    symbol: `${basePath}/brand/xk-logo-symbol.svg`,
    colors: {
      primary: "#101A33",
      secondary: "#3157D5",
      accent: "#19B8D5",
      surface: "#F5F7FB",
      background: "#FFFFFF",
      foreground: "#172033",
      muted: "#667085",
      border: "#E4E8F0",
    },
    fonts: { latin: "Inter", traditionalChinese: "Noto Sans TC" },
  },
  service: "一頁式網站建置",
  title: "一頁式網站建置｜Xplore Kaleidoscope（XK）",
  description:
    "從看菜單、找門市，到詢價、報名，XK 協助你把服務整理成手機上就能用的一頁。先用需求整理工具，產生並複製可直接討論的建站需求。",
  links: {
    home: "https://xk2022.github.io/xk-website/",
    services: "https://xk2022.github.io/xk-website/services/",
    portfolio: "https://xk2022.github.io/xk-website/portfolio/",
    contact: "https://xk2022.github.io/xk-website/contact/",
  },
  // 本廣告頁不呈現具名案例或「查看展示」；避免把自主展示當作客戶實績。
  casePublication: { showNamedCases: false, displayLinks: [] as string[] },
} as const;

export const scenarios = [
  {
    id: "local",
    label: "在地店家",
    english: "LOCAL BUSINESS",
    number: "01",
    question: "你在哪裡？有什麼可以先看？",
    action: "看餐點或服務、導航到店、整理預留或團訂訊息",
    visualLabel: "讓第一次來的客人，也找得到你。",
    tags: ["餐點與服務", "門市導航", "預留需求"],
  },
  {
    id: "business",
    label: "製造與企業服務",
    english: "BUSINESS SERVICES",
    number: "02",
    question: "我知道用途，還不知道該問哪種規格。",
    action: "看加工樣本，帶入類別並整理詢價需求",
    visualLabel: "從「我需要」開始，把詢價說清楚。",
    tags: ["加工樣本", "服務分類", "詢價需求"],
  },
  {
    id: "campaign",
    label: "品牌與活動推廣",
    english: "BRAND & EVENTS",
    number: "03",
    question: "這個方案適合我嗎？我要怎麼參加或詢問？",
    action: "選送禮情境、看活動資訊，前往已確認的洽詢或報名入口",
    visualLabel: "讓心動的人，找到參與的下一步。",
    tags: ["送禮情境", "活動資訊", "洽詢與報名"],
  },
] as const;
export type ScenarioId = (typeof scenarios)[number]["id"] | "other" | "";
export const actionOptions = [
  "導航",
  "詢價",
  "報名",
  "整理預留需求",
  "其他",
] as const;
export const materialOptions = [
  "Logo",
  "照片",
  "文案",
  "社群或既有網站",
  "尚未準備",
] as const;
export type Material = (typeof materialOptions)[number];

export const cooperationSteps = [
  { title: "整理需求", description: "確認對象、訪客動作與現有素材。" },
  {
    title: "確認頁面",
    description: "討論文案、版面、互動以及要連往哪個管道。",
  },
  {
    title: "預覽與驗收",
    description: "在手機和桌面實際操作，核對內容與連結。",
  },
] as const;
