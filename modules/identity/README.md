# identity — Identity & Authentication Layer

> **開發狀態**：✅ Done — 核心功能完成
> **Domain Type**：Generic Domain（通用域）

`modules/identity` 負責使用者身分驗證、Token 管理與認證狀態管理。是整個平台的認證基礎設施，被其他所有模組依賴。

外界互動規則：
- `identity/api` 必須保持**無 `"use client"` 元件**，因為 `account/application` 等模組在 server 端 import 此 api
- 外界只能透過 `api/` 公開介面存取此模組

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 使用者認證 | Firebase Auth 整合，管理登入/登出狀態 |
| Token 管理 | JWT Token 刷新與驗證 |
| 認證狀態 | 提供 `useIdentity` hook 供 UI 層使用 |
| Token 刷新監聽 | `useTokenRefreshListener` 自動刷新 Token |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 身分 | Identity | 已認證使用者的身分記錄 |
| Token | Token | JWT 認證令牌 |
| 認證狀態 | AuthState | 目前的認證狀態（authenticated / unauthenticated） |
| 刷新監聽 | TokenRefreshListener | 監聽 Token 過期並自動刷新的機制 |

---

## 重要架構限制

- `identity/api` **不能**包含 `"use client"` hooks 或 React 元件
- `"use client"` 的 hooks（如 `useTokenRefreshListener`）只能在 `interfaces/hooks/` 下
- `account/application/use-cases` 在 server 端 import `identityApi`，必須保持純 server-safe

---

## 依賴關係

- **上游（依賴）**：Firebase Auth（外部服務）
- **下游（被依賴）**：所有模組（身分驗證基礎）

---

## 目錄結構

```
modules/identity/
├── api/                  # 公開 API（server-safe only，無 "use client"）
├── application/          # Use Cases
├── domain/               # Entities, Repositories
├── infrastructure/       # Firebase Auth 適配器
├── interfaces/           # UI hooks（useIdentity, useTokenRefreshListener）
│   └── hooks/
└── index.ts
```

---

## 架構參考

- 通用語言：`docs/architecture/ubiquitous-language.md`
