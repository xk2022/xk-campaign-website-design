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
    home: "https://www.xplorekaleidoscope.com/",
    services: "https://www.xplorekaleidoscope.com/services/",
    portfolio: "https://www.xplorekaleidoscope.com/portfolio/",
    contact: "https://www.xplorekaleidoscope.com/contact/",
  },
  contactChannels: {
    email: {
      label: "Email 專案詢價",
      href: "mailto:system.xk2022@gmail.com",
      address: "system.xk2022@gmail.com",
    },
  },
  contactHandoff: {
    status: "available",
    verifiedAt: "2026-11-25",
    title: "把摘要帶給 XK，開始討論。",
    description:
      "複製摘要後，可使用官網公開的專案詢價 Email。若你已透過介紹或既有對話認識 XK，也可以自行貼回原對話。",
    copySuccess: "已複製，可自行貼給 XK",
    copyHint: "複製不會送出需求。開啟郵件程式後，請自行貼上摘要並確認寄出。",
    source: {
      url: "https://github.com/xk2022/xk-website/blob/1e16144c21a848399e2986948d4239481672f12c/src/config/contact.ts",
      blobSha: "323c2d201f956bda7734ffca4ee5b90aec765edf",
      verification: "source-and-live-page",
      browserResult: "官網 contact/ 已恢復並公開 Email 專案詢價",
    },
  },
  // 僅列可開啟的自主展示；不代表付費客戶、委託交付或品牌背書。
  casePublication: {
    showNamedCases: true,
    displayLinks: [
      "https://showcase.xplorekaleidoscope.com/march-tangbao/",
      "https://honest.xplorekaleidoscope.com/",
      "https://honbird.xplorekaleidoscope.com/",
    ],
  },
} as const;

export const painPoints = [
  { title: "資訊散在好幾個地方？", description: "菜單在社群、地址在名片，把客人常找的資訊集中在同一頁。" },
  { title: "每次都從頭解釋服務？", description: "先讓客人看懂用途、樣本與差異，帶著具體問題來詢問。" },
  { title: "看完介紹，卻不知道怎麼開始？", description: "替這一頁選一個主要動作，接到導航、詢價或已確認的報名入口。" },
] as const;

/** 公開自主展示；截圖來源與核對紀錄見 doc/04_campaign_optimization_2026-11-25.md。 */
export const showcases = [
  {
    id: "march-tangbao", name: "三月手工湯包", category: "在地店家",
    image: `${basePath}/showcases/march-tangbao.webp`,
    href: campaign.casePublication.displayLinks[0],
    need: "第一次來的客人，想先看餐點、找到門市，再整理預留需求。",
    actions: ["菜單與餐點介紹", "門市導航入口", "預留訊息整理"],
    note: "自主展示，非客戶委託交付。餐點為生成示意素材，預留操作不代表訂單成立。",
  },
  {
    id: "honest-diecut", name: "宏能興業", category: "製造與企業服務",
    image: `${basePath}/showcases/honest-diecut.webp`,
    href: campaign.casePublication.displayLinks[1],
    need: "採購知道使用情境，但需要樣本分類，才能說清楚加工需求。",
    actions: ["加工樣本分類", "帶入加工類別", "模擬詢價摘要"],
    note: "自主展示，非客戶委託交付。加工樣本為生成示意素材，詢價不會自動送出。",
  },
  {
    id: "hongjia-birdnest", name: "宏家燕窩", category: "品牌推廣",
    image: `${basePath}/showcases/hongjia-birdnest.webp`,
    href: campaign.casePublication.displayLinks[2],
    need: "送給親友或企業贈禮，需要不同的資訊與洽詢起點。",
    actions: ["親友與企業送禮情境", "品牌與產品資訊", "模擬洽詢摘要"],
    note: "自主展示，非客戶委託交付。產品為生成示意素材，並非購物或活動報名系統。",
  },
] as const;

export const brandTrust = {
  title: "和 XK 一起，把需求做成能操作的頁面。",
  description: "Xplore Kaleidoscope 由軟體工程師創立，從需求釐清、頁面實作到操作驗收，讓內容和功能一起被確認。",
  points: [
    { title: "從你的生意開始", description: "先確認給誰看、希望完成什麼，再討論內容與技術。" },
    { title: "用實際操作確認", description: "在手機與桌面預覽，逐一核對文案、連結、提示與互動結果。" },
    { title: "交付與維護先說清楚", description: "原始碼、部署協助、修改範圍與後續維護方式，逐項寫入個案提案。" },
  ],
  source: "https://github.com/xk2022/xk-website/blob/1e16144c21a848399e2986948d4239481672f12c/src/config/about.ts",
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

/**
 * 已授權刊登的三種一頁式網站預估起價。
 * 公司定價策略僅提供一頁式 NT$15,000–30,000 建議區間，
 * 三檔為本專案採用的規劃方向；實際條件仍以個案報價單為準。
 */
export const pricing = {
  status: "published" as "draft" | "published",
  publicationDate: "2026-11-24",
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
    scope: "來源提供 Landing Page 建議區間；三檔為本頁採用的預估起價，個案條件依報價單確認",
  },
} as const;

/** 可見 FAQ 與 FAQPage 使用同一份文字；不代表搜尋成效或收錄承諾。 */
export const faqItems = [
  {
    question: "一頁式網站大概需要多少費用？",
    answer: pricing.status === "published"
      ? `目前提供${pricing.plans.map((plan) => `${plan.name} NT$${new Intl.NumberFormat("zh-TW").format(plan.amount)} 起`).join("、")}三種方向，均為一次性建置的預估起價。實際金額、稅別、付款，以及網域、主機與維護是否包含，會在報價單逐項確認。`
      : "費用依內容、素材與互動需求逐案確認。實際金額、稅別、付款，以及網域、主機與維護是否包含，會在報價單逐項確認。",
  },
  {
    question: "一頁式網站和多頁網站，該怎麼選？",
    answer: "如果這次要說清楚一項服務、店家資訊或一場活動，並引導一個主要動作，一頁式通常是合適的討論起點。若有大量產品、文章、多語內容、會員或交易流程，應先評估多頁網站或系統需求，再確認範圍。",
  },
  {
    question: "還沒有文案、Logo 或照片，也可以開始嗎？",
    answer: "可以先整理需求，並在素材欄選擇「尚未準備」。現有社群、服務說明及客人常問的問題，都能作為討論起點；文案、攝影或額外素材製作是否納入及費用，會另外確認。",
  },
  {
    question: "製造服務或活動，也適合做一頁式網站嗎？",
    answer: "可以依主要動作規劃，例如用加工樣本協助整理詢價，或集中活動資訊並連到主辦方確認的報名入口。後台、自動寄信、金流及外部系統串接，需要另外確認，不因有需求整理表單就自動包含。",
  },
  {
    question: "多久能完成？可以修改幾次？上線後誰維護？",
    answer: "會依素材完整度、頁面內容、互動複雜度及可安排的工作時間確認。交期、修改範圍與次數、驗收、部署及後續維護更新方式，都會在開始前寫入個案提案，沒有統一固定交期或不限次修改。",
  },
  {
    question: "產生摘要後，會自動寄給 XK 嗎？",
    answer: "不會。內容只在本頁記憶體整理，重新整理就會清空。請先複製摘要，再透過官網公開的 Email 專案詢價入口開啟郵件程式，自行貼上並確認寄出；若裝置沒有設定郵件程式，可在自己的信箱手動建立郵件。",
  },
] as const;
