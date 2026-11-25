# 2026-11-25｜一頁式廣告頁內容與洽詢優化

- 日期：2026-11-25（Asia/Taipei）
- 專案：`xk2022/xk-website-lp-campaign`（本機／npm package 沿用 `xk-campaign-website-design`）
- 分支：`codex/improve-campaign-trust-and-conversion`
- 基準：`main@9c35744be1895f00e46edb267c935f40aeec8d31`
- 目的：依使用者提供的五張顧問建議照片，補足可操作作品、真實洽詢承接、品牌說明及常見問題。沿用既有視覺與三檔已授權價格。

## 逐項評估與處理

| 項目 | 評估 | 本輪採用 |
| --- | --- | --- |
| P1 作品與信任 | 目前兩張虛構靜態卡無法讓訪客親自操作；沒有付費客戶／成果數據證據 | 改為三張可開啟的自主展示，說清楚要解決的問題及可操作功能；標示非客戶委託交付、生成示意素材，不捏造改版前後或業績 |
| P2 價格 | 2026-11-24 已刊登形象起步 15,000／服務推廣 22,000／互動客製 30,000 元起 | 保留價格與條件，首屏保留預算入口；完整方案移到作品後，不改為截圖中的未核定新命名 |
| P3 洽詢 | 舊版提醒官網停放、管道待確認，已不符合目前官方狀態 | 重新核對公開 Email；頁首、品牌區及摘要後提供純 mailto 與可選取地址，訪客自行貼上、確認寄出；不新增 LINE、預約或免費諮詢承諾 |
| P4 品牌 | 官網可證實由軟體工程師創立，以及需求／實作／驗收工作方式；無公開姓名肖像 | 補品牌介紹及三個合作重點，連回官網；不虛構團隊、年資、保固或證照 |
| P5 內容與結構 | 費用、素材、適用範圍與維護疑問可在頁內先回答 | 原生 details FAQ 與同源 FAQPage JSON-LD，維持語意 H1/H2、既有 title/description/OG/noindex，不新增未核定 canonical 或 sitemap |
| 建議版序 | 痛點、作品、價格到洽詢的脈絡較清楚 | 首屏 → 痛點 → 三情境 → 作品 → 價格 → 三步合作 → 品牌 → FAQ → 需求工具；交付細節可按需展開 |
| 顧問評分 | 照片中的現況／目標分數不是實測成績 | 不刊登分數、不宣稱轉換率、排名或 Core Web Vitals 達標；保留後續真實投放與實機驗證 |

## 資料與工程位置

- `src/config/campaign.ts`：品牌、外部絕對網址、公開 Email／來源狀態、痛點、情境、展示狀態與網址、品牌介紹、FAQ、方案金額。FAQ 價格只在 `pricing.status=published` 時出現，避免未刊登價格透過文字或 JSON-LD 洩漏。
- `src/components/campaign-content.tsx`／CSS Module：四組 Server Components；FAQ 為原生鍵盤可操作的 details，JSON-LD 以同一份答案輸出並逃逸 `<`。
- `src/app/page.tsx`：版序、首屏作品入口、頁首 Email、可展開的交付範圍；既有需求主 CTA 保留。
- `src/components/brief-tool.tsx`：摘要後公開 Email。記憶體草稿、情境保留、必填驗證、互斥、摘要更新、剪貼簿版本保護與拒絕備援保持原有行為。
- `public/showcases/`：三張本地 WebP，尺寸固定避免位移，延後載入，不嵌入外站 iframe 或預載展示站。
- 移除兩張重複虛構示意的 `scenario-examples.tsx` 與只供該元件使用的 CSS；首屏虛構手機介面保留明確示意標示。
- 測試：`brief-tool.test.tsx`、`tests/e2e/campaign.spec.ts`、`tests/e2e/content.spec.ts`；維持既有價格與草稿回歸測試。

## 唯讀來源與素材溯源

