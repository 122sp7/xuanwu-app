# AGENT.md ??notification BC

## 璅∠?摰?

`notification` ?舫??摮?嚗?鞎祉頂蝯梢?遣蝡??霈??

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `NotificationEntity` | Notification嚗???class ??嚗lert, Message嚗??粹嚗?|
| `recipientId` | userId, receiverId |
| `NotificationType` | Type, AlertLevel |
| `DispatchNotificationInput` | CreateNotification, SendNotification |

## ??閬?

### ???迂
```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ??蝳迫
```typescript
import { NotificationEntity } from "@/modules/notification/domain/entities/Notification";
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
