# 2026-11-27｜公司架構對齊與展示連結修正

- 日期：2026-11-27（Asia/Taipei）
- 專案：`xk2022/xk-website-lp-campaign`
- 基準：`main@950b0ef22685cd897d52ecca932d64759104bd66`
- 分支：`codex/align-frontend-structure-and-showcase-links`
- 範圍：讀取公司最新文件、對齊程式首層結構、修正本頁樣品連結、同步 CI 與 README。官網、公司庫、展示來源與 Hub 皆唯讀。

## 發現與修正

| 編號 | 問題／證據 | 處理 |
| --- | --- | --- |
| S001 | 公司最新規範已要求共用首層與 `frontend/`；本專案仍將套件、設定、src/public 散在根目錄 | 整體搬至 `frontend/`，`doc/` 改 `docs/`；保留內部元件與邏輯，不做無依據的深層模組重構 |
| S002 | 搬移後原 CI 安裝、快取與上傳路徑仍指根目錄，根測試也無法自然找到前端套件 | CI run 工作目錄改 frontend，鎖檔快取改 frontend/package-lock.json，上傳 frontend/out；修正 Playwright／TS／ESLint／Vitest 對根測試的解析 |
| L001 | `https://honest.xplorekaleidoscope.com/` GET 回 404 GitHub Pages 頁，沒有轉址 | 改為 `https://showcase.xplorekaleidoscope.com/honest/` |
| L002 | `https://honbird.xplorekaleidoscope.com/` GET 回 404 GitHub Pages 頁，沒有轉址 | 改為 `https://showcase.xplorekaleidoscope.com/hongjia-birdnest/` |
| L003 | 三月原路徑仍可用，不能因其他兩案搬移而猜測新 slug | 保留 `https://showcase.xplorekaleidoscope.com/march-tangbao/` |
| D001 | README 混合不同日期的架構、路徑、連結與驗證狀態 | 按公司範本重整現況、用途／限制、架構、安裝、部署與來源；歷史紀錄保留當時證據 |

## 公司文件基準

公司庫固定 snapshot：`76252e621ecb5c508494b49d4cd1eabd340b7e81`。

