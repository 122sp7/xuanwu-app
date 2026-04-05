# workspace-audit — Workspace Audit Layer

> **開發狀態**：🏗️ Midway — 開發部分完成
> **Domain Type**：Supporting Domain（支援域）

`modules/workspace-audit` 負責工作區與組織範圍的**稽核記錄管理**。稽核記錄是 append-only 的不可變證據軌跡，提供可查詢的稽核可見性。未來將作為穩定的事件 sink，接收其他模組發出的領域事件並轉換為稽核記錄。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`
- 稽核記錄只能讀取，不能更新或刪除

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 稽核記錄查詢 | 按工作區或組織範圍查詢稽核記錄 |
| 稽核流串流 | 即時串流顯示最新稽核事件（AuditStream） |
| 稽核 Tab 提供 | 在工作區 UI 中提供 WorkspaceAuditTab 元件 |
| 稽核 Schema 驗證 | 透過 Zod schema.ts 驗證稽核記錄格式 |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `AuditLog` | 稽核記錄聚合根，append-only，不可修改或刪除 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 稽核記錄 | AuditLog | 一筆不可變的操作稽核軌跡 |
| 稽核範圍 | AuditScope | 稽核查詢的範圍（工作區 ID 或組織 ID） |
| 稽核動作 | AuditAction | 被記錄的操作類型（create / update / delete / access） |
| 稽核 Schema | AuditSchema | Zod 定義的稽核記錄資料結構 |
| 稽核儲存庫 | AuditRepository | 稽核記錄的 append-only 持久化介面 |

---

## 核心約束：Append-Only

```typescript
// ✅ 正確：只有讀取操作
const logs = await auditApi.queryAuditLogs({ workspaceId, limit: 50 });

// ❌ 禁止：稽核記錄不可修改
await auditApi.updateAuditLog(id, data);   // 永遠不允許

// ❌ 禁止：稽核記錄不可刪除
await auditApi.deleteAuditLog(id);         // 永遠不允許
```

---

## 領域事件（Domain Events）

workspace-audit 是事件的**消費端（sink）**，不發出自己的業務領域事件：

| 訂閱事件 | 來源模組 | 說明 |
|----------|----------|------|
| `knowledge.page_updated` | `knowledge` | 知識頁面變更記錄 |
| `workspace.member_joined` | `workspace` | 成員加入記錄 |
| `source.upload_completed` | `source` | 檔案上傳記錄 |
| 其他模組的操作事件 | 各模組 | 未來透過事件 sink 統一接收 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（操作者身分）
- **下游（被依賴）**：`workspace/api`（Audit tab）、`organization/api`（組織層級稽核查詢）

---

## 目錄結構

```
modules/workspace-audit/
├── api/                      # 公開 API 邊界
│   └── index.ts
├── application/              # Use Cases
│   └── use-cases/
│       └── audit.use-cases.ts
├── domain/                   # Aggregates, Repositories, Schema
│   ├── entities/
│   │   └── AuditLog.ts       # append-only 聚合根
│   ├── repositories/
│   │   └── AuditRepository.ts
│   └── schema.ts             # Zod 稽核 Schema
├── infrastructure/           # Firebase 適配器
│   └── firebase/
│       └── FirebaseAuditRepository.ts
├── interfaces/               # UI 元件、queries
│   ├── components/
│   │   ├── AuditStream.tsx
│   │   └── WorkspaceAuditTab.tsx
│   └── queries/
│       └── audit.queries.ts
└── index.ts
```

---

## 架構參考

- 系統設計文件：`docs/architecture/domain-model.md`
- 通用語言：`docs/architecture/ubiquitous-language.md`
- 開發合約：`docs/development-reference/reference/development-contracts/audit-contract.md`
