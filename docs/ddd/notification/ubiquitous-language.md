# Ubiquitous Language — notification

> **範圍：** 僅限 `modules/notification/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 通知 | NotificationEntity | 一則系統通知記錄（含標題、內容、類型、讀取狀態） |
| 接收者 ID | recipientId | 接收此通知的帳戶 ID |
| 通知類型 | NotificationType | `"info" \| "alert" \| "success" \| "warning"` |
| 分發通知輸入 | DispatchNotificationInput | 建立並發送通知的輸入物件 |
| 來源事件類型 | sourceEventType | 觸發此通知的業務事件類型（可選，用於追蹤） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `NotificationEntity` | `Notification`（避免與 JS Notification API 衝突） |
| `recipientId` | `userId`, `receiverId` |
