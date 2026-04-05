# AGENT.md — notification BC

## 模組定位

`notification` 是通知分發的通用子域，負責系統通知的建立、發送與讀取。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `NotificationEntity` | Notification（作為 class 名），Alert, Message（作為通知） |
| `recipientId` | userId, receiverId |
| `NotificationType` | Type, AlertLevel |
| `DispatchNotificationInput` | CreateNotification, SendNotification |

## 邊界規則

### ✅ 允許
```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ❌ 禁止
```typescript
import { NotificationEntity } from "@/modules/notification/domain/entities/Notification";
```

## 驗證命令

```bash
npm run lint
npm run build
```
