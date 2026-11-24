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
    fonts: {
      latin: "Inter Variable",
      traditionalChinese: "Noto Sans TC Variable",
    },
  },
  service: "一頁式網站建置",
  title: "一頁式網站建置｜Xplore Kaleidoscope（XK）",
  description:
    "從看菜單、找門市，到詢價、報名，XK 協助你把服務整理成手機上就能用的一頁。先用需求整理工具，產生並複製可直接討論的建站需求。",
  pagesPreviewUrl: "https://web.xplorekaleidoscope.com/",
  links: {
    home: "https://xk2022.github.io/xk-website/",
    services: "https://xk2022.github.io/xk-website/services/",
    portfolio: "https://xk2022.github.io/xk-website/portfolio/",
    contact: "https://xk2022.github.io/xk-website/contact/",
  },
  contactHandoff: {
    status: "pending",
    verifiedAt: "2026-11-23",
    title: "正式聯絡管道確認中",
    description:
      "先複製並自行保存摘要。若你已透過介紹或既有對話認識 XK，可自行貼回原對話。官網聯絡頁目前導向網域停放頁，首次接觸請待官網恢復並公布正式管道後再洽詢。",
    copySuccess: "已複製，可自行貼給 XK",
    copyHint: "複製不會送出需求，正式聯絡管道確認後再自行提供。",
    source: {
      url: "https://github.com/xk2022/xk-website/blob/c124954582edc2af3a24c187c1c937a73035a851/src/config/contact.ts",
      blobSha: "121ba6506ba5420c6d699e6ef8e67725f7188f92",
      verification: "source-and-browser-redirect",
      browserResult: "官網 contact/ 轉址至 https://xplorekaleidoscope.com/lander（網域停放頁）",
    },
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

/** 可討論方向，並非固定方案或自動包含的交付承諾。 */
export const serviceScope = {
  title: "先確認這一頁，要交付什麼。",
  description:
    "從內容、手機畫面到訪客下一步，先列出要做的事，再確認實際交付範圍。",
  discussTitle: "可以一起討論的交付",
  discuss: [
    "把你提供的品牌、服務與素材，整理成一頁的內容順序。",
    "適合手機與桌面瀏覽的版面，以及約定的互動與外連入口。",
    "基礎頁面標題與描述、操作驗收，以及原始碼、交接說明與部署協助的範圍。",
  ],
  confirmTitle: "需要依個案確認",
  confirm: [
    "文案撰寫、翻譯、攝影，以及額外素材製作與修改次數。",
    "網域與主機、第三方費用、資料收集或系統串接的需求與責任。",
    "交付項目、原始碼權利、報價、時程，以及上線後維護與更新方式。",
  ],
  preparation:
    "你可以先準備 Logo、照片、現有文案、社群或既有網站連結；尚未備齊，也可以在需求摘要中註明。",
  note: "實際交付與合作條件以雙方確認的內容為準。",
  sources: [
    {
      url: "https://github.com/xk2022/xplore-kaleidoscope/blob/dca3329c556bdd88113181384543b5923e25618b/doc/01_business-plan/week-01/02_service-catalog.md",
      blobSha: "99babf871dda0cf5537fecb00a20f9638f3f6f60",
      sections: [
        "3. S01 — Website Development",
        "9. Commercial Terms",
        "10. Service Exclusions",
        "11. S05 — Maintenance Services",
      ],
    },
    {
      url: "https://github.com/xk2022/xk-website/blob/c124954582edc2af3a24c187c1c937a73035a851/src/config/services.ts",
      blobSha: "a38450ed4d1112c81ca383f1dc4dade1d368c7f1",
      sections: ["website-development", "servicesPage.process", "serviceProcessSteps"],
    },
  ],
} as const;

/** 自行設計的靜態介面示意；不代表真實品牌、可送出的功能或客戶實績。 */
export const scenarioExamples = [
  {
    id: "business",
    label: "製造與企業服務",
    title: "讓用途，成為詢價的起點。",
    brand: "微型加工服務（虛構）",
    heading: "先找接近你需求的加工類別",
    options: ["保護膜模切", "工業標籤", "其他加工"],
    detailLabel: "詢價前可以整理",
    detail: "用途、材料、尺寸與預估數量；還不確定的規格也能註明。",
    action: "整理詢價需求",
  },
  {
    id: "campaign",
    label: "品牌與活動推廣",
    title: "讓活動資訊，接上參與的下一步。",
    brand: "週末品牌體驗（虛構）",
    heading: "先看看哪種參與方式適合你",
    options: ["個人參與", "企業包場", "想先詢問"],
    detailLabel: "報名前先看清楚",
    detail: "活動內容、日期與地點，依主辦方確認資訊刊登。",
    action: "確認入口後前往報名",
  },
] as const;

/**
 * 本輪價位提案，尚未核定；預設不在公開建置中顯示。
 * 公司定價策略僅提供一頁式 NT$15,000–30,000 建議區間，
 * 以下三檔名稱、金額與內容是供負責人確認的提案，並非既有正式報價。
 */
export const pricing = {
  status: "draft" as "draft" | "published",
  currency: "TWD",
  currencyLabel: "NT$",
  title: "先看預算，找到適合你的第一頁。",
  description: "依素材準備程度、內容安排與互動需求，先找接近你的建置方向。",
  draftNotice: "價位提案預覽：以下金額與方案內容尚未核定，未對外刊登。",
  priceLabel: "預估建置費",
  priceSuffix: "起",
  billingNote: "一次性建置費用；實際金額、稅別與付款方式以確認後的報價單為準。",
  extrasNote:
    "網域、主機、文案與攝影、第三方服務及後續維護，是否包含及各項費用會在報價單逐項確認。",
  commonNote:
    "三種方向均為一頁式網站。先提供現有 Logo、照片與文案，實際區塊、修改範圍、互動及交付環境再一起確認。",
  plans: [
    {
      id: "starter",
      name: "形象起步",
      amount: 15000,
      label: "先讓客人找到重點",
      audience: "已有文案與照片，想把品牌、服務與聯絡入口整理成一頁。",
      features: ["品牌與服務資訊編排", "手機與桌面響應版面", "既有洽詢或導航入口"],
    },
    {
      id: "promotion",
      name: "服務推廣",
      amount: 22000,
      label: "讓資訊接上下一步",
      audience: "服務內容較多，希望客人看懂差異，再帶著明確需求來詢問。",
      features: ["服務重點與行動順序整理", "情境分類與內容呈現", "頁內需求摘要整理互動"],
    },
    {
      id: "interaction",
      name: "互動客製",
      amount: 30000,
      label: "把選擇整理成需求",
      audience: "有特定選項、資料整理或品牌呈現需求，需要討論客製的一頁互動。",
      features: ["依品牌需求規劃版面", "客製選項與摘要互動", "互動流程與交付範圍確認"],
    },
  ],
  source: {
    url: "https://github.com/xk2022/xplore-kaleidoscope/blob/cd9be948fe843c437d69ed635263a9527e931367/doc/02_services/定價策略.md",
    blobSha: "59fea2a9d9805bbbfa7407a01ce5ce275a737a77",
    checkedAt: "2026-11-24",
    scope: "僅支持 Landing Page 整體建議區間，三檔仍待核定",
  },
} as const;
