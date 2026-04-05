# Ubiquitous Language — identity

> **範圍：** 僅限 `modules/identity/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 身份 | Identity | Firebase Auth 驗證後的使用者記錄，以 `uid` 為唯一識別碼 | `modules/identity/domain/entities/` |
| 唯一身份碼 | uid | Firebase Authentication 產生的使用者全域唯一 ID | `Identity.uid` |
| Token 刷新訊號 | TokenRefreshSignal | 代表 Firebase ID token 需要更新的訊號物件 | `domain/entities/` |
| 登入 | signIn | 透過 Email 或 OAuth 建立 Firebase Auth session | `IdentityRepository.signIn()` |
| 登出 | signOut | 終止 Firebase Auth session | `IdentityRepository.signOut()` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Identity` | `User`, `AuthUser`, `CurrentUser` |
| `uid` | `userId`, `id`, `accountId`（在此 BC 內） |
| `TokenRefreshSignal` | `RefreshToken`, `TokenEvent` |
