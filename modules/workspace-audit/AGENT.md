# AGENT.md — workspace-audit compatibility module

## 模組定位（相容層）

`workspace-audit` 已轉為相容層。
實際稽核子域已移至 `modules/workspace/subdomains/audit`，且建議跨模組改用 `@/modules/workspace/api`。

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

### ✅ 建議
```typescript
import { WorkspaceAuditTab, getOrganizationAuditLogs } from "@/modules/workspace/api";
```

### ❌ 禁止
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
import { AuditLog } from "@/modules/workspace/subdomains/audit/domain/entities/AuditLog";
```

## 驗證命令

```bash
npm run lint
npm run build
```
