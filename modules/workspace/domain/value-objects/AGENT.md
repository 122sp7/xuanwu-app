# domain/value-objects — Value Objects（值對象）

此目錄放 **以值相等判斷語意的 immutable domain objects**。

> Value Object 沒有自己的 identity；它的責任是封裝值語意、正規化與內建約束。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Primitive wrapper | `WorkspaceName` |
| 狀態 / 枚舉語意包裝 | `WorkspaceLifecycleState`、`WorkspaceVisibility` |
| 小型值結構 | `Address` |
| 值正規化與 equality 邏輯 | trim、canonicalize、value equality |

**判斷準則**：如果它沒有獨立 identity，且語意由值本身決定，就放這裡。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Aggregate Root / Entity | 應放 `domain/aggregates/` 或 `domain/entities/` |
| 跨多物件的業務規則 | 放 `domain/services/` |
| Repository / persistence code | 放 `ports/output/` 或 `infrastructure/` |
| DTO / read projection | 放 `application/dtos/` 或 query-side |
| Firebase、HTTP、React import | Value Object 必須 framework-free |

---

## 依賴箭頭

```txt
domain/aggregates
    -> domain/value-objects
domain/entities
    -> domain/value-objects
domain/services
    -> domain/value-objects
application/dtos
    -> domain/value-objects (type only, optional)
```

`domain/value-objects` 應盡量維持 leaf-like，**不可**依賴 `application/`、`infrastructure/`、`interfaces/`。