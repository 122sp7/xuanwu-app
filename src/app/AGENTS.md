# src/app — Agent Guide

路由組合層。只做 page / layout 組裝，不承載業務邏輯。

## Route Here

- 新增 page、layout 或 route group。
- account-scoped 頁面或 parallel / intercepting routes。

## Route Elsewhere

| 需求 | 目標 |
|---|---|
| 業務邏輯 | `src/modules/<context>/application/use-cases/` |
| Server Action | `modules/<context>/interfaces/_actions/` |
| 共享 UI 元件 | `packages/ui-shadcn/` |
| 業務無關 hook | `packages/ui-components/` |

## Hard Rules

- 不呼叫 repository、Firebase SDK，不引用模組內部路徑。
- Route props 只傳 `accountId`、`workspaceId`，不傳 aggregate 物件。
- 能用既有 route group 就不要新開 group。
