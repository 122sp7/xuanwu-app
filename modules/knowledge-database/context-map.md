# Context Map — knowledge-database

---

## 上游依賴（knowledge-database 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Database 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證操作者身份 |
| `knowledge-collaboration` | **Customer / Supplier** | Permission 控制 Database/Record 存取權限 |

---

## 下游影響（downstream BCs 依賴 knowledge-database）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge-base` | **Open Host Service** | Article 可透過 Relation 欄位 link 到 Database Record |
| `knowledge` | **Open Host Service** | Page 中可嵌入 Database（inline database） |
| `workspace-feed` | **Published Language** | `record_added` 等事件推送工作區動態 |
| `workspace-flow` | **Anti-Corruption Layer** | Task 可 link 到 Database Record（ACL 保護） |
| `notification` | **Published Language** | Record 更新可觸發通知 |

---

## 整合事件流

```
knowledge-database.database_created
  → workspace (register database in workspace content tree)

knowledge-database.record_linked
  → (if linked to article) knowledge-base (update backlink index)
  → workspace-feed (activity)

knowledge-collaboration.permission_granted (subjectType="database")
  → knowledge-database (check permission on record access)
```

---

## 邊界規則

- `Relation` 欄位的 targetRecordId 是 opaque reference — 不 import 目標的 domain 型別。
- Database Schema 變更（刪除 Field）必須同步更新所有 Record（由 application 層協調）。
- View 不擁有資料，只持有展示配置。
