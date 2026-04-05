# notification — 通知上下文

> **Domain Type:** Generic Subdomain
> **模組路徑:** `modules/notification/`
> **開發狀態:** 🏗️ Midway

## 定位

`notification` 負責向平台使用者分發系統通知。是典型的通用子域——通知機制本身無差異化空間。

## 職責

| 能力 | 說明 |
|------|------|
| 通知分發 | 建立並發送通知到指定接收者 |
| 通知讀取 | 標記通知為已讀 |
| 通知查詢 | 列出使用者未讀/全部通知 |

## 通知類型

```
NotificationType: "info" | "alert" | "success" | "warning"
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | NotificationEntity 設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
