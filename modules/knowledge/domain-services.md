# Domain Services — knowledge

> `knowledge` BC 目前無需獨立的 Domain Service。業務規則已內聚於 Page / Block 聚合根本身。

---

## 現況

此 BC（個人筆記 Page + Block）的業務規則較單純，目前無需提取獨立的 Domain Service。

邏輯由以下層次處理：

| 層次 | 負責內容 |
|---|---|
| Page entity | `approvalState` 狀態機轉換、Block 順序管理 |
| Use Cases | 跨 Use Case 協調（CreatePage + initial Block） |
| Repository | 樂觀鎖（version 欄位） |

---

## 潛在未來 Domain Services（待需求出現再提取）

| 候選 Service | 觸發條件 |
|---|---|
| `PageApprovalService` | 若 approval 流程複雜化（多步驟審批、代理審批） |
| `BlockOrderService` | 若 Block 排序規則複雜化（fractional indexing） |
| `PageDuplicatorService` | 若 Page 複製需要深度 Block 複製邏輯 |

---

## 跨 BC Domain Services（不在此 BC）

| Service | 所屬 BC |
|---|---|
| `BacklinkExtractorService` | `knowledge-base` |
| `PermissionLevelComparator` | `knowledge-collaboration` |
| `FieldValueValidator` | `knowledge-database` |
| `ViewQueryBuilder` | `knowledge-database` |
