**公開網站：[https://web.xplorekaleidoscope.com/](https://web.xplorekaleidoscope.com/)**

# XK 一頁式網站建置服務廣告頁

[![Verify and deploy GitHub Pages](https://github.com/xk2022/xk-campaign-website-design/actions/workflows/pages.yml/badge.svg)](https://github.com/xk2022/xk-campaign-website-design/actions/workflows/pages.yml)

獨立專案 `xk-campaign-website-design`。首頁 `/`，繁體中文、手機優先，主要完成動作為「產生並複製需求摘要」。使用 Next.js App Router、React、TypeScript、Tailwind CSS 4 與 Lucide。GitHub Actions 驗證靜態輸出，通過後將同一份產物部署至 GitHub Pages。專案與 XK 官網及公司文件庫分開維護。

本頁為 Xplore Kaleidoscope（XK）自主製作的服務推廣預覽，依 P01 Website Development、W01 一頁式網站規格開發，對應 R01 網站建置。公開展示使用 GitHub Pages。

## 方案費用

三種價位方案已於 2026-11-24 授權刊登：形象起步 **NT$15,000 起**、服務推廣 **NT$22,000 起**、互動客製 **NT$30,000 起**，均為一次性建置的預估起價。方案集中於 `src/config/campaign.ts` 的 `pricing`，正式建置預設顯示；稅別、付款、網域／主機與維護等費用仍逐案列入報價單確認。[方案來源、條件與驗證紀錄](doc/03_pricing_proposal_2026-11-24.md) 保留原提案與採用經過。

## 品質待辦與後續修復

[2026-11-23 品質待辦與修復紀錄](doc/02_quality_backlog_2026-11-23.md) 整理 2026-11-22 檢查發現，包含項目編號、優先度、證據、驗收條件與建議分支。可重用的開工命令見 [一頁式專案命令範本](doc/01_one_page_solution.md)。後續修復請指定項目編號，從最新 `main` 建立對應分支，並更新該檔的日期與狀態。已確認缺陷、產品改善、業務待確認及待驗證項目分開追蹤。

## 安裝與本機啟動

在本專案根目錄執行（Node.js 24.x、npm；`.nvmrc` 為 `24`）：

```bash
git clone https://github.com/xk2022/xk-campaign-website-design.git
cd xk-campaign-website-design
nvm use
npm ci
npm run dev -- --port 3000
```

開啟 **http://localhost:3000/** 或 **http://127.0.0.1:3000/**。若沒有 nvm，先以慣用方式安裝 Node.js 24，再從 `npm ci` 開始。移至其他電腦時，將 `cd` 改成本專案所在位置即可；不依賴任何上層 repo、環境變數或私有套件。

一般 Next.js 模式的 production 預覽：

```bash
npm run build
npm start -- --port 3000
```

## GitHub Actions 與 GitHub Pages

- 原始碼：[xk2022/xk-campaign-website-design](https://github.com/xk2022/xk-campaign-website-design)
- 驗證與部署：[Verify and deploy GitHub Pages](https://github.com/xk2022/xk-campaign-website-design/actions/workflows/pages.yml)
- 公開展示：**https://web.xplorekaleidoscope.com/**
- 原 GitHub Pages 網址 https://xk2022.github.io/xk-campaign-website-design/ 目前會轉址至上述自訂網域。

2026-11-23 重新核對 Pages API：`build_type: workflow`、`cname: web.xplorekaleidoscope.com`、HTTPS 啟用。自訂網域從根目錄提供頁面，因此 CI 設定 `NEXT_PUBLIC_BASE_PATH=""`；沒有變更網域、DNS、repo 可見性或 Pages 管理設定。API 的 `source.branch: gh-pages` 為既有欄位，不能據此判斷目前採分支發布。

`.github/workflows/pages.yml` 在 PR、推送 `main` 及手動執行時啟動：

1. Node.js 24 執行 `npm ci`、lint、typecheck、單元測試與一般 Next.js build。
2. 以自訂網域根路徑執行 `build:pages`，檢查首頁、資產、`.nojekyll` 及 `version.json` 來源 SHA。
3. Chromium 對實際靜態產物驗收六種寬度、需求摘要、品牌資產與 metadata。
4. 僅 `main` 保存 `pages-static-export` artifact；驗證 job 只需 `contents: read`。
5. 僅 `main` 成功後執行 deploy job，讀取已啟用的 Pages 設定並部署**同一份已驗證產物**。deploy job 只授 `pages: write`、`id-token: write`，環境為 `github-pages`。PR 不部署。

官方 Actions 皆固定完整 commit SHA。維護流程為：最新 main → `codex/<任務>` 分支 → PR → CI → 合併 → main 驗證與部署 → 公開站核對。`CI 成功` 與 `部署成功` 分開確認；公開站 `/version.json` 的 `sourceSha` 必須等於部署的 main commit，`sourceState` 為 `clean`。該檔只記錄版本、建置時間與路徑，不包含訪客資料。

先前 `gh-pages` 分支為歷史靜態成品，**目前不作日常發布來源，不需手動推送**。若將來改回分支發布，須另行同步 Pages 設定、workflow 與本文件，不能只推成品分支便宣稱已上線。管理 API 若回傳 403，使用有管理權限的帳號處理所需設定；不藉改變 repo 可見性解決權限問題。

### 本機驗證 Pages 產物

```bash
npm run build:pages
npm run preview:pages -- --port 3002
```

開啟 **http://127.0.0.1:3002/xk-campaign-website-design/**。這是純靜態伺服器，不需要部署平台或後端服務。

- `build:pages` 只在該次 build 注入 `STATIC_EXPORT=true` 與 `NEXT_PUBLIC_BASE_PATH=/xk-campaign-website-design`；一般 `npm run dev` 的首頁仍是 `/`。
- 若自行設定 `NEXT_PUBLIC_BASE_PATH`，建置與預覽時必須使用相同值；預設不需額外設定環境變數。
- Pages build 使用 `output: export`、trailing slash 及靜態圖片；Logo／符號路徑與 Next.js 資產都包含同一個 basePath。
- 官網導流使用原本的完整絕對網址，不受廣告頁 basePath 影響。
- 更換 repo 名稱或自訂網域時，一併核對 build 的 basePath、workflow 測試 URL、`campaign.pagesPreviewUrl` 與 README 網址。
- 預覽頁保留 `noindex, nofollow`。官方 favicon 和 Open Graph 分享圖隨靜態輸出，分享圖使用預定 Pages 子路徑。待正式廣告網址核定後再設定 canonical、`og:url` 與 sitemap。`robots.txt` 讓爬蟲可讀取頁面的 `noindex` 標籤，專案子路徑下的檔案不取代網域根目錄的爬取規則。

靜態產物完整驗收（POSIX shell；Windows 可在 shell 中設定相同環境變數）：

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002/xk-campaign-website-design/ \
PLAYWRIGHT_SERVER_COMMAND="npm run preview:pages -- --port 3002" \
npm run test:e2e
```

自訂網域的本機同版預覽（與目前 CI 相同）：

```bash
NEXT_PUBLIC_BASE_PATH="" npm run build:pages
NEXT_PUBLIC_BASE_PATH="" npm run preview:pages -- --port 3007
```

開啟 **http://127.0.0.1:3007/**。兩個命令須使用同一個 basePath；不設環境變數時仍預設 repo 子路徑，方便獨立搬移與回歸測試。

## 工程與主要檔案

| 檔案 | 用途 |
| --- | --- |
| `.github/workflows/pages.yml` | PR 檢查、main 靜態輸出驗證／保存與 Actions 部署 |
| `scripts/build-pages.mjs`、`scripts/serve-pages.mjs` | 跨平台靜態建置與子路徑預覽 |
| `src/app/page.tsx` | Server Component：首屏、三種情境、合作方式、工具區與頁尾 |
| `src/app/layout.tsx`、`src/app/icon.svg`、`src/app/robots.txt` | `zh-Hant`、title、description、Open Graph 分享圖、favicon 及預覽索引設定 |
| `src/app/globals.css`、`src/app/fonts.css` | 手機優先版面、品牌視覺、表單、換行與可見焦點、減少動態偏好 |
| `src/config/campaign.ts` | **品牌名稱／正式 Logo 路徑／色票／字型、情境、動作、素材、外部網址、價位方案／刊登狀態與案例公開策略** |
| `src/components/pricing-section.tsx`、`pricing-section.module.css` | Server Component：三檔預估起價、費用條件與前往需求工具的入口 |
| `src/components/scenario-examples.tsx` | Server Component：製造／活動的靜態虛構介面示意 |
| `scripts/measure-fonts.mjs` | 可重現的冷 Chromium 字型／CSS 載入量測 |
| `src/components/phone-preview.tsx` | Server Component：自行設計的手機頁面與店面向量插畫，明示「介面示意」及虛構品牌 |
| `src/components/scenario-start.tsx` | Client Component：情境選取、定位表單與情境欄焦點 |
| `src/components/brief-tool.tsx` | Client Component：記憶體草稿、驗證、摘要、複製／拒絕複製與返回修改 |
| `src/lib/brief.ts` | 表單型別、虛構示範資料、素材互斥、欄位驗證與自然中文摘要 |
| `src/components/brief-tool.test.tsx` | 表單互動回歸測試；另有 `src/lib/brief.test.ts` 覆蓋 Unicode 與摘要文案，共 31 項 |
| `tests/e2e/campaign.spec.ts` | Playwright 驗收六種視窗寬度、首頁、摘要及 Pages 子路徑資源 |
| `tests/e2e/pricing.spec.ts` | 刊登狀態、手機首屏費用入口、三方案與草稿保留驗收 |
| `public/brand/` | 公司庫正式 Logo 03 的原始 SVG 與 PNG 分享圖 |
| `.nvmrc`、`package-lock.json`、`package.json` | Node 24 與可獨立安裝、啟動、檢查及建置的工程基準 |

靜態內容使用 Server Components；只有情境入口、表單及剪貼簿使用 Client Components。字型經 `@fontsource-variable/inter` 與 `@fontsource-variable/noto-sans-tc` 本地打包，不在瀏覽時呼叫 Google Fonts。使用原生語意表單控制項與 Lucide，沒有為簡單欄位另加 UI 元件依賴。`AGENTS.md` 是首次 `next dev` 自動產生的 Next.js 版本指引，後續已依其查閱此版內建文件。

## 需求工具的行為與資料範圍

- 三個「用這個情境開始」只改情境，保留品牌、受眾、主要動作（含其他動作）、素材與補充。跳轉完成後將焦點放到情境欄。
- 必填欄位拒絕純空白、零寬與其他不可見字元，保留合法名稱與含 ZWJ 的 emoji 原文；錯誤放在欄位旁並連結 `aria-describedby`，焦點移到第一個錯誤欄位。
- 「尚未準備」與其餘素材雙向互斥。「其他」主要動作有額外必填輸入欄。
- 只有主動按「帶入示範資料」才覆寫草稿；使用虛構品牌「山角木作工作室」。
- 長摘要自動增高，寬度改變或字型載入後重新量測；保留手動全文選取與向下拉高。其他動作以獨立敘述呈現，短語及完整句子都保留原意。
- 每次產生摘要均使用最新草稿。舊版剪貼簿 Promise 不會在新版摘要上顯示過期的成功或失敗提示。
- `navigator.clipboard.writeText` 成功後才顯示「已複製，可自行貼給 XK」。被拒或 API 不可用時保留唯讀全文，並提供「選取摘要全文」以手動複製。
- 草稿僅使用 React 記憶體狀態。重新整理即清空，沒有 API、寄信、後台、追蹤像素、分析事件或瀏覽器儲存；網址只有頁內錨點，外連不附加草稿。
- JavaScript 尚未完成載入或停用時，表單停用並顯示 noscript 說明。草稿控制項不帶 `name`，避免原生表單回退把內容寫入查詢字串。

## 品牌與參考來源（唯讀）

開始時工作區沒有目標專案，亦無既有 README、AGENTS、package.json 或 lockfile；已檢查後採新專案基準。參考資料讀取於 2026-11-21：

- 公司庫 snapshot：`dca3329c556bdd88113181384543b5923e25618b`
- 官網 snapshot：`95d8153192ac69b10821baa2a2f4b115a5693c03`
- [Week 03 前端架構](https://github.com/xk2022/xplore-kaleidoscope/blob/main/doc/01_business-plan/week-03/01_nextjs-architecture_前端技術架構.md)
- [Week 03 GitHub 開發流程](https://github.com/xk2022/xplore-kaleidoscope/blob/main/doc/01_business-plan/week-03/05_github-workflow_開發與版本管理規範.md)
- [Week 04 作品集策略](https://github.com/xk2022/xplore-kaleidoscope/blob/main/doc/01_business-plan/week-04/01_portfolio-strategy_XK%20%E6%8A%80%E8%A1%93%E4%BD%9C%E5%93%81%E5%B1%95%E7%A4%BA%E7%AD%96%E7%95%A5.md)
- [官網品牌 tokens 與焦點樣式](https://github.com/xk2022/xk-website/blob/main/src/app/globals.css)
- [官網字型設定](https://github.com/xk2022/xk-website/blob/main/src/app/layout.tsx)
- [公司庫正式 Logo 03 master](https://github.com/xk2022/xplore-kaleidoscope/blob/main/assets/brand/logo/source/original-design-files/xk-logo-03-master.svg)
- [Logo 水平版來源](https://github.com/xk2022/xplore-kaleidoscope/blob/main/assets/brand/logo/svg/xk-logo-horizontal.svg)，blob `e1a52e7e30c943df03a5805d06754204fa4ce484`
- [Logo 符號版來源](https://github.com/xk2022/xplore-kaleidoscope/blob/main/assets/brand/logo/svg/xk-logo-symbol.svg)，blob `277fafce8fd03edcfc1bb9c34458318ddcd4ed22`

UI 使用深藍 `#101A33`、亮藍 `#3157D5`、青色 `#19B8D5`；正式 Logo 原稿色保留 `#101828`／`#2563EB`。字型為 Inter／Noto Sans TC 的 variable 版本（CSS 家族名稱帶 Variable），備援為 Microsoft JhengHei、PingFang TC、Arial。焦點使用亮藍 2px 外框及 4px 間距（輸入欄為 3px）。

不展示具名作品卡、案例截圖或「查看展示」，亦不聲稱參考品牌是付費客戶。四個品牌的[官網來源設定](https://github.com/xk2022/xk-website/blob/main/src/config/website-showcases.ts)已唯讀核對為自主品牌展示；其個別展示頁未另開啟，因本廣告頁沒有提供這些連結。`casePublication.showNamedCases` 為 `false`。手機內的「山角日常」完全為虛構介面示意。

## 外部連結核對

四頁均已核對來源路由；2026-11-21 曾以 Cloud Chrome 開啟正常內容。**2026-11-23 重新實開**發現官網正在使用自訂網域，結果與原始檢查不同：

| 畫面入口 | 保留的指定 URL | 本輪 Cloud Chrome 結果 |
| --- | --- | --- |
| XK 官網 | https://xk2022.github.io/xk-website/ | 轉到 `https://xplorekaleidoscope.com/lander`，GoDaddy 網域停放頁 |
| 完整服務 | https://xk2022.github.io/xk-website/services/ | 轉到同一網域停放頁 |
| 技術作品集 | https://xk2022.github.io/xk-website/portfolio/ | 轉到 `https://xplorekaleidoscope.com/portfolio/`，讀到作品展示內容；其中部分內連仍帶舊 basePath |
| 查看 XK 聯絡資訊 | https://xk2022.github.io/xk-website/contact/ | 轉到網域停放頁，無法由此提交需求 |

本廣告頁依原規格保留完整絕對網址，不修改唯讀的官網 repo 或 DNS。頁面摘要旁已如實提醒目前聯絡頁導向狀態、先自行保存、已有聯絡對話者可自行分享。官網來源 `src/config/contact.ts` 仍為 `verifiedContactChannels=[]`（核對來源與日期在 `campaign.contactHandoff`），沒有自行新增 LINE、Email 或預約管道。**官網轉址／正式聯絡管道仍待維護者及業務處理**，不能將本站功能修復解讀為上述官網也已修復。

## 檢查與瀏覽器驗收

本輪修復驗證日期：**2026-11-23（Asia/Taipei）**。環境：Node.js **v24.22.3**、npm **11.19.1**。lockfile 實際安裝 Next.js **16.4.6**。所有命令從本專案根目錄執行。

| 命令 | 結果 |
| --- | --- |
| `npm ci` | 通過，依 lockfile 重新安裝 |
| `npm run lint` | 通過，零警告 |
| `npm run typecheck` | 通過，含 Next.js route typegen |
| `npm test` | 31／31 通過 |
| `npm run build` | 通過，`/` 預先產生為靜態頁面 |
| `npm run build:pages` | 通過，產生含子路徑與 `.nojekyll` 的 `out/` |
| `npm run test:e2e`（Pages 靜態預覽） | 23／23 通過，根路徑與 repo 子路徑均完成驗收 |

在此受管環境中，安裝、啟動與 Turbopack 的 PostCSS 內部程序需要允許網路／本機綁定連接埠。第一次在受限 shell 執行 build 時曾被 `bind port: Operation not permitted` 阻擋；允許本機網路後，同一 `npm run build` 已成功，沒有以略過編譯或關閉檢查處理。一般本機執行不需要此環境的工具權限參數。

### 瀏覽器範圍

初版的一般 production 預覽於 2026-11-21 通過 15 項測試，Pages 靜態預覽於 2026-11-22 通過 16 項。初版也在 Cloud Chrome 操作「帶入示範 → 產生需求摘要」，確認全文、聯絡入口及草稿清除。

- 本次以純靜態預覽 `/xk-campaign-website-design/` 驗證 Logo、favicon 與分享圖的路徑及內容類型，並檢查首頁資產載入。
- 2026-11-21 Chromium 實際瀏覽器，以 production `npm start` 的 3000 連接埠驗收；另以開發模式 3001 驗證示範 → 摘要、網址無草稿及無頁面程式錯誤。
- 375、390、768、1024、1280、1440 px：首頁、表單、長品牌及多行摘要均檢查水平溢位。新一輪的首頁與摘要截圖會寫入 `test-results/`，初版四種寬度的參考截圖保存在 `artifacts/screenshots/`。
- 375×667 及 375×812：兩個首屏入口皆位於可視範圍，按鈕高度至少 44px。
- 三情境入口保留手填資料；直接填表、其他動作、素材雙向互斥、空白必填與第一錯誤焦點。
- 示範 → 摘要 → 返回修改為報名 → 再產生 → 真實剪貼簿寫入與讀回全文比對；另模擬 `NotAllowedError` 驗證手動選取全文與沒有誤報成功。
- 重新整理清空；網址、localStorage、sessionStorage 均不含草稿；JavaScript 停用時不能送出或填寫草稿。
- Enter／Tab／方向鍵可完成示範、選取、產生及返回；檢查 2px 可見焦點、摘要焦點與 metadata、外部 href。

Playwright 預設使用系統 `/usr/bin/chromium`（若存在），否則使用其管理的 Chromium。可指定 `CHROMIUM_PATH`。首次在未安裝瀏覽器的電腦執行：

```bash
npx playwright install chromium
npm run test:e2e
```

預設測試會重用 3000 的既有 server，無 server 時自動啟動 `npm run dev`；可用 `PLAYWRIGHT_BASE_URL` 與 `PLAYWRIGHT_SERVER_COMMAND` 指向靜態 Pages 預覽。CI 會自行啟動測試伺服器。HTML 報告輸出至 `playwright-report/`，失敗追蹤輸出至 `test-results/`，兩者不納入原始碼版本。

本輪在 375／1440px 的表單與摘要狀態以 axe-core 4.14.1 複查；複雜示意背景另以保守合成色與實際截圖人工檢視，完整結果見品質待辦，未宣稱全站 WCAG 認證。

此次本機驗收為 Chromium 的指定 viewport。實體手機、Safari／Firefox 與真實廣告投放待驗證。遠端發布狀態以 `Verify and deploy GitHub Pages` 的 deploy job、部署環境及公開站 `version.json` 為準。正式廣告網址核定前，展示站維持 `noindex, nofollow`。

## 2026-11-23 改善與量測

本輪依 [品質待辦](doc/02_quality_backlog_2026-11-23.md) 處理 Q002–010，並完成 Q001 可做的告知與保存流程。功能性說明調整為 14–16px、補強文字對比與 200% 字級重排；摘要改為全文展開，必填驗證拒絕不可見字元，完整句動作保留原話。交付討論範圍、素材準備與製造／活動示意集中於 `src/config/campaign.ts`；示意是虛構內容，非客戶實績。

字型維持 Inter／Noto Sans TC；改為 variable 字型後，Noto Unicode range 覆蓋 16,661 個碼位、Inter 2,466 個碼位，與原套件宣告一致，未縮減正體中文字集。中文及 emoji 已實際核對字形：繁中使用 Noto Sans TC Variable，emoji 使用系統 Noto Color Emoji。

本機冷 Chromium context、375×812、DPR 1、mobile/touch，等待 load + networkidle + document.fonts.ready，尚未捲動。伺服器沒有 HTTP 壓縮；比較實際改版前／後頁面，新增內容也計入後測：

| 觀察項目 | 改版前 | 改版後 |
| --- | --- | --- |
| 初載字型請求 | 31 | 15（減少 51.6%） |
| 字型 encodedBodySize | 1,052,728 B | 963,216 B（減少 8.5%） |
| CSS encodedBodySize | 370,561 B | 138,748 B（減少 62.6%） |
| 載入期間 lab CLS | 0 | 0 |

這些是本機 ResourceTiming body bytes 與有限載入期間的觀察，不是公開網路 transfer、真實使用者資料或 Core Web Vitals 達標宣稱。重現量測（先啟動靜態預覽）：

```bash
node scripts/measure-fonts.mjs http://127.0.0.1:3007/
```

Q011 補充環境：官方 Playwright WebKit 27.2 已下載，實際啟動受本機缺少 GTK4、Graphene、Harfbuzz ICU、Manette、Hyphen、GLESv2 系統函式庫阻擋，未執行頁面流程。未停用安全檢查或以 Chromium 代稱 Safari。**實體 iPhone／Android、Safari 與 LINE 內建瀏覽器仍待實機驗收**；裝置／OS／瀏覽器版本、日期與必測路徑列在品質待辦 Q011。

### 本輪發布結果

2026-11-23 已合併 [修復 PR #5](https://github.com/xk2022/xk-campaign-website-design/pull/5)。[main Actions 45053375629](https://github.com/xk2022/xk-campaign-website-design/actions/runs/45053375629) 驗證與部署均成功，公開 `version.json` 已核對來源 `a2e3bedbf6cca59cec0530d13bae6d8a639198d9`、`clean`、空 basePath。Cloud Chrome 實際走完示範、返回修改其他動作、重新產生及複製，觀察最新摘要與成功提示；品牌資產、分享圖、favicon 與 robots.txt 均正常。

詳細分階段結果與日期保留在 [品質待辦的發布紀錄](doc/02_quality_backlog_2026-11-23.md)。這是 PR #5 功能版本的歷史紀錄；後續純文件部署另有來源 SHA，以該次 Actions 與公開版本檔為準。Q001 正式官網／聯絡承接及 Q011 實機／WebKit 驗收仍保留待辦。
