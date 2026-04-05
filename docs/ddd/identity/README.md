# identity — 身份驗證上下文

> **Domain Type:** Generic Subdomain
> **模組路徑:** `modules/identity/`
> **開發狀態:** ✅ Done — 穩定

## 定位

`identity` 是 Firebase Authentication 的 **domain 封裝層**。它是 IDDD 中的「通用子域」——身份驗證本身無業務差異化空間，但必須正確封裝以維持 domain 純淨。

所有已驗證的使用者狀態都從這裡出發；`account` 域消費 `identity/api` 取得身份上下文。

## 職責

| 能力 | 說明 |
|------|------|
| 登入 / 登出 | signIn（Email/Google OAuth）、signOut |
| Token 更新 | 監聽 Firebase token 刷新事件，發出 TokenRefreshSignal |
| 身份讀取 | 讀取當前已驗證使用者（uid、email、displayName） |

## 核心概念

- **`Identity`** — 代表已驗證的使用者（uid 是主鍵）
- **`TokenRefreshSignal`** — token 即將過期時發出的訊號，觸發 custom claims 更新

## 邊界規則

`identity/api` **不得**匯出任何 `"use client"` React 元件或 hooks。  
`account` 的 application use-cases 在伺服器端 import `identity/api`，若含 Client Component 會導致打包錯誤。

## 跨 BC 關係

- **下游消費者：** `account`（Customer/Supplier）

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | Identity 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
