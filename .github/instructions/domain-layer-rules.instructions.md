---
description: 'Domain Layer（領域層）戰略設計規則：業務純度、行為封裝、不變數保護、技術無關性。'
applyTo: 'src/modules/**/domain/**/*.{ts,tsx}'
---

# Domain Layer（領域層）設計規則

> 完整邊界參考：**先查 `docs/ubiquitous-language.md`、`docs/contexts/<context>/README.md`**
> 戰術設計範例（聚合根、值對象、Zod 驗證）請參考 `domain-modeling.instructions.md`。
> 此文件只包含 Domain Layer 層級的**戰略設計約束**。

## 戰略設計規則

1. Domain 層只表達業務規則，不包含技術實作（DB / API / Framework）。
2. Entity 必須封裝狀態與行為，禁止裸 set state。
3. Aggregate Root 是唯一外部進入 Domain 的入口。
4. Domain 不依賴 Application / Infrastructure / Interface。
5. Domain 變更只能透過行為方法（method），不能直接修改屬性。
6. Domain event 用於表達「業務事實」，不是技術事件。
7. Invariant（不變條件）必須在 Aggregate 內強制保護。
8. Domain 必須能在沒有 DB / HTTP 的情況下完整運作（pure logic）。

## 與其他層的關係

- `domain/` 是依賴方向的最內層，所有其他層指向它。
- `application/` 依賴 `domain/` 的 abstraction，不依賴 implementation。
- `infrastructure/` 實作 `domain/` 定義的 Port/Repository 介面。
- `interfaces/` 不得直接呼叫 `domain/` 內部，必須經由 `application/` 或模組 `index.ts`。

## 禁止模式

- ❌ 在 `domain/` 層匯入 Firebase、HTTP client、React、ORM。
- ❌ 貧血模型：只有 data properties，無 business logic。
- ❌ 跨聚合直接操作：在 Aggregate A 中修改 Aggregate B 的狀態。
- ❌ Domain event 命名使用現在式或技術術語。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill hexagonal-ddd
