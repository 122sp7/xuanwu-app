# AGENT.md — workspace-audit BC

## 模組定位

`workspace-audit` 是稽核紀錄支援域，維護 Append-Only 的 AuditLog，查詢工作區與組織稽核軌跡。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `AuditLog` | Log、Record、History、ActivityLog |
| `auditEventType` | EventType、ActionType |
| `actorId` | UserId、PerformerId |
| `workspaceId` / `organizationId` | Scope（作為稽核範圍） |

## 最重要規則：Append-Only

```typescript
// ✅ 只允許追加新記錄
await auditRepository.append(newAuditLog);

// ❌ 禁止修改或刪除
await auditRepository.update(id, changes);  // 違反 Append-Only
await auditRepository.delete(id);           // 違反 Append-Only
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";
```

### ❌ 禁止
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
```

## 驗證命令

```bash
npm run lint
npm run build
```
