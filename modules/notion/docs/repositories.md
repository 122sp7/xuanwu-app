# Repositories & Output Ports — notion

本文件記錄 `notion` bounded context 的 repository interfaces 與 output ports。合并前，各介面存在於對應的獨立模組；合并後，統一由 `modules/notion/core/ports/output/` 定義。

## knowledge 子域（← modules/knowledge/）

| 介面 | 主要方法 | 現有位置 |
|------|---------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `verify()`, `requestReview()`, `assignOwner()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` | `modules/knowledge/domain/repositories/knowledge.repositories.ts` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` | `modules/knowledge/domain/repositories/knowledge.repositories.ts` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` | `modules/knowledge/domain/repositories/knowledge.repositories.ts` |
| `KnowledgeCollectionRepository` | `create()`, `rename()`, `addPage()`, `removePage()`, `addColumn()`, `archive()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` | `modules/knowledge/domain/repositories/knowledge.repositories.ts` |
| `BacklinkIndexRepository` | `upsert()`, `findByPageId()`, `findByTargetPageId()` | `modules/knowledge/domain/repositories/IBacklinkIndexRepository.ts` |

---

## authoring 子域（← modules/knowledge-base/）

| 介面 | 主要方法 | 現有位置 |
|------|---------|---------|
| `ArticleRepository` | `create()`, `update()`, `publish()`, `archive()`, `verify()`, `requestReview()`, `assignOwner()`, `findById()`, `listByOrganizationId()` | `modules/knowledge-base/domain/repositories/ArticleRepository.ts` |
| `CategoryRepository` | `create()`, `rename()`, `move()`, `delete()`, `findById()`, `listByOrganizationId()` | `modules/knowledge-base/domain/repositories/CategoryRepository.ts` |

---

## collaboration 子域（← modules/knowledge-collaboration/）

| 介面 | 主要方法 | 現有位置 |
|------|---------|---------|
| `ICommentRepository` | `create()`, `update()`, `delete()`, `resolve()`, `findById()`, `listByContentId()` | `modules/knowledge-collaboration/domain/repositories/ICommentRepository.ts` |
| `IPermissionRepository` | `grant()`, `revoke()`, `check()`, `listBySubjectId()` | `modules/knowledge-collaboration/domain/repositories/IPermissionRepository.ts` |
| `IVersionRepository` | `create()`, `restore()`, `label()`, `findById()`, `listByContentId()` | `modules/knowledge-collaboration/domain/repositories/IVersionRepository.ts` |

---

## database 子域（← modules/knowledge-database/）

| 介面 | 主要方法 | 現有位置 |
|------|---------|---------|
| `IDatabaseRepository` | `create()`, `rename()`, `addField()`, `updateField()`, `deleteField()`, `findById()`, `listByWorkspaceId()` | `modules/knowledge-database/domain/repositories/IDatabaseRepository.ts` |
| `IDatabaseRecordRepository` | `add()`, `update()`, `delete()`, `linkRecords()`, `unlinkRecords()`, `queryRecords()`, `findById()` | `modules/knowledge-database/domain/repositories/IDatabaseRecordRepository.ts` |
| `IViewRepository` | `create()`, `update()`, `delete()`, `findById()`, `listByDatabaseId()` | `modules/knowledge-database/domain/repositories/IViewRepository.ts` |
| `IAutomationRepository` | `create()`, `update()`, `delete()`, `listByDatabaseId()` | `modules/knowledge-database/domain/repositories/IAutomationRepository.ts` |

---

## Non-Repository Output Ports（規劃中）

合并後 notion 預期需要的非 repository output ports：

| Port | 說明 |
|------|------|
| `DomainEventPublisher` | 發布 notion 領域事件至訊息匯流排 |
| `FullTextSearchPort` | 全文搜尋索引寫入 |
| `AttachmentStoragePort` | 附件上傳與儲存 |
| `AiIngestionPort` | 觸發 AI RAG 攝入管線 |
| `NotificationGateway` | 傳送通知（協作留言、版本還原等） |

---

## Firebase 實作位置（現有）

| 模組 | Firebase 實作 |
|------|--------------|
| `modules/knowledge/` | `infrastructure/firebase/FirebaseKnowledgePageRepository.ts`, `FirebaseContentBlockRepository.ts`, `FirebaseContentCollectionRepository.ts`, `FirebaseBacklinkIndexRepository.ts` |
| `modules/knowledge-base/` | `infrastructure/firebase/FirebaseArticleRepository.ts`, `FirebaseCategoryRepository.ts` |
| `modules/knowledge-collaboration/` | `infrastructure/firebase/FirebaseCommentRepository.ts`, `FirebasePermissionRepository.ts`, `FirebaseVersionRepository.ts` |
| `modules/knowledge-database/` | `infrastructure/firebase/FirebaseDatabaseRepository.ts`, `FirebaseRecordRepository.ts`, `FirebaseViewRepository.ts`, `FirebaseAutomationRepository.ts` |

合并後，這些 Firebase 實作統一移至 `modules/notion/core/infrastructure/`。
