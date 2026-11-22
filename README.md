# XK 一頁式網站建置服務廣告頁

[![Verify GitHub Pages export](https://github.com/xk2022/xk-campaign-website-design/actions/workflows/pages.yml/badge.svg)](https://github.com/xk2022/xk-campaign-website-design/actions/workflows/pages.yml)

獨立專案 `xk-campaign-website-design`。首頁 `/`，繁體中文、手機優先，主要完成動作為「產生並複製需求摘要」。使用 Next.js App Router、React、TypeScript、Tailwind CSS 4 與 Lucide。GitHub Actions 驗證靜態輸出，GitHub Pages 從 `gh-pages` 分支發布。專案與 XK 官網及公司文件庫分開維護。

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
- 驗證工作流程 [Verify GitHub Pages export](https://github.com/xk2022/xk-campaign-website-design/actions/workflows/pages.yml)
- 公開展示 [GitHub Pages](https://xk2022.github.io/xk-campaign-website-design/)

`.github/workflows/pages.yml` 在 PR、推送 `main` 及手動執行時啟動，`main` 通過驗證後會保存靜態輸出。

1. 依 `.nvmrc` 使用 Node.js 24，執行 `npm ci`。
2. 執行 lint、typecheck、單元測試及一般 Next.js build。
3. 執行 `npm run build:pages`，確認 `out/` 包含 Next.js 首頁、資產與 `.nojekyll`。
4. 安裝 Chromium，對實際靜態產物執行 Playwright，包含 `/xk-campaign-website-design/` 子路徑、Logo 與需求工具。
5. 在 `main` 的執行紀錄保存 `pages-static-export` artifact，供維護者發布。

官方 Actions 固定於完整 commit SHA，驗證 job 只需 `contents: read`。

### 從分支發布

1. 從 `main` 成功的驗證紀錄下載 `pages-static-export` 並解開其中的 `artifact.tar`，或依下節驗證本機同版本的 `out/`。
2. 維護者在獨立工作目錄取出 `gh-pages` 分支，更新分支根目錄為驗證過的靜態輸出內容。提交前確認根目錄有 `index.html`、`.nojekyll`、`_next/` 和 `brand/`，並檢查提交內容只包含此次輸出。首次發布時可建立專用的 `gh-pages` 分支。
3. 維護者提交並推送 `gh-pages`。首次設定時，具管理權限的維護者在 **Settings → Pages → Build and deployment** 選 **Deploy from a branch**，指定 **gh-pages** 與 **/ (root)**，再儲存。 [GitHub Pages 分支發布](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch)
4. 確認 `pages-build-deployment` 成功，開啟公開展示並確認首頁、品牌素材與需求摘要工具正常。

首次設定完成後，每次更新由維護者推送已驗證的 `gh-pages` 成品，再核對發布結果。GitHub 內建的 `GITHUB_TOKEN` 推送無法觸發這項建置。 [GitHub Pages 分支發布疑難排解](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#troubleshooting-publishing-from-a-branch)

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
- 更換 repo 名稱或自訂網域時，需一併核對 build 的 basePath、workflow 測試 URL 與 README 網址；正式廣告網址核定前仍保留 `noindex, nofollow`，不自動加 canonical。

靜態產物完整驗收（POSIX shell；Windows 可在 shell 中設定相同環境變數）：

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002/xk-campaign-website-design/ \
PLAYWRIGHT_SERVER_COMMAND="npm run preview:pages -- --port 3002" \
npm run test:e2e
```

## 工程與主要檔案

| 檔案 | 用途 |
| --- | --- |
| `.github/workflows/pages.yml` | PR 檢查與 main 的靜態輸出驗證及保存 |
| `scripts/build-pages.mjs`、`scripts/serve-pages.mjs` | 跨平台靜態建置與子路徑預覽 |
| `src/app/page.tsx` | Server Component：首屏、三種情境、合作方式、工具區與頁尾 |
| `src/app/layout.tsx` | `zh-Hant`、title／description／Open Graph／noindex，從品牌設定注入 CSS 變數 |
| `src/app/globals.css` | 手機優先版面、品牌視覺、表單、換行與可見焦點、減少動態偏好 |
| `src/config/campaign.ts` | **品牌名稱／正式 Logo 路徑／色票／字型、情境、動作、素材、外部網址與案例公開策略** |
| `src/components/phone-preview.tsx` | Server Component：自行設計的手機頁面與店面向量插畫，明示「介面示意」及虛構品牌 |
| `src/components/scenario-start.tsx` | Client Component：情境選取、定位表單與情境欄焦點 |
| `src/components/brief-tool.tsx` | Client Component：記憶體草稿、驗證、摘要、複製／拒絕複製與返回修改 |
| `src/lib/brief.ts` | 表單型別、虛構示範資料、素材互斥、欄位驗證與自然中文摘要 |
| `src/components/brief-tool.test.tsx` | 7 項 Vitest／Testing Library 回歸測試 |
| `tests/e2e/campaign.spec.ts` | Playwright 瀏覽器驗收、四寬度與首頁／摘要截圖 |
| `public/brand/` | 公司庫正式 Logo 03 的原始 SVG，未重繪、換色或改變比例 |
| `.nvmrc`、`package-lock.json`、`package.json` | Node 24 與可獨立安裝、啟動、檢查及建置的工程基準 |

靜態內容使用 Server Components；只有情境入口、表單及剪貼簿使用 Client Components。字型經 `@fontsource/inter` 與 `@fontsource/noto-sans-tc` 本地打包，不在瀏覽時呼叫 Google Fonts。使用原生語意表單控制項與 Lucide，沒有為簡單欄位另加 UI 元件依賴。`AGENTS.md` 是首次 `next dev` 自動產生的 Next.js 版本指引，後續已依其查閱此版內建文件。

## 需求工具的行為與資料範圍

- 三個「用這個情境開始」只改情境，保留品牌、受眾、主要動作（含其他動作）、素材與補充。跳轉完成後將焦點放到情境欄。
- 必填欄位拒絕半形與全形純空白，錯誤放在欄位旁並連結 `aria-describedby`，焦點移到第一個錯誤欄位。
- 「尚未準備」與其餘素材雙向互斥。「其他」主要動作有額外必填輸入欄。
- 只有主動按「帶入示範資料」才覆寫草稿；使用虛構品牌「山角木作工作室」。
- 每次產生摘要均使用最新草稿。舊版剪貼簿 Promise 不會在新版摘要上顯示過期的成功或失敗提示。
- `navigator.clipboard.writeText` 成功後才顯示「已複製，可自行貼給 XK」。被拒或 API 不可用時保留唯讀全文，並提供「選取摘要全文」以手動複製。
- 草稿僅使用 React 記憶體狀態。重新整理即清空，沒有 API、寄信、後台、追蹤像素、分析事件或瀏覽器儲存；網址只有頁內錨點，外連不附加草稿。
- JavaScript 尚未完成載入或停用時，表單停用並顯示 noscript 說明。草稿控制項不帶 `name`，避免原生表單回退把內容寫入查詢字串。
- 展示版維持 `noindex, nofollow`。尚無核定正式廣告頁網址，故不設定 canonical 或 `og:url`，不冒用官網網址。

## 品牌與參考來源（唯讀）

開始時工作區沒有目標專案，亦無既有 README、AGENTS、package.json 或 lockfile；已檢查後採新專案基準。參考資料讀取於 2026-11-21：

- 公司庫 snapshot：`dca3329c556bdd88113181384543b5923e25618b`
- 官網 snapshot：`95d8153192ac69b10821baa2a2f4b115a5693c03`
- [Week 03 前端架構](https://github.com/xk2022/xplore-kaleidoscope/blob/main/doc/01_business-plan/week-03/01_nextjs-architecture_前端技術架構.md)
- [Week 03 GitHub 開發流程](https://github.com/xk2022/xplore-kaleidoscope/blob/main/doc/01_business-plan/week-03/05_github-workflow_開發與版本管理規範.md)
- [官網品牌 tokens 與焦點樣式](https://github.com/xk2022/xk-website/blob/main/src/app/globals.css)
- [官網字型設定](https://github.com/xk2022/xk-website/blob/main/src/app/layout.tsx)
- [公司庫正式 Logo 03 master](https://github.com/xk2022/xplore-kaleidoscope/blob/main/assets/brand/logo/source/original-design-files/xk-logo-03-master.svg)
- [Logo 水平版來源](https://github.com/xk2022/xplore-kaleidoscope/blob/main/assets/brand/logo/svg/xk-logo-horizontal.svg)，blob `e1a52e7e30c943df03a5805d06754204fa4ce484`
- [Logo 符號版來源](https://github.com/xk2022/xplore-kaleidoscope/blob/main/assets/brand/logo/svg/xk-logo-symbol.svg)，blob `277fafce8fd03edcfc1bb9c34458318ddcd4ed22`

UI 使用深藍 `#101A33`、亮藍 `#3157D5`、青色 `#19B8D5`；正式 Logo 原稿色保留 `#101828`／`#2563EB`。字型為 Inter／Noto Sans TC，備援為 Microsoft JhengHei、PingFang TC、Arial。焦點使用亮藍 2px 外框及 4px 間距（輸入欄為 3px）。

不展示具名作品卡、案例截圖或「查看展示」，亦不聲稱參考品牌是付費客戶。四個品牌的[官網來源設定](https://github.com/xk2022/xk-website/blob/main/src/config/website-showcases.ts)已唯讀核對為自主品牌展示；其個別展示頁未另開啟，因本廣告頁沒有提供這些連結。`casePublication.showNamedCases` 為 `false`。手機內的「山角日常」完全為虛構介面示意。

## 外部連結核對

下列四頁均已核對來源路由，且於 **2026-11-21 使用 Cloud Chrome 實際開啟**，並讀取到正常內容，沒有僅憑路徑推測。官網 `basePath` 為 `/xk-website`，因此所有連結均使用完整絕對網址。

| 畫面入口 | 核對 URL | 瀏覽器結果 |
| --- | --- | --- |
| XK 官網 | https://xk2022.github.io/xk-website/ | 已開啟；品牌首頁 |
| 完整服務 | https://xk2022.github.io/xk-website/services/ | 已開啟；服務項目，包含一頁式網站介紹 |
| 技術作品集 | https://xk2022.github.io/xk-website/portfolio/ | 已開啟；作品展示與技術展示規劃，不能解讀為全數已交付 |
| 查看 XK 聯絡資訊 | https://xk2022.github.io/xk-website/contact/ | 已開啟；目前顯示「正式聯絡管道確認中」 |

官網目前沒有已公開的正式聯絡管道，本頁沒有自行新增 LINE、Email 或預約連結。摘要由訪客自行保存及決定後續分享方式。

## 檢查與瀏覽器驗收

本機驗證日期：**2026-11-22**。環境：Node.js **v24.22.3**、npm **11.19.1**。lockfile 實際安裝 Next.js **16.4.6**。所有命令從本專案根目錄執行。

| 命令 | 結果 |
| --- | --- |
| `npm ci` | 通過，依 lockfile 重新安裝 |
| `npm run lint` | 通過，零警告 |
| `npm run typecheck` | 通過，含 Next.js route typegen |
| `npm test` | 7／7 通過 |
| `npm run build` | 通過，`/` 預先產生為靜態頁面 |
| `npm run build:pages` | 通過，產生含子路徑與 `.nojekyll` 的 `out/` |
| `npm run test:e2e`（Pages 靜態預覽） | **16／16 通過**，Chromium 驗收共 41.0 秒 |

在此受管環境中，安裝、啟動與 Turbopack 的 PostCSS 內部程序需要允許網路／本機綁定連接埠。第一次在受限 shell 執行 build 時曾被 `bind port: Operation not permitted` 阻擋；允許本機網路後，同一 `npm run build` 已成功，沒有以略過編譯或關閉檢查處理。一般本機執行不需要此環境的工具權限參數。

### 瀏覽器範圍

Pages 靜態產物結果：16／16 通過，包含 Logo 回應 MIME 與資產零 404。原一般 production 預覽 15 項測試亦已於 2026-11-21 通過。另已在可見的 Cloud Chrome 親自操作「帶入示範 → 產生需求摘要」，確認全文與聯絡入口正常，再清空草稿並保留首頁預覽。早期測試發現的開發伺服器互動初始化與情境錨點焦點問題，均已修正並經最終完整重跑。

- 2026-11-22 以純靜態預覽 `/xk-campaign-website-design/` 重跑完整 16 項流程；以下原功能全部包含在該次驗收。
- 2026-11-21 Chromium 實際瀏覽器，以 production `npm start` 的 3000 連接埠驗收；另以開發模式 3001 驗證示範 → 摘要、網址無草稿及無頁面程式錯誤。
- 375、768、1024、1440px：首頁、表單、長品牌及多行摘要均檢查水平溢位；摘要文字以換行呈現。首頁／摘要各四張截圖在 `artifacts/screenshots/`。
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

此次本機驗收為 Chromium 的指定 viewport。實體手機、Safari／Firefox 與真實廣告投放待驗證。遠端發布狀態以 `pages-build-deployment` 執行紀錄及公開頁面為準。正式廣告網址核定前，展示站維持 `noindex, nofollow`。
