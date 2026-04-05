# AGENT.md — modules/workspace-audit

## 模組定位

`modules/workspace-audit` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責工作區與組織範圍的稽核可見性。稽核記錄是 **append-only 的不可變證據**，不是操作狀態，不可修改或刪除。

---

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語，不可替換：

| 正確術語 | 禁止使用 |
|----------|----------|
| `AuditLog` | Log、Event、Record、History、AuditRecord |
| `AuditScope` | Scope、Range、Target |
| `AuditAction` | Action、Operation、EventType |
| `AuditSchema` | Schema、Format、Definition |
| `AuditRepository` | Repository、Store（作為稽核介面術語） |

---

## 最重要約束：Append-Only

```typescript
// ✅ 正確：只有查詢操作
const logs = await workspaceAuditApi.queryAuditLogs({ workspaceId, limit: 50 });

// ❌ 嚴禁：稽核記錄永遠不能修改
await workspaceAuditApi.updateAuditLog(id, patch);

// ❌ 嚴禁：稽核記錄永遠不能刪除
await workspaceAuditApi.deleteAuditLog(id);
```

---

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";

// WorkspaceAuditTab 元件（若從 api barrel 匯出）
import { WorkspaceAuditTab } from "@/modules/workspace-audit/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
import { FirebaseAuditRepository } from "@/modules/workspace-audit/infrastructure/firebase/FirebaseAuditRepository";
import { auditUseCases } from "@/modules/workspace-audit/application/use-cases/audit.use-cases";
```

---

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `AuditRepository` 介面在 `domain/repositories/`，只有讀取操作，無 `save` / `delete`
- `domain/` 禁止 import Firebase SDK、React、HTTP clients

---

## 未來事件 Sink 整合規則

目前其他模組要寫入稽核記錄，**尚無**統一的 sink 合約。未來整合方式：

```typescript
// 未來正確方式：透過事件 sink
// 其他模組發出領域事件 → audit 模組訂閱 → 寫入 AuditLog（append-only）

// ❌ 禁止未來直接跨模組寫入 Firestore
db.collection("audit-logs").add(data); // 永遠不允許繞過模組邊界
```

---

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `workspace/api` | 被組合使用 | 工作區 Audit tab（WorkspaceAuditTab） |
| `organization/api` | 被組合使用 | 組織層級稽核查詢 |
| `knowledge/api` | 未來事件訂閱 | 監聽知識操作事件 |
| `source/api` | 未來事件訂閱 | 監聽文件上傳事件 |

---

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
