# Context Map — knowledge-base

> 描述此 Bounded Context 與其他 BC 的關係類型與整合模式，遵循 IDDD 戰略設計。

---

## 上游依賴（knowledge-base 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Article 與 Category 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證 ownerId / verifiedByUserId 是否存在 |
| `knowledge-collaboration` | **Customer / Supplier** | 從 collaboration 接收 Permission 資訊（查看/編輯權限） |

---

## 下游影響（downstream BCs 依賴 knowledge-base）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge` | **Customer / Supplier** | Knowledge Page 可提升（promote）為 knowledge-base Article |
| `knowledge-collaboration` | **Customer / Supplier** | Collaboration 使用 articleId 關聯 Comment / Version |
| `knowledge-database` | **Anti-Corruption Layer** | Database Record 可 link 到 Article（不反向依賴） |
| `notification` | **Published Language** | `knowledge-base.article_verified` 事件觸發通知 |
| `workspace-feed` | **Published Language** | `knowledge-base.article_published` 事件推送工作區動態 |

---

## 整合事件流

```
knowledge.page_approved
  → (human or automation) promotes to knowledge-base article
  → knowledge-base.article_created

knowledge-base.article_verified
  → notification (verified owner notified)
  → workspace-feed (article verified appears in feed)

knowledge-base.article_review_requested
  → notification (article owner notified to review)
```

---

## 邊界規則

- `knowledge-base` **不得**直接 import `knowledge` 的 domain 層。
- `knowledge-base` 只能透過 `modules/knowledge/api` 取得 page 資訊。
- `knowledge-collaboration` 透過 `modules/knowledge-base/api` 取得 articleId，不讀取 Article 內部細節。
