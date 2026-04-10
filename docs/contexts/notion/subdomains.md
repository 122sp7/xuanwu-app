# Notion

本文件依 Context7 參考 DDD / Hexagonal 模組邊界與責任分離原則整理。以下缺口子域依本次任務前提，視為目前專案尚未落地但主域設計上應補齊的子域。

## Current Subdomains

| Subdomain | Role |
|---|---|
| knowledge | 頁面建立、組織、版本化與交付 |
| authoring | 知識庫文章建立、驗證與分類 |
| collaboration | 協作留言、細粒度權限與版本快照 |
| database | 結構化資料多視圖管理 |
| ai | AI 輔助頁面生成與摘要整合 |
| analytics | 知識使用行為量測 |
| attachments | 附件與媒體關聯儲存 |
| automation | 知識事件觸發自動化動作 |
| integration | 知識與外部系統雙向整合 |
| notes | 個人輕量筆記與正式知識協作 |
| templates | 頁面範本管理與套用 |
| versioning | 全域版本快照策略管理 |

## Missing Gap Subdomains

| Proposed Subdomain | Why Needed | Gap If Missing |
|---|---|---|
| taxonomy | 承接標籤、分類、主題樹與語義分類法 | authoring 與 database 會被迫混入分類治理，知識查找與組織語言不穩定 |
| relations | 承接 backlinks、references、content-to-content 關聯與語義連結 | 知識內容之間的關係只能隱含在 UI 或資料欄位中，無法形成正典邊界 |
| publishing | 承接發布流程、受眾可見性、公開交付與內容落版 | authoring 只能停在編輯面，正式交付與對外呈現沒有獨立語言 |

## Recommended Order

1. taxonomy
2. relations
3. publishing