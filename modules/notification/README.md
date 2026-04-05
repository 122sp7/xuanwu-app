# notification — Notification Layer

> **開發狀態**：📅 Planned — 已規劃，尚未開始
> **Domain Type**：Generic Domain（通用域）

`modules/notification` 負責系統通知的生成、分發與管理。作為通用域，接收其他模組（knowledge、workspace、organization 等）發出的領域事件，轉換為使用者通知。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 通知生成 | 根據領域事件生成通知項目 |
| 通知分發 | 向指定使用者分發通知（in-app / email / push） |
| 已讀管理 | 管理通知的已讀/未讀狀態 |
| 通知偏好 | 管理使用者的通知偏好設定 |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `Notification` | 單一通知項目，含 recipientId、type、payload、readAt |
| `NotificationPreference` | 使用者的通知偏好設定 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 通知 | Notification | 系統向使用者發出的訊息提醒 |
| 接收者 | Recipient | 通知的目標使用者 |
| 通知類型 | NotificationType | 通知的種類（mention / invite / update / ...） |
| 已讀狀態 | ReadState | 通知的已讀/未讀標記 |
| 通知偏好 | NotificationPreference | 使用者對各類通知的訂閱偏好 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `notification.sent` | 通知發送完成時 |
| `notification.read` | 使用者標記已讀時 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（接收者身分）、其他所有模組（事件來源）
- **下游（被依賴）**：無（通知是最終消費者）

---

## 目錄結構

```
modules/notification/
├── api/                  # 公開 API 邊界
├── application/          # Use Cases
├── domain/               # Entities, Repositories
├── infrastructure/       # 通知分發適配器（Firebase Cloud Messaging / Email）
├── interfaces/           # UI 元件（通知列表、通知鈴）
└── index.ts
```
