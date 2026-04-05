# account — 帳戶上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/account/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`account` 承接 `identity` 的已驗證身份，管理個人檔案、偏好設定與帳戶政策，讓平台具備使用者層級的個人化與權限落點。它位於平台基礎層，負責把「登入身份」轉成「可持久化的帳戶語意」。

## 主要職責

| 能力 | 說明 |
|---|---|
| 帳戶設定檔 | 維護顯示名稱、頭像、偏好與其他個人資料 |
| 帳戶政策 | 管理 AccountPolicy、custom claims 與存取控制輔助資訊 |
| 個人化入口 | 為組織、工作區與通知提供使用者側設定基礎 |

## 與其他 Bounded Context 協作

- `identity` 提供身份與 token 上下文。
- `organization`、`workspace` 與 `notification` 以帳戶資料作為使用者語意來源。

## 核心聚合 / 核心概念

- **`Account`**
- **`AccountPolicy`**
- **`AccountProfile`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
