# Application Services — knowledge-base

> Use Case 一個檔案一個操作，呼叫 Domain Services / Repository 介面，回傳 `CommandResult`。

---

## Article Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateArticleUseCase` | title, content, categoryId, tags, workspaceId | `CommandResult<ArticleId>` | 建立草稿文章 |
| `UpdateArticleUseCase` | articleId, title?, content?, tags? | `CommandResult` | 更新文章內容，version bump |
| `PublishArticleUseCase` | articleId | `CommandResult` | 將草稿轉為已發布 |
| `ArchiveArticleUseCase` | articleId | `CommandResult` | 封存文章（軟刪除） |
| `VerifyArticleUseCase` | articleId, verifiedByUserId, expiresAtISO? | `CommandResult` | 設定文章為已驗證 |
| `RequestArticleReviewUseCase` | articleId, requestedByUserId | `CommandResult` | 標記文章需要複核 |
| `AssignArticleOwnerUseCase` | articleId, ownerId | `CommandResult` | 指派文章負責人 |
| `TransferArticleCategoryUseCase` | articleId, targetCategoryId | `CommandResult` | 移動文章到另一分類 |
| `ExtractArticleBacklinksUseCase` | articleId | `CommandResult` | 從 content 解析並更新 linkedArticleIds |

## Category Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateCategoryUseCase` | name, parentCategoryId?, workspaceId | `CommandResult<CategoryId>` | 建立分類目錄 |
| `RenameCategoryUseCase` | categoryId, name | `CommandResult` | 重新命名分類 |
| `MoveCategoryUseCase` | categoryId, targetParentId | `CommandResult` | 移動分類到新父節點（深度驗證） |
| `DeleteCategoryUseCase` | categoryId | `CommandResult` | 刪除空白分類 |

---

## 範例 — CreateArticleUseCase

```typescript
// modules/knowledge-base/application/use-cases/create-article.use-case.ts
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import type { CommandResult } from "@shared-types";
import { generateId } from "@shared-utils";

export class CreateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<CommandResult<{ articleId: string }>> {
    const articleId = generateId();
    const now = new Date().toISOString();

    await this.repo.save({
      id: articleId,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      categoryId: input.categoryId ?? null,
      title: input.title,
      content: input.content ?? "",
      tags: input.tags ?? [],
      status: "draft",
      version: 1,
      verificationState: "unverified",
      ownerId: null,
      verifiedByUserId: null,
      verifiedAtISO: null,
      verificationExpiresAtISO: null,
      linkedArticleIds: [],
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });

    return { success: true, data: { articleId } };
  }
}
```
