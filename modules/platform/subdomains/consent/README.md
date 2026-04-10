# platform/subdomains/consent

## 子域職責

`consent` 子域負責同意管理與資料使用授權的正典邊界（獨立於 `compliance`）：

- 記錄主體對資料使用目的的明確同意（`ConsentRecord`）
- 管理同意版本化、撤回與更新通知
- 提供同意狀態查詢，供 `analytics`、`notification` 等子域在執行前進行前置確認

## 核心語言

| 術語 | 說明 |
|---|---|
| `ConsentRecord` | 主體對特定資料使用目的的同意記錄聚合根 |
| `ConsentPurpose` | 資料使用目的的具名定義（如 `analytics_tracking`、`marketing_email`） |
| `ConsentStatus` | 同意狀態（`granted`、`denied`、`withdrawn`、`pending`） |
| `ConsentVersion` | 同意聲明的版本（對應隱私政策版本） |
| `ConsentWithdrawal` | 主體撤回同意的不可變記錄 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RecordConsent`、`WithdrawConsent`、`CheckConsent`、`NotifyConsentUpdate`）
- `domain/`: `ConsentRecord`、`ConsentPurpose`、`ConsentVersion`
- `infrastructure/`: Firestore 同意記錄存取
- `interfaces/`: server action 接線、同意偏好設定 UI

## 整合規則

- `consent` 不是 `compliance` 的別名：compliance 負責法規執行，consent 負責主體意願管理
- `analytics`、`notification`、`integration` 等子域在操作前可查詢 `CheckConsent` 確認授權
- 父模組 public API（`@/modules/platform/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/platform/subdomains.md 建議建立
