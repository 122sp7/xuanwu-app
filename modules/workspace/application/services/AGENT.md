# application/services — Application Services（應用服務 = 流程）

> **Application Service = 流程**
> 協調多個 use case 或跨 aggregate 的執行順序與事務邊界。
> 它不包含業務規則，那是 `domain/services/` 的責任。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Process Manager / Saga | `KnowledgeToWorkflowMaterializer`（Phase 3 移入） |
| 跨 aggregate 複合流程 | 需要協調兩個以上 output port 的流程 |
| 事件驅動流程 | 訂閱 domain event → 觸發多個 use case 的 orchestrator |
| 冪等性管理器 | 對外部事件去重、保證 at-most-once 處理 |

**判斷準則**：
- 單一 aggregate 的一個動作 → `application/use-cases/`
- 多個 use case 按順序執行，或需要跨越 aggregate 邊界協調 → **此處**

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| 業務規則計算（invariant、guard、policy） | 業務規則放 `domain/services/` |
| 單一 aggregate 的 CRUD 操作 | 放 `application/use-cases/` |
| UI 組裝、React component、Route Handler、CLI handler | 放 `interfaces/` |
| 直接依賴 Firebase / event bus implementation | 應透過 `ports/output/` |
| 持有長期狀態的 in-memory singleton | 冪等性狀態需持久化，不能只存在記憶體 |

---

## 與 Domain Service 的區別

| | Domain Service | Application Service |
|--|---------------|---------------------|
| **職責** | **邏輯**（業務規則） | **流程**（協調順序） |
| **狀態** | 無狀態 | 可能跨步驟維護流程狀態 |
| **依賴** | 只依賴 domain | 可依賴 use-cases、domain、ports |
| **範例** | `task-transition-policy.ts` | `KnowledgeToWorkflowMaterializer` |

---

## 命名慣例

```
<process>-manager.ts            → Process Manager（Saga）
<domain>-workflow.service.ts    → 跨 aggregate 流程協調
<event-topic>-handler.ts        → 事件驅動 orchestrator
```

## 依賴箭頭

```txt
application/use-cases
	-> application/services
application/services
	-> domain/services
application/services
	-> domain/aggregates|entities|events
application/services
	-> ports/output
```

`application/services` **不可**依賴 `infrastructure/`、`interfaces/`。

---

## Phase 3 預計移入

workspace-flow 合併後，Process Manager 將搬入此目錄：
- `KnowledgeToWorkflowMaterializer`（目前在 `workspace-flow/application/process-managers/`）

同時，其 in-memory 冪等性 Set 需替換為 Firestore persistent store（`infrastructure/firebase/MaterializedEventRepository`）。
