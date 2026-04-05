# AGENT.md — modules/workspace-audit

## 模組定位

`modules/workspace-audit` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責工作區與組織範圍的稽核記錄查詢。稽核記錄是 append-only 的不可變證據，不是操作狀態。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `AuditRecord`（不是 Log、Event、History）
- `AuditScope`（工作區或組織的稽核範圍）
- `AuditAction`（被記錄的操作動作）

## 核心原則

**稽核記錄是 append-only 的不可變證據，不能被修改或刪除。**

```typescript
// ✅ 正確：只有讀取操作
const records = await auditApi.queryAuditRecords({ workspaceId, limit: 50 });

// ❌ 禁止：稽核記錄不能更新或刪除
await auditApi.updateRecord(id, data);  // 不允許
```

## 邊界規則

### ✅ 允許

```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditRecordDTO } from "@/modules/workspace-audit/api";
```

### ❌ 禁止

```typescript
import { AuditRecord } from "@/modules/workspace-audit/domain/...";
```

## 未來整合規則

未來其他模組要寫入稽核記錄，必須透過 **audit-owned 邊界**（事件 sink），而不是直接寫入 Firestore：

```typescript
// 未來正確方式：透過事件 sink
// 其他模組發出領域事件 → audit 模組訂閱 → 寫入稽核記錄
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `workspace/api` | 被組合使用 | 工作區稽核 tab |
| `organization/api` | 被組合使用 | 組織層級稽核查詢 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
