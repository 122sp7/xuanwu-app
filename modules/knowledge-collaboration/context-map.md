# Context Map — knowledge-collaboration

---

## 上游依賴（knowledge-collaboration 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | contentId 必須屬於某 Workspace |
| `identity` | **Conformist** | 驗證 authorId / principalId 是否存在 |
| `knowledge` | **Customer / Supplier** | 使用 pageId 作為 contentId 引用來源 |
| `knowledge-base` | **Customer / Supplier** | 使用 articleId 作為 contentId 引用來源 |
| `knowledge-database` | **Customer / Supplier** | 使用 databaseId 作為 subjectId（Permission） |

---

## 下游影響（downstream BCs 依賴 knowledge-collaboration）

| BC | 關係類型 | 說明 |
|---|---|---|
| `notification` | **Published Language** | `comment_created`、`page_locked` 等事件觸發通知 |
| `workspace-feed` | **Published Language** | `version_published` 推送工作區動態 |
| `workspace-audit` | **Published Language** | `permission_changed` 寫入稽核紀錄 |

---

## 整合事件流

```
knowledge.page_updated
  → (application layer) CreateVersionUseCase
  → knowledge-collaboration.version_created

knowledge-collaboration.permission_changed
  → workspace-audit (append-only log)
  → notification (if permission revoked, user notified)

knowledge-collaboration.comment_created
  → notification (content owner notified)
  → workspace-feed (activity feed)
```

---

## 邊界規則

- 此 BC 使用 `contentId` 作為 opaque reference，不 import 其他 BC 的 domain 層。
- Version 快照中的 `snapshotBlocks` 是 `unknown[]`（不依賴 `knowledge` Block 型別）。
- Permission 授予不超過授予者自身的 Permission 級別。
