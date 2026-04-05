# Context Map — knowledge

> `knowledge` BC 僅負責個人筆記的 Page 與 Block 管理。組織知識、版本協作、結構化資料庫由三個姊妹 BC 負責。

---

## 上游依賴（knowledge 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Page 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證 createdByUserId 是否存在 |
| `shared` | **Shared Kernel** | `CommandResult`、事件發佈基礎型別 |

---

## 下游影響（downstream BCs 依賴 knowledge）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge-base` | **Customer / Supplier** | Page 可透過 Promote 流程成為 Article（跨 BC 操作） |
| `knowledge-collaboration` | **Customer / Supplier** | 使用 pageId 作為 contentId，提供 Comment / Version / Permission |
| `knowledge-database` | **Split / Transitional Boundary** | `KnowledgeCollection` 仍在本模組，最終 database 能力應收斂到此 BC |
| `workspace-audit` | **Published Language** | `knowledge.page_approved` 可被稽核流程消費 |
| `notification` | **Published Language** | 審核或複核事件未來可觸發通知 |
| `workspace-feed` | **Published Language** | 目前尚未看到 `knowledge.page_published` 的實際 publish |

---

## 姊妹 BC 邊界說明（Knowledge Family）

| BC | 職責邊界 |
|---|---|
| `knowledge` | **個人筆記** - Page + Block（草稿、私人頁面） |
| `knowledge-base` | **組織知識庫** - Article + Category（公開 Wiki / SOP） |
| `knowledge-collaboration` | **協作基礎設施** - Comment / Permission / Version |
| `knowledge-database` | **結構化資料** - Database / Record / View |

> 目前 code 上 `KnowledgeCollection` 仍在 `knowledge`，這是過渡狀態，不表示最終 ownership 已經定案。

---

## 整合事件流

```
knowledge.page_created
  → (planned) knowledge-collaboration.version_created (initial snapshot)

knowledge.page_approved
  → (contract-ready) workspace-audit
  → (contract-ready) notification

knowledge.page_verified / knowledge.page_review_requested / knowledge.page_owner_assigned
  → (planned) wiki governance / notification flows

user action: Promote Page → Article
  → knowledge-base.article_created (new article with page content)
  (knowledge 本身不發出跨 BC 事件，由 application 層協調)
```

---

## 邊界規則

- `knowledge` **不得** import `knowledge-base`、`knowledge-collaboration`、`knowledge-database` 的 domain 層。
- `knowledge-collaboration` 透過 `modules/knowledge/api` 取得 pageId，不讀取 Page 內部。
- `approvalState`、`verificationState`、`ownerId` 目前仍保留在 `Page`；若日後重新切分 ownership，必須連同 API contract 一起搬移。
