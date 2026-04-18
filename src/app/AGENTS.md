# App — Agent Guide

## Purpose

`src/app/` 是 **Next.js 16 App Router** 的路由入口層，負責 layout 組合與 page slot 分發。不承載任何業務邏輯。

## Boundary Rules

- `app/` 只組合路由、layout 與 UI 入口，不寫業務規則、不呼叫 repository、不直接存取 Firebase SDK。
- 業務行為透過 Server Action 或模組 `index.ts` 公開邊界取得。
- 不在 layout / page 中引用另一個模組的 `domain/`、`application/`、`infrastructure/` 或 `interfaces/` 內部路徑。
- Route 組件只接受 scope props（`accountId`、`workspaceId`），不直接消費跨模組的 context provider。

## Route Group 設計

| 群組 | 用途 |
|---|---|
| `(public)` | 登入前公開頁（landing、auth） |
| `(shell)` | 登入後帶 shell chrome 的應用頁面 |
| `(shell)/(account)/[accountId]` | account-scoped 頁面，`accountId` 為 shell route identifier |
| `[[...slug]]` | catch-all，在 account scope 下承接所有子路徑 |

## Route Here When

- 需要新增 page、layout 或 route group。
- 需要在 shell 內新增一個 account-scoped 功能頁面。
- 需要組合 parallel routes 或 intercepting routes。

## Route Elsewhere When

- 業務邏輯 → `src/modules/<context>/application/use-cases/`。
- Server Action → `modules/<context>/interfaces/_actions/`。
- 共享 UI 元件 → `packages/ui-shadcn/`。
- 共享 hook → `packages/ui-components/`（業務無關）或模組本地 `adapters/inbound/react/hooks/`。

## Delivery Style

- 保持 layout 和 page 輕薄（thin）：只做 slot 組合與 scope prop 傳遞。
- 新增 route segment 前先確認 `accountId` / `workspaceId` scope 是否已在父 layout 中取得。
- 奧卡姆剃刀：能用既有 route group 的就不要新開 group。
