# Domain Events — workspace

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace.created` | 新工作區建立時 | `workspaceId`, `accountId`, `name`, `occurredAt` |
| `workspace.archived` | 工作區歸檔時 | `workspaceId`, `accountId`, `occurredAt` |
| `workspace.member_joined` | 成員加入工作區 | `workspaceId`, `accountId`, `role`, `occurredAt` |
| `workspace.member_removed` | 成員被移除 | `workspaceId`, `accountId`, `occurredAt` |

## 訂閱事件

`workspace` 不直接訂閱其他 BC 的事件，由 app/ 路由層協調各 tab 組合。

## 事件格式範例

```typescript
interface WorkspaceCreatedEvent {
  readonly type: "workspace.created";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly occurredAt: string;  // ISO 8601
}
```
