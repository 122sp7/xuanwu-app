# AGENT.md — modules/shared

## 模組定位

`modules/shared` 是 Knowledge Platform 的**共享核心（Shared Kernel）**，提供所有模組共用的 DomainEvent 基礎型別、Value Objects 和工具函數。

## 最重要規則：DomainEvent 欄位

```typescript
// ✅ 正確：occurredAt 是 ISO string
export interface DomainEvent {
  type: string;
  eventId: string;      // UUID
  occurredAt: string;   // ISO 8601，不是 Date 物件！
  payload: Record<string, unknown>;
}

// ❌ 禁止：不要用 occurredAtISO 或 Date 物件
occurredAtISO: string;  // 錯誤欄位名
occurredAt: Date;       // 跨 Server/Client 邊界序列化不安全
```

## shared 的邊界規則

### ✅ 允許 import shared 的模組

所有模組均可 import `@/modules/shared` — shared 是唯一允許被任意模組直接 import 的模組（不需要 api/）。

### ❌ shared 自身禁止 import 其他業務模組

```typescript
// ❌ 嚴禁：shared 不能依賴任何業務模組
import { Identity } from "@/modules/identity/...";
import { Workspace } from "@/modules/workspace/...";
```

## 放入 shared 的標準

只有滿足以下**全部**條件的內容才應放入 shared：
1. 被 3 個以上不同模組使用
2. 純粹是型別定義、值物件或工具函數
3. 不含任何業務邏輯或基礎設施依賴

## 跨模組互動

shared 只提供服務，不消費任何模組。所有模組均可依賴 shared。

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
