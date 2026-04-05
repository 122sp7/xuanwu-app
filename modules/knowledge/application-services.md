# knowledge — Application Services

## Application Layer 職責

管理頁面（Page）與內容區塊（Block）的 CRUD 與排序操作。

## 實際檔案

- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-block.use-cases.ts`

## Use Cases 清單

| Use Case 類別 | 操作 |
|---|---|
| `CreatePageUseCase` | 建立頁面 |
| `RenamePageUseCase` | 重新命名頁面 |
| `MovePageUseCase` | 移動頁面層級 |
| `ArchivePageUseCase` | 歸檔頁面 |
| `ReorderPageBlocksUseCase` | 重排頁面 Block |
| `GetPageUseCase` | 取得單頁 |
| `ListPagesUseCase` | 取得帳戶所有頁面 |
| `GetPageTreeUseCase` | 取得頁面樹狀結構 |
| `AddBlockUseCase` | 新增 Block |
| `UpdateBlockUseCase` | 更新 Block 內容 |
| `DeleteBlockUseCase` | 刪除 Block |
| `ListBlocksUseCase` | 取得頁面所有 Block |
