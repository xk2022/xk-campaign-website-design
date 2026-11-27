# 部署與基礎設施

本專案使用既有 GitHub Actions／GitHub Pages，公開入口為 https://web.xplorekaleidoscope.com/ 。

- Workflow 位於根目錄 `.github/workflows/pages.yml`。
- 前端工作目錄為 `frontend/`，鎖檔為 `frontend/package-lock.json`，靜態成品為 `frontend/out/`。
- PR 僅驗證；main 驗證成功後發布同一份 artifact，並以公開 `version.json` 比對來源 SHA。
- 本專案為 XK 自有服務廣告，未登記至 Showcase Hub；樣品展示的連結導向 Hub。本次不改中央展示庫、DNS、網域或 Pages 管理設定。

目前不需要 Docker、IaC、主機或資料庫設定；操作與驗收方式見根目錄 README。
