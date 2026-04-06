# knowledge — Application Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件記錄 `knowledge` 的 application layer 服務與 use cases。內容與 `modules/knowledge/application/` 實作保持一致。

## Application Layer 職責

管理知識頁面、內容區塊與版本歷史，是平台的核心知識內容領域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/block-service.ts`
- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-block.use-cases.ts`
- `application/use-cases/knowledge-collection.use-cases.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-version.use-cases.ts`

## Use Cases 清單

| Use Case 類別 | 操作 | UI 入口 |
|---|---|---|
| `CreateKnowledgePageUseCase` | 建立知識頁面 | PageTreeView `+` 按鈕 / "新增頁面" |
| `RenameKnowledgePageUseCase` | 重新命名頁面 | PageTreeView `…` 選單 → 行內 inline 輸入框 |
| `MoveKnowledgePageUseCase` | 移動頁面層級 | PageTreeView `…` 選單 → 「移動到」（待實作） |
| `ArchiveKnowledgePageUseCase` | 歸檔頁面（UI：移至垃圾桶） | PageTreeView `…` 選單 → 「移至垃圾桶」 |
| `PromoteKnowledgePageUseCase` | 提升頁面為 Article（D3 Promote 協議）：執行頁面驗證並發出 `knowledge.page_promoted` 事件 | 由 `knowledge-base` Server Action 觸發 |
| `ReorderKnowledgePageBlocksUseCase` | 重排頁面區塊 |
| `ApproveKnowledgePageUseCase` | 審批頁面（觸發整合事件） |
| `VerifyKnowledgePageUseCase` | 驗證頁面（Wiki Space 模式） |
| `RequestPageReviewUseCase` | 要求頁面審閱（Wiki Space 模式） |
| `AssignPageOwnerUseCase` | 指定頁面負責人（Wiki Space 模式） |
| `GetKnowledgePageUseCase` | 取得單頁 |
| `ListKnowledgePagesUseCase` | 取得帳戶所有頁面 |
| `GetKnowledgePageTreeUseCase` | 取得頁面樹狀結構 |
| `CreateKnowledgeCollectionUseCase` | 建立集合（Database / Wiki Space） |
| `RenameKnowledgeCollectionUseCase` | 重新命名集合 |
| `AddPageToCollectionUseCase` | 將頁面加入集合 |
| `RemovePageFromCollectionUseCase` | 從集合移除頁面 |
| `AddCollectionColumnUseCase` | 新增欄位（Database 模式） |
| `ArchiveKnowledgeCollectionUseCase` | 歸檔集合 |
| `GetKnowledgeCollectionUseCase` | 取得單一集合 |
| `ListKnowledgeCollectionsByAccountUseCase` | 取得帳戶所有集合 |
| `ListKnowledgeCollectionsByWorkspaceUseCase` | 取得工作區所有集合 |

## 設計對齊

- 模組 README：`../../../modules/knowledge/README.md`
- 模組 AGENT：`../../../modules/knowledge/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/knowledge/application-services.md`
