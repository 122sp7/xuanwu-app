# Context Map — knowledge

> `knowledge` BC 僅負責個人筆記的 Page 與 Block 管理。組織知識、版本協作、結構化資料庫由三個姊妹 BC 負責。

---

## 上游依賴（knowledge 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Page 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證 createdByUserId 是否存在 |

---

## 下游影響（downstream BCs 依賴 knowledge）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge-base` | **Customer / Supplier** | Page 可透過 Promote 流程成為 Article（跨 BC 操作） |
| `knowledge-collaboration` | **Customer / Supplier** | 使用 pageId 作為 contentId，提供 Comment / Version / Permission |
| `workspace-feed` | **Published Language** | `knowledge.page_published` 推送工作區動態 |
| `workspace-audit` | **Published Language** | `knowledge.page_approved` 寫入稽核紀錄 |
| `notification` | **Published Language** | Page 審核相關事件觸發通知 |

---

## 姊妹 BC 邊界說明（Knowledge Family）

| BC | 職責邊界 |
|---|---|
| `knowledge` | **個人筆記** - Page + Block（草稿、私人頁面） |
| `knowledge-base` | **組織知識庫** - Article + Category（公開 Wiki / SOP） |
| `knowledge-collaboration` | **協作基礎設施** - Comment / Permission / Version |
| `knowledge-database` | **結構化資料** - Database / Record / View |

---

## 整合事件流

```
knowledge.page_created
  → (auto) knowledge-collaboration.version_created (initial snapshot)

knowledge.page_approved
  → workspace-audit (append-only log)
  → notification (author notified)

knowledge.page_published (optional)
  → workspace-feed (activity)

user action: Promote Page → Article
  → knowledge-base.article_created (new article with page content)
  (knowledge 本身不發出跨 BC 事件，由 application 層協調)
```

---

## 邊界規則

- `knowledge` **不得** import `knowledge-base`、`knowledge-collaboration`、`knowledge-database` 的 domain 層。
- `knowledge-collaboration` 透過 `modules/knowledge/api` 取得 pageId，不讀取 Page 內部。
- `approvalState` 屬於 Page 生命週期，保留在此 BC（非 collaboration 的 Permission 概念）。
