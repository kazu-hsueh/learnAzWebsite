# AZ-104 Fieldnotes

以繁體中文為主、中英並列的 AZ-104 靜態學習網站。首頁提供六條學習路徑；每條路徑的內容由自己的資料夾管理，適合直接部署到 GitHub Pages。

## 六大學習路徑

1. Azure 系統管理員的先決條件
2. 管理身分識別和治理
3. 設定及管理虛擬網路
4. 實作和管理儲存體
5. 部署和管理 Azure 計算資源
6. 監視和備份 Azure 資源

主題入口位於 `topics/<主題>/`，該資料夾的 `content.json` 維護主題介紹、小主題與筆記；`index.html` 載入共用的 `topic.js` 和 `topic.css`。新增主題時，新增資料夾並沿用同一頁面骨架，再將入口加到首頁。小主題清單不代表完整或官方考試範圍；實際考試目標請以最新 Microsoft Learn AZ-104 study guide 為準。

## 本機預覽

使用任一靜態檔案伺服器預覽，避免以 `file://` 開啟時瀏覽器封鎖 JSON 載入：

```sh
python3 -m http.server 8000
```

接著瀏覽 `http://localhost:8000`。網站無需安裝依賴或啟動後端。

## GitHub Pages

在 repository 的 Settings > Pages 選擇部署來源分支與根目錄。首頁連到 `topics/` 下的各主題資料夾，網站使用相對路徑，可由 repository 根目錄發布。

## 官方參考

- [AZ-104 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104)
- [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)
- [Understand scope for Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview)

練習題為原創學習題，非 Microsoft 官方考題。
