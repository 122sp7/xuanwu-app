# ADR 0001 — Firestore 子域 Collection 邊界

## Status

Accepted

## Date

2025-02-11

## Context

系統使用 Firebase Firestore 作為主要持久化層。隨著 8 個 bounded context 各自擁有子域，需要明確定義：

1. **哪個模組擁有哪個 Firestore collection**
2. **Collection 命名規則是否與子域對齊**
3. **跨模組是否可直接讀取對方的 collection**
4. **多租戶隔離（tenantId）如何在 collection 路徑中表達**

目前風險：
- 多個模組可能操作同一 collection（如 `notebooks` 被 notebooklm 和 workspace 同時讀取）
- Collection 命名不統一（有的用 camelCase，有的用 kebab-case）
- tenantId 隔離未在所有 collection 一致應用

## Decision

### Collection 命名規則

所有 Firestore collection 路徑遵循：

```
<module>/<subdomain>/<entity-plural>
```

例：
- `notebooklm/notebook/notebooks/{notebookId}`
- `workspace/task/tasks/{taskId}`
- `notion/knowledge/pages/{pageId}`
- `iam/account/accounts/{accountId}`

**根層 collection 允許例外**（Firebase 慣例）：
- `users/{userId}` — iam/identity 的 Identity 聚合根，路徑保持 Firebase Auth 慣例
- `tenants/{tenantId}` — iam/tenant 的 Tenant 聚合根

### 多租戶隔離策略

對需要租戶隔離的 collection，在路徑中加入 tenantId segment：

```
tenants/{tenantId}/<module>/<subdomain>/<entity-plural>/{entityId}
```

例：
- `tenants/{tenantId}/notebooklm/notebook/notebooks/{notebookId}`
- `tenants/{tenantId}/workspace/task/tasks/{taskId}`

**哪些需要 tenant 隔離：**
- notebooklm（所有 collection）
- workspace（所有 collection）
- notion（所有 collection）
- billing（subscription、entitlement）

**哪些不需要：**
- iam/account — account 是 tenant 的上層，不需 tenant 前綴
- platform/audit-log — 系統層面，不分 tenant

### 跨模組 Collection 存取規則

| 規則 | 說明 |
|---|---|
| **禁止直接跨模組 collection 存取** | module A 的 repository 不得讀取 module B 的 collection |
| **跨模組資料需走 API boundary** | module A 需要 module B 的資料，透過 `@/modules/b` 的 use case 或 query |
| **Denormalized 讀取例外** | 若 module A 需要大量讀取 module B 的輕量欄位（如 workspace name），可建立 read model projection，但需透過 domain event 更新，不直接連結 B 的 collection |

### Firestore Security Rules 對齊

每個 collection 的讀寫規則對應其 owning module 的 domain 邊界：

```
match /tenants/{tenantId}/workspace/task/tasks/{taskId} {
  // workspace/task module 擁有此 collection
  // 其他 module 的 service account 不得直接讀寫
  allow read: if request.auth.uid == resource.data.assignedUserId 
              || hasWorkspaceMembership(tenantId, request.auth.uid);
  allow write: if isWorkspaceAdmin(tenantId, request.auth.uid);
}
```

## Consequences

**正面：** Collection 所有權明確；Security Rules 可系統性對應 module 邊界；跨模組耦合透過 API 控制。  
**負面：** 遷移現有 collection 路徑需要 Firestore 資料遷移腳本（Firestore 不支援 rename collection）。  
**中性：** 路徑格式較長（`tenants/{tenantId}/notebooklm/notebook/notebooks/{notebookId}`），但 repository adapter 隱藏路徑細節，domain 不感知。

## References

- `firestore.rules` — 現有 Security Rules（待對齊）
- `firestore.indexes.json` — 現有 index 定義
- `docs/structure/domain/bounded-contexts.md` — 各 module 所有權
- `.github/instructions/firestore-schema.instructions.md` — Firestore 設計規則
- ADR platform/0001 — audit-log（append-only collection 需特殊 rules）
