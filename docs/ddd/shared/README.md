# shared — 共享核心

> **Domain Type:** Shared Kernel（共享核心）
> **模組路徑:** `modules/shared/`
> **開發狀態:** ✅ Done — 穩定

## 定位

`shared` 是 IDDD 的 **Shared Kernel** 模式實作。它不是一個完整的業務域，而是多個 BC 共同依賴的**最小共享基礎型別集**。任何新增都需要所有消費方共識。

## 內容

| 元素 | 型別 | 說明 |
|------|------|------|
| `DomainEvent` | Interface | 所有領域事件的基礎介面（`occurredAt: string` ISO） |
| `EventRecord` | Interface | 稽核/追蹤用的事件記錄基礎型別 |
| `SlugUtils` | Utility | URL-safe slug 生成工具 |
| 基礎型別 | Types | `ID`, `Timestamp` 等共用型別 |

## 重要規則

- `DomainEvent.occurredAt` 欄位名稱為 **`occurredAt`**（ISO string），**不是** `occurredAtISO`
- Shared Kernel 的任何變更需要所有消費模組的共識（IDDD 規則）
- 不要將業務邏輯放入 `shared/`

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | Shared Kernel 通用語言 |
| [aggregates.md](./aggregates.md) | 共享基礎型別 |
| [domain-events.md](./domain-events.md) | DomainEvent 基礎介面 |
| [context-map.md](./context-map.md) | 與所有 BC 的共享關係 |
