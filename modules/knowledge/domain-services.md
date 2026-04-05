# Domain Services — knowledge

> `knowledge` BC 目前沒有獨立的 domain service class；多數規則分散在 repository、application use cases 與 editor store，而不是封裝在 aggregate methods 中。

---

## 現況

此 BC（個人筆記 Page + Block）的主流程仍以 CRUD 與簡單 workflow 為主，目前尚未抽出獨立 service class。

邏輯由以下層次處理：

| 層次 | 負責內容 |
|---|---|
| Page repository | slugify、Firestore path、approval / verify / assign owner persistence |
| Use Cases | DTO 驗證、move guard、approve event publish |
| Editor store | 本地 block editor 狀態（Zustand） |

---

## 潛在未來 Domain Services（待需求出現再提取）

| 候選 Service | 觸發條件 |
|---|---|
| `PageApprovalService` | 若 approval 流程複雜化（多步驟審批、代理審批） |
| `BlockOrderService` | 若 Block 排序規則複雜化（fractional indexing） |
| `PageDuplicatorService` | 若 Page 複製需要深度 Block 複製邏輯 |
| `PageVerificationPolicyService` | 若 verification expiry / owner reassignment 規則複雜化 |
| `CollectionBoundaryService` | 若 `KnowledgeCollection` 抽離到 `knowledge-database` 需要對應轉譯 |

---

## 跨 BC Domain Services（不在此 BC）

| Service | 所屬 BC |
|---|---|
| `BacklinkExtractorService` | `knowledge-base` |
| `PermissionLevelComparator` | `knowledge-collaboration` |
| `FieldValueValidator` | `knowledge-database` |
| `ViewQueryBuilder` | `knowledge-database` |
