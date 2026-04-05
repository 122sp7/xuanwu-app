# Aggregates — identity

## 聚合根：Identity

### 職責
代表一個已通過 Firebase Authentication 驗證的使用者。提供讀取身份資訊的能力。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | Firebase UID（主鍵） |
| `email` | `string \| null` | 使用者 Email |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 頭像 URL |

### 不變數

- `uid` 永遠不為空（由 Firebase 保證）
- `Identity` 物件是唯讀的（由 Firebase Auth SDK 產生）

---

## 值物件：TokenRefreshSignal

### 職責
代表「token 需要刷新」的事件訊號，觸發 `account` 域更新 custom claims。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | 需要刷新 token 的使用者 UID |
| `occurredAt` | `string` | ISO 8601 時間戳 |

---

## Repository Interfaces

| 介面 | 主要方法 | 說明 |
|------|---------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth 操作 |
| `TokenRefreshRepository` | `listenToTokenRefresh()` | 監聽 token 刷新事件 |
