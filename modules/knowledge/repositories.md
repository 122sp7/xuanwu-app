# knowledge — Repositories

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts`
  - `PageRepository`（原 KnowledgePageRepository）
  - `BlockRepository`（原 KnowledgeBlockRepository）

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`

## PageRepository 方法對照

| 方法 | 說明 |
|------|------|
| `create()` | 建立頁面 |
| `rename()` | 重命名 |
| `move()` | 移動層級 |
| `archive()` | 歸檔 |
| `reorderBlocks()` | 重排 Block |
| `findById()` | 取得單頁 |
| `listByAccountId()` | 列出帳戶所有頁面 |
| `listByWorkspaceId()` | 列出工作區所有頁面 |

## BlockRepository 方法對照

| 方法 | 說明 |
|------|------|
| `add()` | 新增 Block |
| `update()` | 更新 Block 內容 |
| `delete()` | 刪除 Block |
| `reorder()` | 重排 Block 順序 |
| `findById()` | 取得單一 Block |
| `listByPageId()` | 列出頁面所有 Block |

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports
