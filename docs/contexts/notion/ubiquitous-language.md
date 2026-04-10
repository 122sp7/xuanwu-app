# Notion

本文件整理 notion 主域在跨子域協作時必須共用的語言。全域術語入口見 [../../ubiquitous-language.md](../../ubiquitous-language.md)；本文件只定義 notion 主域層級需要統一的名稱，不取代更細的子域術語文件。

## Scope

notion 是四個主域之一，也是核心知識內容生命週期所在主域。它負責頁面、文章、資料庫、協作、範本、附件、版本與知識事件驅動流程的正典語言。

## Canonical Terms

| Term | Definition | Usage |
|---|---|---|
| Knowledge Artifact | notion 主域擁有的知識內容總稱 | 在不需指定型別時，作為 page、article、database 等的統稱 |
| Knowledge Page | 知識內容的正典頁面單位 | 指頁面建立、編輯、交付與版本語意 |
| Article | 經過撰寫、驗證與分類的知識庫文章 | 指較強 editorial 流程的知識內容 |
| Collaboration Thread | 附著在知識內容上的協作討論邊界 | 指留言、討論與版本評註語意 |
| Database | 有結構與欄位語意的知識集合 | 指可被多視圖檢視的結構化知識內容 |
| Database View | 對 Database 的投影與檢視配置 | 指排序、篩選、分組或顯示方式 |
| Attachment | 綁定於知識內容的檔案或媒體 | 指媒體、檔案與關聯內容 |
| Template | 可重複套用的知識結構起點 | 指頁面或資料庫模板 |
| Note | 輕量知識草稿或個人記錄 | 指可能演化為正式知識內容的輕量單位 |
| Version Snapshot | 知識內容某一時點的不可變快照 | 指版本管理與歷史追溯 |
| Automation Rule | 由知識事件驅動的自動化規則 | 指知識內容生命周期中的規則化行為 |

## Language Rules

- 使用 Knowledge Page、Article、Database 等明確語彙，不使用 Document 或 Wiki 作為籠統總稱。
- 使用 Collaboration Thread 表示協作討論邊界，不用 Chat 指稱知識協作。
- 使用 Database View 表示資料投影；若只是顯示形式，不要把整個資料本體稱為 View。
- 使用 Version Snapshot 表示不可變版本狀態；不要把草稿狀態與快照混為一談。
- 若內容仍屬 AI 對話或 synthesis 產物，應留在 notebooklm 語言中，除非已被 notion 正式吸收成知識內容。

## Avoid

| Avoid | Use Instead | Reason |
|---|---|---|
| Wiki | Knowledge Page、Article 或 Database | wiki 是舊稱且語意過寬 |
| Document | Knowledge Page 或 Article | 無法區分內容類型與生命週期 |
| Table | Database 或 Database View | 需先區分資料本體與顯示投影 |
| Chat | Collaboration Thread 或 Conversation | 必須區分知識協作與 AI 對話 |