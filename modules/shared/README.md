# shared — Shared Domain Primitives

> **開發狀態**：✅ Done — 穩定維護中
> **Domain Type**：Shared Kernel（共享核心）

`modules/shared` 提供整個平台共用的 Value Objects、工具函數、事件基礎型別與共享基礎設施。所有其他模組都可以依賴 shared，但 shared 不能依賴任何其他業務模組。

外界互動規則：
- 所有模組均可直接 import `modules/shared`（不需要經過 api/）
- shared 的 export 必須是純粹的型別、值物件或工具函數，不能包含業務邏輯

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| DomainEvent 基礎型別 | `DomainEvent` 介面定義（含 `occurredAt` ISO string） |
| 共用 Value Objects | 跨模組使用的值物件（如 ID 型別、時間戳） |
| 共用工具函數 | 跨模組使用的純工具函數 |
| 共用基礎設施 | Firebase 初始化、共用 Firestore 適配器 |

---

## 核心型別

### DomainEvent

```typescript
// modules/shared/domain/events.ts
export interface DomainEvent {
  type: string;
  eventId: string;         // UUID
  occurredAt: string;      // ISO 8601 字串（不是 Date 物件）
  payload: Record<string, unknown>;
}
```

> ⚠️ 注意：欄位是 `occurredAt`（ISO string），不是 `occurredAtISO`、不是 `Date` 物件

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 領域事件 | DomainEvent | 所有領域事件的基礎介面 |
| 發生時間 | occurredAt | 事件發生的 ISO 8601 時間字串 |
| 事件 ID | eventId | 事件的唯一識別碼（UUID） |

---

## 重要約束

- `occurredAt` 必須是 **ISO string**，不能是 `Date` 物件（跨 Server/Client 序列化安全）
- shared 不能 import 任何業務模組（identity、knowledge、workspace 等）
- 放入 shared 的內容必須真正跨模組共用，單模組專用的不應放在 shared

---

## 目錄結構

```
modules/shared/
├── domain/               # 共用領域型別
│   └── events.ts         # DomainEvent 基礎介面
├── infrastructure/       # 共用基礎設施
│   └── firebase/         # Firebase 初始化
└── index.ts
```

---

## 架構參考

- 領域事件規範：`docs/architecture/domain-events.md`
