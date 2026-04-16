# 問題三：用六邊形模式取代 `_providers` / `_shell`

**Date**: 2026-04-16  
**Context**: 拋棄 `app/(shell)/_providers/` 和 `app/(shell)/_shell/`，改用模組 inbound adapter 組合。

---

## 現況問題

```
app/(shell)/_providers/AppProvider.tsx   ← 混合業務邏輯 + React 膠水
app/(shell)/_shell/ShellRootLayout.tsx  ← 780+ 行 Client Component，
                                           直接 useApp() + useWorkspaceContext()
                                           + useAuth() + subscribeToProfile()
```

`ShellRootLayout.tsx` 成為跨三個 bounded context 的耦合點（platform + workspace + iam），違背模組邊界。

---

## 六邊形解方

**核心思維**：Shell 是 `platform` 模組的 **inbound adapter 組合物**，不是 `app/` 的私有實作。

### 目標結構

```
src/modules/platform/
  adapters/
    inbound/
      react/
        AccountScopeProvider.tsx         ← 取代 AppProvider（業務邏輯 → use-case）
        ShellFrame.tsx                   ← 取代 ShellRootLayout（≤ 80 行，純組合）
        ShellAppRail.tsx                 ← props-driven，無直接 useContext
        ShellSidebar.tsx                 ← props-driven，無直接 useContext
        useAccountScope.ts               ← 取代 useApp()
        useShellNavigation.ts            ← 取代散落 routing logic

src/modules/workspace/
  adapters/
    inbound/
      react/
        WorkspaceScopeProvider.tsx       ← 取代 WorkspaceContextProvider
        useWorkspaceScope.ts             ← 取代 useWorkspaceContext()

src/modules/iam/
  adapters/
    inbound/
      react/
        IamSessionProvider.tsx           ← 取代 AuthProvider
        useIamSession.ts
```

---

## ShellFrame 設計原則

```typescript
// src/modules/platform/adapters/inbound/react/ShellFrame.tsx
// 唯一責任：組合子組件，傳遞 props，不持有業務邏輯

export function ShellFrame({ children }: { children: ReactNode }) {
  // 只從同層 inbound adapter hooks 取值，不跨模組直接消費
  const { activeAccount, accounts } = useAccountScope();
  const { activeWorkspaceId, workspaces } = useWorkspaceScope();
  const { user } = useIamSession();
  const nav = useShellNavigation();

  return (
    <ShellGuard>
      <div className="flex h-screen overflow-hidden">
        <ShellAppRail {...nav.railProps(activeAccount, accounts, workspaces)} />
        <ShellSidebar {...nav.sidebarProps(activeAccount, workspaces)} />
        <main>{children}</main>
      </div>
    </ShellGuard>
  );
}
```

**Props 驅動，而非 Context 穿透**：子組件（`ShellAppRail`, `ShellSidebar`）收 props，不直接呼叫任何 `useContext`。這使它們可獨立測試。

---

## 替換前後對比

```
替換前：
  app/layout.tsx → <Providers>
    AuthProvider → AppProvider → WorkspaceContextProvider
      app/(shell)/layout.tsx → <ShellLayout>  (ShellRootLayout.tsx，780行)

替換後：
  src/app/layout.tsx → <PlatformBootstrap>       ← platform inbound adapter，自包含
    IamSessionProvider                            ← iam inbound adapter
    AccountScopeProvider                          ← platform inbound adapter
    WorkspaceScopeProvider                        ← workspace inbound adapter
      src/app/(shell)/layout.tsx → <ShellFrame>  ← platform inbound adapter，≤ 80行
```

`app/` 層只知道「module 提供了什麼組件」，不知道模組內部怎麼管理狀態。

---

## 可測試性收益

| 組件 | 測試方式 |
|---|---|
| `AccountScopeProvider` | Mock `AccountScopePort` + `ResolveActiveAccount` use-case |
| `ShellFrame` | 直接傳 mock props，不需要真實 providers |
| `ShellAppRail` | 純 props snapshot test |
| `ShellSidebar` | 純 props snapshot test |
| `AccountRouteDispatcher` | Mock `useWorkspaceScope` return value |

原本的 `ShellRootLayout.tsx` 幾乎無法在 isolation 下測試（太多隱式 context 依賴）。
