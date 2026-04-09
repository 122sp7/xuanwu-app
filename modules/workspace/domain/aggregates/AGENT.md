# domain/aggregates — Aggregate Roots（聚合根）

此目錄放 `workspace` BC 的所有 **Aggregate Root 類別**。
Aggregate Root 是 write-side 的一致性邊界。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Aggregate Root class | `Workspace`（含 invariant、domain event 發出） |
| Aggregate 內嵌的 command type | `CreateWorkspaceCommand`、`UpdateWorkspaceSettingsCommand` |
| Aggregate 上的 factory method 或 static constructor | `Workspace.create()`、`Task.create()` |

**判斷準則**：有自己的唯一識別、維護業務不變量（invariant）、
作為外部引用的根（其他 aggregate 只能持有其 ID）→ 放入此處。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| 純實體（Entity，無 invariant 責任） | 放 `domain/entities/` |
| Value Object（無 identity，equality by value） | 放 `domain/value-objects/` |
| Read model / projection（查詢用途） | 放 `interfaces/` 或 `application/dtos/` |
| Repository / Event Publisher 介面 | 放 `ports/output/` |
| Framework import（Firebase、React 等） | Aggregate 必須 framework-free |

---

## 現況

`Workspace` 已收斂到 `domain/aggregates/Workspace.ts`，目前這個目錄承載 workspace BC 的 write-side aggregate root。

後續 Phase 3（workspace-flow 合併）時，預計再補入：

| Aggregate Root | 來源 | 狀態 |
|---------------|------|------|
| `Workspace` | `domain/aggregates/Workspace.ts` | 已收斂 |
| `Task` | `workspace-flow` 合併 | Phase 3 |
| `Issue` | `workspace-flow` 合併 | Phase 3 |
| `Invoice` | `workspace-flow` 合併 | Phase 3 |

---

## 命名慣例

```
PascalCase.ts     → Aggregate Root 類別檔案
PascalCase.test.ts → 對應的單元測試
```

## 依賴方向

```
domain/aggregates → domain/value-objects
domain/aggregates → domain/entities
domain/aggregates → domain/events（發出事件型別）
domain/aggregates → domain/services（呼叫 domain service，如有需要）
```

`domain/aggregates` **不可**依賴 `application/`、`infrastructure/`、`interfaces/`。
