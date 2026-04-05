# AGENT.md ??workspace-audit BC

## 璅∠?摰?

`workspace-audit` ?舐里?貊???游?嚗雁霅?Append-Only ??AuditLog嚗閰Ｗ極雿???蝜里?貉?頝～?

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `AuditLog` | Log?ecord?istory?ctivityLog |
| `auditEventType` | EventType?ctionType |
| `actorId` | UserId?erformerId |
| `workspaceId` / `organizationId` | Scope嚗??箇里?貊??? |

## ???閬?嚗ppend-Only

```typescript
// ???芸?閮梯蕭?閮?
await auditRepository.append(newAuditLog);

// ??蝳迫靽格???
await auditRepository.update(id, changes);  // ?? Append-Only
await auditRepository.delete(id);           // ?? Append-Only
```

## ??閬?

### ???迂
```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";
```

### ??蝳迫
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
