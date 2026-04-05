# AGENT.md — modules/notification

## 模組定位

`modules/notification` 是 Knowledge Platform 的**通用域（Generic Domain）**，負責系統通知的生成、分發與已讀管理。是領域事件的最終消費者，不發出自己的核心領域事件。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Notification`（不是 Alert、Message、Notice）
- `Recipient`（不是 User、Target）
- `NotificationType`（不是 Type、Category）
- `ReadState`（不是 Status、ReadFlag）
- `NotificationPreference`（不是 Settings、Config）

## 邊界規則

### ✅ 允許

```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ❌ 禁止

```typescript
import { Notification } from "@/modules/notification/domain/...";
```

## 事件訂閱模式

Notification 模組透過訂閱其他模組的領域事件來生成通知，不直接呼叫其他模組：

```typescript
// 事件訂閱範例
// knowledge.page_created → 生成「新頁面」通知給協作者
// organization.member_invited → 生成「邀請」通知給被邀請者
// workspace.member_joined → 生成「新成員」通知給工作區管理員
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `identity/api` | API 呼叫 | 驗證接收者身分 |
| `knowledge/api` | 事件訂閱 | 監聽知識更新事件 |
| `workspace/api` | 事件訂閱 | 監聽工作區成員變更事件 |
| `organization/api` | 事件訂閱 | 監聽組織成員邀請事件 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
