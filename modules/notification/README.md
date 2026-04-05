# notification — 通知上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/notification/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notification` 提供跨平台的通知分發能力，將知識、工作流程與工作區互動轉成使用者可感知的訊息。它是典型平台配套能力，但對協作效率與回應速度很重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 通知分發 | 發送 info / alert / success / warning 等系統訊息 |
| 事件轉訊息 | 把其他上下文的事件轉成使用者可消費的通知 |
| 通知偏好支撐 | 配合 `account` 與 `workspace` 的偏好設定輸出通知行為 |

## 與其他 Bounded Context 協作

- `workspace-feed`、`workspace-flow`、`workspace` 等上下文會觸發通知需求。
- `account` 提供使用者偏好與收件對象語意。

## 核心聚合 / 核心概念

- **`NotificationEntity`**
- **`NotificationPayload`**
- **`NotificationPreference`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
