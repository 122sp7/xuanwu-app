# Domain Events — identity

## 發出事件

`identity` 域目前不發出 DomainEvent（Firebase Auth 事件由 SDK 直接處理，不經過領域事件匯流排）。

未來如需追蹤登入稽核，可考慮加入：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `identity.signed_in` | 使用者成功登入 | 供 `workspace-audit` 消費 |
| `identity.signed_out` | 使用者登出 | 供稽核紀錄消費 |

## 訂閱事件

`identity` 不訂閱其他 BC 的事件。

## TokenRefreshSignal（非正式事件）

`TokenRefreshSignal` 是透過 `TokenRefreshRepository.listenToTokenRefresh()` 的 Observable 訊號，不是正式的 DomainEvent，但語意上扮演事件角色：

```typescript
// account use-case 消費此訊號
identityApi.listenToTokenRefresh()
  .subscribe(() => accountApi.refreshCustomClaims(uid));
```
