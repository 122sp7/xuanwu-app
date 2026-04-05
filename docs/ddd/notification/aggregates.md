# Aggregates ??notification

## ???對?NotificationEntity

### ?瑁痊
隞?”銝?頂蝯梢閮??恣????霈????

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ?銝駁 |
| `recipientId` | `string` | ?交?董??ID |
| `title` | `string` | ?璅? |
| `message` | `string` | ??批捆 |
| `type` | `NotificationType` | `info \| alert \| success \| warning` |
| `read` | `boolean` | ?臬撌脰? |
| `timestamp` | `number` | Unix timestamp嚗神蝘? |
| `sourceEventType` | `string?` | 閫貊甇日??隞園???|
| `metadata` | `Record<string, unknown>?` | ??????|

### 銝???

- `recipientId` 銝?箇征
- `title` 銝?箇征

---

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `NotificationRepository` | `save()`, `findByRecipient()`, `markAsRead()` |
