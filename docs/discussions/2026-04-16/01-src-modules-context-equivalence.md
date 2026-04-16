# 問題一：src/modules 如何實現等價上下文？

**Date**: 2026-04-16  
**Context**: Post-distillation review — `modules/` → `src/modules/` migration complete (commit 46dd39a3).

---

## 現況問題

`AppProvider`（`app/(shell)/_providers/AppProvider.tsx`）混合了三件事：

1. **狀態機邏輯**（`appReducer` — accounts hydration, bootstrapPhase）
2. **副作用協調**（`subscribeToAccountsForUser`, localStorage sync）
3. **React 膠水**（`useReducer`, `Context.Provider`）

這導致業務邏輯洩漏到 `app/` 層，違背六邊形架構依賴方向。

---

## 六邊形解方：Context 是 Inbound Adapter

```
src/modules/platform/
  adapters/
    inbound/
      react/                           ← React 特定的 inbound adapter
        AccountScopeProvider.tsx       ← 取代 AppProvider.tsx
        useAccountScope.ts             ← 取代 useApp() hook
        ShellBootstrap.tsx             ← 取代 ShellRootLayout.tsx（組裝層）
  application/
    use-cases/
      ResolveActiveAccount.use-case.ts ← 業務邏輯：哪個 account 是 active
  domain/
    repositories/
      AccountScopePort.ts              ← 訂閱帳號列表的 port 介面
```

**核心原則：**
- `adapters/inbound/react/` 只做「把 React 生命週期翻譯成 use-case 呼叫」
- Reducer 邏輯（`resolveActiveAccount` 業務決策）提升到 `application/use-cases/`
- `AccountScopeProvider` 本身是薄殼：持有 Zustand store，訂閱 port，呼叫 use-case

```typescript
// src/modules/platform/adapters/inbound/react/AccountScopeProvider.tsx
"use client";

export function AccountScopeProvider({ children }: { children: ReactNode }) {
  const { user, status } = useIamSession();               // iam module hook
  const store = useAccountScopeStore();                   // zustand

  useEffect(() => {
    if (status === "initializing" || !user) {
      store.reset();
      return;
    }
    return subscribeAccountsPort(user.id, (accounts) => {
      const resolved = resolveActiveAccountUseCase.execute({
        accounts,
        user,
        preferredId: readPersistedAccountId(),
        current: store.activeAccount,
      });
      store.setAccounts(accounts, resolved);
    });
  }, [status, user?.id]);

  return <>{children}</>;
}
```

---

## 結構對照

| 現況 | src/ 六邊形等價 |
|---|---|
| `app/(shell)/_providers/AppProvider.tsx` | `src/modules/platform/adapters/inbound/react/AccountScopeProvider.tsx` |
| `useApp()` from `modules/platform/api/ui` | `useAccountScope()` from `src/modules/platform/adapters/inbound/react/` |
| `app/_providers/index.tsx` Providers 組裝 | `src/app/layout.tsx` 只 import `<PlatformBootstrap>`（自包含） |
| `WorkspaceContextProvider` | `src/modules/workspace/adapters/inbound/react/WorkspaceScopeProvider.tsx` |

**關鍵轉變**：`app/` 不再知道「帳號」或「工作區」的存在，它只 mount 各模組的 inbound adapter 組件。

---

## 每個模組需建立的 inbound/react/ 清單

| 模組 | 需建立的組件 |
|---|---|
| `platform` | `AccountScopeProvider`, `ShellFrame`, `useAccountScope`, `PlatformBootstrap` |
| `iam` | `IamSessionProvider`, `PublicLandingView`, `useIamSession` |
| `workspace` | `WorkspaceScopeProvider`, `AccountRouteDispatcher`, `useWorkspaceScope` |
