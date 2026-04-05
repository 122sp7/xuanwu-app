# Domain Events — account

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `account.created` | 新帳戶建立時 | `accountId`, `email`, `occurredAt` |
| `account.policy_updated` | AccountPolicy 更新時，觸發 custom claims 刷新 | `accountId`, `policyId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 事件 | 行動 |
|---------|------|------|
| `identity` | `TokenRefreshSignal` | 觸發 custom claims 重新計算與 Firebase token 更新 |

## 事件格式

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
