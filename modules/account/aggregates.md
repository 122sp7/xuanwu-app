# Aggregates — account

## 聚合根：Account

### 職責
代表使用者在 Xuanwu 平台的業務身份記錄。管理 profile 資訊與帳戶狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 帳戶主鍵（對應 Firebase uid） |
| `displayName` | `string` | 顯示名稱 |
| `email` | `string` | Email |
| `avatarUrl` | `string \| null` | 頭像 URL |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變數

- 每個 Account 對應唯一一個 Firebase uid
- Account 建立後 id 不可變更

---

## 聚合根：AccountPolicy

### 職責
代表附加到帳戶的存取控制政策，定義哪些資源可存取、哪些動作被允許，並映射到 Firebase custom claims。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Policy 主鍵 |
| `accountId` | `string` | 關聯的 Account ID |
| `rules` | `PolicyRule[]` | 存取控制規則列表 |
| `effect` | `"allow" \| "deny"` | 規則效果 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AccountRepository` | `save()`, `findById()`, `delete()` |
| `AccountQueryRepository` | `findById()`, `findByEmail()` |
| `AccountPolicyRepository` | `save()`, `findByAccountId()` |
