# domain/factories — Domain Factories（領域工廠）

此目錄放 **建立 aggregate、entity、value object、domain event 的工廠與 reconstitution helper**。

> Factory 的責任是「安全地建立有效模型」，不是持久化，也不是流程協調。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Aggregate factory | 建立 `Workspace` 的 factory function |
| Reconstitution helper | 從 persistence snapshot 重建 aggregate / entity |
| Value object parser / normalizer | 將 raw input 正規化成 VO |
| Domain event factory | 建立標準化 event payload |

**判斷準則**：若它的任務是把 raw data 轉成有效 domain model，而不是執行業務流程，就放這裡。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Repository / persistence code | 放 `infrastructure/` |
| Use case orchestration | 放 `application/use-cases/` 或 `application/services/` |
| React / Route Handler / CLI code | 放 `interfaces/` |
| 與模型建立無關的通用 utility | 不應混進 domain factory |

---

## 依賴箭頭

```txt
application/use-cases
    -> domain/factories
domain/factories
    -> domain/aggregates
domain/factories
    -> domain/entities|value-objects|events
```

`domain/factories` **不可**依賴 `infrastructure/`、`interfaces/`、`application/services/`。