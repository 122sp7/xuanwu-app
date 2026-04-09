# domain/entities — Entities（實體 / Supporting Domain Objects）

此目錄放 **具 identity 的 supporting domain objects**，它們屬於 domain model，但不是 aggregate root。

> Entity 可以有生命週期與 identity，但不承擔整個一致性邊界。那是 aggregate root 的責任。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Supporting Entity | `WorkspaceLocation`、`Capability` |
| Aggregate 內部帶 identity 的子物件 | 自訂角色、子節點、附屬記錄 |
| 過渡期既有 domain object | 尚未移入 `domain/aggregates/` 的 legacy entity |

**判斷準則**：如果它有 identity，但不作為整個寫入一致性的根，就放在這裡。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Aggregate Root | 放 `domain/aggregates/` |
| Value Object | 放 `domain/value-objects/` |
| Query-side projection / read model | 不應新增到這裡；應留在 query-side / DTO surface |
| DTO | 放 `application/dtos/` |
| Firebase、HTTP、React import | Domain entity 必須 framework-free |

---

## 依賴箭頭

```txt
domain/aggregates
    -> domain/entities
domain/services
    -> domain/entities
domain/entities
    -> domain/value-objects (optional)
```

`domain/entities` **不可**依賴 `application/`、`infrastructure/`、`interfaces/`、`ports/output/`。

---

## 注意事項

- 現有歷史 read model 若暫時還在此目錄，視為過渡態，不代表新檔案也應放這裡。
- 新增檔案時，先問自己：它是不是 aggregate root？是不是 value object？如果都不是，再考慮 entity。