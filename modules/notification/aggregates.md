# Aggregates — notification

## 聚合根：NotificationEntity

### 職責
代表一則系統通知記錄。管理通知的發送與讀取狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 通知主鍵 |
| `recipientId` | `string` | 接收者帳戶 ID |
| `title` | `string` | 通知標題 |
| `message` | `string` | 通知內容 |
| `type` | `NotificationType` | `info \| alert \| success \| warning` |
| `read` | `boolean` | 是否已讀 |
| `timestamp` | `number` | Unix timestamp（毫秒） |
| `sourceEventType` | `string?` | 觸發此通知的事件類型 |
| `metadata` | `Record<string, unknown>?` | 附加元資料 |

### 不變數

- `recipientId` 不可為空
- `title` 不可為空

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `NotificationRepository` | `save()`, `findByRecipient()`, `markAsRead()` |
