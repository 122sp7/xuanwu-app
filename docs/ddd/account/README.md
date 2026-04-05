# account — 帳戶設定檔上下文

> **Domain Type:** Generic Subdomain
> **模組路徑:** `modules/account/`
> **開發狀態:** ✅ Done — 穩定

## 定位

`account` 管理使用者在 Xuanwu 平台的**業務身份與存取控制**。與 `identity`（Firebase Auth）的區別是：`identity` 說「誰登入了」，`account` 說「這個人在系統中是什麼角色、有什麼權限」。

## 職責

| 能力 | 說明 |
|------|------|
| Account Profile | 建立、讀取、更新使用者 profile（displayName、avatarUrl、bio） |
| AccountPolicy | 附加存取控制策略到帳戶（policy rules → custom claims） |
| Custom Claims 刷新 | 監聽 TokenRefreshSignal，觸發 Firebase custom claims 更新 |
| Account 查詢 | CQRS 讀取側（AccountQueryRepository 分離） |

## 核心概念

- **`Account`** — 使用者在平台的業務記錄（非驗證記錄）
- **`AccountPolicy`** — 與帳戶綁定的存取控制政策，決定 custom claims 內容

## 邊界規則

`account/application/use-cases` 在伺服器端 import `identity/api`，因此 `identity/api` 不得含 Client Component 匯出。

## 跨 BC 關係

- **上游依賴：** `identity/api`（取得 uid）
- **下游消費者：** `organization`（MemberReference 參照 Account）、`workspace`（workspaceId ownerAccountId）

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | Account, AccountPolicy 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
