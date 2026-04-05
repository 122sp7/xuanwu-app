# Domain Events ??workspace

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `workspace.created` | ?啣極雿?撱箇???| `workspaceId`, `accountId`, `name`, `occurredAt` |
| `workspace.archived` | 撌乩??甇豢???| `workspaceId`, `accountId`, `occurredAt` |
| `workspace.member_joined` | ??撌乩?? | `workspaceId`, `accountId`, `role`, `occurredAt` |
| `workspace.member_removed` | ?鋡怎宏??| `workspaceId`, `accountId`, `occurredAt` |

## 閮鈭辣

`workspace` 銝?亥??勗隞?BC ??隞塚???app/ 頝舐撅文?隤踹? tab 蝯???

## 鈭辣?澆?蝭?

```typescript
interface WorkspaceCreatedEvent {
  readonly type: "workspace.created";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly occurredAt: string;  // ISO 8601
}
```
