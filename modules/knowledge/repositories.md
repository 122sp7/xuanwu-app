# knowledge — Repositories

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts`
  - `KnowledgePageRepository`
  - `KnowledgeBlockRepository`
  - `KnowledgeVersionRepository`
  - `KnowledgeCollectionRepository`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentCollectionRepository.ts`

## Firestore 路徑

- Page: `accounts/{accountId}/contentPages/{pageId}`
- Block: `accounts/{accountId}/contentBlocks/{blockId}`
- Collection: `accounts/{accountId}/knowledgeCollections/{collectionId}`

這與 Firestore 官方文件的 document / subcollection path 寫法一致，採 `doc(db, "accounts", accountId, ...)` 形式建立引用。

## KnowledgePageRepository 方法對照

| 方法 | 說明 |
|------|------|
| `create()` | 建立頁面 |
| `rename()` | 重命名 |
| `move()` | 移動層級 |
| `archive()` | 歸檔 |
| `reorderBlocks()` | 重排 Block |
| `approve()` | 設定 approvalState = approved |
| `verify()` | 設定 verificationState = verified |
| `requestReview()` | 設定 verificationState = needs_review |
| `assignOwner()` | 指派 ownerId |
| `findById()` | 取得單頁 |
| `listByAccountId()` | 列出帳戶所有頁面 |
| `listByWorkspaceId()` | 列出工作區所有頁面 |

## KnowledgeBlockRepository 方法對照

| 方法 | 說明 |
|------|------|
| `add()` | 新增 Block |
| `update()` | 更新 Block 內容 |
| `delete()` | 刪除 Block |
| `findById()` | 取得單一 Block |
| `listByPageId()` | 列出頁面所有 Block |

## KnowledgeCollectionRepository 方法對照

| 方法 | 說明 |
|------|------|
| `create()` | 建立 collection |
| `rename()` | 重新命名 |
| `addPage()` | 加入 page |
| `removePage()` | 移除 page |
| `addColumn()` | 新增 schema column |
| `archive()` | 封存 collection |
| `findById()` | 取得單一 collection |
| `listByAccountId()` | 列出帳戶所有 collections |
| `listByWorkspaceId()` | 列出工作區 collections |

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports
- `interfaces/queries` 直接 new Firebase repository 是目前做法，但跨 BC 不應跳過 `api/` 公開面
