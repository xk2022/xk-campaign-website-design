請建立／維護一個與 XK 既有一頁式專案一致的獨立網站。

目標 repo：xk2022/<新專案名稱>
GitHub 可見性：<public 或 private>
預定網址：https://xk2022.github.io/<新專案名稱>/
網站階段：<預覽版或正式版>
發布方式：GitHub Pages，Deploy from a branch，gh-pages，/ (root)
本次授權：實作、推送、建立 PR、檢查通過後合併、發布及驗證公開網站。

工程參考：
https://github.com/xk2022/xk-campaign-website-design

公司規範與正式品牌素材：
https://github.com/xk2022/xplore-kaleidoscope

上述參考 repo 僅供讀取，不修改它們。業務內容依本次需求，
不要沿用參考專案的品牌名稱、文案、案例或聯絡資訊。

1. 開工核對
先讀目標 repo 的 README.md、AGENTS.md、package.json、
lockfile、Next.js 設定與 .github/workflows。
核對 git remote、工作區既有修改、最新 main、GitHub 可見性、
分支保護、CI 狀態，以及 Pages 的實際 build_type、來源分支、
目錄、自訂網域與管理權限。
若文件與 GitHub 實際設定不一致，先明確指出並依本次指定的
發布方式處理；不要只根據 README 推定部署設定正確。

2. 工程基準
使用 Node.js 24、npm、Next.js App Router、React、
TypeScript、Tailwind CSS；保留 .nvmrc=24 與 package-lock.json。
既有專案沿用 lockfile，不自行升級主要依賴。
需要圖示／UI 元件時優先沿用 Lucide、shadcn/ui。
首頁在一般開發模式為 /，可從 repo 根目錄獨立安裝及建置。
靜態版面使用 Server Components，互動才使用 Client Components。

3. 設定與資產
品牌、情境、外部連結、公開狀態集中於 src/config。
沿用對應品牌的正式素材，核對來源及使用方式。
使用本專案自己的 repo 名稱、package.name、basePath、
Pages URL、Open Graph 圖片 URL 及 README 網址。
不得殘留 /xk-campaign-website-design 或其他專案的網址。
預覽版維持 noindex, nofollow；正式版依核定網址設定索引與 canonical。

4. 靜態部署相容性
保留一般 Next.js build，另外提供 build:pages、preview:pages。
Pages build 使用 static export、正確 basePath、trailing slash
及不依賴伺服器圖片最佳化的資產。
確認 Logo、圖片、字型、favicon、分享圖與頁內錨點在子路徑正常。
out/ 必須包含 index.html、.nojekyll、_next/ 與必要靜態資產。

5. Git 與 CI
從最新 main 建立 codex/<任務名稱> 分支，以 PR 合併。
保留既有歷史與使用者修改，不 force push。
GitHub Actions 使用 Node.js 24、固定完整 action commit SHA、
最小必要權限，並執行：
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run build:pages
npm run test:e2e
CI 必須測試真正匯出的 Pages 子路徑，不能只測開發伺服器。

6. 驗收
使用 Chromium 驗證 375、390、768、1024、1280、1440px。
檢查水平溢位、鍵盤與焦點、長文字換行、資產 404 和主要訪客流程。
有表單或剪貼簿時，測試驗證失敗、返回修改、最新摘要、
複製成功／拒絕及資料保存／傳送範圍。
測試內容依功能設計，不以湊固定測試數量作為完成標準。

7. 發布
確認 PR 的最新 head CI 通過後，依本次授權合併。
將同一來源版本、已驗證的靜態產物同步至 gh-pages，
gh-pages 只保存發布成品，不放原始碼、README 或 node_modules。
使用可觸發分支發布的授權身分推送；不要假設內建
GITHUB_TOKEN 推送一定會觸發 Pages 建置。
確認 Pages 發布工作成功，再實際開啟公開網址及操作主要流程。
遇到管理 API 403，完成其他可做的工作並列出必要設定，
不可宣稱已部署成功，也不可自行改變 repo 可見性來排除問題。

8. 文件與交付
更新 README 的啟動、建置、發布、品牌來源、驗收結果與限制。
將可重用工程規範寫入 AGENTS.md，保留 Next.js 自動產生的區塊；
本次業務規格另外保存，避免混入永久規範。
交付 PR、來源 commit、CI／發布紀錄、本機指令及公開網址，
分別說明「CI 通過」「產物保存」「gh-pages 更新」「發布成功」。