- [06_engineering/website-project-readme-template.md](https://github.com/xk2022/xplore-kaleidoscope/blob/76252e621ecb5c508494b49d4cd1eabd340b7e81/06_engineering/website-project-readme-template.md)，blob `1533e5eee24e9dd29aec8eccf2a79ee5436d98bb`：LP／CORP／BRAND／SHOP／APP 共用首層；純前端也放 `frontend/`，套件、鎖定檔、框架設定、資產均在其中；工作流程及跨元件文件留根。
- [06_engineering/architecture.md](https://github.com/xk2022/xplore-kaleidoscope/blob/76252e621ecb5c508494b49d4cd1eabd340b7e81/06_engineering/architecture.md)，blob `679c475e57258c69790101f1ceedb96f1575d5c6`：依網站類型選擇架構，不能將 APP 的 Vite／Spring／Compose 直接套用到本 Next.js LP。
- 舊 Week03 已移入歷史封存，不能繼續用舊 `doc/01_business-plan/week-03/` 的 main 路徑當現行規範。最新規範沒有要求一律建立 `features/data/types/assets`，本輪不新增空功能模組。

## 路徑映射與操作差異

| 舊位置 | 新位置 |
| --- | --- |
| package.json／package-lock.json | frontend/package.json／frontend/package-lock.json |
| src／public／scripts | frontend/src／frontend/public／frontend/scripts |
| Next／TS／ESLint／PostCSS／Vitest／Playwright 設定 | frontend/ 內相同檔名 |
| Next.js 自動 AGENTS.md | frontend/AGENTS.md；根 AGENTS.md 改為 repo 工作範圍指引 |
| doc/ | docs/ |
| artifacts/screenshots/ | docs/artifacts/screenshots/（歷史驗收證據） |
| out/、.next/、測試輸出 | frontend/out/、frontend/.next/、frontend/test-results/、frontend/playwright-report/ |
| tests/e2e/、.github/workflows/、.nvmrc | 保留根目錄 |

新增 backend／infrastructure 的簡短 README，說明目前無後端與既有 Pages 部署邊界，保留共同首層但不建立虛構服務。

- 正式命令先 `cd frontend`；在根目錄可用 `npm --prefix frontend ...`。沒有根套件、第二份鎖檔或根 node_modules 依賴。
- Playwright 指向 `../tests/e2e`，明確使用前端 TS 設定；根測試的 runner/types 解析至唯一的前端安裝。ESLint 由明確 cwd 的跨平台 runner 掃描前端及根測試，TS include 根測試，避免「搬完只檢查部分程式」的假通過。
- CI verify 的 run cwd 為 frontend，Node 版本讀根 `.nvmrc`，npm cache 讀 frontend lockfile；upload action 從 repo 根收集 frontend/out。Git provenance 仍涵蓋整個 repo。
- 只調整目錄／解析與樣品 href；需求表單、價格、Server／Client 界線、回頂、metadata、noindex 與既有獨立網域不變。

## 展示網址與部署證據

| 樣品 | 目前網址 | HTTP／資產 |
| --- | --- | --- |
| 三月手工湯包 | https://showcase.xplorekaleidoscope.com/march-tangbao/ | GET 200、無轉址；抽查 CSS／JS／首張圖片 200 與正確 MIME |
| 宏能興業 | https://showcase.xplorekaleidoscope.com/honest/ | GET 200、無轉址；抽查 CSS／JS／首張圖片 200 與正確 MIME |
| 宏家燕窩 | https://showcase.xplorekaleidoscope.com/hongjia-birdnest/ | GET 200、無轉址；抽查 CSS／JS／首張圖片 200 與正確 MIME |

來源相互核對：

- [官網展示設定](https://github.com/xk2022/xk-website/blob/ee4b4709a9f8daa755e2595a46c158b3c92d8229/src/config/website-showcases.ts)。
- [三月 README](https://github.com/xk2022/xk-lp-march-tangbao/blob/3415bbef1e4f10f33b5a6658367df0b53b17b742/README.md)。
- [宏能 README](https://github.com/xk2022/xk-lp-honest-diecut/blob/30cd7f59e1e5e1963b84aa4a175542152a5ffbb7/README.md)。
- [宏家 README](https://github.com/xk2022/xk-lp-hongjia-birdnest/blob/2997f1f0dba5b57ca413cf529aa141b2137a2d98/README.md)。
- [Hub config/showcases.json](https://github.com/xk2022/xk-website-showcase/blob/f63941867cdfc8cdf713e3075f75ec1e5e71da20/config/showcases.json)，blob `58d573e33311eba98c3ed15db9d0ee4a33b7ff3e`，與公開 manifest 一致。宏能部署採固定 artifact `b80e09b…`；source HEAD `30cd7f5…` 差異只在 README，未誤稱 source HEAD 已部署。

本廣告 repo 未在 Hub 的 22 筆登錄中，亦無對應 campaign／website-design／web.xplore 入口。本輪保留自有服務廣告既有獨立部署，不擅自新增 Hub 登錄或更改其他 repo。

## 驗證

環境：Node.js v24.22.3、npm 11.19.1、lockfile 的 Next.js 16.4.6。所有正式 npm 命令在 `frontend/` 執行。

| 檢查 | 結果 |
| --- | --- |
| `npm ci --cache /tmp/xk-npm-cache` | 通過；根目錄不存在 node_modules／package.json，確認沒有依賴舊安裝 |
| `npm run lint` | 通過，涵蓋 frontend 與根 tests；不是忽略根測試的假通過 |
| `npm run typecheck` | 通過，包含 Next route typegen 與根瀏覽器測試 |
| `npm test` | 32／32 通過 |
| `npm run build` | 通過，首頁靜態產生 |
| `NEXT_PUBLIC_BASE_PATH="" npm run build:pages` | 通過，成品位於 frontend/out |
| 根路徑 `npm run test:e2e` | 32 通過、1 draft-only 略過；已刊登價格所以不執行未刊登草案案例 |
| 預設子路徑 build＋針對性 e2e | 通過：版本來源、Logo／favicon／OG 與三個樣品本地圖及 href，共 3 項 |
| 375／390／768／1024／1280／1440px | 首頁、長品牌、多行摘要無水平溢位；首屏入口與原有流程均通過 |
| 回頂／表單／隱私 | 回頂焦點／Enter／草稿保留、情境保留、必填焦點、素材互斥、摘要重產生、真實及拒絕剪貼簿、刷新清空、no-JS 防止原生傳送均通過 |
| 文件及依賴 | 新 README／本輪文件相對連結存在；lockfile bytes 與搬移前完全一致 |
| Cloud Chrome 樣品實開 | 三個正確入口均可開啟；宏能 PET 樣本帶入、宏家企業情境帶入、三月 V1 示範→預留訊息正常 |

遠端 CI、合併、發布及公開 sourceSha 另於本次 PR 記錄；本機通過不等同發布成功。

本次樣品檢查只操作頁內展示，不寄送詢問、LINE、預留或訂單；不測外站所有第三方入口。實體裝置／Safari／LINE 內建瀏覽器限制仍沿用 Q011。
