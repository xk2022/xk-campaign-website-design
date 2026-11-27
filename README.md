**公開網站：[https://web.xplorekaleidoscope.com/](https://web.xplorekaleidoscope.com/)**

# XK 一頁式網站建置服務廣告頁

[![Verify and deploy GitHub Pages](https://github.com/xk2022/xk-website-lp-campaign/actions/workflows/pages.yml/badge.svg)](https://github.com/xk2022/xk-website-lp-campaign/actions/workflows/pages.yml)

將店家、企業服務與品牌推廣的需求，整理成可在手機使用的一頁式網站；訪客可在本頁產生並複製建站需求，再自行透過公開 Email 向 XK 洽詢。

## 專案資訊

| 項目 | 內容 |
| --- | --- |
| Repository | [xk2022/xk-website-lp-campaign](https://github.com/xk2022/xk-website-lp-campaign) |
| 網站類型 | Landing Page／一頁式服務廣告 |
| 專案性質 | XK 自主規劃，非客戶委託交付 |
| 專案狀態 | proposal：公開服務推廣預覽，維持 `noindex, nofollow` |
| 主要使用者 | 店家老闆、中小企業窗口、活動承辦人 |
| 主要完成動作 | 產生並複製需求摘要 |
| 公開入口 | https://web.xplorekaleidoscope.com/ |
| 部署管理 | 本 repo 的 GitHub Actions／GitHub Pages |
| 維護狀態 | 持續維護 |
| 最後更新 | 2026-11-27（Asia/Taipei） |

## 核心功能與限制

- 三種情境入口只更新情境，保留手填草稿；提供虛構示範資料、必填驗證與第一錯誤焦點、素材互斥、摘要修改及剪貼簿拒絕時的手動選取。
- 三檔預估建置起價為形象起步 **NT$15,000**、服務推廣 **NT$22,000**、互動客製 **NT$30,000**，自 2026-11-24 授權刊登。一次性建置費、稅別、付款、網域／主機及維護是否包含，依個案報價單確認。
- 提供可操作的自主展示、合作說明、FAQ／同源 FAQPage，以及右下角的回頂箭頭；未把自主展示當成付費客戶或交付實績。
- 草稿只存在當頁記憶體，重新整理即清空；沒有 API、後台、追蹤或瀏覽器儲存，不把草稿加進網址。Email 只開啟訪客的郵件程式，須自行貼上摘要並確認寄出。
- 預覽版保留 `noindex, nofollow`；canonical、`og:url` 與 sitemap 待正式索引政策核定。沒有固定交期、成效數字、評論或自造的 LINE／預約入口。

## 公司架構對齊（2026-11-27）

本輪依公司最新 [網站 README／專案結構規範](https://github.com/xk2022/xplore-kaleidoscope/blob/76252e621ecb5c508494b49d4cd1eabd340b7e81/06_engineering/website-project-readme-template.md) 與 [架構選型](https://github.com/xk2022/xplore-kaleidoscope/blob/76252e621ecb5c508494b49d4cd1eabd340b7e81/06_engineering/architecture.md) 調整。公司庫只讀；未修改官網、公司文件或中央展示庫。

```text
xk-website-lp-campaign/
├── .github/workflows/pages.yml
├── docs/                       # 專案需求、來源、修復與驗收紀錄
├── frontend/
│   ├── AGENTS.md               # Next.js 版本指引
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── playwright.config.ts
│   ├── vitest.config.ts
│   ├── scripts/                # 前端建置、靜態預覽及量測
│   ├── public/                 # 正式 Logo 與展示截圖
│   └── src/
│       ├── app/                # 首頁、layout、metadata、樣式
│       ├── components/         # 既有 Server 元件及互動 islands
│       ├── config/campaign.ts  # 品牌、情境、價格、連結及公開狀態
│       ├── lib/                # 需求驗證與摘要純函式
│       └── test/               # 單元測試共用設定
├── backend/README.md           # 目前沒有後端服務
├── infrastructure/README.md    # 既有 Pages 部署位置與邊界
├── tests/e2e/                  # 跨元件瀏覽器驗收
├── .nvmrc                      # 24
├── AGENTS.md
└── README.md
```

前端套件、鎖檔、設定、程式與資產均已搬至 `frontend/`；`doc/` 改為 `docs/`。程式內部保持現有模組與 Server／Client 界線，未為分類新增空的功能模組。框架維持 Next.js App Router、React、TypeScript、Tailwind CSS 4、Lucide；沒有依賴升級。

**npm 指令現在從 `frontend/` 執行。** 根目錄可用 `npm --prefix frontend ...`，不另建根套件或重複鎖檔。套件名仍保留 `xk-campaign-website-design`，因此預設的本機子路徑驗收仍使用此名稱；自訂網域部署為空 basePath。

## 安裝與本機啟動

Node.js **24.x**、npm，版本由根目錄 `.nvmrc` 與前端 `engines` 固定。

```bash
git clone https://github.com/xk2022/xk-website-lp-campaign.git
cd xk-website-lp-campaign
nvm use
cd frontend
npm ci
npm run dev -- --port 3000
```

首頁為 **http://localhost:3000/**（連接埠 **3000**）。沒有 nvm 時，先安裝 Node.js 24，再執行 `npm ci`。已在 repo 根目錄時，也可執行：

```bash
npm --prefix frontend ci
npm --prefix frontend run dev -- --port 3000
```

一般 production 預覽（在 `frontend/`）：

```bash
npm run build
npm start -- --port 3000
```

## 建置與測試

以下命令均在 `frontend/` 執行；不依賴根目錄的 `node_modules`。

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

與目前自訂網域相同的根路徑靜態建置及預覽：

```bash
NEXT_PUBLIC_BASE_PATH="" npm run build:pages
NEXT_PUBLIC_BASE_PATH="" npm run preview:pages -- --port 3007
```

開啟 **http://127.0.0.1:3007/**（連接埠 **3007**）。輸出為 `frontend/out/`。環境變數寫法為 POSIX shell；其他 shell 請設定相同變數。

完整 Chromium 驗收：

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007/ \
PLAYWRIGHT_SERVER_COMMAND="NEXT_PUBLIC_BASE_PATH= npm run preview:pages -- --port 3007" \
npm run test:e2e
```

可攜子路徑驗收：

```bash
npm run build:pages
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002/xk-campaign-website-design/ \
PLAYWRIGHT_SERVER_COMMAND="npm run preview:pages -- --port 3002" \
npm run test:e2e
```

未安裝瀏覽器時先執行 `npx playwright install chromium`；若有系統 `/usr/bin/chromium`，測試會優先使用，也可指定 `CHROMIUM_PATH`。Playwright 從前端設定讀取根目錄 `tests/e2e/`，結果位於 `frontend/test-results/`、`frontend/playwright-report/`，不納入版控。

## 展示連結核對（2026-11-27）

| 樣品 | 現行網址 | 修正／驗證 |
| --- | --- | --- |
| 三月手工湯包 | https://showcase.xplorekaleidoscope.com/march-tangbao/ | 保持原址；HTTP 200，CSS／JS／圖片正常 |
| 宏能興業 | https://showcase.xplorekaleidoscope.com/honest/ | 取代已回傳 404 的 `honest.xplorekaleidoscope.com`；新址及資產 200 |
| 宏家燕窩 | https://showcase.xplorekaleidoscope.com/hongjia-birdnest/ | 取代已回傳 404 的 `honbird.xplorekaleidoscope.com`；新址及資產 200 |

Cloud Chrome 已實開三頁，確認宏能 PET 樣本帶入、宏家企業送禮情境帶入、三月 V1 示範到預留訊息可操作；沒有對外送出。

網址對照目前 [官網展示設定](https://github.com/xk2022/xk-website/blob/ee4b4709a9f8daa755e2595a46c158b3c92d8229/src/config/website-showcases.ts)、各來源 README 及 [Hub 登錄](https://github.com/xk2022/xk-website-showcase/blob/f63941867cdfc8cdf713e3075f75ec1e5e71da20/config/showcases.json)。兩個舊網址未提供轉址，不能只修改畫面文字而保留舊 href。

所有樣品網址集中於 `frontend/src/config/campaign.ts` 的 `casePublication`，作品內容由 `showcases` 使用。測試獨立核對預期 href、本地截圖及另開分頁屬性。樣品為自主展示；外站可能另提供聯絡或測試入口，本次未送出真實詢問、預留或訂單。

官網導流仍為完整絕對網址：[XK 官網](https://www.xplorekaleidoscope.com/)、[完整服務](https://www.xplorekaleidoscope.com/services/)、[技術作品集](https://www.xplorekaleidoscope.com/portfolio/)、[聯絡資訊](https://www.xplorekaleidoscope.com/contact/)，不受本頁 basePath 影響。公開 Email 為 `mailto:system.xk2022@gmail.com`，不附加草稿。

## GitHub Actions 與部署

[Verify and deploy GitHub Pages](https://github.com/xk2022/xk-website-lp-campaign/actions/workflows/pages.yml) 在 PR、推送 main 及手動執行時啟動。

1. 以根目錄 `.nvmrc` 設定 Node.js 24；npm 快取鎖檔為 `frontend/package-lock.json`。
2. 所有 npm／node／npx 指令以 `frontend/` 為工作目錄，執行安裝、lint、型別、單元、一般及靜態建置。
3. 檢查 `frontend/out/index.html`、資產、`.nojekyll` 與 `version.json`，再對真正靜態成品跑 Chromium 驗收。
4. PR 只驗證；main 成功後保存 **`frontend/out/`**，deploy job 發布同一份 `pages-static-export` artifact。
5. 以公開 `/version.json` 核對 `sourceSha` 等於部署 main commit、`sourceState=clean`、`basePath=""`；CI 通過與部署成功分開確認。

本專案為 XK 自有服務廣告，未登記至中央 Showcase Hub，保留既有 `web.xplorekaleidoscope.com` 與本 repo 的 Pages 發布。**作品集樣品**由 `xk2022/xk-website-showcase` 統一部署；本輪沒有變更 Hub、DNS、repo 可見性或 Pages 管理設定。新作品集專案應依公司中央展示規範登錄，勿直接複用此廣告的部署方式。

維護流程：最新 main → `codex/<任務>` → PR → 最新 head CI 通過 → 合併 → main 驗證與部署 → 公開站核對。官方 Actions 固定完整 SHA、使用最小權限；歷史 `gh-pages` 分支不作本專案日常發布來源。

## 主要資料與驗收紀錄

| 位置 | 用途 |
| --- | --- |
| `frontend/src/config/campaign.ts` | 品牌／Logo 03、色票、字型、情境、素材、動作、三檔價格、FAQ、公開聯絡與展示網址 |
| `frontend/src/app/page.tsx`、`layout.tsx` | Server 首頁、語系、metadata、OG 及預覽索引設定 |
| `frontend/src/components/brief-tool.tsx`、`scenario-start.tsx`、`back-to-top.tsx` | Client 互動；其餘內容以 Server Components 呈現 |
| `frontend/src/lib/brief.ts`、co-located tests | Unicode 必填、素材互斥、情境保留及最新摘要 |
| `frontend/public/brand/`、`showcases/` | 正式 Logo 03 與有來源的三張本地 WebP；截圖為 2026-11-21 畫面，可能與最新展示細節不同 |
| `docs/` | 原需求、工程範本、品質待辦、價位及來源／驗收紀錄 |

品牌沿用深藍 `#101A33`、亮藍 `#3157D5`、青色 `#19B8D5`；Inter／Noto Sans TC Variable 本地打包，可見焦點及減少動態偏好保留。正式 Logo 與截圖的固定來源、blob、授權界線見歷史紀錄。

本輪 Node24 安裝、lint、型別、32 項單元測試及兩種建置通過；根路徑瀏覽器驗收 32 通過／1 draft-only 略過，子路徑資源／版本／樣品連結另 3 項通過。

本輪結果及來源映射見 [2026-11-27 架構與連結修正紀錄](docs/05_structure_and_links_2026-11-27.md)。歷史文件保留當時路徑與網址，現行操作以本 README 為準：

- [一頁式專案命令範本](docs/01_one_page_solution.md)
- [品質待辦／實機限制](docs/02_quality_backlog_2026-11-23.md)
- [價格來源與刊登紀錄](docs/03_pricing_proposal_2026-11-24.md)
- [內容、品牌及素材來源](docs/04_campaign_optimization_2026-11-25.md)

Chromium viewport 驗收不等於實體裝置驗證；實體 iPhone／Android、Safari／Firefox、LINE 內建瀏覽器及郵件送達仍待實機／外部系統測試。沒有宣稱廣告成效或公開網路 Core Web Vitals 達標。
