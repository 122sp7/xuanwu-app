# shared — 共享核心上下文

> **Domain Type:** Shared Kernel  
> **模組路徑:** `modules/shared/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`shared` 不是獨立業務能力，而是多個 bounded context 共同依賴的 Shared Kernel。它提供穩定共享的事件、值物件與工具型別，目標是減少重複而不形成隱性大泥球。

## 主要職責

| 能力 | 說明 |
|---|---|
| 共享型別 | 提供跨模組穩定共用的事件與值物件基礎型別 |
| 事件基礎語意 | 維持 `DomainEvent`、`EventRecord` 等跨域契約一致 |
| 工具與通用值物件 | 提供 slug、識別碼與其他低變動共享能力 |

## 與其他 Bounded Context 協作

- 所有上下文都可能依賴 `shared`，但只能消費穩定共享核心，不能把業務邏輯堆入此模組。
- `shared` 的變更需視為跨域契約變更處理。

## 核心聚合 / 核心概念

- **`DomainEvent`**
- **`EventRecord`**
- **`SlugUtils`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
