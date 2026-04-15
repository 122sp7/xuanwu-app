# App — Next.js App Router Entry

`src/app/` 是 Next.js 16 App Router 的 UI 進入層。負責路由組合與 layout 組裝，不承載任何業務邏輯。

## 目錄結構

```
src/app/
  layout.tsx               ← Root Layout（html / body / metadata）
  (public)/
    page.tsx               ← 公開頁面（登入前可見）
  (shell)/
    layout.tsx             ← Shell Group Layout（通用 chrome wrapper）
    (account)/
      [accountId]/
        [[...slug]]/
          page.tsx         ← account-scoped catch-all route
```

## 路由群組說明

| 路由群組 | 用途 |
|---|---|
| `(public)` | 登入前可存取的公開頁面（marketing、landing、auth） |
| `(shell)` | 登入後有 shell chrome（導覽列、側邊欄）的頁面 |
| `(account)/[accountId]` | 以 `accountId` 為 scope 的帳號相關頁面 |
| `[[...slug]]` | catch-all：在 account scope 下承接所有子路徑 |

## Layout 層級

```
RootLayout (layout.tsx)           ← html / body / global metadata
└── ShellLayout ((shell)/layout.tsx)  ← shell chrome wrapper
    └── page.tsx                      ← route segment 的實際頁面
```

## 設計原則

- `app/` 只做路由組合（Route Composition）與 Layout 組裝，不寫業務規則。
- 業務邏輯統一來自 `src/modules/<context>/` 或 `modules/<context>/api/`。
- Server Action 呼叫来自 `modules/<context>/interfaces/_actions/`。
- 不在 page / layout 內直接呼叫 Firestore、Firebase Auth SDK 或 domain repository。
- 路由 props 只傳 scope identifier（`accountId`、`workspaceId`），不傳 upstream aggregate 物件。

## 命名規則

| 元素 | 規則 |
|---|---|
| Route Group | `(kebab-case)` |
| Dynamic Segment | `[camelCase]` |
| Catch-all | `[[...slug]]` |
| Layout | `layout.tsx` |
| Page | `page.tsx` |
