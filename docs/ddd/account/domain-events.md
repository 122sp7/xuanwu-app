# Domain Events ??account

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `account.created` | ?啣董?嗅遣蝡? | `accountId`, `email`, `occurredAt` |
| `account.policy_updated` | AccountPolicy ?湔??閫貊 custom claims ?瑟 | `accountId`, `policyId`, `occurredAt` |

## 閮鈭辣

| 靘? BC | 鈭辣 | 銵? |
|---------|------|------|
| `identity` | `TokenRefreshSignal` | 閫貊 custom claims ?閮???Firebase token ?湔 |

## 鈭辣?澆?

```typescript
interface AccountCreatedEvent {
  readonly type: "account.created";
  readonly accountId: string;
  readonly email: string;
  readonly occurredAt: string;  // ISO 8601
}

interface AccountPolicyUpdatedEvent {
  readonly type: "account.policy_updated";
  readonly accountId: string;
  readonly policyId: string;
  readonly occurredAt: string;
}
```
