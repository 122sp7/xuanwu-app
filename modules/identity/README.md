# identity — 身份驗證上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/identity/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`identity` 是整個平台的身份入口，封裝 Firebase Authentication 與 session 起點。它對產品價值並不差異化，但所有工作區、知識與 AI 互動都建立在正確的身份語意之上。

## 主要職責

| 能力 | 說明 |
|---|---|
| 登入 / 登出 | 處理 signIn、signOut 與身份狀態切換 |
| Token 生命週期 | 管理 token refresh 與相關身份訊號 |
| 身份上下文供應 | 向 `account`、`organization`、`workspace` 提供穩定的身份讀取入口 |

## 與其他 Bounded Context 協作

- `account` 直接消費 `identity/api` 提供的身份上下文。
- `organization` 與 `workspace` 依賴身份語意建立成員與存取規則。

## 核心聚合 / 核心概念

- **`Identity`**
- **`AuthenticatedUser`**
- **`TokenRefreshSignal`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
