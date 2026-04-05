# account — Account & Profile Layer

> **開發狀態**：✅ Done — 核心功能完成
> **Domain Type**：Generic Domain（通用域）

`modules/account` 負責使用者帳號的個人資料管理、偏好設定與帳號政策。與 `identity`（認證）不同，account 管理的是認證後的使用者資料層。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- `account/application` 在 server 端 import `identityApi`，因此 `identity/api` 必須保持 server-safe

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 個人資料 | 管理使用者個人資料（名稱、頭像、簡介） |
| 偏好設定 | 管理使用者的 UI 偏好與通知設定 |
| 帳號政策 | 執行帳號層級的存取政策 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 帳號 | Account | 已認證使用者的資料記錄（區別於 Identity） |
| 個人資料 | Profile | 帳號的公開個人資訊 |
| 偏好設定 | Preferences | 使用者的個人化設定 |
| 帳號政策 | AccountPolicy | 帳號層級的存取規則 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（身分驗證）、`organization/api`（組織政策）
- **下游（被依賴）**：`workspace/api`（工作區成員資訊）

---

## 目錄結構

```
modules/account/
├── api/                  # 公開 API 邊界
├── application/          # Use Cases（import identityApi from @/modules/identity/api）
│   └── use-cases/
│       ├── account-policy.use-cases.ts
│       └── account.use-cases.ts
├── domain/               # Entities, Repositories
├── infrastructure/       # Firebase 適配器
├── interfaces/           # UI 元件、hooks
└── index.ts
```
