# knowledge — Repositories

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts`
  - `KnowledgePageRepository` — 含 `verify()`, `requestReview()`, `assignOwner()` 等 Wiki Space 方法
  - `KnowledgeBlockRepository`
  - `KnowledgeVersionRepository`
  - `KnowledgeCollectionRepository`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseKnowledgePageRepository.ts`
  - 實作 `KnowledgePageRepository`，含 `verify()`, `requestReview()`, `assignOwner()` 三個新方法
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentCollectionRepository.ts`
  - 實作 `KnowledgeCollectionRepository`，`toKnowledgeCollection()` mapper 已對應 `spaceType` 欄位

## KnowledgePageRepository 方法對照

| 方法 | 說明 |
|------|------|
| `create()` | 建立頁面 |
| `rename()` | 重命名 |
| `move()` | 移動層級 |
| `archive()` | 歸檔 |
| `reorderBlocks()` | 重排區塊 |
| `approve()` | 審批（AI 草稿模式） |
| `verify()` | 驗證頁面（Wiki Space 模式） |
| `requestReview()` | 標記為待審閱（Wiki Space 模式） |
| `assignOwner()` | 指定頁面負責人 |
| `findById()` | 取得單頁 |
| `listByAccountId()` | 列出帳戶所有頁面 |
| `listByWorkspaceId()` | 列出工作區所有頁面 |

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/knowledge/repositories.md`
- `../../../modules/knowledge/aggregates.md`