官網固定來源：[`xk2022/xk-website@1e16144c21a848399e2986948d4239481672f12c`](https://github.com/xk2022/xk-website/tree/1e16144c21a848399e2986948d4239481672f12c)。公司庫固定來源：[`cd9be948fe843c437d69ed635263a9527e931367`](https://github.com/xk2022/xplore-kaleidoscope/tree/cd9be948fe843c437d69ed635263a9527e931367)。未修改這兩個 repo。

- 官網 `src/config/contact.ts`，blob `323c2d201f956bda7734ffca4ee5b90aec765edf`；`docs/contact-response-workflow.md`，blob `2c3daae6066c669d942849f081aa2a89f8064f04`：品牌負責人提供的 Email 專案詢價，訪客自行寄送。本站僅用信箱地址，不採帶草稿的 URL。
- 官網 `src/config/website-showcases.ts`，blob `e7e7355e778f9e85f36305afd3e41e585db7b187`；公司 `doc/05_projects/case-studies/landing-pages.md`，blob `d03feb6befc94be716ab2696b0ce1490d2aab6dc`：自主展示性質。
- 三月展示最新 README 位於 `xk2022/xk-lp-march-tangbao`，blob `d3da9291090a85565fe554f78b127e28ff8ccfda`，公開路徑已改為 `showcase.xplorekaleidoscope.com/march-tangbao/`，未沿用官網設定中的舊 march 子網域。
- 官網 `src/config/about.ts`，blob `da30c3fa3a9ad4cfee3c51fdcba5363a732ea88c`：Founder & Software Engineer，姓名／肖像未公開；公司 `doc/98_decisions/2026-11-20.md` 說明一人公司，不能宣稱多人團隊。
- 公司 `doc/02_services/網站建置方案.md`，blob `02a2685b81f23988fe49d6d0ea03f71fd8c40c43`：手機主要動作、內容與操作驗收、提案確認交付／維護。不提供固定交期、不限次修改或自造保固期限。

截圖原稿來自該官網 commit 的 `public/images/showcases/`；[asset-manifest](https://github.com/xk2022/xk-website/blob/1e16144c21a848399e2986948d4239481672f12c/docs/reports/website-showcases-artifacts/asset-manifest.json) 記錄 2026-11-21 公開網站 1280×800 截圖轉 WebP。本輪原樣複用，實際解碼／檢視，Git blob 及 SHA256 均與來源一致；這是舊版畫面，可能與展示站最新細節不同，不是品牌委託或授權背書證據。

| 本機檔案 | Git blob | Bytes／尺寸 |
| --- | --- | --- |
| `public/showcases/march-tangbao.webp` | `334c23e425be88c9b5ba109bbc08bd58968cf713` | 58,872／1280×800 |
| `public/showcases/honest-diecut.webp` | `8485e38aa83591272f3596230cbbdaee7f43cbf8` | 57,514／1280×800 |
| `public/showcases/hongjia-birdnest.webp` | `5bea84eb90dcb1d2853f58f0cb17c6ebe6cdbcb3` | 56,598／1280×800 |

## 實際公開連結核對

2026-11-25 Cloud Chrome 的可見頁面與實際操作：

- `https://www.xplorekaleidoscope.com/`：官網首頁正常。
- `https://www.xplorekaleidoscope.com/services/`：服務介紹正常。
- `https://www.xplorekaleidoscope.com/portfolio/`：作品展示正常。
- `https://www.xplorekaleidoscope.com/contact/`：聯絡頁正常，公開 Email 與來源一致。沒有寄送測試信或檢驗郵件送達。
- `https://showcase.xplorekaleidoscope.com/march-tangbao/`：HTTP 200；菜單／導航入口可見，帶入示範 → 產生預留訊息成功，未開啟或送出店家 LINE。
- `https://honest.xplorekaleidoscope.com/`：HTTP 200；PET 保護膜樣本能帶入類別及欄位提示，表單明示模擬／不寄送。
- `https://honbird.xplorekaleidoscope.com/`：HTTP 200；企業贈禮入口能選取企業情境與切換提示，不稱為活動報名或購物系統。

此輪改用實際開啟的 www 官網網址，取代原規格舊 Pages 轉址入口；不在外連或 mailto 放入草稿。以上來源核對不表示測過外站全部功能。

## 驗證與發布

環境：Node.js v24.22.3、npm 11.19.1；lockfile 安裝 Next.js 16.4.6。

| 命令／檢查 | 本輪結果 |
| --- | --- |
| `npm ci --cache /tmp/xk-npm-cache` | 通過，未修改依賴或 lockfile |
| `npm run lint` | 通過，零警告 |
| `npm run typecheck` | 通過，包含 Next route typegen |
| `npm test` | 32／32 通過，含摘要修改及 Email 不附草稿 |
| `npm run build` | 通過，首頁靜態產生 |
| `NEXT_PUBLIC_BASE_PATH="" npm run build:pages` | 通過，自訂網域根路徑靜態產物 |
| 根路徑 `npm run test:e2e` | 29 通過、1 略過；略過的是僅適用 draft 價格狀態的測試，本版 published |
| repo 子路徑 `npm run build:pages`／e2e | 通過；`/xk-campaign-website-design/` 靜態預覽 29 通過、1 draft-only 略過 |
| 375／390／768／1024／1280／1440px Chromium | 首頁、長品牌、多行摘要無水平溢位；375×667、375×812 主／作品 CTA 可見且至少 44px |
| 流程／隱私 | 三情境保留草稿、直接填表、空白及其他動作驗證／焦點、素材互斥、示範→摘要→修改→重產生→真實剪貼簿、拒絕後手動選取、刷新清空、無 JS 防原生草稿傳送均通過 |
| 新內容 | 三展示本地 WebP 200／lazy、不預載外站、版序、FAQ Enter／Space、可見答案與 schema 完全一致、Email 不附草稿均通過 |
| axe-core 4.14.1 | 375／1440px，痛點、情境、作品、方案、流程、品牌、FAQ（費用答案展開）0 自動違規／0 待人工判定；不代表全站或實機無障礙認證 |

受管 shell 初次 build 的 PostCSS 程序因本機 port bind 權限失敗；停止該程序、以環境允許的本機網路權限重跑後正常通過，未關閉型別、lint 或編譯檢查。

GitHub PR／main CI、合併及公開版本核對另記於本次 PR 的驗收紀錄；以 Actions 與公開 `version.json` 為準，不能將本機通過等同已發布。

未驗證／未承諾：實體 iPhone／Android、Safari／Firefox、LINE 內建瀏覽器、真實寄信送達、廣告投放成效與公開網路 Core Web Vitals。展示站仍 `noindex, nofollow`，FAQPage 不代表搜尋引擎會顯示複合搜尋結果。已知實機待辦沿用 Q011。
