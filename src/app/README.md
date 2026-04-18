# src/app — Next.js App Router 路由入口

`src/app/` 是 Next.js 16 App Router 的路由組合層，只做 layout 組裝與 page slot 分發，不承載業務邏輯。

## 路由群組

| 群組 | 用途 |
|---|---|
| `(public)` | 登入前公開頁面 |
| `(shell)` | 登入後帶 shell chrome 的應用頁面 |
| `(shell)/(account)/[accountId]` | account-scoped 頁面 |
| `[[...slug]]` | account scope 下的 catch-all |

## 規則

- 只組合路由與 layout，不寫業務規則。
- 業務行為來自 `src/modules/<context>/index.ts`。
- Server Action 來自 `modules/<context>/interfaces/_actions/`。
- Route props 只傳 `accountId`、`workspaceId` 等 scope identifier。
