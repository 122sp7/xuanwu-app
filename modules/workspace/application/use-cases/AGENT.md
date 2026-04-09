# application/use-cases — Use Cases（單一使用案例）

此目錄放 **一個 user goal / command / query 對應的一段應用層流程**。

> 一個 use case 只負責一個明確操作，不承擔長流程 saga，也不承擔純領域規則。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Command-side use case | `CreateWorkspaceUseCase`、`UpdateWorkspaceSettingsUseCase` |
| Query-side use case | `FetchWorkspaceMembersUseCase` |
| 單一使用案例的 orchestration | 載入 aggregate、呼叫 domain service、呼叫 output port、回傳 DTO |
| 薄型 use-case barrel | `workspace.use-cases.ts` |

**判斷準則**：如果它是在完成一個明確操作，例如「建立工作區」「更新設定」「取得成員列表」，就放這裡。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| 多步驟長流程 / Saga / Process Manager | 放 `application/services/` |
| 純業務規則（policy、guard、invariant） | 放 `domain/services/` 或 aggregate 本身 |
| React component、Route Handler、CLI handler | 放 `interfaces/` |
| Firebase / event bus concrete class 依賴 | 應透過 `ports/output/` |
| Firestore document mapping / converter | 放 `infrastructure/firebase/` |

---

## 命名慣例

```
create-<entity>.use-case.ts
update-<entity>.use-case.ts
fetch-<entity>.use-case.ts
<feature>.use-cases.ts        → barrel / group export only
```

## 依賴箭頭

```txt
interfaces/api|cli|web
    -> ports/input
    -> application/use-cases
application/use-cases
    -> application/dtos
application/use-cases
    -> domain/aggregates|entities|services
application/use-cases
    -> ports/output
```

`application/use-cases` **不可**依賴 `infrastructure/`、`interfaces/`。

---

## 與 Application Service 的分工

- 一個 use case = 一個明確操作
- 一個 application service = 協調多個 use case 或長流程
- 若覺得 use case 開始需要追蹤流程狀態、重試、去重、事件編排，就該搬去 `application/services/`