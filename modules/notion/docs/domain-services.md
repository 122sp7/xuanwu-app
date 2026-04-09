# Domain Services — notion

本文件記錄 `notion` bounded context 的 domain services。Domain services 只承載無狀態、跨聚合或跨值物件的純業務規則，不得引入 React、Firebase SDK、HTTP client 等框架依賴。

## knowledge 子域（← modules/knowledge/）

`knowledge` 目前沒有獨立的 domain service 檔案。規則主要封裝在 aggregate methods 或 application layer orchestration 中。

**設計規則：**
- 頁面歸檔的子頁級聯規則（D2）封裝在 `KnowledgePage` aggregate method 中
- Promote 協議的頁面驗證邏輯（D3）封裝在 `PromoteKnowledgePage` use case 中

---

## authoring 子域（← modules/knowledge-base/）

| Domain Service | 說明 | 現有位置 |
|----------------|------|---------|
| `BacklinkExtractorService` | 從 article content 解析 `[[wikilink]]` 語法，提取被引用的 Article 標題集合 | `modules/knowledge-base/domain/services/BacklinkExtractorService.ts` |
| `ArticleSlugService` | 從 article title 生成 URL-safe slug（handling 重複衝突）| — |
| `CategoryDepthValidator` | 驗證分類層級深度不超過 5 層（不變數保護） | — |

---

## collaboration 子域（← modules/knowledge-collaboration/）

| Domain Service | 說明 | 現有位置 |
|----------------|------|---------|
| `PermissionLevelComparator` | `view < comment < edit < full` 偏序比較，防止超授（authorising a higher level than the grantor holds） | — |
| `VersionRetentionPolicy` | 保留最多 100 個版本（具名版本除外）；自動刪除最舊的非具名版本 | — |

---

## database 子域（← modules/knowledge-database/）

| Domain Service | 說明 | 現有位置 |
|----------------|------|---------|
| `FieldValueValidator` | 驗證 Record property 的值符合對應 Field 類型規範（如 `date` field 不接受 `string` 非 ISO 值） | — |
| `ViewQueryBuilder` | 將 View 的 filter / sort / groupBy 配置轉為可執行的查詢參數，不持有資料 | — |

---

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 若規則只屬於單一 aggregate，應封裝為 aggregate method，不應抽成 domain service
- domain services 不得持有任何 repository 或外部 gateway 的直接依賴
- domain services 的輸入與輸出必須是純 domain object（entity、value object、primitive）
