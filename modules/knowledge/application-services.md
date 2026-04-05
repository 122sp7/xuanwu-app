# knowledge — Application Services

## Application Layer 職責

管理頁面（Page）、內容區塊（Block）與過渡中的 `KnowledgeCollection` 的 CRUD、排序與 workflow orchestration。

## 實際檔案

- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-block.use-cases.ts`
- `application/use-cases/knowledge-collection.use-cases.ts`

## Use Cases 清單

| Use Case 類別 | 操作 |
|---|---|
| `CreateKnowledgePageUseCase` | 建立頁面 |
| `RenameKnowledgePageUseCase` | 重新命名頁面 |
| `MoveKnowledgePageUseCase` | 移動頁面層級 |
| `ArchiveKnowledgePageUseCase` | 歸檔頁面 |
| `ReorderKnowledgePageBlocksUseCase` | 重排頁面 Block IDs |
| `GetKnowledgePageUseCase` | 取得單頁 |
| `ListKnowledgePagesUseCase` | 取得帳戶所有頁面 |
| `GetKnowledgePageTreeUseCase` | 建立頁面樹狀結構 |
| `ApproveKnowledgePageUseCase` | 核准頁面並 publish `knowledge.page_approved` |
| `VerifyKnowledgePageUseCase` | 設為 verified |
| `RequestPageReviewUseCase` | 設為 needs_review |
| `AssignPageOwnerUseCase` | 指派 page owner |
| `AddKnowledgeBlockUseCase` | 新增 Block |
| `UpdateKnowledgeBlockUseCase` | 更新 Block 內容 |
| `DeleteKnowledgeBlockUseCase` | 刪除 Block |
| `ListKnowledgeBlocksUseCase` | 取得頁面所有 Block |
| `CreateKnowledgeCollectionUseCase` | 建立 collection |
| `RenameKnowledgeCollectionUseCase` | 重新命名 collection |
| `AddPageToCollectionUseCase` | 把 page 加入 collection |
| `RemovePageFromCollectionUseCase` | 從 collection 移除 page |
| `AddCollectionColumnUseCase` | 新增 collection column |
| `ArchiveKnowledgeCollectionUseCase` | 封存 collection |

## 已知差距

- `publishKnowledgeVersion` 目前回傳 not implemented
- `getKnowledgeVersions` 目前回傳空陣列
- approval / verify / owner workflow 已有 use case，但對應 UI 與完整 downstream materialization 尚未補齊
