# Files

## File: modules/notion/AGENT.md
````markdown
# Notion Agent

> Strategic agent documentation: [docs/contexts/notion/AGENT.md](../../docs/contexts/notion/AGENT.md)

## Mission

保護 notion 主域作為知識內容生命週期邊界。

## Route Here When

- 問題核心是知識頁面、文章、內容結構、分類、關聯、模板與發布。
- 問題需要把輸入吸收成正式知識內容的正典狀態。
- 問題需要定義內容版本、內容協作與內容交付。

## Route Elsewhere When

- 身份、租戶、授權、權益、憑證治理屬於 platform。
- 工作區生命週期、共享、存在感與工作區流程屬於 workspace。
- notebook、conversation、retrieval、grounding、synthesis 屬於 notebooklm。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order (Strangler Pattern)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration:
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
````

## File: modules/notion/docs/README.md
````markdown
# Notion Documentation

Implementation-level documentation for the notion bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/notion/`:

- [README.md](../../../docs/contexts/notion/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/notion/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/notion/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/notion/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/notion/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Conflict Resolution

- Strategic docs in `docs/contexts/notion/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
````

## File: modules/notion/domain/.gitkeep
````

````

## File: modules/notion/infrastructure/.gitkeep
````

````

## File: modules/notion/interfaces/.gitkeep
````

````

## File: modules/notion/subdomains/attachments/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/attachments/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'attachments'.
````

## File: modules/notion/subdomains/attachments/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'attachments'.
````

## File: modules/notion/subdomains/attachments/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'attachments'.
````

## File: modules/notion/subdomains/authoring/api/factories.ts
````typescript
import { FirebaseArticleRepository } from "../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../infrastructure/firebase/FirebaseCategoryRepository";

export function makeArticleRepo() {
  return new FirebaseArticleRepository();
}

export function makeCategoryRepo() {
  return new FirebaseCategoryRepository();
}
````

## File: modules/notion/subdomains/authoring/api/index.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// ─── Read contracts ────────────────────────────────────────────────────────────
export type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../domain/aggregates/Article";
export type { CategorySnapshot } from "../domain/aggregates/Category";

// ─── Identifiers used by other BCs ────────────────────────────────────────────
export type ArticleId = string;
export type CategoryId = string;

// ─── Server Actions (write-side) ──────────────────────────────────────────────
export {
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
  deleteArticle,
} from "../interfaces/_actions/article.actions";

export {
  createCategory,
  renameCategory,
  moveCategory,
  deleteCategory,
} from "../interfaces/_actions/category.actions";

// ─── Queries (read-side) ──────────────────────────────────────────────────────
export { getArticles, getArticle, getCategories, getBacklinks } from "../interfaces/queries";

// ─── UI Components ────────────────────────────────────────────────────────────
export { ArticleDialog } from "../interfaces/components/ArticleDialog";
export { KnowledgeBaseArticlesRouteScreen } from "../interfaces/components/KnowledgeBaseArticlesRouteScreen";
export { ArticleDetailPage } from "../interfaces/components/ArticleDetailPage";
export type { ArticleDetailPageProps } from "../interfaces/components/ArticleDetailPage";
````

## File: modules/notion/subdomains/authoring/application/dto/ArticleDto.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/dto
 * Purpose: Zod schemas for Article CQRS inputs.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

export const CreateArticleSchema = AccountScopeSchema.extend({
  title: z.string().min(1).max(256),
  content: z.string().default(""),
  categoryId: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  createdByUserId: z.string().min(1),
});

export const UpdateArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  title: z.string().min(1).max(256).optional(),
  content: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const PublishArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const ArchiveArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const DeleteArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const VerifyArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  verifiedByUserId: z.string().min(1),
  expiresAtISO: z.string().optional(),
});

export const RequestArticleReviewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
````

## File: modules/notion/subdomains/authoring/application/dto/authoring.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the authoring subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../domain/aggregates/Article";
export type { CategorySnapshot } from "../../domain/aggregates/Category";
````

## File: modules/notion/subdomains/authoring/application/dto/CategoryDto.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/dto
 * Purpose: Zod schemas for Category CQRS inputs.
 */

import { z } from "@lib-zod";

export const CreateCategorySchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
  name: z.string().min(1).max(128),
  parentCategoryId: z.string().nullable().default(null),
  depth: z.number().int().min(0).default(0),
  description: z.string().nullable().default(null),
  createdByUserId: z.string().min(1),
});

export const RenameCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(128),
});

export const MoveCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  newParentCategoryId: z.string().nullable(),
  newDepth: z.number().int().min(0),
});

export const DeleteCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
````

## File: modules/notion/subdomains/authoring/application/dto/index.ts
````typescript
export {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  DeleteArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
} from "./ArticleDto";

export {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "./CategoryDto";
````

## File: modules/notion/subdomains/authoring/application/use-cases/ArticleLifecycleUseCases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article lifecycle use cases ??create, update, archive, delete.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { Article } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  ArchiveArticleSchema,
  DeleteArticleSchema,
} from "../dto/ArticleDto";

export class CreateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult> {
    const parsed = CreateArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const article = Article.create(generateId(), {
      accountId: parsed.data.accountId,
      workspaceId: parsed.data.workspaceId,
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
      createdByUserId: parsed.data.createdByUserId,
    });
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, 1);
  }
}

export class UpdateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult> {
    const parsed = UpdateArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.update({
      title: parsed.data.title,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId,
      tags: parsed.data.tags,
    });
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}

export class ArchiveArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult> {
    const parsed = ArchiveArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.archive();
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}

export class DeleteArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult> {
    const parsed = DeleteArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, 0);
  }
}
````

## File: modules/notion/subdomains/authoring/application/use-cases/ArticlePublicationUseCases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article publication use case.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { Article } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import { PublishArticleSchema } from "../dto/ArticleDto";

export class PublishArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult> {
    const parsed = PublishArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    try {
      article.publish();
    } catch (e) {
      return commandFailureFrom("ARTICLE_PUBLISH_REJECTED", e instanceof Error ? e.message : "Cannot publish");
    }
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}
````

## File: modules/notion/subdomains/authoring/application/use-cases/ArticleVerificationUseCases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article verification use cases ??verify and request review.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { Article } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import { VerifyArticleSchema, RequestArticleReviewSchema } from "../dto/ArticleDto";

export class VerifyArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult> {
    const parsed = VerifyArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.verify(parsed.data.verifiedByUserId, parsed.data.expiresAtISO);
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}

export class RequestArticleReviewUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult> {
    const parsed = RequestArticleReviewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.requestReview();
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}
````

## File: modules/notion/subdomains/authoring/application/use-cases/CategoryUseCases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Category use cases ??create, rename, move, delete.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { Category } from "../../domain/aggregates/Category";
import type { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../dto/CategoryDto";

export class CreateCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
    const parsed = CreateCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const category = Category.create(generateId(), {
      accountId: parsed.data.accountId,
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      parentCategoryId: parsed.data.parentCategoryId,
      depth: parsed.data.depth,
      description: parsed.data.description,
      createdByUserId: parsed.data.createdByUserId,
    });
    await this.repo.save(category.getSnapshot());
    return commandSuccess(category.id, 1);
  }
}

export class RenameCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
    const parsed = RenameCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    const category = Category.reconstitute(snapshot);
    category.rename(parsed.data.name);
    await this.repo.save(category.getSnapshot());
    return commandSuccess(category.id, 1);
  }
}

export class MoveCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
    const parsed = MoveCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    const category = Category.reconstitute(snapshot);
    category.move(parsed.data.newParentCategoryId, parsed.data.newDepth);
    await this.repo.save(category.getSnapshot());
    return commandSuccess(category.id, 0);
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult> {
    const parsed = DeleteCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, 0);
  }
}
````

## File: modules/notion/subdomains/authoring/domain/aggregates/Article.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/aggregates
 * Purpose: Article aggregate root — lifecycle, publication, and verification of KB articles.
 */

import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export type ArticleStatus = "draft" | "published" | "archived";
export type ArticleVerificationState = "verified" | "needs_review" | "unverified";

export interface ArticleSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly status: ArticleStatus;
  readonly version: number;
  readonly verificationState: ArticleVerificationState;
  readonly ownerId: string | null;
  readonly verifiedByUserId: string | null;
  readonly verifiedAtISO: string | null;
  readonly verificationExpiresAtISO: string | null;
  readonly linkedArticleIds: readonly string[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateArticleInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly content: string;
  readonly tags: string[];
  readonly createdByUserId: string;
}

export class Article {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: ArticleSnapshot) {}

  static create(id: string, input: CreateArticleInput): Article {
    const now = new Date().toISOString();
    const article = new Article({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      categoryId: input.categoryId,
      title: input.title,
      content: input.content,
      tags: input.tags,
      status: "draft",
      version: 1,
      verificationState: "unverified",
      ownerId: input.createdByUserId,
      verifiedByUserId: null,
      verifiedAtISO: null,
      verificationExpiresAtISO: null,
      linkedArticleIds: [],
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    article._domainEvents.push({
      type: "notion.authoring.article_created",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { articleId: id, accountId: input.accountId, workspaceId: input.workspaceId, title: input.title },
    });
    return article;
  }

  static reconstitute(snapshot: ArticleSnapshot): Article {
    return new Article({ ...snapshot });
  }

  update(fields: { title?: string; content?: string; categoryId?: string | null; tags?: string[] }): void {
    if (this._props.status === "archived") throw new Error("Cannot update archived article.");
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      title: fields.title ?? this._props.title,
      content: fields.content ?? this._props.content,
      categoryId: fields.categoryId !== undefined ? fields.categoryId : this._props.categoryId,
      tags: fields.tags ?? this._props.tags,
      updatedAtISO: now,
    };
  }

  publish(): void {
    if (this._props.status !== "draft") throw new Error("Only draft articles can be published.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "published", version: this._props.version + 1, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.authoring.article_published",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { articleId: this._props.id, accountId: this._props.accountId, version: this._props.version },
    });
  }

  archive(): void {
    if (this._props.status === "archived") throw new Error("Article is already archived.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.authoring.article_archived",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { articleId: this._props.id, accountId: this._props.accountId },
    });
  }

  verify(byUserId: string, expiresAtISO?: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      verificationState: "verified",
      verifiedByUserId: byUserId,
      verifiedAtISO: now,
      verificationExpiresAtISO: expiresAtISO ?? null,
      updatedAtISO: now,
    };
  }

  requestReview(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, verificationState: "needs_review", updatedAtISO: now };
  }

  getSnapshot(): ArticleSnapshot {
    return { ...this._props };
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
  get status(): ArticleStatus { return this._props.status; }
}
````

## File: modules/notion/subdomains/authoring/domain/aggregates/Category.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/aggregates
 * Purpose: Category aggregate root — hierarchical article organisation.
 */

import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export interface CategorySnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly parentCategoryId: string | null;
  readonly depth: number;
  readonly articleIds: readonly string[];
  readonly description: string | null;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateCategoryInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly parentCategoryId: string | null;
  readonly depth: number;
  readonly description: string | null;
  readonly createdByUserId: string;
}

export class Category {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: CategorySnapshot) {}

  static create(id: string, input: CreateCategoryInput): Category {
    const now = new Date().toISOString();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return new Category({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      name: input.name,
      slug,
      parentCategoryId: input.parentCategoryId,
      depth: input.depth,
      articleIds: [],
      description: input.description,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: CategorySnapshot): Category {
    return new Category({ ...snapshot });
  }

  rename(newName: string): void {
    const now = new Date().toISOString();
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    this._props = { ...this._props, name: newName, slug, updatedAtISO: now };
  }

  move(newParentId: string | null, newDepth: number): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, parentCategoryId: newParentId, depth: newDepth, updatedAtISO: now };
  }

  getSnapshot(): CategorySnapshot {
    return { ...this._props };
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
}
````

## File: modules/notion/subdomains/authoring/domain/aggregates/index.ts
````typescript
export { Article } from "./Article";
export type { ArticleSnapshot, ArticleStatus, ArticleVerificationState, CreateArticleInput } from "./Article";
export { Category } from "./Category";
export type { CategorySnapshot, CreateCategoryInput } from "./Category";
````

## File: modules/notion/subdomains/authoring/domain/events/AuthoringEvents.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/events
 * Purpose: Published event discriminated-union types for authoring subdomain.
 */

export interface AuthoringArticleCreatedEvent {
  readonly type: "notion.authoring.article_created";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}

export interface AuthoringArticlePublishedEvent {
  readonly type: "notion.authoring.article_published";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
    readonly version: number;
  };
}

export interface AuthoringArticleArchivedEvent {
  readonly type: "notion.authoring.article_archived";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
  };
}
````

## File: modules/notion/subdomains/authoring/domain/events/index.ts
````typescript
// Domain events are inlined in the Article aggregate as NotionDomainEvent payloads.
// Event types surfaced here for listener/consumer use.

export type { AuthoringArticleCreatedEvent } from "./AuthoringEvents";
export type { AuthoringArticlePublishedEvent } from "./AuthoringEvents";
export type { AuthoringArticleArchivedEvent } from "./AuthoringEvents";


export {};
````

## File: modules/notion/subdomains/authoring/domain/events/NotionDomainEvent.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/events
 * Purpose: Base interface for Notion Authoring domain events.
 */

export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO 8601 string
  readonly type: string;
  readonly payload: object;
}
````

## File: modules/notion/subdomains/authoring/domain/repositories/IArticleRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/repositories
 * Purpose: Article persistence contract (driven port).
 */

import type { ArticleSnapshot, ArticleStatus } from "../aggregates/Article";

export interface IArticleRepository {
  getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null>;
  list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]>;
  listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]>;
  save(snapshot: ArticleSnapshot): Promise<void>;
  delete(accountId: string, articleId: string): Promise<void>;
}
````

## File: modules/notion/subdomains/authoring/domain/repositories/ICategoryRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/repositories
 * Purpose: Category persistence contract (driven port).
 */

import type { CategorySnapshot } from "../aggregates/Category";

export interface ICategoryRepository {
  getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]>;
  save(snapshot: CategorySnapshot): Promise<void>;
  delete(accountId: string, categoryId: string): Promise<void>;
}
````

## File: modules/notion/subdomains/authoring/domain/repositories/index.ts
````typescript
// TODO: export IArticleRepository, ICategoryRepository

export type { IArticleRepository } from "./IArticleRepository";
export type { ICategoryRepository } from "./ICategoryRepository";
````

## File: modules/notion/subdomains/authoring/domain/services/index.ts
````typescript
// No domain services required for initial authoring subdomain scope.
export {};
````

## File: modules/notion/subdomains/authoring/domain/value-objects/index.ts
````typescript
// Value types are co-located in aggregates (Article.ts, Category.ts).
// Re-export for convenience:
export type { ArticleStatus, ArticleVerificationState } from "../aggregates/Article";
````

## File: modules/notion/subdomains/authoring/infrastructure/firebase/FirebaseArticleRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

function articlesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "kbArticles");
}

function articleDoc(db: ReturnType<typeof getFirestore>, accountId: string, articleId: string) {
  return doc(db, "accounts", accountId, "kbArticles", articleId);
}

function toSnapshot(id: string, data: Record<string, unknown>): ArticleSnapshot {
  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    categoryId: typeof data.categoryId === "string" ? data.categoryId : null,
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
    tags: Array.isArray(data.tags)
      ? (data.tags as unknown[]).filter((t): t is string => typeof t === "string")
      : [],
    status: (data.status as ArticleStatus) ?? "draft",
    version: typeof data.version === "number" ? data.version : 1,
    verificationState: (data.verificationState as ArticleVerificationState) ?? "unverified",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : null,
    verifiedByUserId: typeof data.verifiedByUserId === "string" ? data.verifiedByUserId : null,
    verifiedAtISO: typeof data.verifiedAtISO === "string" ? data.verifiedAtISO : null,
    verificationExpiresAtISO:
      typeof data.verificationExpiresAtISO === "string" ? data.verificationExpiresAtISO : null,
    linkedArticleIds: Array.isArray(data.linkedArticleIds)
      ? (data.linkedArticleIds as unknown[]).filter((l): l is string => typeof l === "string")
      : [],
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseArticleRepository implements IArticleRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
    const db = this.db();
    const snap = await getDoc(articleDoc(db, accountId, articleId));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]> {
    const db = this.db();
    const constraints = [
      where("workspaceId", "==", params.workspaceId),
      ...(params.categoryId ? [where("categoryId", "==", params.categoryId)] : []),
      ...(params.status ? [where("status", "==", params.status)] : []),
      orderBy("updatedAtISO", "desc"),
    ];
    const q = query(articlesCol(db, params.accountId), ...constraints);
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
    const db = this.db();
    const q = query(
      articlesCol(db, accountId),
      where("linkedArticleIds", "array-contains", articleId),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: ArticleSnapshot): Promise<void> {
    const db = this.db();
    const { id, accountId, ...rest } = snapshot;
    await setDoc(articleDoc(db, accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, articleId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(articleDoc(db, accountId, articleId));
  }
}
````

## File: modules/notion/subdomains/authoring/infrastructure/firebase/FirebaseCategoryRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { CategorySnapshot } from "../../domain/aggregates/Category";
import type { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";

function categoriesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "kbCategories");
}

function categoryDoc(db: ReturnType<typeof getFirestore>, accountId: string, categoryId: string) {
  return doc(db, "accounts", accountId, "kbCategories", categoryId);
}

function toSnapshot(id: string, data: Record<string, unknown>): CategorySnapshot {
  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    name: typeof data.name === "string" ? data.name : "",
    slug: typeof data.slug === "string" ? data.slug : "",
    parentCategoryId: typeof data.parentCategoryId === "string" ? data.parentCategoryId : null,
    depth: typeof data.depth === "number" ? data.depth : 0,
    articleIds: Array.isArray(data.articleIds)
      ? (data.articleIds as unknown[]).filter((a): a is string => typeof a === "string")
      : [],
    description: typeof data.description === "string" ? data.description : null,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseCategoryRepository implements ICategoryRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null> {
    const db = this.db();
    const snap = await getDoc(categoryDoc(db, accountId, categoryId));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
    const db = this.db();
    const q = query(
      categoriesCol(db, accountId),
      where("workspaceId", "==", workspaceId),
      orderBy("depth", "asc"),
      orderBy("name", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: CategorySnapshot): Promise<void> {
    const db = this.db();
    const { id, accountId, ...rest } = snapshot;
    await setDoc(categoryDoc(db, accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, categoryId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(categoryDoc(db, accountId, categoryId));
  }
}
````

## File: modules/notion/subdomains/authoring/infrastructure/firebase/index.ts
````typescript
// TODO: export FirebaseArticleRepository, FirebaseCategoryRepository

export { FirebaseArticleRepository } from "./FirebaseArticleRepository";
export { FirebaseCategoryRepository } from "./FirebaseCategoryRepository";
````

## File: modules/notion/subdomains/authoring/infrastructure/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/subdomains/authoring/interfaces/_actions/article.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Article Server Actions — thin adapter over article use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeArticleRepo } from "../../api/factories";
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
} from "../../application/use-cases/ArticleLifecycleUseCases";
import { PublishArticleUseCase } from "../../application/use-cases/ArticlePublicationUseCases";
import {
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
} from "../../application/use-cases/ArticleVerificationUseCases";
import type { z } from "@lib-zod";
import type {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  DeleteArticleSchema,
} from "../../application/dto/ArticleDto";

export async function createArticle(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult> {
  try {
    return await new CreateArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function updateArticle(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult> {
  try {
    return await new UpdateArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_UPDATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function publishArticle(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult> {
  try {
    return await new PublishArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_PUBLISH_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function archiveArticle(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult> {
  try {
    return await new ArchiveArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function verifyArticle(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult> {
  try {
    return await new VerifyArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_VERIFY_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function requestArticleReview(
  input: z.infer<typeof RequestArticleReviewSchema>,
): Promise<CommandResult> {
  try {
    return await new RequestArticleReviewUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_REVIEW_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteArticle(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult> {
  try {
    return await new DeleteArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
````

## File: modules/notion/subdomains/authoring/interfaces/_actions/category.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Category Server Actions — thin adapter over category use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCategoryRepo } from "../../api/factories";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../application/use-cases/CategoryUseCases";
import type { z } from "@lib-zod";
import type {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../../application/dto/CategoryDto";

export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
  try {
    return await new CreateCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
  try {
    return await new RenameCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_RENAME_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
  try {
    return await new MoveCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_MOVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteCategory(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult> {
  try {
    return await new DeleteCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
````

## File: modules/notion/subdomains/authoring/interfaces/_actions/index.ts
````typescript
// TODO: export server actions: createArticle, updateArticle, publishArticle, archiveArticle
// TODO: export createCategory, moveCategory

export {
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
  deleteArticle,
} from "./article.actions";

export {
  createCategory,
  renameCategory,
  moveCategory,
  deleteCategory,
} from "./category.actions";
````

## File: modules/notion/subdomains/authoring/interfaces/components/ArticleDetailPage.tsx
````typescript
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  BadgeCheck,
  Edit,
  FileClock,
  MessageSquare,
  History,
  Globe,
  Link2,
} from "lucide-react";

import { getArticle, getCategories, getBacklinks } from "../queries";
import {
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
} from "../_actions/article.actions";
import { ArticleDialog } from "./ArticleDialog";
import type { ArticleSnapshot as Article } from "../../application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../application/dto/authoring.dto";
import { CommentPanel, VersionHistoryPanel } from "@/modules/notion/api";
import { ReactMarkdown } from "@lib-react-markdown";
import { remarkGfm } from "@lib-remark-gfm";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ArticleDetailPageProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticleDetailPage({
  accountId,
  workspaceId,
  currentUserId,
}: ArticleDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const articleId = params.articleId as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [backlinks, setBacklinks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!accountId || !articleId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [art, cats, bls] = await Promise.all([
        getArticle(accountId, articleId),
        getCategories(accountId, workspaceId),
        getBacklinks(accountId, articleId),
      ]);
      setArticle(art);
      setCategories(cats);
      setBacklinks(bls);
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId, articleId]);

  useEffect(() => { void load(); }, [load]);

  function handlePublish() {
    startTransition(async () => {
      await publishArticle({ id: articleId, accountId });
      await load();
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveArticle({ id: articleId, accountId });
      await load();
    });
  }

  function handleVerify() {
    startTransition(async () => {
      await verifyArticle({ id: articleId, accountId, verifiedByUserId: currentUserId });
      await load();
    });
  }

  function handleRequestReview() {
    startTransition(async () => {
      await requestArticleReview({ id: articleId, accountId });
      await load();
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 返回
        </Button>
        <p className="text-sm text-muted-foreground">找不到文章。</p>
      </div>
    );
  }

  const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
    draft: "outline",
    published: "default",
    archived: "secondary",
  };
  const statusLabel: Record<string, string> = {
    draft: "草稿",
    published: "已發佈",
    archived: "已封存",
  };
  const veriLabel: Record<string, string> = {
    verified: "已驗證",
    needs_review: "待審查",
    unverified: "未驗證",
  };

  return (
    <div className="space-y-4">
      {/* Back + actions bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge-base/articles")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 文章列表
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {article.status === "draft" && (
            <Button size="sm" variant="outline" onClick={handlePublish} disabled={isPending}>
              <Globe className="mr-1.5 h-3.5 w-3.5" /> 發佈
            </Button>
          )}
          {article.status !== "archived" && (
            <Button size="sm" variant="outline" onClick={handleArchive} disabled={isPending}>
              <Archive className="mr-1.5 h-3.5 w-3.5" /> 封存
            </Button>
          )}
          {article.verificationState !== "verified" && (
            <Button size="sm" variant="outline" onClick={handleVerify} disabled={isPending}>
              <BadgeCheck className="mr-1.5 h-3.5 w-3.5" /> 標記已驗證
            </Button>
          )}
          {article.verificationState === "verified" && (
            <Button size="sm" variant="outline" onClick={handleRequestReview} disabled={isPending}>
              <FileClock className="mr-1.5 h-3.5 w-3.5" /> 請求審查
            </Button>
          )}
          <Button size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="mr-1.5 h-3.5 w-3.5" /> 編輯
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="space-y-2 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[article.status] ?? "outline"}>
            {statusLabel[article.status] ?? article.status}
          </Badge>
          {article.verificationState && (
            <Badge variant="outline" className="text-xs">
              {veriLabel[article.verificationState] ?? article.verificationState}
            </Badge>
          )}
          {article.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{article.title}</h1>
        <p className="text-xs text-muted-foreground">
          v{article.version} · 更新於 {new Date(article.updatedAtISO).toLocaleDateString("zh-TW")}
        </p>
      </header>

      {/* Body tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">內容</TabsTrigger>
          <TabsTrigger value="backlinks">
            <Link2 className="mr-1 h-3.5 w-3.5" /> 反向連結
            {backlinks.length > 0 && (
              <span className="ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground">
                {backlinks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-1 h-3.5 w-3.5" /> 留言
          </TabsTrigger>
          <TabsTrigger value="versions">
            <History className="mr-1 h-3.5 w-3.5" /> 版本
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="prose prose-sm dark:prose-invert min-h-[200px] max-w-none rounded-lg border border-border/60 bg-muted/10 p-4">
            {article.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">此文章尚無內容。</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="backlinks">
          {backlinks.length === 0 ? (
            <p className="rounded-lg border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
              尚無其他文章引用此文章。
            </p>
          ) : (
            <ul className="space-y-2 rounded-lg border border-border/60 bg-muted/10 p-4">
              {backlinks.map((bl) => (
                <li key={bl.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/knowledge-base/articles/${bl.id}`)}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    {bl.title}
                  </button>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(bl.updatedAtISO).toLocaleDateString("zh-TW")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="comments">
          {currentUserId ? (
            <CommentPanel
              accountId={accountId}
              workspaceId={workspaceId}
              contentId={articleId}
              contentType="article"
              currentUserId={currentUserId}
            />
          ) : (
            <p className="text-sm text-muted-foreground">請先登入以查看留言。</p>
          )}
        </TabsContent>

        <TabsContent value="versions">
          {currentUserId ? (
            <VersionHistoryPanel
              accountId={accountId}
              contentId={articleId}
              currentUserId={currentUserId}
            />
          ) : (
            <p className="text-sm text-muted-foreground">請先登入以查看版本歷程。</p>
          )}
        </TabsContent>
      </Tabs>

      <ArticleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        accountId={accountId}
        workspaceId={workspaceId}
        currentUserId={currentUserId}
        categories={categories}
        article={article}
        onSuccess={() => void load()}
      />
    </div>
  );
}
````

## File: modules/notion/subdomains/authoring/interfaces/components/ArticleDialog.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/components
 * Purpose: Dialog for creating and editing Knowledge Base articles.
 */

import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

import { createArticle, updateArticle } from "../_actions/article.actions";
import type { ArticleSnapshot } from "../../application/dto/authoring.dto";
import type { CategorySnapshot } from "../../application/dto/authoring.dto";

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  categories: CategorySnapshot[];
  /** Article to edit — omit for create mode */
  article?: ArticleSnapshot;
  onSuccess?: (articleId?: string) => void;
}

export function ArticleDialog({
  open,
  onOpenChange,
  accountId,
  workspaceId,
  currentUserId,
  categories,
  article,
  onSuccess,
}: ArticleDialogProps) {
  const isEdit = !!article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [categoryId, setCategoryId] = useState<string>(article?.categoryId ?? "__none__");
  const [tags, setTags] = useState(article?.tags.join(", ") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void Promise.resolve().then(() => {
      setTitle(article?.title ?? "");
      setContent(article?.content ?? "");
      setCategoryId(article?.categoryId ?? "__none__");
      setTags(article?.tags.join(", ") ?? "");
      setError(null);
    });
  }, [article, open]);

  function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("標題不可空白");
      return;
    }
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const resolvedCategoryId = categoryId === "__none__" ? null : categoryId;

    startTransition(async () => {
      setError(null);
      if (isEdit) {
        const result = await updateArticle({
          id: article!.id,
          accountId,
          title: trimmedTitle,
          content,
          categoryId: resolvedCategoryId,
          tags: parsedTags,
        });
        if (!result.success) {
          setError(result.error.message ?? "更新失敗");
          return;
        }
        onSuccess?.();
      } else {
        const result = await createArticle({
          accountId,
          workspaceId,
          title: trimmedTitle,
          content,
          categoryId: resolvedCategoryId,
          tags: parsedTags,
          createdByUserId: currentUserId,
        });
        if (!result.success) {
          setError(result.error.message ?? "建立失敗");
          return;
        }
        onSuccess?.(result.aggregateId);
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "編輯文章" : "新增文章"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-title">標題</Label>
            <Input
              id="kb-article-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章標題"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-category">分類</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="kb-article-category">
                <SelectValue placeholder="選擇分類（選填）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— 不指定 —</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-tags">
              標籤{" "}
              <span className="text-muted-foreground text-xs">（以逗號分隔）</span>
            </Label>
            <Input
              id="kb-article-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="標籤1, 標籤2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-content">內容</Label>
            <Textarea
              id="kb-article-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="文章內容（支援 Markdown）"
              rows={6}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !title.trim()}>
            {isPending ? "儲存中…" : isEdit ? "更新文章" : "建立文章"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/notion/subdomains/authoring/interfaces/components/CategoryTreePanel.tsx
````typescript
"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Layers } from "lucide-react";

import type { CategorySnapshot as Category } from "../../application/dto/authoring.dto";

// ── Category tree helpers ────────────────────────────────────────────────────

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }
  const roots: CategoryNode[] = [];
  for (const node of map.values()) {
    if (node.parentCategoryId) {
      map.get(node.parentCategoryId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// ── Category tree panel ──────────────────────────────────────────────────────

interface CategoryTreePanelProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryTreePanel({ categories, selectedId, onSelect }: CategoryTreePanelProps) {
  const roots = useMemo(() => buildCategoryTree(categories), [categories]);

  return (
    <aside className="w-52 shrink-0 space-y-1">
      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        分類
      </p>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          selectedId === null
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <Layers className="size-3.5 shrink-0 text-muted-foreground" />
        全部文章
      </button>
      {roots.map((node) => (
        <CategoryNodeRow
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
      {categories.length === 0 && (
        <p className="px-2 text-xs text-muted-foreground/60">尚無分類</p>
      )}
    </aside>
  );
}

interface CategoryNodeRowProps {
  node: CategoryNode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function CategoryNodeRow({ node, selectedId, onSelect }: CategoryNodeRowProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="p-0.5 text-muted-foreground opacity-0 transition hover:opacity-100"
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
          aria-label={expanded ? "折疊" : "展開"}
        >
          {expanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${
            isSelected
              ? "bg-primary/10 text-primary font-medium"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
          {node.articleIds.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground/60">
              {node.articleIds.length}
            </span>
          )}
        </button>
      </div>
      {hasChildren && expanded && (
        <div className="ml-4 space-y-0.5 border-l border-border/40 pl-1">
          {node.children.map((child) => (
            <CategoryNodeRow
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/authoring/interfaces/components/index.ts
````typescript
// TODO: export ArticleEditorView, ArticleListView, CategoryTreeView

export { ArticleDialog } from "./ArticleDialog";
````

## File: modules/notion/subdomains/authoring/interfaces/components/KnowledgeBaseArticlesRouteScreen.tsx
````typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, CircleDot, FileClock, Plus } from "lucide-react";

import { useApp } from "@/modules/platform/api";
import { useAuth } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { ArticleSnapshot as Article, ArticleStatus, ArticleVerificationState as VerificationState } from "../../application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../application/dto/authoring.dto";
import { getArticles, getCategories } from "../queries";
import { ArticleDialog } from "./ArticleDialog";
import { CategoryTreePanel } from "./CategoryTreePanel";

const STATUS_CONFIG: Record<ArticleStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "草稿", variant: "outline" },
  published: { label: "已發佈", variant: "default" },
  archived: { label: "已封存", variant: "secondary" },
};

const VERIFICATION_CONFIG: Record<VerificationState, { label: string; icon: React.ElementType }> = {
  verified: { label: "已驗證", icon: BadgeCheck },
  needs_review: { label: "待審查", icon: FileClock },
  unverified: { label: "未驗證", icon: CircleDot },
};

/**
 * KnowledgeBaseArticlesRouteScreen
 * Route-level screen component for /knowledge-base/articles.
 * Encapsulates data-loading, filtering and layout so the Next.js route
 * file stays thin (params/context wiring only).
 */
export function KnowledgeBaseArticlesRouteScreen() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accountId || !workspaceId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [arts, cats] = await Promise.all([
        getArticles({ accountId, workspaceId }),
        getCategories(accountId, workspaceId),
      ]);
      setArticles(arts);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => { load(); }, [load]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    const cat = categories.find((c) => c.id === selectedCategoryId);
    if (!cat) return articles;
    return articles.filter((a) => cat.articleIds.includes(a.id));
  }, [articles, categories, selectedCategoryId]);

  function handleSuccess(articleId?: string) {
    if (articleId) {
      router.push(`/knowledge-base/articles/${articleId}`);
    } else {
      load();
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Base</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文章</h1>
        <p className="text-sm text-muted-foreground">
          組織知識庫的 SOP 文章、通用文件與驗證管治。
        </p>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/knowledge")}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Knowledge Hub
        </button>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!accountId || !workspaceId}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          新增文章
        </Button>
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={accountId}
        workspaceId={workspaceId}
        currentUserId={currentUserId}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {!accountId || !workspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號/工作區情境，請先登入或切換帳號。
        </p>
      ) : loading ? (
        <div className="flex gap-4">
          <Skeleton className="h-48 w-52 shrink-0 rounded-lg" />
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <CategoryTreePanel
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />

          <div className="flex-1">
            {filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {selectedCategoryId ? "此分類尚無文章。" : "尚無文章。點擊「新增文章」開始建立。"}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredArticles.map((article) => {
                  const status = STATUS_CONFIG[article.status];
                  const veri = VERIFICATION_CONFIG[article.verificationState];
                  const VeriIcon = veri.icon;
                  return (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:bg-muted/10 transition-colors"
                      onClick={() => router.push(`/knowledge-base/articles/${article.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-sm font-medium">{article.title}</CardTitle>
                          <Badge variant={status.variant} className="shrink-0 text-[10px]">{status.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <VeriIcon className="h-3 w-3" />
                          <span>{veri.label}</span>
                        </div>
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground/70">
                          v{article.version} · {new Date(article.updatedAtISO).toLocaleDateString("zh-TW")}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/authoring/interfaces/queries/index.ts
````typescript
// TODO: export getArticle, getArticlesByWorkspace, getCategoryTree

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/queries
 * Purpose: Direct-instantiation query functions (read-side).
 */

import { makeArticleRepo, makeCategoryRepo } from "../../api/factories";
import type { ArticleSnapshot, ArticleStatus } from "../../application/dto/authoring.dto";
import type { CategorySnapshot } from "../../application/dto/authoring.dto";

export async function getArticles(params: {
  accountId: string;
  workspaceId: string;
  categoryId?: string;
  status?: ArticleStatus;
}): Promise<ArticleSnapshot[]> {
  return makeArticleRepo().list(params);
}

export async function getArticle(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
  return makeArticleRepo().getById(accountId, articleId);
}

export async function getCategories(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
  return makeCategoryRepo().listByWorkspace(accountId, workspaceId);
}

export async function getBacklinks(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
  return makeArticleRepo().listByLinkedArticleId(accountId, articleId);
}
````

## File: modules/notion/subdomains/authoring/interfaces/store/index.ts
````typescript
// TODO: export useArticleEditorStore

export {};
````

## File: modules/notion/subdomains/automation/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/automation/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'automation'.
````

## File: modules/notion/subdomains/automation/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'automation'.
````

## File: modules/notion/subdomains/automation/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'automation'.
````

## File: modules/notion/subdomains/collaboration/api/factories.ts
````typescript
import { FirebaseCommentRepository } from "../infrastructure/firebase/FirebaseCommentRepository";
import { FirebasePermissionRepository } from "../infrastructure/firebase/FirebasePermissionRepository";
import { FirebaseVersionRepository } from "../infrastructure/firebase/FirebaseVersionRepository";

export function makeCommentRepo() {
  return new FirebaseCommentRepository();
}

export function makeVersionRepo() {
  return new FirebaseVersionRepository();
}

export function makePermissionRepo() {
  return new FirebasePermissionRepository();
}
````

## File: modules/notion/subdomains/collaboration/api/index.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// Aggregate snapshot types
export type { CommentSnapshot, SelectionRange, ContentType, CommentId } from "../domain/aggregates/Comment";
export type { CommentUnsubscribe } from "../domain/repositories/ICommentRepository";
export type { VersionSnapshot, VersionId } from "../domain/aggregates/Version";
export type { PermissionSnapshot, PermissionLevel, PrincipalType, PermissionId } from "../domain/aggregates/Permission";

// DTOs
export type {
  CreateCommentDto, UpdateCommentDto, ResolveCommentDto, DeleteCommentDto,
  CreateVersionDto, DeleteVersionDto,
  GrantPermissionDto, RevokePermissionDto,
} from "../application/dto/CollaborationDto";

// Server actions
export { createComment, updateComment, resolveComment, deleteComment } from "../interfaces/_actions/comment.actions";
export { createVersion, deleteVersion } from "../interfaces/_actions/version.actions";
export { grantPermission, revokePermission } from "../interfaces/_actions/permission.actions";

// Queries
export { getComments, getVersions, getPermissions, subscribeComments } from "../interfaces/queries";

// UI components
export { CommentPanel } from "../interfaces/components/CommentPanel";
export { VersionHistoryPanel } from "../interfaces/components/VersionHistoryPanel";
````

## File: modules/notion/subdomains/collaboration/application/dto/collaboration.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the collaboration subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { CommentSnapshot } from "../../domain/aggregates/Comment";
export type { CommentUnsubscribe } from "../../domain/repositories/ICommentRepository";
export type { VersionSnapshot } from "../../domain/aggregates/Version";
export type { PermissionSnapshot } from "../../domain/aggregates/Permission";
````

## File: modules/notion/subdomains/collaboration/application/dto/CollaborationDto.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/dto
 * Purpose: Zod schemas and DTO types for comment, version, and permission operations.
 */

import { z } from "@lib-zod";

const ContentScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

const SelectionRangeSchema = z.object({
  from: z.number().int().min(0),
  to: z.number().int().min(0),
});

// ── Comment ───────────────────────────────────────────────────────────────────

export const CreateCommentSchema = ContentScopeSchema.extend({
  contentId: z.string().min(1),
  contentType: z.enum(["page", "article"]),
  authorId: z.string().min(1),
  body: z.string().min(1).max(10000),
  parentCommentId: z.string().min(1).nullable().optional(),
  blockId: z.string().min(1).nullable().optional(),
  mentionedUserIds: z.array(z.string().min(1)).optional(),
  selectionRange: SelectionRangeSchema.nullable().optional(),
});
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  body: z.string().min(1).max(10000),
});
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;

export const ResolveCommentSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  resolvedByUserId: z.string().min(1),
});
export type ResolveCommentDto = z.infer<typeof ResolveCommentSchema>;

export const DeleteCommentSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteCommentDto = z.infer<typeof DeleteCommentSchema>;

// ── Version ───────────────────────────────────────────────────────────────────

export const CreateVersionSchema = ContentScopeSchema.extend({
  contentId: z.string().min(1),
  contentType: z.enum(["page", "article"]),
  snapshotBlocks: z.array(z.unknown()),
  label: z.string().min(1).max(200).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  createdByUserId: z.string().min(1),
});
export type CreateVersionDto = z.infer<typeof CreateVersionSchema>;

export const DeleteVersionSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteVersionDto = z.infer<typeof DeleteVersionSchema>;

// ── Permission ────────────────────────────────────────────────────────────────

export const GrantPermissionSchema = ContentScopeSchema.extend({
  subjectId: z.string().min(1),
  subjectType: z.enum(["page", "article", "database"]),
  principalId: z.string().min(1),
  principalType: z.enum(["user", "team", "public", "link"]),
  level: z.enum(["view", "comment", "edit", "full"]),
  grantedByUserId: z.string().min(1),
  expiresAtISO: z.string().datetime().nullable().optional(),
  linkToken: z.string().min(1).nullable().optional(),
});
export type GrantPermissionDto = z.infer<typeof GrantPermissionSchema>;

export const RevokePermissionSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type RevokePermissionDto = z.infer<typeof RevokePermissionSchema>;
````

## File: modules/notion/subdomains/collaboration/application/dto/index.ts
````typescript
export type {
  CreateCommentDto, UpdateCommentDto, ResolveCommentDto, DeleteCommentDto,
  CreateVersionDto, DeleteVersionDto,
  GrantPermissionDto, RevokePermissionDto,
} from "./CollaborationDto";
export {
  CreateCommentSchema, UpdateCommentSchema, ResolveCommentSchema, DeleteCommentSchema,
  CreateVersionSchema, DeleteVersionSchema,
  GrantPermissionSchema, RevokePermissionSchema,
} from "./CollaborationDto";
````

## File: modules/notion/subdomains/collaboration/application/use-cases/CommentUseCases.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Comment
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { CommentSnapshot } from "../../domain/aggregates/Comment";
import type { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import {
  CreateCommentSchema, type CreateCommentDto,
  UpdateCommentSchema, type UpdateCommentDto,
  ResolveCommentSchema, type ResolveCommentDto,
  DeleteCommentSchema, type DeleteCommentDto,
} from "../dto/CollaborationDto";

export class CreateCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: CreateCommentDto): Promise<CommandResult> {
    const parsed = CreateCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, contentId, contentType, authorId, body, parentCommentId, blockId, selectionRange } = parsed.data;
    const comment = await this.repo.create({
      contentId, contentType, workspaceId, accountId, authorId, body,
      parentCommentId: parentCommentId ?? null,
      blockId: blockId ?? null,
      selectionRange: selectionRange ?? null,
    });
    return commandSuccess(comment.id, Date.now());
  }
}

export class UpdateCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: UpdateCommentDto): Promise<CommandResult> {
    const parsed = UpdateCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    if (!result) return commandFailureFrom("COMMENT_NOT_FOUND", "Comment not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class ResolveCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: ResolveCommentDto): Promise<CommandResult> {
    const parsed = ResolveCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    const result = await this.repo.resolve(parsed.data);
    if (!result) return commandFailureFrom("COMMENT_NOT_FOUND", "Comment not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class DeleteCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: DeleteCommentDto): Promise<CommandResult> {
    const parsed = DeleteCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}

export class ListCommentsUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
    if (!accountId.trim() || !contentId.trim()) return [];
    return this.repo.listByContent(accountId, contentId);
  }
}
````

## File: modules/notion/subdomains/collaboration/application/use-cases/index.ts
````typescript
export { CreateCommentUseCase, UpdateCommentUseCase, ResolveCommentUseCase, DeleteCommentUseCase, ListCommentsUseCase } from "./CommentUseCases";
export { CreateVersionUseCase, DeleteVersionUseCase } from "./VersionUseCases";
export { GrantPermissionUseCase, RevokePermissionUseCase } from "./PermissionUseCases";
````

## File: modules/notion/subdomains/collaboration/application/use-cases/PermissionUseCases.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Permission
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IPermissionRepository } from "../../domain/repositories/IPermissionRepository";
import {
  GrantPermissionSchema, type GrantPermissionDto,
  RevokePermissionSchema, type RevokePermissionDto,
} from "../dto/CollaborationDto";

export class GrantPermissionUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(input: GrantPermissionDto): Promise<CommandResult> {
    const parsed = GrantPermissionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("PERMISSION_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, subjectId, subjectType, principalId, principalType, level, grantedByUserId, expiresAtISO, linkToken } = parsed.data;
    const permission = await this.repo.grant({
      subjectId, subjectType, workspaceId, accountId, principalId, principalType,
      level, grantedByUserId,
      expiresAtISO: expiresAtISO ?? null,
      linkToken: linkToken ?? null,
    });
    return commandSuccess(permission.id, Date.now());
  }
}

export class RevokePermissionUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(input: RevokePermissionDto): Promise<CommandResult> {
    const parsed = RevokePermissionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("PERMISSION_INVALID_INPUT", parsed.error.message);
    await this.repo.revoke(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}
````

## File: modules/notion/subdomains/collaboration/application/use-cases/VersionUseCases.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Version
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IVersionRepository } from "../../domain/repositories/IVersionRepository";
import {
  CreateVersionSchema, type CreateVersionDto,
  DeleteVersionSchema, type DeleteVersionDto,
} from "../dto/CollaborationDto";

export class CreateVersionUseCase {
  constructor(private readonly repo: IVersionRepository) {}

  async execute(input: CreateVersionDto): Promise<CommandResult> {
    const parsed = CreateVersionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("VERSION_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, contentId, contentType, snapshotBlocks, label, description, createdByUserId } = parsed.data;
    const version = await this.repo.create({
      contentId, contentType, workspaceId, accountId, snapshotBlocks,
      label: label ?? null,
      description: description ?? null,
      createdByUserId,
    });
    return commandSuccess(version.id, Date.now());
  }
}

export class DeleteVersionUseCase {
  constructor(private readonly repo: IVersionRepository) {}

  async execute(input: DeleteVersionDto): Promise<CommandResult> {
    const parsed = DeleteVersionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("VERSION_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}
````

## File: modules/notion/subdomains/collaboration/domain/aggregates/Comment.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Comment
 *
 * Represents an inline or block-level comment on a knowledge page or article.
 * Supports threaded replies (parentCommentId) and rich-text selection anchors.
 */

export type ContentType = "page" | "article";

export interface SelectionRange {
  from: number;
  to: number;
}

export interface CommentSnapshot {
  readonly id: string;
  readonly contentId: string;
  readonly contentType: ContentType;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId: string | null;
  readonly blockId: string | null;
  readonly selectionRange: SelectionRange | null;
  readonly resolvedAt: string | null;
  readonly resolvedByUserId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export type CommentId = string;
````

## File: modules/notion/subdomains/collaboration/domain/aggregates/index.ts
````typescript
export type { CommentSnapshot, CommentId, SelectionRange, ContentType } from "./Comment";
export type { VersionSnapshot, VersionId } from "./Version";
export type { PermissionSnapshot, PermissionId, PermissionLevel, PrincipalType } from "./Permission";
````

## File: modules/notion/subdomains/collaboration/domain/aggregates/Permission.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Permission
 *
 * Governs access to a knowledge subject (page | article | database).
 * Supports link-based sharing via linkToken.
 */

export type PermissionLevel = "view" | "comment" | "edit" | "full";
export type PrincipalType = "user" | "team" | "public" | "link";

export interface PermissionSnapshot {
  readonly id: string;
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: PrincipalType;
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly grantedAtISO: string;
  readonly expiresAtISO: string | null;
  readonly linkToken: string | null;
}

export type PermissionId = string;
````

## File: modules/notion/subdomains/collaboration/domain/aggregates/Version.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Version
 *
 * Represents a named snapshot of a knowledge page or article captured at a point in time.
 * Allows users to restore prior states of content.
 */

export interface VersionSnapshot {
  readonly id: string;
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label: string | null;
  readonly description: string | null;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}

export type VersionId = string;
````

## File: modules/notion/subdomains/collaboration/domain/events/index.ts
````typescript
// TODO: export CollaborationEvents
// knowledge-collaboration.comment_created | comment_resolved
// knowledge-collaboration.permission_granted | permission_revoked
// knowledge-collaboration.version_created | version_restored
// knowledge-collaboration.page_locked

export {};
````

## File: modules/notion/subdomains/collaboration/domain/repositories/ICommentRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: ICommentRepository
 *
 * Owned by the domain layer. Implemented in infrastructure/firebase/.
 */

import type { CommentSnapshot, SelectionRange } from "../aggregates/Comment";

export type CommentUnsubscribe = () => void;

export interface CreateCommentInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId?: string | null;
  readonly blockId?: string | null;
  readonly selectionRange?: SelectionRange | null;
}

export interface UpdateCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly body: string;
}

export interface ResolveCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly resolvedByUserId: string;
}

export interface ICommentRepository {
  create(input: CreateCommentInput): Promise<CommentSnapshot>;
  update(input: UpdateCommentInput): Promise<CommentSnapshot | null>;
  resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null>;
  delete(accountId: string, commentId: string): Promise<void>;
  findById(accountId: string, commentId: string): Promise<CommentSnapshot | null>;
  listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]>;
  subscribe(
    accountId: string,
    contentId: string,
    onUpdate: (comments: CommentSnapshot[]) => void,
  ): CommentUnsubscribe;
}
````

## File: modules/notion/subdomains/collaboration/domain/repositories/index.ts
````typescript
export type { ICommentRepository, CreateCommentInput, UpdateCommentInput, ResolveCommentInput, CommentUnsubscribe } from "./ICommentRepository";
export type { IVersionRepository, CreateVersionInput } from "./IVersionRepository";
export type { IPermissionRepository, GrantPermissionInput } from "./IPermissionRepository";
````

## File: modules/notion/subdomains/collaboration/domain/repositories/IPermissionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: IPermissionRepository
 */

import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../aggregates/Permission";

export interface GrantPermissionInput {
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: PrincipalType;
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly expiresAtISO?: string | null;
  readonly linkToken?: string | null;
}

export interface IPermissionRepository {
  grant(input: GrantPermissionInput): Promise<PermissionSnapshot>;
  revoke(accountId: string, permissionId: string): Promise<void>;
  findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null>;
  listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]>;
}
````

## File: modules/notion/subdomains/collaboration/domain/repositories/IVersionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: IVersionRepository
 */

import type { VersionSnapshot } from "../aggregates/Version";

export interface CreateVersionInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label?: string | null;
  readonly description?: string | null;
  readonly createdByUserId: string;
}

export interface IVersionRepository {
  create(input: CreateVersionInput): Promise<VersionSnapshot>;
  delete(accountId: string, versionId: string): Promise<void>;
  findById(accountId: string, versionId: string): Promise<VersionSnapshot | null>;
  listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]>;
}
````

## File: modules/notion/subdomains/collaboration/domain/services/index.ts
````typescript
// TODO: export PermissionResolutionService, VersionRetentionService

export {};
````

## File: modules/notion/subdomains/collaboration/domain/value-objects/index.ts
````typescript
// TODO: export CommentId, PermissionId, VersionId, ContentId, PermissionLevel

export {};
````

## File: modules/notion/subdomains/collaboration/infrastructure/firebase/FirebaseCommentRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { CommentSnapshot, SelectionRange } from "../../domain/aggregates/Comment";
import type {
  ICommentRepository,
  CommentUnsubscribe,
  CreateCommentInput,
  UpdateCommentInput,
  ResolveCommentInput,
} from "../../domain/repositories/ICommentRepository";

function commentsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "collaborationComments");
}

function commentDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "collaborationComments", id);
}

function toComment(id: string, data: Record<string, unknown>): CommentSnapshot {
  return {
    id,
    contentId: typeof data.contentId === "string" ? data.contentId : "",
    contentType: data.contentType === "article" ? "article" : "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    authorId: typeof data.authorId === "string" ? data.authorId : "",
    body: typeof data.body === "string" ? data.body : "",
    parentCommentId: typeof data.parentCommentId === "string" ? data.parentCommentId : null,
    blockId: typeof data.blockId === "string" ? data.blockId : null,
    selectionRange: (
      data.selectionRange !== null &&
      typeof data.selectionRange === "object" &&
      typeof (data.selectionRange as Record<string, unknown>).from === "number" &&
      typeof (data.selectionRange as Record<string, unknown>).to === "number"
    )
      ? {
          from: (data.selectionRange as Record<string, unknown>).from as number,
          to: (data.selectionRange as Record<string, unknown>).to as number,
        } as SelectionRange
      : null,
    resolvedAt: typeof data.resolvedAt === "string" ? data.resolvedAt : null,
    resolvedByUserId: typeof data.resolvedByUserId === "string" ? data.resolvedByUserId : null,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseCommentRepository implements ICommentRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateCommentInput): Promise<CommentSnapshot> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      contentId: input.contentId,
      contentType: input.contentType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      authorId: input.authorId,
      body: input.body,
      parentCommentId: input.parentCommentId ?? null,
      blockId: input.blockId ?? null,
      selectionRange: input.selectionRange ?? null,
      resolvedAt: null,
      resolvedByUserId: null,
      createdAtISO: now,
      updatedAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(commentDoc(db, input.accountId, id), data);
    return toComment(id, data);
  }

  async update(input: UpdateCommentInput): Promise<CommentSnapshot | null> {
    const db = this.db();
    const ref = commentDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    await updateDoc(ref, { body: input.body, updatedAtISO: now });
    return toComment(snap.id, { ...snap.data(), body: input.body, updatedAtISO: now });
  }

  async resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null> {
    const db = this.db();
    const ref = commentDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    await updateDoc(ref, { resolvedAt: now, resolvedByUserId: input.resolvedByUserId });
    return toComment(snap.id, { ...snap.data(), resolvedAt: now, resolvedByUserId: input.resolvedByUserId });
  }

  async delete(accountId: string, commentId: string): Promise<void> {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(commentDoc(this.db(), accountId, commentId));
  }

  async findById(accountId: string, commentId: string): Promise<CommentSnapshot | null> {
    const snap = await getDoc(commentDoc(this.db(), accountId, commentId));
    if (!snap.exists()) return null;
    return toComment(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
    const db = this.db();
    const q = query(
      commentsCol(db, accountId),
      where("contentId", "==", contentId),
      orderBy("_createdAt", "asc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toComment(d.id, d.data() as Record<string, unknown>));
  }

  subscribe(accountId: string, contentId: string, onUpdate: (comments: CommentSnapshot[]) => void): CommentUnsubscribe {
    const db = this.db();
    const q = query(
      commentsCol(db, accountId),
      where("contentId", "==", contentId),
      orderBy("_createdAt", "asc"),
    );
    return onSnapshot(q, (snap) => {
      onUpdate(snap.docs.map((d) => toComment(d.id, d.data() as Record<string, unknown>)));
    });
  }
}
````

## File: modules/notion/subdomains/collaboration/infrastructure/firebase/FirebasePermissionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationPermissions/{id}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../../domain/aggregates/Permission";
import type { IPermissionRepository, GrantPermissionInput } from "../../domain/repositories/IPermissionRepository";

function permissionsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "collaborationPermissions");
}

function permissionDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "collaborationPermissions", id);
}

function toPermission(id: string, data: Record<string, unknown>): PermissionSnapshot {
  return {
    id,
    subjectId: typeof data.subjectId === "string" ? data.subjectId : "",
    subjectType: (data.subjectType as PermissionSnapshot["subjectType"]) ?? "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    principalId: typeof data.principalId === "string" ? data.principalId : "",
    principalType: (data.principalType as PrincipalType) ?? "user",
    level: (data.level as PermissionLevel) ?? "view",
    grantedByUserId: typeof data.grantedByUserId === "string" ? data.grantedByUserId : "",
    grantedAtISO: typeof data.grantedAtISO === "string" ? data.grantedAtISO : "",
    expiresAtISO: typeof data.expiresAtISO === "string" ? data.expiresAtISO : null,
    linkToken: typeof data.linkToken === "string" ? data.linkToken : null,
  };
}

export class FirebasePermissionRepository implements IPermissionRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async grant(input: GrantPermissionInput): Promise<PermissionSnapshot> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      principalId: input.principalId,
      principalType: input.principalType,
      level: input.level,
      grantedByUserId: input.grantedByUserId,
      grantedAtISO: now,
      expiresAtISO: input.expiresAtISO ?? null,
      linkToken: input.linkToken ?? null,
      _createdAt: serverTimestamp(),
    };
    await setDoc(permissionDoc(db, input.accountId, id), data);
    return toPermission(id, data);
  }

  async revoke(accountId: string, permissionId: string): Promise<void> {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(permissionDoc(this.db(), accountId, permissionId));
  }

  async findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null> {
    const snap = await getDoc(permissionDoc(this.db(), accountId, permissionId));
    if (!snap.exists()) return null;
    return toPermission(snap.id, snap.data() as Record<string, unknown>);
  }

  async listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
    const db = this.db();
    const q = query(permissionsCol(db, accountId), where("subjectId", "==", subjectId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toPermission(d.id, d.data() as Record<string, unknown>));
  }
}
````

## File: modules/notion/subdomains/collaboration/infrastructure/firebase/FirebaseVersionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationVersions/{versionId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { VersionSnapshot } from "../../domain/aggregates/Version";
import type { IVersionRepository, CreateVersionInput } from "../../domain/repositories/IVersionRepository";

function versionsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "collaborationVersions");
}

function versionDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "collaborationVersions", id);
}

function toVersion(id: string, data: Record<string, unknown>): VersionSnapshot {
  return {
    id,
    contentId: typeof data.contentId === "string" ? data.contentId : "",
    contentType: data.contentType === "article" ? "article" : "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    snapshotBlocks: Array.isArray(data.snapshotBlocks) ? data.snapshotBlocks : [],
    label: typeof data.label === "string" ? data.label : null,
    description: typeof data.description === "string" ? data.description : null,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseVersionRepository implements IVersionRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateVersionInput): Promise<VersionSnapshot> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      contentId: input.contentId,
      contentType: input.contentType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      snapshotBlocks: input.snapshotBlocks,
      label: input.label ?? null,
      description: input.description ?? null,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(versionDoc(db, input.accountId, id), data);
    return toVersion(id, data);
  }

  async findById(accountId: string, versionId: string): Promise<VersionSnapshot | null> {
    const db = this.db();
    const snap = await getDoc(versionDoc(db, accountId, versionId));
    if (!snap.exists()) return null;
    return toVersion(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
    const db = this.db();
    const q = query(versionsCol(db, accountId), where("contentId", "==", contentId), orderBy("createdAtISO", "desc"));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toVersion(d.id, d.data() as Record<string, unknown>));
  }

  async delete(accountId: string, versionId: string): Promise<void> {
    const db = this.db();
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(versionDoc(db, accountId, versionId));
  }
}
````

## File: modules/notion/subdomains/collaboration/infrastructure/firebase/index.ts
````typescript
export { FirebaseCommentRepository } from "./FirebaseCommentRepository";
export { FirebaseVersionRepository } from "./FirebaseVersionRepository";
export { FirebasePermissionRepository } from "./FirebasePermissionRepository";
````

## File: modules/notion/subdomains/collaboration/infrastructure/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/subdomains/collaboration/interfaces/_actions/comment.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Comment aggregate server actions — create, update, resolve, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { dispatchNotification } from "@/modules/platform/api";
import { makeCommentRepo } from "../../api/factories";
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
} from "../../application/use-cases/CommentUseCases";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  ResolveCommentDto,
  DeleteCommentDto,
} from "../../application/dto/CollaborationDto";

export async function createComment(input: CreateCommentDto): Promise<CommandResult> {
  try {
    const result = await new CreateCommentUseCase(makeCommentRepo()).execute(input);
    if (result.success && input.mentionedUserIds && input.mentionedUserIds.length > 0) {
      await Promise.allSettled(
        input.mentionedUserIds.map((recipientId) =>
          dispatchNotification({
            recipientId,
            title: "有人提及了你",
            message: input.body.slice(0, 100),
            type: "info",
            sourceEventType: "comment.mention",
            metadata: { authorId: input.authorId, contentId: input.contentId, contentType: input.contentType },
          }),
        ),
      );
    }
    return result;
  } catch (err) {
    return commandFailureFrom("COMMENT_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateComment(input: UpdateCommentDto): Promise<CommandResult> {
  try {
    return await new UpdateCommentUseCase(makeCommentRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COMMENT_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function resolveComment(input: ResolveCommentDto): Promise<CommandResult> {
  try {
    return await new ResolveCommentUseCase(makeCommentRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COMMENT_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteComment(input: DeleteCommentDto): Promise<CommandResult> {
  try {
    return await new DeleteCommentUseCase(makeCommentRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COMMENT_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/notion/subdomains/collaboration/interfaces/_actions/index.ts
````typescript
export { createComment, updateComment, resolveComment, deleteComment } from "./comment.actions";
export { createVersion, deleteVersion } from "./version.actions";
export { grantPermission, revokePermission } from "./permission.actions";
````

## File: modules/notion/subdomains/collaboration/interfaces/_actions/permission.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Permission aggregate server actions — grant, revoke.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makePermissionRepo } from "../../api/factories";
import { GrantPermissionUseCase, RevokePermissionUseCase } from "../../application/use-cases/PermissionUseCases";
import type { GrantPermissionDto, RevokePermissionDto } from "../../application/dto/CollaborationDto";

export async function grantPermission(input: GrantPermissionDto): Promise<CommandResult> {
  try {
    return await new GrantPermissionUseCase(makePermissionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("PERMISSION_GRANT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function revokePermission(input: RevokePermissionDto): Promise<CommandResult> {
  try {
    return await new RevokePermissionUseCase(makePermissionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("PERMISSION_REVOKE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/notion/subdomains/collaboration/interfaces/_actions/version.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Version aggregate server actions — create, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeVersionRepo } from "../../api/factories";
import { CreateVersionUseCase, DeleteVersionUseCase } from "../../application/use-cases/VersionUseCases";
import type { CreateVersionDto, DeleteVersionDto } from "../../application/dto/CollaborationDto";

export async function createVersion(input: CreateVersionDto): Promise<CommandResult> {
  try {
    return await new CreateVersionUseCase(makeVersionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VERSION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteVersion(input: DeleteVersionDto): Promise<CommandResult> {
  try {
    return await new DeleteVersionUseCase(makeVersionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VERSION_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/notion/subdomains/collaboration/interfaces/components/CommentPanel.tsx
````typescript
"use client";

import { useEffect, useState, useTransition } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { Badge } from "@ui-shadcn/ui/badge";
import { Separator } from "@ui-shadcn/ui/separator";

import { subscribeComments } from "../queries";
import { createComment, resolveComment, deleteComment } from "../_actions/comment.actions";
import type { CommentSnapshot } from "../../application/dto/collaboration.dto";

interface CommentPanelProps {
  accountId: string;
  workspaceId: string;
  contentId: string;
  contentType: "page" | "article";
  currentUserId: string;
}

export function CommentPanel({ accountId, workspaceId, contentId, contentType, currentUserId }: CommentPanelProps) {
  const [comments, setComments] = useState<CommentSnapshot[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const unsub = subscribeComments(accountId, contentId, setComments);
    return () => unsub();
  }, [accountId, contentId]);

  function handlePost() {
    const trimmed = body.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      const result = await createComment({
        accountId,
        workspaceId,
        contentId,
        contentType,
        authorId: currentUserId,
        body: trimmed,
      });
      if (result.success) {
        setBody("");
      } else {
        setError(result.error.message ?? "留言失敗");
      }
    });
  }

  function handleResolve(commentId: string) {
    startTransition(async () => {
      await resolveComment({ id: commentId, accountId, resolvedByUserId: currentUserId });
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      await deleteComment({ id: commentId, accountId });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">留言</span>
        {comments.length > 0 && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{comments.length}</Badge>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="撰寫留言…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          disabled={isPending}
          className="resize-none text-sm"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          size="sm"
          disabled={isPending || !body.trim()}
          onClick={handlePost}
          className="w-full"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "留言"}
        </Button>
      </div>

      {comments.length > 0 && (
        <>
          <Separator />
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-muted-foreground">{c.authorId}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(c.createdAtISO).toLocaleString("zh-TW", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
                {c.resolvedAt ? (
                  <Badge variant="outline" className="w-fit text-[10px]">已解決</Badge>
                ) : (
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-muted-foreground"
                      disabled={isPending}
                      onClick={() => handleResolve(c.id)}
                    >
                      標記解決
                    </Button>
                    {c.authorId === currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] text-destructive"
                        disabled={isPending}
                        onClick={() => handleDelete(c.id)}
                      >
                        刪除
                      </Button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/collaboration/interfaces/components/index.ts
````typescript
export { CommentPanel } from "./CommentPanel";
export { VersionHistoryPanel } from "./VersionHistoryPanel";
````

## File: modules/notion/subdomains/collaboration/interfaces/components/VersionHistoryPanel.tsx
````typescript
"use client";

import { useEffect, useState, useTransition } from "react";
import { History, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getVersions } from "../queries";
import { deleteVersion } from "../_actions/version.actions";
import type { VersionSnapshot } from "../../application/dto/collaboration.dto";

interface VersionHistoryPanelProps {
  accountId: string;
  contentId: string;
  currentUserId: string;
}

export function VersionHistoryPanel({ accountId, contentId, currentUserId }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let disposed = false;
    void Promise.resolve().then(async () => {
      if (disposed) return;
      setLoading(true);
      try {
        const data = await getVersions(accountId, contentId);
        if (!disposed) { setVersions(data); setLoading(false); }
      } catch {
        if (!disposed) setLoading(false);
      }
    });
    return () => { disposed = true; };
  }, [accountId, contentId]);

  function handleDelete(versionId: string) {
    startTransition(async () => {
      await deleteVersion({ id: versionId, accountId });
      setVersions((prev) => prev.filter((v) => v.id !== versionId));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">版本歷史</span>
        {versions.length > 0 && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{versions.length}</Badge>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
        </div>
      ) : versions.length === 0 ? (
        <p className="text-xs text-muted-foreground">尚無已儲存的版本快照。</p>
      ) : (
        <ol className="space-y-2">
          {versions.map((v, idx) => (
            <li key={v.id} className="flex items-start gap-3 rounded-md border border-border/60 bg-background px-3 py-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                {versions.length - idx}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{v.label || `版本 ${versions.length - idx}`}</p>
                {v.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{v.description}</p>
                )}
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {new Date(v.createdAtISO).toLocaleString("zh-TW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {v.createdByUserId === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(v.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/collaboration/interfaces/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/queries
 * Purpose: Read-side queries for comment, version, and permission data.
 */

import { makeCommentRepo, makePermissionRepo, makeVersionRepo } from "../../api/factories";
import type { CommentSnapshot, CommentUnsubscribe, VersionSnapshot, PermissionSnapshot } from "../../application/dto/collaboration.dto";

export async function getComments(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
  return makeCommentRepo().listByContent(accountId, contentId);
}

export async function getVersions(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
  return makeVersionRepo().listByContent(accountId, contentId);
}

export async function getPermissions(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
  return makePermissionRepo().listBySubject(accountId, subjectId);
}

export function subscribeComments(
  accountId: string,
  contentId: string,
  onUpdate: (comments: CommentSnapshot[]) => void,
): CommentUnsubscribe {
  return makeCommentRepo().subscribe(accountId, contentId, onUpdate);
}
````

## File: modules/notion/subdomains/collaboration/interfaces/store/index.ts
````typescript
// TODO: export useCommentStore, usePermissionStore

export {};
````

## File: modules/notion/subdomains/database/api/factories.ts
````typescript
import { FirebaseAutomationRepository } from "../infrastructure/firebase/FirebaseAutomationRepository";
import { FirebaseDatabaseRecordRepository } from "../infrastructure/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseDatabaseRepository } from "../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseViewRepository } from "../infrastructure/firebase/FirebaseViewRepository";

export function makeDatabaseRepo() {
  return new FirebaseDatabaseRepository();
}

export function makeRecordRepo() {
  return new FirebaseDatabaseRecordRepository();
}

export function makeViewRepo() {
  return new FirebaseViewRepository();
}

export function makeAutomationRepo() {
  return new FirebaseAutomationRepository();
}
````

## File: modules/notion/subdomains/database/api/index.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 *
 * Open Host Service contracts:
 *   - getDatabaseById  — consumed by knowledge subdomain (opaque reference resolution)
 */

// Domain types
export type {
  DatabaseSnapshot,
  DatabaseSnapshot as Database,
  Field,
  FieldType,
  DatabaseId,
  FieldId,
} from "../domain/aggregates/Database";

export type {
  DatabaseRecordSnapshot,
  RecordId,
} from "../domain/aggregates/DatabaseRecord";

export type {
  ViewSnapshot,
  ViewType,
  FilterRule,
  SortRule,
  ViewId,
} from "../domain/aggregates/View";

export type {
  DatabaseAutomationSnapshot,
  AutomationTrigger,
  AutomationActionType,
  AutomationCondition,
  AutomationAction,
} from "../domain/aggregates/DatabaseAutomation";

// Repository input types
export type {
  CreateAutomationInput,
  UpdateAutomationInput,
} from "../domain/repositories/IAutomationRepository";

// Application DTOs
export type {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  AddFieldDto,
  ArchiveDatabaseDto,
  CreateRecordDto,
  UpdateRecordDto,
  DeleteRecordDto,
  CreateViewDto,
  UpdateViewDto,
  DeleteViewDto,
} from "../application/dto/DatabaseDto";

// Server actions
export {
  createDatabase,
  updateDatabase,
  addDatabaseField,
  archiveDatabase,
  createRecord,
  updateRecord,
  deleteRecord,
  createView,
  updateView,
  deleteView,
  createAutomation,
  updateAutomation,
  deleteAutomation,
} from "../interfaces/_actions/database.actions";

// Queries
export {
  getDatabases,
  getDatabase,
  getRecords,
  getViews,
  getAutomations,
} from "../interfaces/queries";

// UI components
export { DatabaseDialog } from "../interfaces/components/DatabaseDialog";
export { DatabaseTableView } from "../interfaces/components/DatabaseTableView";
export { DatabaseBoardView } from "../interfaces/components/DatabaseBoardView";
export { DatabaseListView } from "../interfaces/components/DatabaseListView";
export { DatabaseCalendarView } from "../interfaces/components/DatabaseCalendarView";
export { DatabaseGalleryView } from "../interfaces/components/DatabaseGalleryView";
export { DatabaseFormView } from "../interfaces/components/DatabaseFormView";
export { DatabaseAutomationView } from "../interfaces/components/DatabaseAutomationView";
export { KnowledgeDatabasesRouteScreen } from "../interfaces/components/KnowledgeDatabasesRouteScreen";
export { AddFieldDialog, FIELD_TYPES } from "../interfaces/components/DatabaseAddFieldDialog";
export { DatabaseDetailPage } from "../interfaces/components/DatabaseDetailPage";
export type { DatabaseDetailPageProps } from "../interfaces/components/DatabaseDetailPage";
export { DatabaseFormsPage } from "../interfaces/components/DatabaseFormsPage";
export type { DatabaseFormsPageProps } from "../interfaces/components/DatabaseFormsPage";
````

## File: modules/notion/subdomains/database/application/dto/database.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the database subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { DatabaseSnapshot, Field, FieldType } from "../../domain/aggregates/Database";
export type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
export type { ViewSnapshot } from "../../domain/aggregates/View";
export type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType } from "../../domain/aggregates/DatabaseAutomation";
export type { CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/IAutomationRepository";
````

## File: modules/notion/subdomains/database/application/dto/DatabaseDto.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/dto
 * Purpose: Zod validation schemas for all database, record, and view commands.
 */

import { z } from "@lib-zod";

// ----- Shared scope -----

const WorkspaceScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

// ----- Database -----

export const CreateDatabaseSchema = WorkspaceScopeSchema.extend({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateDatabaseDto = z.infer<typeof CreateDatabaseSchema>;

export const UpdateDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  icon: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
});
export type UpdateDatabaseDto = z.infer<typeof UpdateDatabaseSchema>;

const FieldTypeSchema = z.enum([
  "text", "number", "select", "multi_select", "date",
  "checkbox", "url", "email", "relation", "formula", "rollup",
]);

export const AddFieldSchema = z.object({
  databaseId: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(100),
  type: FieldTypeSchema,
  config: z.record(z.string(), z.unknown()).optional(),
  required: z.boolean().optional(),
});
export type AddFieldDto = z.infer<typeof AddFieldSchema>;

export const ArchiveDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type ArchiveDatabaseDto = z.infer<typeof ArchiveDatabaseSchema>;

export const GetDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type GetDatabaseDto = z.infer<typeof GetDatabaseSchema>;

export const ListDatabasesSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});
export type ListDatabasesDto = z.infer<typeof ListDatabasesSchema>;

// ----- Record -----

export const CreateRecordSchema = WorkspaceScopeSchema.extend({
  databaseId: z.string().min(1),
  pageId: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateRecordDto = z.infer<typeof CreateRecordSchema>;

export const UpdateRecordSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  properties: z.record(z.string(), z.unknown()),
});
export type UpdateRecordDto = z.infer<typeof UpdateRecordSchema>;

export const DeleteRecordSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteRecordDto = z.infer<typeof DeleteRecordSchema>;

export const ListRecordsSchema = z.object({
  accountId: z.string().min(1),
  databaseId: z.string().min(1),
});
export type ListRecordsDto = z.infer<typeof ListRecordsSchema>;

// ----- View -----

const ViewTypeSchema = z.enum(["table", "board", "list", "calendar", "timeline", "gallery"]);

export const CreateViewSchema = WorkspaceScopeSchema.extend({
  databaseId: z.string().min(1),
  name: z.string().min(1).max(200),
  type: ViewTypeSchema,
  createdByUserId: z.string().min(1),
});
export type CreateViewDto = z.infer<typeof CreateViewSchema>;

export const UpdateViewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  filters: z.array(z.any()).optional(),
  sorts: z.array(z.any()).optional(),
  visibleFieldIds: z.array(z.string()).optional(),
  hiddenFieldIds: z.array(z.string()).optional(),
});
export type UpdateViewDto = z.infer<typeof UpdateViewSchema>;

export const DeleteViewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteViewDto = z.infer<typeof DeleteViewSchema>;

export const ListViewsSchema = z.object({
  accountId: z.string().min(1),
  databaseId: z.string().min(1),
});
export type ListViewsDto = z.infer<typeof ListViewsSchema>;
````

## File: modules/notion/subdomains/database/application/dto/index.ts
````typescript
export type {
  CreateDatabaseDto, UpdateDatabaseDto, AddFieldDto, ArchiveDatabaseDto, GetDatabaseDto, ListDatabasesDto,
  CreateRecordDto, UpdateRecordDto, DeleteRecordDto, ListRecordsDto,
  CreateViewDto, UpdateViewDto, DeleteViewDto, ListViewsDto,
} from "./DatabaseDto";
export {
  CreateDatabaseSchema, UpdateDatabaseSchema, AddFieldSchema, ArchiveDatabaseSchema, GetDatabaseSchema, ListDatabasesSchema,
  CreateRecordSchema, UpdateRecordSchema, DeleteRecordSchema, ListRecordsSchema,
  CreateViewSchema, UpdateViewSchema, DeleteViewSchema, ListViewsSchema,
} from "./DatabaseDto";

export {};
````

## File: modules/notion/subdomains/database/application/use-cases/index.ts
````typescript
export { CreateDatabaseUseCase, UpdateDatabaseUseCase, AddFieldUseCase, ArchiveDatabaseUseCase, GetDatabaseUseCase, ListDatabasesUseCase } from "./DatabaseUseCases";
export { CreateRecordUseCase, UpdateRecordUseCase, DeleteRecordUseCase, ListRecordsUseCase } from "./RecordUseCases";
export { CreateViewUseCase, UpdateViewUseCase, DeleteViewUseCase, ListViewsUseCase } from "./ViewUseCases";
export { CreateAutomationUseCase, UpdateAutomationUseCase, DeleteAutomationUseCase, ListAutomationsUseCase } from "./AutomationUseCases";
````

## File: modules/notion/subdomains/database/domain/aggregates/Database.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: Database aggregate root — structured data container with named fields.
 */

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "relation"
  | "formula"
  | "rollup";

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  config: Record<string, unknown>;
  required: boolean;
  order: number;
}

export interface DatabaseSnapshot {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description: string | null;
  fields: Field[];
  viewIds: string[];
  icon: string | null;
  coverImageUrl: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export type DatabaseId = string;
export type FieldId = string;
````

## File: modules/notion/subdomains/database/domain/aggregates/DatabaseAutomation.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseAutomation aggregate — event-driven automation rules on a database.
 */

export type AutomationTrigger =
  | "record_created"
  | "record_updated"
  | "record_deleted"
  | "property_changed";

export type AutomationActionType =
  | "send_notification"
  | "update_property"
  | "create_record"
  | "webhook";

export interface AutomationCondition {
  fieldId: string;
  operator: "equals" | "not_equals" | "is_empty" | "is_not_empty" | "contains";
  value?: unknown;
}

export interface AutomationAction {
  type: AutomationActionType;
  config: Record<string, string>;
}

export interface DatabaseAutomationSnapshot {
  id: string;
  databaseId: string;
  accountId: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAtISO: string;
  updatedAtISO: string;
}

export type AutomationId = string;
````

## File: modules/notion/subdomains/database/domain/aggregates/DatabaseRecord.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseRecord aggregate — a single row in a Database, optionally linked to a page.
 */

export interface DatabaseRecordSnapshot {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  /** Links this record to a KnowledgePage (Article-Record identity pattern). */
  pageId: string | null;
  properties: Record<string, unknown>;
  order: number;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export type RecordId = string;
````

## File: modules/notion/subdomains/database/domain/aggregates/index.ts
````typescript
export type { DatabaseSnapshot, Field, FieldType, DatabaseId, FieldId } from "./Database";
export type { DatabaseRecordSnapshot, RecordId } from "./DatabaseRecord";
export type { ViewSnapshot, ViewType, FilterRule, SortRule, ViewId } from "./View";
export type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType, AutomationCondition, AutomationAction, AutomationId } from "./DatabaseAutomation";
````

## File: modules/notion/subdomains/database/domain/aggregates/View.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: View aggregate — configures how records are displayed in a Database.
 */

export type ViewType = "table" | "board" | "list" | "calendar" | "timeline" | "gallery";

export interface FilterRule {
  fieldId: string;
  operator: "eq" | "neq" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "gt" | "lt";
  value: unknown;
}

export interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}

export interface ViewSnapshot {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  type: ViewType;
  filters: FilterRule[];
  sorts: SortRule[];
  groupBy: { fieldId: string; direction: "asc" | "desc" } | null;
  visibleFieldIds: string[];
  hiddenFieldIds: string[];
  boardGroupFieldId: string | null;
  calendarDateFieldId: string | null;
  timelineStartFieldId: string | null;
  timelineEndFieldId: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export type ViewId = string;
````

## File: modules/notion/subdomains/database/domain/events/index.ts
````typescript
// TODO: export DatabaseEvents
// knowledge-database.database_created | database_renamed
// knowledge-database.field_added | field_deleted
// knowledge-database.record_added | record_updated | record_deleted | record_linked
// knowledge-database.view_created | view_updated

export {};
````

## File: modules/notion/subdomains/database/domain/repositories/IAutomationRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: Repository interface for DatabaseAutomation aggregate.
 */

import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
  AutomationTrigger,
} from "../aggregates/DatabaseAutomation";

export interface CreateAutomationInput {
  databaseId: string;
  accountId: string;
  name: string;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
  createdByUserId: string;
}

export interface UpdateAutomationInput {
  id: string;
  accountId: string;
  databaseId: string;
  name?: string;
  enabled?: boolean;
  trigger?: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
}

export interface IAutomationRepository {
  create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot>;
  update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null>;
  delete(id: string, accountId: string, databaseId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>;
}
````

## File: modules/notion/subdomains/database/domain/repositories/IDatabaseRecordRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: IDatabaseRecordRepository — persistence contract for DatabaseRecord aggregate.
 */

import type { DatabaseRecordSnapshot } from "../aggregates/DatabaseRecord";

export interface CreateRecordInput {
  accountId: string;
  workspaceId: string;
  databaseId: string;
  pageId?: string;
  properties?: Record<string, unknown>;
  createdByUserId: string;
}

export interface UpdateRecordInput {
  id: string;
  accountId: string;
  properties: Record<string, unknown>;
}

export interface IDatabaseRecordRepository {
  create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot>;
  update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot>;
  delete(id: string, accountId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]>;
}
````

## File: modules/notion/subdomains/database/domain/repositories/IDatabaseRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: IDatabaseRepository — persistence contract for the Database aggregate.
 */

import type { DatabaseSnapshot, Field, FieldType } from "../aggregates/Database";

export interface CreateDatabaseInput {
  accountId: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdByUserId: string;
}

export interface UpdateDatabaseInput {
  id: string;
  accountId: string;
  name?: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
}

export interface AddFieldInput {
  databaseId: string;
  accountId: string;
  name: string;
  type: FieldType;
  config?: Record<string, unknown>;
  required?: boolean;
}

export interface IDatabaseRepository {
  create(input: CreateDatabaseInput): Promise<DatabaseSnapshot>;
  update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot>;
  addField(input: AddFieldInput): Promise<Field>;
  archive(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<DatabaseSnapshot | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]>;
}
````

## File: modules/notion/subdomains/database/domain/repositories/index.ts
````typescript
export type { IDatabaseRepository, CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "./IDatabaseRepository";
export type { IDatabaseRecordRepository, CreateRecordInput, UpdateRecordInput } from "./IDatabaseRecordRepository";
export type { IViewRepository, CreateViewInput, UpdateViewInput } from "./IViewRepository";
export type { IAutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "./IAutomationRepository";
````

## File: modules/notion/subdomains/database/domain/repositories/IViewRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: IViewRepository — persistence contract for View aggregate.
 */

import type { ViewSnapshot, ViewType, FilterRule, SortRule } from "../aggregates/View";

export interface CreateViewInput {
  accountId: string;
  workspaceId: string;
  databaseId: string;
  name: string;
  type: ViewType;
  createdByUserId: string;
}

export interface UpdateViewInput {
  id: string;
  accountId: string;
  name?: string;
  filters?: FilterRule[];
  sorts?: SortRule[];
  visibleFieldIds?: string[];
  hiddenFieldIds?: string[];
}

export interface IViewRepository {
  create(input: CreateViewInput): Promise<ViewSnapshot>;
  update(input: UpdateViewInput): Promise<ViewSnapshot>;
  delete(id: string, accountId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]>;
}
````

## File: modules/notion/subdomains/database/domain/services/index.ts
````typescript
// TODO: export DatabaseQueryService (filter/sort/group evaluation)
// TODO: export FormulaEvaluationService, RollupComputationService

export {};
````

## File: modules/notion/subdomains/database/domain/value-objects/index.ts
````typescript
// TODO: export DatabaseId, RecordId, ViewId, FieldId
// TODO: export FieldType, ViewType, FieldValue

export {};
````

## File: modules/notion/subdomains/database/infrastructure/firebase/FirebaseAutomationRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}/automations/{automationId}
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
} from "../../domain/aggregates/DatabaseAutomation";
import type { IAutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/IAutomationRepository";

function automationsCol(db: ReturnType<typeof getFirestore>, accountId: string, databaseId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases", databaseId, "automations");
}

function automationDocRef(db: ReturnType<typeof getFirestore>, accountId: string, databaseId: string, automationId: string) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", databaseId, "automations", automationId);
}

function toCondition(c: Record<string, unknown>): AutomationCondition {
  return {
    fieldId: typeof c.fieldId === "string" ? c.fieldId : "",
    operator: (c.operator as AutomationCondition["operator"]) ?? "equals",
    value: typeof c.value === "string" ? c.value : undefined,
  };
}

function toAction(a: Record<string, unknown>): AutomationAction {
  return {
    type: (a.type as AutomationAction["type"]) ?? "send_notification",
    config: typeof a.config === "object" && a.config !== null ? (a.config as Record<string, string>) : {},
  };
}

function toAutomation(id: string, data: Record<string, unknown>): DatabaseAutomationSnapshot {
  return {
    id,
    databaseId: typeof data.databaseId === "string" ? data.databaseId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    enabled: data.enabled !== false,
    trigger: (data.trigger as DatabaseAutomationSnapshot["trigger"]) ?? "record_created",
    triggerFieldId: typeof data.triggerFieldId === "string" ? data.triggerFieldId : undefined,
    conditions: Array.isArray(data.conditions) ? (data.conditions as Record<string, unknown>[]).map(toCondition) : [],
    actions: Array.isArray(data.actions) ? (data.actions as Record<string, unknown>[]).map(toAction) : [],
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : new Date().toISOString(),
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : new Date().toISOString(),
  };
}

export class FirebaseAutomationRepository implements IAutomationRepository {
  private readonly db = getFirestore(firebaseClientApp);

  async create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot> {
    const id = generateId();
    const now = new Date().toISOString();
    const docRef = automationDocRef(this.db, input.accountId, input.databaseId, id);
    const payload = {
      databaseId: input.databaseId,
      accountId: input.accountId,
      name: input.name,
      enabled: true,
      trigger: input.trigger,
      triggerFieldId: input.triggerFieldId ?? null,
      conditions: input.conditions ?? [],
      actions: input.actions ?? [],
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
      serverCreatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    return toAutomation(id, payload);
  }

  async update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null> {
    const { id, accountId, databaseId, ...fields } = input;
    const docRef = automationDocRef(this.db, accountId, databaseId, id);
    const updates: Record<string, unknown> = { ...fields, updatedAtISO: new Date().toISOString() };
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return toAutomation(id, snap.data() as Record<string, unknown>);
  }

  async delete(id: string, accountId: string, databaseId: string): Promise<void> {
    await deleteDoc(automationDocRef(this.db, accountId, databaseId, id));
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    const q = query(
      automationsCol(this.db, accountId, databaseId),
      where("databaseId", "==", databaseId),
      orderBy("createdAtISO", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toAutomation(d.id, d.data() as Record<string, unknown>));
  }
}
````

## File: modules/notion/subdomains/database/infrastructure/firebase/FirebaseDatabaseRecordRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IDatabaseRecordRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{recordId}
 */

import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@integration-firebase/firestore";

const db = getFirebaseFirestore();
import type { IDatabaseRecordRepository, CreateRecordInput, UpdateRecordInput } from "../../domain/repositories/IDatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";

function recordsCol(accountId: string, databaseId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases", databaseId, "records");
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): DatabaseRecordSnapshot {
  return {
    id,
    databaseId: data.databaseId ?? "",
    workspaceId: data.workspaceId ?? "",
    accountId: data.accountId ?? "",
    pageId: data.pageId ?? null,
    properties: typeof data.properties === "object" && data.properties !== null ? data.properties : {},
    order: typeof data.order === "number" ? data.order : 0,
    createdByUserId: data.createdByUserId ?? "",
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}

export class FirebaseDatabaseRecordRepository implements IDatabaseRecordRepository {
  async create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot> {
    const col = recordsCol(input.accountId, input.databaseId);
    const countSnap = await getDocs(col);
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      pageId: input.pageId ?? null,
      properties: input.properties ?? {},
      order: countSnap.size,
      createdByUserId: input.createdByUserId,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(docRef.id, snap.data() as Record<string, any>);
  }

  async update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot> {
    // We need to find which database this record belongs to. Properties are keyed by field IDs.
    // The record stores databaseId on the document; we fetch it via a collection-group query approach.
    // For simplicity, the input should come from a context where databaseId is available.
    // Here we use a direct path by reading the doc first from a stored databaseId lookup.
    // Since the record doc lives in accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{id},
    // and we only have id+accountId, we do collection group query.
    const { id, accountId, properties } = input;
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(
      collectionGroup(db, "records"),
      where("accountId", "==", accountId),
    );
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === id);
    if (!target) throw new Error(`Record ${id} not found`);
    await updateDoc(target.ref, { properties, updatedAt: serverTimestamp() });
    const refreshed = await getDoc(target.ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(id, refreshed.data() as Record<string, any>);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(collectionGroup(db, "records"), where("accountId", "==", accountId));
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === id);
    if (target) await deleteDoc(target.ref);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
    const snaps = await getDocs(recordsCol(accountId, databaseId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, any>));
  }
}
````

## File: modules/notion/subdomains/database/infrastructure/firebase/FirebaseDatabaseRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IDatabaseRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@integration-firebase/firestore";

const db = getFirebaseFirestore();
import { generateId } from "@shared-utils";
import type { IDatabaseRepository, CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "../../domain/repositories/IDatabaseRepository";
import type { DatabaseSnapshot, Field } from "../../domain/aggregates/Database";

function databasesCol(accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases");
}

function databaseDoc(accountId: string, id: string) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", id);
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): DatabaseSnapshot {
  return {
    id,
    workspaceId: data.workspaceId ?? "",
    accountId: data.accountId ?? "",
    name: data.name ?? "",
    description: data.description ?? null,
    fields: Array.isArray(data.fields) ? data.fields : [],
    viewIds: Array.isArray(data.viewIds) ? data.viewIds : [],
    icon: data.icon ?? null,
    coverImageUrl: data.coverImageUrl ?? null,
    createdByUserId: data.createdByUserId ?? "",
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}

export class FirebaseDatabaseRepository implements IDatabaseRepository {
  async create(input: CreateDatabaseInput): Promise<DatabaseSnapshot> {
    const col = databasesCol(input.accountId);
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      name: input.name,
      description: input.description ?? null,
      fields: [],
      viewIds: [],
      icon: null,
      coverImageUrl: null,
      createdByUserId: input.createdByUserId,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(docRef.id, snap.data() as Record<string, any>);
  }

  async update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot> {
    const ref = databaseDoc(input.accountId, input.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAt: serverTimestamp() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.description !== undefined) changes.description = input.description;
    if (input.icon !== undefined) changes.icon = input.icon;
    if (input.coverImageUrl !== undefined) changes.coverImageUrl = input.coverImageUrl;
    await updateDoc(ref, changes);
    const snap = await getDoc(ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(input.id, snap.data() as Record<string, any>);
  }

  async addField(input: AddFieldInput): Promise<Field> {
    const ref = databaseDoc(input.accountId, input.databaseId);
    const snap = await getDoc(ref);
    const data = snap.data() ?? {};
    const fields: Field[] = Array.isArray(data.fields) ? [...data.fields] : [];
    const newField: Field = {
      id: generateId(),
      name: input.name,
      type: input.type,
      config: input.config ?? {},
      required: input.required ?? false,
      order: fields.length,
    };
    fields.push(newField);
    await updateDoc(ref, { fields, updatedAt: serverTimestamp() });
    return newField;
  }

  async archive(id: string, accountId: string): Promise<void> {
    const ref = databaseDoc(accountId, id);
    await updateDoc(ref, { archived: true, archivedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  async findById(id: string, accountId: string): Promise<DatabaseSnapshot | null> {
    const snap = await getDoc(databaseDoc(accountId, id));
    if (!snap.exists()) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(id, snap.data() as Record<string, any>);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
    const q = query(databasesCol(accountId), where("workspaceId", "==", workspaceId), where("archived", "!=", true));
    const snaps = await getDocs(q);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, any>));
  }
}
````

## File: modules/notion/subdomains/database/infrastructure/firebase/FirebaseViewRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IViewRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/views/{viewId}
 */

import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@integration-firebase/firestore";

const db = getFirebaseFirestore();
import type { IViewRepository, CreateViewInput, UpdateViewInput } from "../../domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";

function viewsCol(accountId: string, databaseId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases", databaseId, "views");
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): ViewSnapshot {
  return {
    id,
    databaseId: data.databaseId ?? "",
    workspaceId: data.workspaceId ?? "",
    accountId: data.accountId ?? "",
    name: data.name ?? "",
    type: data.type ?? "table",
    filters: Array.isArray(data.filters) ? data.filters : [],
    sorts: Array.isArray(data.sorts) ? data.sorts : [],
    groupBy: data.groupBy ?? null,
    visibleFieldIds: Array.isArray(data.visibleFieldIds) ? data.visibleFieldIds : [],
    hiddenFieldIds: Array.isArray(data.hiddenFieldIds) ? data.hiddenFieldIds : [],
    boardGroupFieldId: data.boardGroupFieldId ?? null,
    calendarDateFieldId: data.calendarDateFieldId ?? null,
    timelineStartFieldId: data.timelineStartFieldId ?? null,
    timelineEndFieldId: data.timelineEndFieldId ?? null,
    createdByUserId: data.createdByUserId ?? "",
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}

export class FirebaseViewRepository implements IViewRepository {
  async create(input: CreateViewInput): Promise<ViewSnapshot> {
    const col = viewsCol(input.accountId, input.databaseId);
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      name: input.name,
      type: input.type,
      filters: [],
      sorts: [],
      groupBy: null,
      visibleFieldIds: [],
      hiddenFieldIds: [],
      boardGroupFieldId: null,
      calendarDateFieldId: null,
      timelineStartFieldId: null,
      timelineEndFieldId: null,
      createdByUserId: input.createdByUserId,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(docRef.id, snap.data() as Record<string, any>);
  }

  async update(input: UpdateViewInput): Promise<ViewSnapshot> {
    // Fetch databaseId via collection group since we only have id+accountId
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(collectionGroup(db, "views"), where("accountId", "==", input.accountId));
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === input.id);
    if (!target) throw new Error(`View ${input.id} not found`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAt: serverTimestamp() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.filters !== undefined) changes.filters = input.filters;
    if (input.sorts !== undefined) changes.sorts = input.sorts;
    if (input.visibleFieldIds !== undefined) changes.visibleFieldIds = input.visibleFieldIds;
    if (input.hiddenFieldIds !== undefined) changes.hiddenFieldIds = input.hiddenFieldIds;
    await updateDoc(target.ref, changes);
    const refreshed = await getDoc(target.ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(input.id, refreshed.data() as Record<string, any>);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(collectionGroup(db, "views"), where("accountId", "==", accountId));
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === id);
    if (target) await deleteDoc(target.ref);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
    const snaps = await getDocs(viewsCol(accountId, databaseId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, any>));
  }
}
````

## File: modules/notion/subdomains/database/infrastructure/firebase/index.ts
````typescript
export { FirebaseDatabaseRepository } from "./FirebaseDatabaseRepository";
export { FirebaseDatabaseRecordRepository } from "./FirebaseDatabaseRecordRepository";
export { FirebaseViewRepository } from "./FirebaseViewRepository";
export { FirebaseAutomationRepository } from "./FirebaseAutomationRepository";
````

## File: modules/notion/subdomains/database/infrastructure/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/subdomains/database/interfaces/_actions/database.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/_actions
 * Purpose: Database, Record, View, and Automation server actions.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../../api/factories";
import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
} from "../../application/use-cases";
import type { CreateAutomationInput, UpdateAutomationInput } from "../../application/dto/database.dto";
import type {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  AddFieldDto,
  ArchiveDatabaseDto,
  CreateRecordDto,
  UpdateRecordDto,
  CreateViewDto,
  UpdateViewDto,
  DeleteViewDto,
} from "../../application/dto/DatabaseDto";

// — — — Database — — —

export async function createDatabase(input: CreateDatabaseDto): Promise<CommandResult> {
  try {
    return await new CreateDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateDatabase(input: UpdateDatabaseDto): Promise<CommandResult> {
  try {
    return await new UpdateDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function addDatabaseField(input: AddFieldDto): Promise<CommandResult> {
  try {
    return await new AddFieldUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_ADD_FIELD_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function archiveDatabase(input: ArchiveDatabaseDto): Promise<CommandResult> {
  try {
    return await new ArchiveDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — Record — — —

export async function createRecord(input: CreateRecordDto): Promise<CommandResult> {
  try {
    return await new CreateRecordUseCase(makeRecordRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("RECORD_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateRecord(input: UpdateRecordDto): Promise<CommandResult> {
  try {
    return await new UpdateRecordUseCase(makeRecordRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("RECORD_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteRecord(accountId: string, id: string): Promise<CommandResult> {
  try {
    return await new DeleteRecordUseCase(makeRecordRepo()).execute({ id, accountId });
  } catch (err) {
    return commandFailureFrom("RECORD_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — View — — —

export async function createView(input: CreateViewDto): Promise<CommandResult> {
  try {
    return await new CreateViewUseCase(makeViewRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateView(input: UpdateViewDto): Promise<CommandResult> {
  try {
    return await new UpdateViewUseCase(makeViewRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteView(input: DeleteViewDto): Promise<CommandResult> {
  try {
    return await new DeleteViewUseCase(makeViewRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — Automation — — —

export async function createAutomation(input: CreateAutomationInput): Promise<CommandResult> {
  try {
    return await new CreateAutomationUseCase(makeAutomationRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateAutomation(input: UpdateAutomationInput): Promise<CommandResult> {
  try {
    return await new UpdateAutomationUseCase(makeAutomationRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteAutomation(id: string, accountId: string, databaseId: string): Promise<CommandResult> {
  try {
    return await new DeleteAutomationUseCase(makeAutomationRepo()).execute(id, accountId, databaseId);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/notion/subdomains/database/interfaces/_actions/index.ts
````typescript
export {
  createDatabase,
  updateDatabase,
  addDatabaseField,
  archiveDatabase,
  createRecord,
  updateRecord,
  deleteRecord,
  createView,
  updateView,
  deleteView,
  createAutomation,
  updateAutomation,
  deleteAutomation,
} from "./database.actions";
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseAddFieldDialog.tsx
````typescript
"use client";

import { useState } from "react";

import type { FieldType } from "@/modules/notion/api";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui-shadcn/ui/select";

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "文字" },
  { value: "number", label: "數字" },
  { value: "checkbox", label: "核取方塊" },
  { value: "date", label: "日期" },
  { value: "select", label: "單選" },
  { value: "multi_select", label: "多選" },
  { value: "url", label: "URL" },
  { value: "email", label: "電子郵件" },
];

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (name: string, type: FieldType, required: boolean) => void;
  isPending: boolean;
}

export function AddFieldDialog({ open, onOpenChange, onAdd, isPending }: AddFieldDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [required, setRequired] = useState(false);

  function reset() {
    setName(""); setType("text"); setRequired(false);
  }

  function handleOpenChange(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), type, required);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>新增欄位</DialogTitle></DialogHeader>
        <form id="field-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="field-name">名稱 *</Label>
            <Input id="field-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} placeholder="欄位名稱" />
          </div>
          <div className="space-y-1.5">
            <Label>類型</Label>
            <Select value={type} onValueChange={(v) => setType(v as FieldType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((ft) => (
                  <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="field-required"
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="field-required" className="cursor-pointer">必填欄位</Label>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>取消</Button>
          <Button type="submit" form="field-form" disabled={isPending || !name.trim()}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseAutomationView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: Manage automation rules for a database — list/create/toggle/delete.
 */

import { useEffect, useState, useTransition } from "react";
import type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType } from "../../application/dto/database.dto";
import { getAutomations } from "../queries";
import { createAutomation, updateAutomation, deleteAutomation } from "../_actions/database.actions";

interface Props {
  databaseId: string;
  accountId: string;
  currentUserId: string;
}

const TRIGGER_OPTIONS: { value: AutomationTrigger; label: string }[] = [
  { value: "record_created", label: "Record created" },
  { value: "record_updated", label: "Record updated" },
  { value: "record_deleted", label: "Record deleted" },
  { value: "property_changed", label: "Property changed" },
];

const ACTION_OPTIONS: { value: AutomationActionType; label: string }[] = [
  { value: "send_notification", label: "Send notification" },
  { value: "update_property", label: "Update property" },
  { value: "create_record", label: "Create record" },
  { value: "webhook", label: "Call webhook" },
];

export function DatabaseAutomationView({ databaseId, accountId, currentUserId }: Props) {
  const [automations, setAutomations] = useState<DatabaseAutomationSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<AutomationTrigger>("record_created");
  const [actionType, setActionType] = useState<AutomationActionType>("send_notification");
  const [, startTransition] = useTransition();

  useEffect(() => {
    getAutomations(accountId, databaseId)
      .then(setAutomations)
      .finally(() => setLoading(false));
  }, [accountId, databaseId]);

  function handleCreate() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createAutomation({
        databaseId,
        accountId,
        name: name.trim(),
        trigger,
        actions: [{ type: actionType, config: {} }],
        createdByUserId: currentUserId,
      });
      if (result.success) {
        const updated = await getAutomations(accountId, databaseId);
        setAutomations(updated);
        setName("");
        setShowForm(false);
      }
    });
  }

  function handleToggle(automation: DatabaseAutomationSnapshot) {
    startTransition(async () => {
      await updateAutomation({
        id: automation.id,
        accountId,
        databaseId,
        enabled: !automation.enabled,
      });
      setAutomations((prev) =>
        prev.map((a) => (a.id === automation.id ? { ...a, enabled: !a.enabled } : a)),
      );
    });
  }

  function handleDelete(automationId: string) {
    startTransition(async () => {
      await deleteAutomation(automationId, accountId, databaseId);
      setAutomations((prev) => prev.filter((a) => a.id !== automationId));
    });
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading automations…</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Automations</h3>
        <button
          className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
          onClick={() => setShowForm((v) => !v)}
        >
          + New automation
        </button>
      </div>

      {showForm && (
        <div className="border rounded p-3 space-y-2 text-sm">
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Automation name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1 text-xs flex-1"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
            >
              {TRIGGER_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1 text-xs flex-1"
              value={actionType}
              onChange={(e) => setActionType(e.target.value as AutomationActionType)}
            >
              {ACTION_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="text-xs px-3 py-1 rounded bg-primary text-primary-foreground"
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              className="text-xs px-3 py-1 rounded border"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {automations.length === 0 ? (
        <p className="text-xs text-muted-foreground">No automations yet.</p>
      ) : (
        <ul className="space-y-2">
          {automations.map((a) => (
            <li key={a.id} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
              <div className="space-y-0.5">
                <p className="font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  Trigger: {a.trigger} · Action: {a.actions[0]?.type ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`text-xs px-2 py-0.5 rounded ${a.enabled ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                  onClick={() => handleToggle(a)}
                >
                  {a.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  className="text-xs text-destructive"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseBoardView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseBoardView — Kanban board grouped by first select/multi_select field.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../application/dto/database.dto";

interface DatabaseBoardViewProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

export function DatabaseBoardView({ database, accountId, workspaceId, currentUserId }: DatabaseBoardViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const groupField = database.fields.find((f) => f.type === "select" || f.type === "multi_select") ?? null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  function getTitle(record: DatabaseRecordSnapshot): string {
    const textField = database.fields.find((f) => f.type === "text");
    if (!textField) return record.id.slice(0, 8);
    return String(getProperty(record, textField.id) ?? "—");
  }

  const groups: Record<string, DatabaseRecordSnapshot[]> = {};
  if (!groupField) {
    groups["所有記錄"] = records;
  } else {
    for (const record of records) {
      const val = getProperty(record, groupField.id);
      const key = val != null && val !== "" ? String(val) : "（無分組）";
      (groups[key] ??= []).push(record);
    }
    if ("（無分組）" in groups) {
      const noGroup = groups["（無分組）"];
      delete groups["（無分組）"];
      groups["（無分組）"] = noGroup;
    }
  }

  function handleAdd(groupValue: string) {
    startTransition(async () => {
      const props: Record<string, unknown> = groupField && groupValue !== "（無分組）" && groupValue !== "所有記錄"
        ? { [groupField.id]: groupValue }
        : {};
      await createRecord({ databaseId: database.id, workspaceId, accountId, properties: props, createdByUserId: currentUserId });
      void load();
    });
  }

  function handleDelete(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    });
  }

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 w-48 shrink-0 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {Object.entries(groups).map(([group, groupRecords]) => (
        <div key={group} className="flex w-52 shrink-0 flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">{group}</Badge>
            <span className="text-[10px] text-muted-foreground">{groupRecords.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {groupRecords.map((record) => (
              <div key={record.id} className="group relative rounded-md border border-border/60 bg-card px-3 py-2 shadow-sm">
                <p className="text-sm font-medium leading-snug">{getTitle(record)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 hidden h-5 w-5 text-muted-foreground hover:text-destructive group-hover:flex"
                  disabled={isPending}
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            disabled={isPending}
            onClick={() => handleAdd(group)}
          >
            <Plus className="mr-1 h-3 w-3" /> 新增
          </Button>
        </div>
      ))}
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseCalendarView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseCalendarView — month-grid calendar grouped by a date field.
 */

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../application/dto/database.dto";

interface DatabaseCalendarViewProps {
  database: DatabaseSnapshot;
  accountId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

export function DatabaseCalendarView({ database, accountId }: DatabaseCalendarViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => new Date());

  const dateField = database.fields.find((f) => f.type === "date") ?? null;
  const titleField = database.fields.find((f) => f.type === "text") ?? null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const recordsByDay: Record<string, DatabaseRecordSnapshot[]> = {};
  if (dateField) {
    for (const record of records) {
      const val = getProperty(record, dateField.id);
      if (!val) continue;
      try {
        const d = new Date(String(val));
        if (!isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month) {
          const key = String(d.getDate());
          (recordsByDay[key] ??= []).push(record);
        }
      } catch {}
    }
  }

  function prevMonth() { setCursor(new Date(year, month - 1, 1)); }
  function nextMonth() { setCursor(new Date(year, month + 1, 1)); }

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  if (!dateField) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        此資料庫未包含「日期」欄位，無法顯示日曆視圖。
      </p>
    );
  }

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {year}年 {month + 1}月
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60">
        <div className="grid grid-cols-7 bg-muted/30">
          {weekDays.map((d) => (
            <div key={d} className="px-2 py-1.5 text-center text-[10px] font-semibold text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-border/40">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[60px] border-b border-r border-border/30 bg-muted/10" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayRecords = recordsByDay[String(day)] ?? [];
            const today = new Date();
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            return (
              <div key={day} className={`min-h-[60px] border-b border-r border-border/30 p-1 ${isToday ? "bg-primary/5" : ""}`}>
                <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {dayRecords.slice(0, 3).map((record) => {
                    const title = titleField ? String(getProperty(record, titleField.id) ?? "") || "—" : "—";
                    return (
                      <Badge key={record.id} variant="secondary" className="w-full justify-start truncate text-[9px]">
                        {title}
                      </Badge>
                    );
                  })}
                  {dayRecords.length > 3 && (
                    <span className="text-[9px] text-muted-foreground">+{dayRecords.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseDetailPage.tsx
````typescript
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Archive,
  FileText,
  PlusCircle,
  Table2,
  Kanban,
  List,
  Calendar,
  LayoutGrid,
  Zap,
} from "lucide-react";

import { getDatabase } from "../queries";
import { addDatabaseField, archiveDatabase } from "../_actions/database.actions";
import { DatabaseTableView } from "./DatabaseTableView";
import { DatabaseBoardView } from "./DatabaseBoardView";
import { DatabaseListView } from "./DatabaseListView";
import { DatabaseCalendarView } from "./DatabaseCalendarView";
import { DatabaseGalleryView } from "./DatabaseGalleryView";
import { DatabaseAutomationView } from "./DatabaseAutomationView";
import { AddFieldDialog } from "./DatabaseAddFieldDialog";
import type { DatabaseSnapshot as Database, FieldType } from "../../application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DatabaseDetailPageProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DatabaseDetailPage({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "board" | "list" | "calendar" | "gallery" | "automations">("table");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!accountId || !databaseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const db = await getDatabase(accountId, databaseId);
      setDatabase(db);
    } finally {
      setLoading(false);
    }
  }, [accountId, databaseId]);

  useEffect(() => { void load(); }, [load]);

  function handleAddField(name: string, type: FieldType, required: boolean) {
    startTransition(async () => {
      await addDatabaseField({
        databaseId,
        accountId,
        name,
        type,
        config: {},
        required,
      });
      await load();
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveDatabase({ id: databaseId, accountId });
      router.push("/knowledge-database/databases");
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!database) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge-database/databases")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 返回
        </Button>
        <p className="text-sm text-muted-foreground">找不到資料庫。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge-database/databases")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 資料庫列表
        </Button>
      </div>

      {/* Page header */}
      <header className="space-y-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          {database.icon && <span className="text-xl">{database.icon}</span>}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{database.name}</h1>
        </div>
        {database.description && (
          <p className="text-sm text-muted-foreground">{database.description}</p>
        )}
        <p className="text-xs text-muted-foreground/70">
          {database.fields.length} 個欄位 · 更新於 {new Date(database.updatedAtISO).toLocaleDateString("zh-TW")}
        </p>
      </header>

      {/* View switcher + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-md border border-border/60 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="表格視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Table2 className="h-3 w-3" /> 表格
          </button>
          <button
            type="button"
            onClick={() => setViewMode("board")}
            title="看板視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Kanban className="h-3 w-3" /> 看板
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="清單視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-3 w-3" /> 清單
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            title="日曆視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Calendar className="h-3 w-3" /> 日曆
          </button>
          <button
            type="button"
            onClick={() => setViewMode("gallery")}
            title="圖庫視圖"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "gallery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-3 w-3" /> 圖庫
          </button>
          <button
            type="button"
            onClick={() => setViewMode("automations")}
            title="自動化規則"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "automations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Zap className="h-3 w-3" /> 自動化
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/knowledge-database/databases/${databaseId}/forms`)}
            disabled={isPending}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" /> 表單
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddFieldOpen(true)} disabled={isPending}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> 新增欄位
          </Button>
          <Button size="sm" variant="outline" onClick={handleArchive} disabled={isPending}>
            <Archive className="mr-1.5 h-3.5 w-3.5" /> 封存
          </Button>
        </div>
      </div>

      {/* View */}
      {viewMode === "table" && (
        <DatabaseTableView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "board" && (
        <DatabaseBoardView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "list" && (
        <DatabaseListView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "calendar" && (
        <DatabaseCalendarView
          database={database}
          accountId={accountId}
        />
      )}
      {viewMode === "gallery" && (
        <DatabaseGalleryView
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "automations" && (
        <DatabaseAutomationView
          databaseId={databaseId}
          accountId={accountId}
          currentUserId={currentUserId}
        />
      )}

      <AddFieldDialog
        open={addFieldOpen}
        onOpenChange={setAddFieldOpen}
        onAdd={handleAddField}
        isPending={isPending}
      />
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseDialog.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseDialog — modal for creating a new Database.
 */

import { useState, useTransition } from "react";

import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { createDatabase } from "../_actions/database.actions";

interface DatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  onSuccess?: () => void;
}

export function DatabaseDialog({ open, onOpenChange, accountId, workspaceId, currentUserId, onSuccess }: DatabaseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setName("");
    setDescription("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await createDatabase({
        accountId,
        workspaceId,
        name: name.trim(),
        description: description.trim() || undefined,
        createdByUserId: currentUserId,
      });
      if (result.success) {
        handleOpenChange(false);
        onSuccess?.();
      } else {
        setError(result.error.message ?? "建立失敗");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增資料庫</DialogTitle>
        </DialogHeader>
        <form id="db-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="db-name">名稱 *</Label>
            <Input
              id="db-name"
              placeholder="資料庫名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="db-desc">說明</Label>
            <Textarea
              id="db-desc"
              placeholder="選填：說明此資料庫的用途"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            取消
          </Button>
          <Button type="submit" form="db-form" disabled={isPending || !name.trim()}>
            {isPending ? "建立中…" : "建立"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseFormsPage.tsx
````typescript
"use client";

/**
 * Route: /knowledge-database/databases/[databaseId]/forms
 * Purpose: Manage database forms — create and embed form links for a specific database.
 */

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";

import { getDatabase } from "../queries";
import { DatabaseFormView } from "./DatabaseFormView";
import type { DatabaseSnapshot as Database } from "../../application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DatabaseFormsPageProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DatabaseFormsPage({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseFormsPageProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "share">("preview");

  const load = useCallback(async () => {
    if (!accountId || !databaseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const db = await getDatabase(accountId, databaseId);
      setDatabase(db);
    } finally {
      setLoading(false);
    }
  }, [accountId, databaseId]);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!database) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 返回
        </Button>
        <p className="text-sm text-muted-foreground">找不到資料庫。</p>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/knowledge-database/databases/${databaseId}/forms`
    : "";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/knowledge-database/databases/${databaseId}`)}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 返回資料庫
        </Button>
        <div className="ml-auto">
          <Button size="sm" variant="outline" disabled>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> 建立新表單
          </Button>
        </div>
      </div>

      <header className="space-y-1 border-b border-border/60 pb-4">
        <h1 className="text-xl font-semibold">{database.name} — 表單</h1>
        <p className="text-sm text-muted-foreground">
          使用表單讓外部使用者提交記錄到此資料庫。
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "share")}>
        <TabsList>
          <TabsTrigger value="preview">預覽表單</TabsTrigger>
          <TabsTrigger value="share">分享設定</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card px-6 py-2">
            <DatabaseFormView
              database={database}
              accountId={accountId}
              workspaceId={workspaceId}
              submitterId={currentUserId}
              title={`${database.name} 表單`}
              description={database.description ?? undefined}
            />
          </div>
        </TabsContent>

        <TabsContent value="share" className="mt-4">
          <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">表單連結</p>
              <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span className="flex-1 truncate">{shareUrl}</span>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(shareUrl)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title="複製連結"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                分享此連結讓其他人填寫表單並將記錄直接存入資料庫。
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseFormView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseFormView — public-facing form to collect one Record into a Database.
 */

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { createRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field } from "../../application/dto/database.dto";

interface DatabaseFormViewProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  /** The user submitting the form. Pass anonymous ID or guest token for public forms. */
  submitterId: string;
  /** Optional: restrict to a subset of fields. */
  fieldIds?: string[];
  title?: string;
  description?: string;
}

function FieldInput({ field, value, onChange, disabled }: { field: Field; value: unknown; onChange: (v: unknown) => void; disabled: boolean }) {
  if (field.type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`field-${field.id}`}
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor={`field-${field.id}`}>{field.name}{field.required && " *"}</Label>
      </div>
    );
  }
  if (field.type === "number") {
    return (
      <div className="space-y-1">
        <Label htmlFor={`field-${field.id}`}>{field.name}{field.required && " *"}</Label>
        <Input
          id={`field-${field.id}`}
          type="number"
          value={value == null ? "" : String(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      </div>
    );
  }
  if (field.type === "date") {
    return (
      <div className="space-y-1">
        <Label htmlFor={`field-${field.id}`}>{field.name}{field.required && " *"}</Label>
        <Input
          id={`field-${field.id}`}
          type="date"
          value={value == null ? "" : String(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }
  if (field.type === "url" || field.type === "email") {
    return (
      <div className="space-y-1">
        <Label htmlFor={`field-${field.id}`}>{field.name}{field.required && " *"}</Label>
        <Input
          id={`field-${field.id}`}
          type={field.type}
          value={value == null ? "" : String(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <Label htmlFor={`field-${field.id}`}>{field.name}{field.required && " *"}</Label>
      <Textarea
        id={`field-${field.id}`}
        rows={2}
        value={value == null ? "" : String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function DatabaseFormView({ database, accountId, workspaceId, submitterId, fieldIds, title, description }: DatabaseFormViewProps) {
  const visibleFields = fieldIds && fieldIds.length > 0
    ? database.fields.filter((f) => fieldIds.includes(f.id))
    : database.fields;

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(fieldId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createRecord({
        databaseId: database.id,
        workspaceId,
        accountId,
        properties: values,
        createdByUserId: submitterId,
      });
      if (result.success) {
        setSubmitted(true);
        setValues({});
      } else {
        setError("提交失敗，請稍後再試。");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <h2 className="text-lg font-semibold">已成功提交！</h2>
        <p className="text-sm text-muted-foreground">感謝您的填寫。</p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          再次提交
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title ?? database.name}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {visibleFields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={(v) => handleChange(field.id, v)}
            disabled={isPending}
          />
        ))}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "提交中…" : "送出表單"}
        </Button>
      </form>
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseGalleryView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseGalleryView — card grid for database records.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../application/dto/database.dto";

interface DatabaseGalleryViewProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

export function DatabaseGalleryView({ database, accountId, workspaceId, currentUserId }: DatabaseGalleryViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const titleField = database.fields.find((f) => f.type === "text") ?? null;
  const metaFields = database.fields.filter((f) => f !== titleField).slice(0, 4);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  function handleAdd() {
    startTransition(async () => {
      await createRecord({ databaseId: database.id, workspaceId, accountId, properties: {}, createdByUserId: currentUserId });
      void load();
    });
  }

  function handleDelete(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    });
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {records.length === 0 ? (
          <p className="col-span-full rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">尚無記錄</p>
        ) : (
          records.map((record) => {
            const title = titleField ? String(getProperty(record, titleField.id) ?? "") || "（未命名）" : "（未命名）";
            return (
              <div key={record.id} className="group relative flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3 shadow-sm">
                <p className="truncate text-sm font-medium leading-snug">{title}</p>
                <div className="flex flex-wrap gap-1">
                  {metaFields.map((field) => {
                    const val = getProperty(record, field.id);
                    if (val == null || val === "") return null;
                    return (
                      <Badge key={field.id} variant="outline" className="text-[10px]">
                        {field.name}: {String(val).slice(0, 16)}
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 hidden h-6 w-6 text-muted-foreground hover:text-destructive group-hover:flex"
                  disabled={isPending}
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })
        )}
      </div>
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleAdd} className="w-full text-xs">
        <Plus className="mr-1.5 h-3 w-3" /> 新增記錄
      </Button>
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseListView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseListView — flat record list with fields as readable rows.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../application/dto/database.dto";

interface DatabaseListViewProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

function displayValue(val: unknown, type: string): string {
  if (val == null || val === "") return "";
  if (type === "checkbox") return val ? "✓" : "✗";
  return String(val);
}

export function DatabaseListView({ database, accountId, workspaceId, currentUserId }: DatabaseListViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const titleField = database.fields.find((f) => f.type === "text") ?? database.fields[0] ?? null;
  const secondaryFields = database.fields.filter((f) => f !== titleField);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    startTransition(async () => {
      await createRecord({ databaseId: database.id, workspaceId, accountId, properties: {}, createdByUserId: currentUserId });
      void load();
    });
  }

  function handleDelete(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    });
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {records.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">尚無記錄</p>
      ) : (
        records.map((record) => {
          const isOpen = expanded.has(record.id);
          const title = titleField ? displayValue(getProperty(record, titleField.id), titleField.type) || "（未命名）" : record.id.slice(0, 8);

          return (
            <div key={record.id} className="rounded-md border border-border/60 bg-card">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted"
                  onClick={() => toggleExpand(record.id)}
                >
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                <span className="flex-1 truncate text-sm font-medium text-foreground">{title}</span>
                <div className="hidden gap-1 sm:flex">
                  {secondaryFields.slice(0, 2).map((field) => {
                    const val = displayValue(getProperty(record, field.id), field.type);
                    if (!val) return null;
                    return (
                      <Badge key={field.id} variant="outline" className="text-[10px]">
                        {field.name}: {val.length > 12 ? `${val.slice(0, 12)}…` : val}
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {isOpen && (
                <div className="border-t border-border/40 px-4 py-3">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                    {database.fields.map((field) => {
                      const val = displayValue(getProperty(record, field.id), field.type);
                      return (
                        <div key={field.id} className="contents">
                          <dt className="text-muted-foreground">{field.name}</dt>
                          <dd className="text-foreground">{val || <span className="text-muted-foreground/50">—</span>}</dd>
                        </div>
                      );
                    })}
                    <div className="contents">
                      <dt className="text-muted-foreground">建立時間</dt>
                      <dd className="text-foreground">
                        {new Date(record.createdAtISO).toLocaleString("zh-TW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          );
        })
      )}
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleAdd} className="mt-1 w-full text-xs">
        <Plus className="mr-1.5 h-3 w-3" /> 新增記錄
      </Button>
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/DatabaseTableView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseTableView — spreadsheet-style table with inline cell editing.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries";
import { createRecord, updateRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field, DatabaseRecordSnapshot } from "../../application/dto/database.dto";

interface DatabaseTableViewProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

const FIELD_WIDTHS: Record<string, string> = {
  text: "min-w-[180px]",
  number: "min-w-[100px]",
  checkbox: "min-w-[80px]",
  date: "min-w-[140px]",
  default: "min-w-[140px]",
};

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

function setProperty(record: DatabaseRecordSnapshot, fieldId: string, value: unknown): Record<string, unknown> {
  const props = typeof record.properties === "object" && record.properties !== null
    ? { ...(record.properties as Record<string, unknown>) }
    : {};
  props[fieldId] = value;
  return props;
}

function CellInput({ field, value, onChange, disabled }: { field: Field; value: unknown; onChange: (v: unknown) => void; disabled: boolean }) {
  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border"
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={value == null ? "" : String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className="h-7 border-transparent bg-transparent px-1 text-xs focus:border-border"
      />
    );
  }
  return (
    <Input
      type="text"
      value={value == null ? "" : String(value)}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 border-transparent bg-transparent px-1 text-xs focus:border-border"
    />
  );
}

export function DatabaseTableView({ database, accountId, workspaceId, currentUserId }: DatabaseTableViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const fields = database.fields;

  const load = useCallback(async () => {
    if (!accountId || !database.id) return;
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  function handleCellChange(recordId: string, fieldId: string, value: unknown) {
    setEdits((prev) => ({
      ...prev,
      [recordId]: { ...(prev[recordId] ?? {}), [fieldId]: value },
    }));
  }

  function handleCellBlur(record: DatabaseRecordSnapshot, fieldId: string) {
    const cellValue = edits[record.id]?.[fieldId];
    if (cellValue === undefined) return;
    setSaving((prev) => ({ ...prev, [record.id]: true }));
    startTransition(async () => {
      await updateRecord({ id: record.id, accountId, properties: setProperty(record, fieldId, cellValue) });
      setEdits((prev) => {
        const next = { ...prev };
        delete next[record.id];
        return next;
      });
      setSaving((prev) => ({ ...prev, [record.id]: false }));
    });
  }

  function handleAddRecord() {
    startTransition(async () => {
      await createRecord({
        databaseId: database.id, workspaceId, accountId, properties: {}, createdByUserId: currentUserId,
      });
      void load();
    });
  }

  function handleDeleteRecord(recordId: string) {
    startTransition(async () => {
      await deleteRecord(accountId, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    });
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        此資料庫尚無欄位。請先新增欄位。
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              {fields.map((field) => (
                <th key={field.id} className={`px-3 py-2 text-left text-xs font-semibold text-muted-foreground ${FIELD_WIDTHS[field.type] ?? FIELD_WIDTHS.default}`}>
                  {field.name}
                  {field.required && <span className="ml-0.5 text-destructive">*</span>}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 1} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  尚無記錄
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-border/30 last:border-b-0 hover:bg-muted/10">
                  {fields.map((field) => {
                    const edited = edits[record.id]?.[field.id];
                    const current = edited !== undefined ? edited : getProperty(record, field.id);
                    return (
                      <td key={field.id} className="px-2 py-1">
                        <CellInput
                          field={field}
                          value={current}
                          onChange={(v) => handleCellChange(record.id, field.id, v)}
                          disabled={saving[record.id] ?? false}
                        />
                      </td>
                    );
                  })}
                  <td className="px-1 py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      disabled={isPending}
                      onBlur={() => {
                        fields.forEach((f) => { if (edits[record.id]?.[f.id] !== undefined) handleCellBlur(record, f.id); });
                      }}
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleAddRecord} className="w-full text-xs">
        <Plus className="mr-1.5 h-3 w-3" /> 新增記錄
      </Button>
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/components/index.ts
````typescript
export { DatabaseDialog } from "./DatabaseDialog";
export { DatabaseTableView } from "./DatabaseTableView";
export { DatabaseBoardView } from "./DatabaseBoardView";
export { DatabaseListView } from "./DatabaseListView";
export { DatabaseCalendarView } from "./DatabaseCalendarView";
export { DatabaseGalleryView } from "./DatabaseGalleryView";
export { DatabaseFormView } from "./DatabaseFormView";
export { DatabaseAutomationView } from "./DatabaseAutomationView";
````

## File: modules/notion/subdomains/database/interfaces/components/KnowledgeDatabasesRouteScreen.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Table2 } from "lucide-react";

import { useApp } from "@/modules/platform/api";
import { useAuth } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { DatabaseSnapshot as Database } from "../../application/dto/database.dto";
import { getDatabases } from "../queries";
import { DatabaseDialog } from "./DatabaseDialog";

/**
 * KnowledgeDatabasesRouteScreen
 * Route-level screen component for /knowledge-database/databases.
 * Encapsulates data-loading and layout so the Next.js route file stays thin.
 */
export function KnowledgeDatabasesRouteScreen() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    if (!accountId || !workspaceId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getDatabases(accountId, workspaceId);
      setDatabases(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => { load(); }, [load]);

  function handleSuccess(databaseId?: string) {
    if (databaseId) {
      router.push(`/knowledge-database/databases/${databaseId}`);
    } else {
      load();
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Database</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">資料庫</h1>
        <p className="text-sm text-muted-foreground">
          結構化資料表、看板、日曆與多視圖管理，對應 Notion Database 能力。
        </p>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/knowledge")}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Knowledge Hub
        </button>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!accountId || !workspaceId}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          新增資料庫
        </Button>
      </div>

      <DatabaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={accountId}
        workspaceId={workspaceId}
        currentUserId={currentUserId}
        onSuccess={handleSuccess}
      />

      {!accountId || !workspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號/工作區情境，請先登入或切換帳號。
        </p>
      ) : loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : databases.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
          <Table2 className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">尚無資料庫。點擊「新增資料庫」開始建立。</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {databases.map((db) => (
            <Card
              key={db.id}
              className="cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => router.push(`/knowledge-database/databases/${db.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  {db.icon ? (
                    <span className="text-lg leading-none">{db.icon}</span>
                  ) : (
                    <Table2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <CardTitle className="line-clamp-1 text-sm font-medium">{db.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {db.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{db.description}</p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
                  <span>{db.fields.length} 個欄位</span>
                  <span>·</span>
                  <span>{db.viewIds.length} 個視圖</span>
                </div>
                <p className="text-[10px] text-muted-foreground/50">
                  {new Date(db.updatedAtISO).toLocaleDateString("zh-TW")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/database/interfaces/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/queries
 * Purpose: Read-side queries for database, record, view, and automation data.
 */

import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../../api/factories";
import type { DatabaseSnapshot, DatabaseRecordSnapshot, ViewSnapshot, DatabaseAutomationSnapshot } from "../../application/dto/database.dto";

export async function getDatabases(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
  return makeDatabaseRepo().listByWorkspace(accountId, workspaceId);
}

export async function getDatabase(accountId: string, databaseId: string): Promise<DatabaseSnapshot | null> {
  return makeDatabaseRepo().findById(databaseId, accountId);
}

export async function getRecords(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
  return makeRecordRepo().listByDatabase(accountId, databaseId);
}

export async function getViews(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
  return makeViewRepo().listByDatabase(accountId, databaseId);
}

export async function getAutomations(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
  return makeAutomationRepo().listByDatabase(accountId, databaseId);
}
````

## File: modules/notion/subdomains/database/interfaces/store/index.ts
````typescript
// TODO: export useDatabaseStore, useRecordStore

export {};
````

## File: modules/notion/subdomains/knowledge-analytics/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/knowledge-analytics/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'knowledge-analytics'.
````

## File: modules/notion/subdomains/knowledge-analytics/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'knowledge-analytics'.
````

## File: modules/notion/subdomains/knowledge-analytics/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'knowledge-analytics'.
````

## File: modules/notion/subdomains/knowledge-integration/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/knowledge-integration/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'knowledge-integration'.
````

## File: modules/notion/subdomains/knowledge-integration/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'knowledge-integration'.
````

## File: modules/notion/subdomains/knowledge-integration/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'knowledge-integration'.
````

## File: modules/notion/subdomains/knowledge-versioning/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/knowledge-versioning/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'knowledge-versioning'.
````

## File: modules/notion/subdomains/knowledge-versioning/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'knowledge-versioning'.
````

## File: modules/notion/subdomains/knowledge-versioning/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'knowledge-versioning'.
````

## File: modules/notion/subdomains/knowledge/api/factories.ts
````typescript
import { FirebaseContentBlockRepository } from "../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../infrastructure/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseKnowledgePageRepository } from "../infrastructure/firebase/FirebaseKnowledgePageRepository";

export function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export function makeBlockRepo() {
  return new FirebaseContentBlockRepository();
}

export function makeCollectionRepo() {
  return new FirebaseKnowledgeCollectionRepository();
}
````

## File: modules/notion/subdomains/knowledge/api/index.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// ── Types (read-only snapshots – no aggregate class refs) ─────────────────────
export type { KnowledgePageSnapshot } from "../domain/aggregates/KnowledgePage";
/** @alias KnowledgePageSnapshot — provided for backward-compatibility */
export type { KnowledgePageSnapshot as KnowledgePage } from "../domain/aggregates/KnowledgePage";
export type { ContentBlockSnapshot } from "../domain/aggregates/ContentBlock";
export type { KnowledgeCollectionSnapshot } from "../domain/aggregates/KnowledgeCollection";

// ── Server action DTOs ────────────────────────────────────────────────────────
export type { CreateKnowledgePageDto, RenameKnowledgePageDto, MoveKnowledgePageDto, ArchiveKnowledgePageDto, ReorderKnowledgePageBlocksDto } from "../application/dto/KnowledgePageDto";
export type { AddKnowledgeBlockDto, UpdateKnowledgeBlockDto, DeleteKnowledgeBlockDto } from "../application/dto/ContentBlockDto";
export type { CreateKnowledgeCollectionDto } from "../application/dto/KnowledgeCollectionDto";

// ── Query functions (server-side reads) ───────────────────────────────────────
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePagesByWorkspace,
  getKnowledgePageTree,
  getKnowledgePageTreeByWorkspace,
  getKnowledgeBlocks,
  getKnowledgeCollection,
  getKnowledgeCollections,
} from "../interfaces/queries";

// ── Server actions (drives: app router, Server Components) ────────────────────
export {
  createKnowledgePage,
  renameKnowledgePage,
  moveKnowledgePage,
  archiveKnowledgePage,
  reorderKnowledgePageBlocks,
  publishKnowledgeVersion,
  approveKnowledgePage,
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
  createKnowledgeCollection,
  renameKnowledgeCollection,
  addPageToCollection,
  removePageFromCollection,
  archiveKnowledgeCollection,
} from "../interfaces/_actions";

// ── UI Components ─────────────────────────────────────────────────────────────
export { PageTreeView } from "../interfaces/components/PageTreeView";
export type { PageTreeViewProps } from "../interfaces/components/PageTreeView";
export { PageDialog } from "../interfaces/components/PageDialog";
export { BlockEditorView } from "../interfaces/components/BlockEditorView";
export { PageEditorView } from "../interfaces/components/PageEditorView";
export type { PageEditorViewProps } from "../interfaces/components/PageEditorView";
export { KnowledgePagesRouteScreen } from "../interfaces/components/KnowledgePagesRouteScreen";

// ── Store ─────────────────────────────────────────────────────────────────────
export { useBlockEditorStore } from "../interfaces/store/block-editor.store";
export type { EditorBlock } from "../interfaces/store/block-editor.store";

// ── Tree node type (needed by app/ pages) ─────────────────────────────────────
export type { KnowledgePageTreeNode } from "../domain/aggregates/KnowledgePage";

// ── Domain events (published language — for cross-module event subscriptions) ─
export type { PageApprovedEvent, PageApprovedPayload, ExtractedTask, ExtractedInvoice } from "../domain/events/KnowledgePageEvents";

// ── Sidebar component ─────────────────────────────────────────────────────────
export { KnowledgeSidebarSection } from "../interfaces/components/KnowledgeSidebarSection";

// ── Page header widgets ───────────────────────────────────────────────────────
export { TitleEditor, IconPicker, CoverEditor } from "../interfaces/components/KnowledgePageHeaderWidgets";
export type { TitleEditorProps, IconPickerProps, CoverEditorProps } from "../interfaces/components/KnowledgePageHeaderWidgets";

// ── Route screen components ───────────────────────────────────────────────────
export { KnowledgePageDetailPage } from "../interfaces/components/KnowledgePageDetailPage";
export type { KnowledgePageDetailPageProps } from "../interfaces/components/KnowledgePageDetailPage";
````

## File: modules/notion/subdomains/knowledge/application/dto/ContentBlockDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for ContentBlock use cases.
 */

import { z } from "@lib-zod";
import { BLOCK_TYPES } from "../../domain/value-objects/BlockContent";

export const BlockTypeSchema = z.enum(BLOCK_TYPES);

export const BlockContentSchema = z.object({
  type: BlockTypeSchema,
  richText: z.array(z.unknown()).readonly(),
  properties: z.record(z.string(), z.unknown()).optional(),
});
export type BlockContentDto = z.infer<typeof BlockContentSchema>;

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const AddKnowledgeBlockSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  content: BlockContentSchema,
  index: z.number().int().nonnegative().optional(),
  parentBlockId: z.string().min(1).nullable().optional(),
});
export type AddKnowledgeBlockDto = z.infer<typeof AddKnowledgeBlockSchema>;

export const UpdateKnowledgeBlockSchema = AccountScopeSchema.extend({
  blockId: z.string().min(1),
  content: BlockContentSchema,
});
export type UpdateKnowledgeBlockDto = z.infer<typeof UpdateKnowledgeBlockSchema>;

export const DeleteKnowledgeBlockSchema = AccountScopeSchema.extend({
  blockId: z.string().min(1),
});
export type DeleteKnowledgeBlockDto = z.infer<typeof DeleteKnowledgeBlockSchema>;

export const NestKnowledgeBlockSchema = z.object({
  accountId: z.string().min(1),
  blockId: z.string().min(1),
  parentBlockId: z.string().min(1),
  index: z.number().int().min(0).optional(),
});
export type NestKnowledgeBlockDto = z.infer<typeof NestKnowledgeBlockSchema>;

export const UnnestKnowledgeBlockSchema = z.object({
  accountId: z.string().min(1),
  blockId: z.string().min(1),
  index: z.number().int().min(0).optional(),
});
export type UnnestKnowledgeBlockDto = z.infer<typeof UnnestKnowledgeBlockSchema>;
````

## File: modules/notion/subdomains/knowledge/application/dto/knowledge.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the knowledge subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
export type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
export type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
export type { BlockContent } from "../../domain/value-objects/BlockContent";
export { richTextToPlainText } from "../../domain/value-objects/BlockContent";
````

## File: modules/notion/subdomains/knowledge/application/dto/KnowledgeCollectionDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for KnowledgeCollection use cases.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const CollectionColumnTypeSchema = z.enum([
  "text", "number", "select", "multi-select", "date", "checkbox", "url", "relation",
]);
export type CollectionColumnTypeDto = z.infer<typeof CollectionColumnTypeSchema>;

export const CollectionColumnInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: CollectionColumnTypeSchema,
  options: z.array(z.string()).optional(),
});
export type CollectionColumnInputDto = z.infer<typeof CollectionColumnInputSchema>;

export const CreateKnowledgeCollectionSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1).optional(),
  name: z.string().min(1).max(300),
  description: z.string().max(1000).optional(),
  columns: z.array(CollectionColumnInputSchema).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateKnowledgeCollectionDto = z.infer<typeof CreateKnowledgeCollectionSchema>;

export const RenameKnowledgeCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  name: z.string().min(1).max(300),
});
export type RenameKnowledgeCollectionDto = z.infer<typeof RenameKnowledgeCollectionSchema>;

export const AddPageToCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  pageId: z.string().min(1),
});
export type AddPageToCollectionDto = z.infer<typeof AddPageToCollectionSchema>;

export const RemovePageFromCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  pageId: z.string().min(1),
});
export type RemovePageFromCollectionDto = z.infer<typeof RemovePageFromCollectionSchema>;

export const AddCollectionColumnSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  column: CollectionColumnInputSchema,
});
export type AddCollectionColumnDto = z.infer<typeof AddCollectionColumnSchema>;

export const ArchiveKnowledgeCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
});
export type ArchiveKnowledgeCollectionDto = z.infer<typeof ArchiveKnowledgeCollectionSchema>;
````

## File: modules/notion/subdomains/knowledge/application/dto/KnowledgePageDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for KnowledgePage use cases.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const CreateKnowledgePageSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1),
  title: z.string().min(1).max(300),
  parentPageId: z.string().min(1).nullable().optional(),
  createdByUserId: z.string().min(1),
});
export type CreateKnowledgePageDto = z.infer<typeof CreateKnowledgePageSchema>;

export const RenameKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  title: z.string().min(1).max(300),
});
export type RenameKnowledgePageDto = z.infer<typeof RenameKnowledgePageSchema>;

export const MoveKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  targetParentPageId: z.string().min(1).nullable(),
});
export type MoveKnowledgePageDto = z.infer<typeof MoveKnowledgePageSchema>;

export const ArchiveKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
});
export type ArchiveKnowledgePageDto = z.infer<typeof ArchiveKnowledgePageSchema>;

export const ReorderKnowledgePageBlocksSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  blockIds: z.array(z.string().min(1)),
});
export type ReorderKnowledgePageBlocksDto = z.infer<typeof ReorderKnowledgePageBlocksSchema>;

export const ExtractedTaskSchema = z.object({
  title: z.string().min(1).max(300),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});

export const ExtractedInvoiceSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  currency: z.string().optional(),
});

export const ApproveKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  actorId: z.string().min(1),
  causationId: z.string().min(1).optional(),
  extractedTasks: z.array(ExtractedTaskSchema).default([]),
  extractedInvoices: z.array(ExtractedInvoiceSchema).default([]),
  correlationId: z.string().optional(),
  workspaceId: z.string().optional(),
});
export type ApproveKnowledgePageDto = z.infer<typeof ApproveKnowledgePageSchema>;

export const CreateKnowledgeVersionSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  label: z.string().max(100).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateKnowledgeVersionDto = z.infer<typeof CreateKnowledgeVersionSchema>;
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/BacklinkIndex.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: BacklinkIndex — read model tracking which pages reference a given page.
 */

export interface BacklinkEntry {
  readonly sourcePageId: string;
  readonly sourcePageTitle: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}

export interface BacklinkIndexSnapshot {
  readonly targetPageId: string;
  readonly accountId: string;
  readonly entries: ReadonlyArray<BacklinkEntry>;
  readonly updatedAtISO: string;
}

export class BacklinkIndex {
  private constructor(private readonly _props: BacklinkIndexSnapshot) {}

  static reconstitute(snapshot: BacklinkIndexSnapshot): BacklinkIndex {
    return new BacklinkIndex({ ...snapshot });
  }

  get targetPageId(): string { return this._props.targetPageId; }
  get accountId(): string { return this._props.accountId; }
  get entries(): ReadonlyArray<BacklinkEntry> { return this._props.entries; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<BacklinkIndexSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/ContentBlock.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: ContentBlock aggregate root — atomic content unit inside a Page.
 */

import type { BlockContent } from "../value-objects/BlockContent";
import { richTextToPlainText } from "../value-objects/BlockContent";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export interface ContentBlockSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly parentBlockId: string | null;
  readonly childBlockIds: ReadonlyArray<string>;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateContentBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly parentBlockId?: string | null;
}

export class ContentBlock {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: ContentBlockSnapshot) {}

  static create(id: string, input: CreateContentBlockInput): ContentBlock {
    const now = new Date().toISOString();
    const block = new ContentBlock({
      id,
      pageId: input.pageId,
      accountId: input.accountId,
      content: input.content,
      order: input.order,
      parentBlockId: input.parentBlockId ?? null,
      childBlockIds: [],
      createdAtISO: now,
      updatedAtISO: now,
    });
    const contentText = richTextToPlainText(input.content.richText);
    block._domainEvents.push({
      type: "notion.knowledge.block_added",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { blockId: id, pageId: input.pageId, accountId: input.accountId, contentText },
    });
    return block;
  }

  static reconstitute(snapshot: ContentBlockSnapshot): ContentBlock {
    return new ContentBlock({ ...snapshot });
  }

  update(newContent: BlockContent): void {
    const now = new Date().toISOString();
    const contentText = richTextToPlainText(newContent.richText);
    this._props = { ...this._props, content: newContent, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.block_updated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        blockId: this._props.id,
        pageId: this._props.pageId,
        accountId: this._props.accountId,
        contentText,
      },
    });
  }

  delete(): void {
    const now = new Date().toISOString();
    this._domainEvents.push({
      type: "notion.knowledge.block_deleted",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        blockId: this._props.id,
        pageId: this._props.pageId,
        accountId: this._props.accountId,
      },
    });
  }

  nest(parentId: string, index?: number): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, parentBlockId: parentId, updatedAtISO: now };
    void index;
  }

  unnest(index?: number): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, parentBlockId: null, updatedAtISO: now };
    void index;
  }

  addChild(childId: string, index?: number): void {
    const now = new Date().toISOString();
    const children = [...this._props.childBlockIds];
    const idx = index !== undefined ? index : children.length;
    children.splice(idx, 0, childId);
    this._props = { ...this._props, childBlockIds: children, updatedAtISO: now };
  }

  removeChild(childId: string): void {
    const now = new Date().toISOString();
    const children = this._props.childBlockIds.filter((id) => id !== childId);
    this._props = { ...this._props, childBlockIds: children, updatedAtISO: now };
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get id(): string { return this._props.id; }
  get pageId(): string { return this._props.pageId; }
  get accountId(): string { return this._props.accountId; }
  get content(): BlockContent { return this._props.content; }
  get order(): number { return this._props.order; }
  get parentBlockId(): string | null { return this._props.parentBlockId; }
  get childBlockIds(): ReadonlyArray<string> { return this._props.childBlockIds; }
  get createdAtISO(): string { return this._props.createdAtISO; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<ContentBlockSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/index.ts
````typescript
export { KnowledgePage } from "./KnowledgePage";
export type { KnowledgePageSnapshot, CreateKnowledgePageInput, KnowledgePageTreeNode } from "./KnowledgePage";

export { ContentBlock } from "./ContentBlock";
export type { ContentBlockSnapshot, CreateContentBlockInput } from "./ContentBlock";

export { KnowledgeCollection } from "./KnowledgeCollection";
export type { KnowledgeCollectionSnapshot, CreateKnowledgeCollectionInput, CollectionColumn, CollectionColumnType, CollectionStatus, CollectionSpaceType } from "./KnowledgeCollection";

export { BacklinkIndex } from "./BacklinkIndex";
export type { BacklinkIndexSnapshot, BacklinkEntry } from "./BacklinkIndex";
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: KnowledgeCollection aggregate root — named grouping / database-view of pages.
 */

import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export type CollectionColumnType =
  | "text"
  | "number"
  | "select"
  | "multi-select"
  | "date"
  | "checkbox"
  | "url"
  | "relation";

export interface CollectionColumn {
  readonly id: string;
  readonly name: string;
  readonly type: CollectionColumnType;
  readonly options?: readonly string[];
}

export type CollectionStatus = "active" | "archived";
export type CollectionSpaceType = "database" | "wiki";

export interface KnowledgeCollectionSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns: readonly CollectionColumn[];
  readonly pageIds: readonly string[];
  readonly status: CollectionStatus;
  readonly spaceType: CollectionSpaceType;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateKnowledgeCollectionInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns?: readonly Omit<CollectionColumn, "id">[];
  readonly createdByUserId: string;
  readonly spaceType?: CollectionSpaceType;
}

export class KnowledgeCollection {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: KnowledgeCollectionSnapshot) {}

  static create(id: string, columnIds: readonly string[], input: CreateKnowledgeCollectionInput): KnowledgeCollection {
    const now = new Date().toISOString();
    const columns: CollectionColumn[] = (input.columns ?? []).map((c, i) => ({
      id: columnIds[i] ?? crypto.randomUUID(),
      name: c.name,
      type: c.type,
      options: c.options,
    }));
    const collection = new KnowledgeCollection({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      columns,
      pageIds: [],
      status: "active",
      spaceType: input.spaceType ?? "database",
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    collection._domainEvents.push({
      type: "notion.knowledge.collection_created",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        collectionId: id,
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        name: input.name,
        createdByUserId: input.createdByUserId,
      },
    });
    return collection;
  }

  static reconstitute(snapshot: KnowledgeCollectionSnapshot): KnowledgeCollection {
    return new KnowledgeCollection({ ...snapshot });
  }

  rename(newName: string): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot rename an archived collection.");
    }
    const previousName = this._props.name;
    const now = new Date().toISOString();
    this._props = { ...this._props, name: newName, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.collection_renamed",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        collectionId: this._props.id,
        accountId: this._props.accountId,
        previousName,
        newName,
      },
    });
  }

  addPage(pageId: string): void {
    if (this._props.pageIds.includes(pageId)) return;
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      pageIds: [...this._props.pageIds, pageId],
      updatedAtISO: now,
    };
  }

  removePage(pageId: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      pageIds: this._props.pageIds.filter((id) => id !== pageId),
      updatedAtISO: now,
    };
  }

  addColumn(column: CollectionColumn): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      columns: [...this._props.columns, column],
      updatedAtISO: now,
    };
  }

  archive(): void {
    if (this._props.status === "archived") {
      throw new Error("Collection is already archived.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.collection_archived",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { collectionId: this._props.id, accountId: this._props.accountId },
    });
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
  get workspaceId(): string | undefined { return this._props.workspaceId; }
  get name(): string { return this._props.name; }
  get description(): string | undefined { return this._props.description; }
  get columns(): readonly CollectionColumn[] { return this._props.columns; }
  get pageIds(): readonly string[] { return this._props.pageIds; }
  get status(): CollectionStatus { return this._props.status; }
  get spaceType(): CollectionSpaceType { return this._props.spaceType; }
  get createdByUserId(): string { return this._props.createdByUserId; }
  get createdAtISO(): string { return this._props.createdAtISO; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<KnowledgeCollectionSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: KnowledgePage aggregate root — proper DDD class with private constructor,
 *          static factory methods, business methods, and domain events.
 */

import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export interface KnowledgePageSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: "active" | "archived";
  readonly approvalState?: "pending" | "approved";
  readonly approvedAtISO?: string;
  readonly approvedByUserId?: string;
  readonly verificationState?: "verified" | "needs_review";
  readonly ownerId?: string;
  readonly verifiedByUserId?: string;
  readonly verifiedAtISO?: string;
  readonly verificationExpiresAtISO?: string;
  readonly iconUrl?: string;
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId: string | null;
  readonly createdByUserId: string;
  readonly order: number;
}

export class KnowledgePage {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: KnowledgePageSnapshot) {}

  static create(id: string, input: CreateKnowledgePageInput): KnowledgePage {
    const now = new Date().toISOString();
    const slug = KnowledgePage.slugify(input.title);
    const page = new KnowledgePage({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      title: input.title,
      slug,
      parentPageId: input.parentPageId,
      order: input.order,
      blockIds: [],
      status: "active",
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    page._domainEvents.push({
      type: "notion.knowledge.page_created",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        pageId: id,
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        title: input.title,
        createdByUserId: input.createdByUserId,
      },
    });
    return page;
  }

  static reconstitute(snapshot: KnowledgePageSnapshot): KnowledgePage {
    return new KnowledgePage({ ...snapshot });
  }

  rename(newTitle: string): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot rename an archived page.");
    }
    const previousTitle = this._props.title;
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      title: newTitle,
      slug: KnowledgePage.slugify(newTitle),
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page_renamed",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, previousTitle, newTitle },
    });
  }

  move(targetParentId: string | null): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot move an archived page.");
    }
    if (targetParentId === this._props.id) {
      throw new Error("A page cannot be its own parent.");
    }
    const previousParentPageId = this._props.parentPageId;
    const now = new Date().toISOString();
    this._props = { ...this._props, parentPageId: targetParentId, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page_moved",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        pageId: this._props.id,
        accountId: this._props.accountId,
        previousParentPageId,
        newParentPageId: targetParentId,
      },
    });
  }

  archive(): void {
    if (this._props.status === "archived") {
      throw new Error("Page is already archived.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page_archived",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId },
    });
  }

  approve(byUserId: string, atISO: string): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot approve an archived page.");
    }
    if (this._props.approvalState === "approved") {
      throw new Error("Page is already approved.");
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      approvalState: "approved",
      approvedByUserId: byUserId,
      approvedAtISO: atISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page_approved",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        pageId: this._props.id,
        accountId: this._props.accountId,
        workspaceId: this._props.workspaceId,
        actorId: byUserId,
        extractedTasks: [],
        extractedInvoices: [],
        causationId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
      },
    });
  }

  verify(byUserId: string, expiresAtISO?: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      verificationState: "verified",
      verifiedByUserId: byUserId,
      verifiedAtISO: now,
      verificationExpiresAtISO: expiresAtISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page_verified",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        pageId: this._props.id,
        accountId: this._props.accountId,
        verifiedByUserId: byUserId,
        verificationExpiresAtISO: expiresAtISO,
      },
    });
  }

  requestReview(byUserId: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, verificationState: "needs_review", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page_review_requested",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, requestedByUserId: byUserId },
    });
  }

  assignOwner(ownerId: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, ownerId, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page_owner_assigned",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, ownerId },
    });
  }

  updateIcon(iconUrl: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      iconUrl: iconUrl || undefined,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page_icon_updated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, iconUrl },
    });
  }

  updateCover(coverUrl: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      coverUrl: coverUrl || undefined,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page_cover_updated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, coverUrl },
    });
  }

  reorderBlocks(blockIds: ReadonlyArray<string>): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, blockIds, updatedAtISO: now };
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
  get workspaceId(): string | undefined { return this._props.workspaceId; }
  get title(): string { return this._props.title; }
  get slug(): string { return this._props.slug; }
  get parentPageId(): string | null { return this._props.parentPageId; }
  get order(): number { return this._props.order; }
  get blockIds(): readonly string[] { return this._props.blockIds; }
  get status(): "active" | "archived" { return this._props.status; }
  get approvalState(): "pending" | "approved" | undefined { return this._props.approvalState; }
  get approvedAtISO(): string | undefined { return this._props.approvedAtISO; }
  get approvedByUserId(): string | undefined { return this._props.approvedByUserId; }
  get verificationState(): "verified" | "needs_review" | undefined { return this._props.verificationState; }
  get ownerId(): string | undefined { return this._props.ownerId; }
  get verifiedByUserId(): string | undefined { return this._props.verifiedByUserId; }
  get verifiedAtISO(): string | undefined { return this._props.verifiedAtISO; }
  get verificationExpiresAtISO(): string | undefined { return this._props.verificationExpiresAtISO; }
  get iconUrl(): string | undefined { return this._props.iconUrl; }
  get coverUrl(): string | undefined { return this._props.coverUrl; }
  get createdByUserId(): string { return this._props.createdByUserId; }
  get createdAtISO(): string { return this._props.createdAtISO; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<KnowledgePageSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private static slugify(title: string): string {
    return (
      title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100) || "page"
    );
  }
}

/** Tree node for hierarchical views */
export interface KnowledgePageTreeNode extends KnowledgePageSnapshot {
  readonly children: readonly KnowledgePageTreeNode[];
}
````

## File: modules/notion/subdomains/knowledge/domain/events/index.ts
````typescript
export * from "./KnowledgePageEvents";
export * from "./KnowledgeBlockEvents";
export * from "./KnowledgeCollectionEvents";
````

## File: modules/notion/subdomains/knowledge/domain/events/KnowledgeBlockEvents.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: ContentBlock domain events.
 */

import type { NotionDomainEvent } from "./NotionDomainEvent";

export interface BlockAddedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
}

export interface BlockAddedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block_added";
  readonly payload: BlockAddedPayload;
}

export interface BlockUpdatedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
}

export interface BlockUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block_updated";
  readonly payload: BlockUpdatedPayload;
}

export interface BlockDeletedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
}

export interface BlockDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block_deleted";
  readonly payload: BlockDeletedPayload;
}

export type KnowledgeBlockDomainEvent =
  | BlockAddedEvent
  | BlockUpdatedEvent
  | BlockDeletedEvent;
````

## File: modules/notion/subdomains/knowledge/domain/events/KnowledgeCollectionEvents.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: KnowledgeCollection domain events.
 */

import type { NotionDomainEvent } from "./NotionDomainEvent";

export interface CollectionCreatedPayload {
  readonly collectionId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly createdByUserId: string;
}

export interface CollectionCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection_created";
  readonly payload: CollectionCreatedPayload;
}

export interface CollectionRenamedPayload {
  readonly collectionId: string;
  readonly accountId: string;
  readonly previousName: string;
  readonly newName: string;
}

export interface CollectionRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection_renamed";
  readonly payload: CollectionRenamedPayload;
}

export interface CollectionArchivedPayload {
  readonly collectionId: string;
  readonly accountId: string;
}

export interface CollectionArchivedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection_archived";
  readonly payload: CollectionArchivedPayload;
}

export type KnowledgeCollectionDomainEvent =
  | CollectionCreatedEvent
  | CollectionRenamedEvent
  | CollectionArchivedEvent;
````

## File: modules/notion/subdomains/knowledge/domain/events/KnowledgePageEvents.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: KnowledgePage domain events.
 */

import type { NotionDomainEvent } from "./NotionDomainEvent";

export interface PageCreatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly createdByUserId: string;
}

export interface PageCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_created";
  readonly payload: PageCreatedPayload;
}

export interface PageRenamedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly previousTitle: string;
  readonly newTitle: string;
}

export interface PageRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_renamed";
  readonly payload: PageRenamedPayload;
}

export interface PageMovedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly previousParentPageId: string | null;
  readonly newParentPageId: string | null;
}

export interface PageMovedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_moved";
  readonly payload: PageMovedPayload;
}

export interface PageArchivedPayload {
  readonly pageId: string;
  readonly accountId: string;
}

export interface PageArchivedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_archived";
  readonly payload: PageArchivedPayload;
}

export interface ExtractedTask {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}

export interface ExtractedInvoice {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}

export interface PageApprovedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly extractedTasks: ReadonlyArray<ExtractedTask>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoice>;
  readonly actorId: string;
  readonly causationId: string;
  readonly correlationId: string;
}

export interface PageApprovedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_approved";
  readonly payload: PageApprovedPayload;
}

export interface PageVerifiedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly verifiedByUserId: string;
  readonly verificationExpiresAtISO?: string;
}

export interface PageVerifiedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_verified";
  readonly payload: PageVerifiedPayload;
}

export interface PageReviewRequestedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly requestedByUserId: string;
}

export interface PageReviewRequestedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_review_requested";
  readonly payload: PageReviewRequestedPayload;
}

export interface PageOwnerAssignedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly ownerId: string;
}

export interface PageOwnerAssignedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_owner_assigned";
  readonly payload: PageOwnerAssignedPayload;
}

export interface PageIconUpdatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly iconUrl: string;
}

export interface PageIconUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_icon_updated";
  readonly payload: PageIconUpdatedPayload;
}

export interface PageCoverUpdatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly coverUrl: string;
}

export interface PageCoverUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_cover_updated";
  readonly payload: PageCoverUpdatedPayload;
}

export type KnowledgePageDomainEvent =
  | PageCreatedEvent
  | PageRenamedEvent
  | PageMovedEvent
  | PageArchivedEvent
  | PageApprovedEvent
  | PageVerifiedEvent
  | PageReviewRequestedEvent
  | PageOwnerAssignedEvent
  | PageIconUpdatedEvent
  | PageCoverUpdatedEvent;
````

## File: modules/notion/subdomains/knowledge/domain/events/NotionDomainEvent.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: Base interface for Notion Knowledge domain events.
 */

export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO 8601 string
  readonly type: string;
  readonly payload: object;
}
````

## File: modules/notion/subdomains/knowledge/domain/repositories/IBacklinkIndexRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for BacklinkIndex read model persistence.
 */

import type { BacklinkIndex, BacklinkEntry } from "../aggregates/BacklinkIndex";

export interface UpsertBacklinkEntriesInput {
  readonly accountId: string;
  readonly targetPageId: string;
  readonly sourcePageId: string;
  readonly entries: ReadonlyArray<Omit<BacklinkEntry, "sourcePageId">>;
}

export interface RemoveBacklinksFromSourceInput {
  readonly accountId: string;
  readonly sourcePageId: string;
}

export interface IBacklinkIndexRepository {
  upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void>;
  removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void>;
  findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null>;
  listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>>;
}
````

## File: modules/notion/subdomains/knowledge/domain/repositories/IContentBlockRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for ContentBlock persistence.
 */

import type { ContentBlock } from "../aggregates/ContentBlock";

export interface IContentBlockRepository {
  save(block: ContentBlock): Promise<void>;
  findById(accountId: string, blockId: string): Promise<ContentBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>;
  delete(accountId: string, blockId: string): Promise<void>;
  countByPageId(accountId: string, pageId: string): Promise<number>;
}
````

## File: modules/notion/subdomains/knowledge/domain/repositories/IKnowledgeCollectionRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for KnowledgeCollection persistence.
 */

import type { KnowledgeCollection } from "../aggregates/KnowledgeCollection";

export interface IKnowledgeCollectionRepository {
  save(collection: KnowledgeCollection): Promise<void>;
  findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
  listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
}
````

## File: modules/notion/subdomains/knowledge/domain/repositories/IKnowledgePageRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for KnowledgePage persistence.
 */

import type { KnowledgePage, KnowledgePageSnapshot } from "../aggregates/KnowledgePage";

export interface IKnowledgePageRepository {
  save(page: KnowledgePage): Promise<void>;
  findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  listByAccountId(accountId: string): Promise<KnowledgePage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
  /** Count pages at same parent level for ordering */
  countByParent(accountId: string, parentPageId: string | null): Promise<number>;
  /** Snapshot type for direct projection queries */
  findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>;
  listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]>;
  listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>;
}
````

## File: modules/notion/subdomains/knowledge/domain/repositories/index.ts
````typescript
export type { IKnowledgePageRepository } from "./IKnowledgePageRepository";
export type { IContentBlockRepository } from "./IContentBlockRepository";
export type { IKnowledgeCollectionRepository } from "./IKnowledgeCollectionRepository";
export type { IBacklinkIndexRepository, UpsertBacklinkEntriesInput, RemoveBacklinksFromSourceInput } from "./IBacklinkIndexRepository";
````

## File: modules/notion/subdomains/knowledge/domain/services/BacklinkExtractorService.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/services
 * Purpose: BacklinkExtractorService — domain service that extracts page IDs mentioned in block content.
 */

import type { ContentBlockSnapshot } from "../aggregates/ContentBlock";
import { extractMentionedPageIds } from "../value-objects/BlockContent";

export interface BacklinkMention {
  readonly targetPageId: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}

export class BacklinkExtractorService {
  /**
   * Extract all page mentions from a list of block snapshots.
   * Returns a map of targetPageId -> list of mentions.
   */
  extractMentions(
    blocks: ReadonlyArray<ContentBlockSnapshot>,
  ): ReadonlyMap<string, ReadonlyArray<{ blockId: string; lastSeenAtISO: string }>> {
    const result = new Map<string, Array<{ blockId: string; lastSeenAtISO: string }>>();
    const now = new Date().toISOString();

    for (const block of blocks) {
      const pageIds = extractMentionedPageIds(block.content.richText);
      for (const pageId of pageIds) {
        if (!result.has(pageId)) {
          result.set(pageId, []);
        }
        result.get(pageId)!.push({ blockId: block.id, lastSeenAtISO: now });
      }
    }

    return result;
  }
}
````

## File: modules/notion/subdomains/knowledge/domain/services/index.ts
````typescript
export { BacklinkExtractorService } from "./BacklinkExtractorService";
export type { BacklinkMention } from "./BacklinkExtractorService";
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/ApprovalState.ts
````typescript
import { z } from "@lib-zod";

export const ApprovalStateSchema = z.enum(["pending", "approved"]);
export type ApprovalState = z.infer<typeof ApprovalStateSchema>;
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/BlockContent.ts
````typescript
/**
 * Module: notion
 * Layer: domain/value-objects
 * Purpose: BlockContent value object — immutable typed content snapshot for a Block.
 *
 * Re-implementation of the original knowledge domain block-content.
 * This is a VALUE OBJECT: equality is determined by value, not identity.
 */

// ── RichText Annotation Model ─────────────────────────────────────────────────

export type RichTextSpanType = "text" | "mention_page" | "mention_user" | "link";

export interface TextAnnotations {
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly strikethrough?: boolean;
  readonly code?: boolean;
  readonly color?: string;
}

interface BaseRichTextSpan {
  readonly annotations?: TextAnnotations;
}

export interface TextSpan extends BaseRichTextSpan {
  readonly type: "text";
  readonly plainText: string;
}

export interface MentionPageSpan extends BaseRichTextSpan {
  readonly type: "mention_page";
  readonly pageId: string;
  readonly label: string;
}

export interface MentionUserSpan extends BaseRichTextSpan {
  readonly type: "mention_user";
  readonly userId: string;
  readonly displayName: string;
}

export interface LinkSpan extends BaseRichTextSpan {
  readonly type: "link";
  readonly url: string;
  readonly label: string;
}

export type RichTextSpan = TextSpan | MentionPageSpan | MentionUserSpan | LinkSpan;

export function richTextToPlainText(spans: ReadonlyArray<RichTextSpan>): string {
  return spans
    .map((s) => {
      switch (s.type) {
        case "text": return s.plainText;
        case "mention_page": return s.label;
        case "mention_user": return `@${s.displayName}`;
        case "link": return s.label;
      }
    })
    .join("");
}

export function extractMentionedPageIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string> {
  return spans
    .filter((s): s is MentionPageSpan => s.type === "mention_page")
    .map((s) => s.pageId);
}

export function extractMentionedUserIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string> {
  return spans
    .filter((s): s is MentionUserSpan => s.type === "mention_user")
    .map((s) => s.userId);
}

// ── Block types ───────────────────────────────────────────────────────────────

export type BlockType =
  | "text"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "image"
  | "code"
  | "bullet-list"
  | "numbered-list"
  | "divider"
  | "quote"
  | "callout"
  | "toggle"
  | "toc"
  | "synced";

export const BLOCK_TYPES = [
  "text",
  "heading-1",
  "heading-2",
  "heading-3",
  "image",
  "code",
  "bullet-list",
  "numbered-list",
  "divider",
  "quote",
  "callout",
  "toggle",
  "toc",
  "synced",
] as const satisfies readonly BlockType[];

export interface BlockContent {
  readonly type: BlockType;
  readonly richText: ReadonlyArray<RichTextSpan>;
  readonly properties?: Readonly<Record<string, unknown>>;
}

export function blockContentEquals(a: BlockContent, b: BlockContent): boolean {
  if (a.type !== b.type) return false;
  if (JSON.stringify(a.richText) !== JSON.stringify(b.richText)) return false;
  if (a.properties === undefined && b.properties === undefined) return true;
  if (a.properties === undefined || b.properties === undefined) return false;
  const sortedKeys = (obj: Record<string, unknown>): string =>
    JSON.stringify(obj, Object.keys(obj).sort());
  return sortedKeys(a.properties) === sortedKeys(b.properties);
}

export function emptyTextBlockContent(): BlockContent {
  return { type: "text", richText: [] };
}

export function plainTextBlockContent(text: string, type: BlockType = "text"): BlockContent {
  return { type, richText: [{ type: "text", plainText: text }] };
}
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/BlockId.ts
````typescript
import { z } from "@lib-zod";

export const BlockIdSchema = z.string().uuid().brand("BlockId");
export type BlockId = z.infer<typeof BlockIdSchema>;

export function createBlockId(id: string): BlockId {
  return BlockIdSchema.parse(id);
}

export function unsafeBlockId(id: string): BlockId {
  return id as BlockId;
}
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/CollectionId.ts
````typescript
import { z } from "@lib-zod";

export const CollectionIdSchema = z.string().uuid().brand("CollectionId");
export type CollectionId = z.infer<typeof CollectionIdSchema>;

export function createCollectionId(id: string): CollectionId {
  return CollectionIdSchema.parse(id);
}

export function unsafeCollectionId(id: string): CollectionId {
  return id as CollectionId;
}
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/index.ts
````typescript
export { PageIdSchema, createPageId, unsafePageId } from "./PageId";
export type { PageId } from "./PageId";

export { BlockIdSchema, createBlockId, unsafeBlockId } from "./BlockId";
export type { BlockId } from "./BlockId";

export { CollectionIdSchema, createCollectionId, unsafeCollectionId } from "./CollectionId";
export type { CollectionId } from "./CollectionId";

export { PageStatusSchema, PAGE_STATUSES } from "./PageStatus";
export type { PageStatus } from "./PageStatus";

export { ApprovalStateSchema } from "./ApprovalState";
export type { ApprovalState } from "./ApprovalState";

export { VerificationStateSchema } from "./VerificationState";
export type { VerificationState } from "./VerificationState";
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/PageId.ts
````typescript
import { z } from "@lib-zod";

export const PageIdSchema = z.string().uuid().brand("PageId");
export type PageId = z.infer<typeof PageIdSchema>;

export function createPageId(id: string): PageId {
  return PageIdSchema.parse(id);
}

export function unsafePageId(id: string): PageId {
  return id as PageId;
}
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/PageStatus.ts
````typescript
import { z } from "@lib-zod";

export const PageStatusSchema = z.enum(["active", "archived"]);
export type PageStatus = z.infer<typeof PageStatusSchema>;

export const PAGE_STATUSES = ["active", "archived"] as const satisfies readonly PageStatus[];
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/VerificationState.ts
````typescript
import { z } from "@lib-zod";

export const VerificationStateSchema = z.enum(["verified", "needs_review"]);
export type VerificationState = z.infer<typeof VerificationStateSchema>;
````

## File: modules/notion/subdomains/knowledge/infrastructure/firebase/FirebaseBacklinkIndexRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IBacklinkIndexRepository.
 * Firestore paths:
 *   accounts/{accountId}/backlinkIndex/{targetPageId}
 *   accounts/{accountId}/backlinkOutbound/{sourcePageId}
 */

import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { IBacklinkIndexRepository, UpsertBacklinkEntriesInput, RemoveBacklinksFromSourceInput } from "../../domain/repositories/IBacklinkIndexRepository";
import { BacklinkIndex } from "../../domain/aggregates/BacklinkIndex";
import type { BacklinkEntry, BacklinkIndexSnapshot } from "../../domain/aggregates/BacklinkIndex";

function backlinkIndexDoc(db: ReturnType<typeof getFirestore>, accountId: string, targetPageId: string) {
  return doc(db, "accounts", accountId, "backlinkIndex", targetPageId);
}
function backlinkOutboundDoc(db: ReturnType<typeof getFirestore>, accountId: string, sourcePageId: string) {
  return doc(db, "accounts", accountId, "backlinkOutbound", sourcePageId);
}

function toEntries(raw: unknown): BacklinkEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
    .map((e) => ({
      sourcePageId: typeof e.sourcePageId === "string" ? e.sourcePageId : "",
      sourcePageTitle: typeof e.sourcePageTitle === "string" ? e.sourcePageTitle : "",
      blockId: typeof e.blockId === "string" ? e.blockId : "",
      lastSeenAtISO: typeof e.lastSeenAtISO === "string" ? e.lastSeenAtISO : "",
    }));
}

export class FirebaseBacklinkIndexRepository implements IBacklinkIndexRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void> {
    const { accountId, targetPageId, sourcePageId, entries } = input;
    const ref = backlinkIndexDoc(this.db, accountId, targetPageId);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? toEntries((snap.data() as Record<string, unknown>).entries) : [];
    const nowISO = new Date().toISOString();
    const filtered = existing.filter((e) => !entries.some((ne) => e.blockId === ne.blockId && e.sourcePageId === sourcePageId));
    const newEntries: BacklinkEntry[] = entries.map((e) => ({ sourcePageId, sourcePageTitle: (e as BacklinkEntry).sourcePageTitle ?? "", blockId: e.blockId, lastSeenAtISO: nowISO }));
    const merged = [...filtered, ...newEntries];

    const batch = writeBatch(this.db);
    batch.set(ref, { targetPageId, accountId, entries: merged, updatedAtISO: nowISO }, { merge: true });

    // Update outbound index
    const outRef = backlinkOutboundDoc(this.db, accountId, sourcePageId);
    batch.set(outRef, { sourcePageId, accountId, targetPageIds: [targetPageId], updatedAtISO: nowISO }, { merge: true });
    await batch.commit();
  }

  async removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void> {
    const { accountId, sourcePageId } = input;
    const outRef = backlinkOutboundDoc(this.db, accountId, sourcePageId);
    const outSnap = await getDoc(outRef);
    const targetPageIds: string[] = outSnap.exists()
      ? ((outSnap.data() as Record<string, unknown>).targetPageIds as string[] ?? [])
      : [];

    const batch = writeBatch(this.db);
    const nowISO = new Date().toISOString();
    for (const targetPageId of targetPageIds) {
      const ref = backlinkIndexDoc(this.db, accountId, targetPageId);
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;
      const entries = toEntries((snap.data() as Record<string, unknown>).entries).filter((e) => e.sourcePageId !== sourcePageId);
      batch.set(ref, { entries, updatedAtISO: nowISO }, { merge: true });
    }
    batch.set(outRef, { targetPageIds: [], updatedAtISO: nowISO }, { merge: true });
    await batch.commit();
  }

  async findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null> {
    const snap = await getDoc(backlinkIndexDoc(this.db, accountId, targetPageId));
    if (!snap.exists()) return null;
    const d = snap.data() as Record<string, unknown>;
    const snapshot: BacklinkIndexSnapshot = {
      targetPageId,
      accountId,
      entries: toEntries(d.entries),
      updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
    };
    return BacklinkIndex.reconstitute(snapshot);
  }

  async listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>> {
    const snap = await getDoc(backlinkOutboundDoc(this.db, accountId, sourcePageId));
    if (!snap.exists()) return [];
    const d = snap.data() as Record<string, unknown>;
    return Array.isArray(d.targetPageIds) ? (d.targetPageIds as string[]) : [];
  }
}
````

## File: modules/notion/subdomains/knowledge/infrastructure/firebase/FirebaseContentBlockRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IContentBlockRepository.
 * Firestore path: accounts/{accountId}/contentBlocks/{blockId}
 */

import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as _generateId } from "@lib-uuid";
import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { IContentBlockRepository } from "../../domain/repositories/IContentBlockRepository";
import type { BlockContent } from "../../domain/value-objects/BlockContent";
import { BLOCK_TYPES } from "../../domain/value-objects/BlockContent";

const VALID_TYPES = new Set<string>(BLOCK_TYPES);

function blocksCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "contentBlocks");
}
function blockDoc(db: ReturnType<typeof getFirestore>, accountId: string, blockId: string) {
  return doc(db, "accounts", accountId, "contentBlocks", blockId);
}

function toBlockContent(raw: unknown): BlockContent {
  if (typeof raw !== "object" || raw === null) return { type: "text", richText: [] };
  const obj = raw as Record<string, unknown>;
  const type = typeof obj.type === "string" && VALID_TYPES.has(obj.type) ? (obj.type as BlockContent["type"]) : "text";
  return {
    type,
    richText: Array.isArray(obj.richText) ? (obj.richText as BlockContent["richText"]) : [],
    properties: typeof obj.properties === "object" && obj.properties !== null ? (obj.properties as Record<string, unknown>) : undefined,
  };
}

function toSnapshot(id: string, d: Record<string, unknown>): ContentBlockSnapshot {
  return {
    id,
    pageId: typeof d.pageId === "string" ? d.pageId : "",
    accountId: typeof d.accountId === "string" ? d.accountId : "",
    content: toBlockContent(d.content),
    order: typeof d.order === "number" ? d.order : 0,
    parentBlockId: typeof d.parentBlockId === "string" ? d.parentBlockId : null,
    childBlockIds: Array.isArray(d.childBlockIds) ? (d.childBlockIds as string[]) : [],
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseContentBlockRepository implements IContentBlockRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async save(block: ContentBlock): Promise<void> {
    const snap = block.getSnapshot();
    const ref = blockDoc(this.db, snap.accountId, snap.id);
    const existing = await getDoc(ref);
    const data: Record<string, unknown> = { ...snap, updatedAt: serverTimestamp() };
    if (!existing.exists()) {
      data.createdAt = serverTimestamp();
      await setDoc(ref, data);
    } else {
      await updateDoc(ref, data);
    }
  }

  async findById(accountId: string, blockId: string): Promise<ContentBlock | null> {
    const snap = await getDoc(blockDoc(this.db, accountId, blockId));
    if (!snap.exists()) return null;
    return ContentBlock.reconstitute(toSnapshot(snap.id, snap.data() as Record<string, unknown>));
  }

  async listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]> {
    const snaps = await getDocs(
      query(blocksCol(this.db, accountId), where("pageId", "==", pageId)),
    );
    return snaps.docs.map((d) => ContentBlock.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async delete(accountId: string, blockId: string): Promise<void> {
    await deleteDoc(blockDoc(this.db, accountId, blockId));
  }

  async nextOrder(accountId: string, pageId: string): Promise<number> {
    const snaps = await getDocs(
      query(blocksCol(this.db, accountId), where("pageId", "==", pageId)),
    );
    return snaps.size;
  }

  async countByPageId(accountId: string, pageId: string): Promise<number> {
    const snaps = await getDocs(query(blocksCol(this.db, accountId), where("pageId", "==", pageId)));
    return snaps.size;
  }
}
````

## File: modules/notion/subdomains/knowledge/infrastructure/firebase/FirebaseKnowledgeCollectionRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgeCollectionRepository.
 * Firestore path: accounts/{accountId}/knowledgeCollections/{collectionId}
 */

import {
  collection, doc, getDoc, getDocs,
  getFirestore, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { KnowledgeCollection } from "../../domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../domain/repositories/IKnowledgeCollectionRepository";

function col(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeCollections");
}
function docRef(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "knowledgeCollections", id);
}

function toSnapshot(id: string, d: Record<string, unknown>): KnowledgeCollectionSnapshot {
  return {
    id,
    accountId: typeof d.accountId === "string" ? d.accountId : "",
    workspaceId: typeof d.workspaceId === "string" ? d.workspaceId : undefined,
    name: typeof d.name === "string" ? d.name : "",
    description: typeof d.description === "string" ? d.description : undefined,
    columns: Array.isArray(d.columns) ? (d.columns as KnowledgeCollectionSnapshot["columns"]) : [],
    pageIds: Array.isArray(d.pageIds) ? (d.pageIds as string[]) : [],
    status: d.status === "archived" ? "archived" : "active",
    spaceType: d.spaceType === "wiki" ? "wiki" : "database",
    createdByUserId: typeof d.createdByUserId === "string" ? d.createdByUserId : "",
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseKnowledgeCollectionRepository implements IKnowledgeCollectionRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async save(coll: KnowledgeCollection): Promise<void> {
    const snap = coll.getSnapshot();
    const ref = docRef(this.db, snap.accountId, snap.id);
    const existing = await getDoc(ref);
    const data: Record<string, unknown> = { ...snap, columns: [...snap.columns], pageIds: [...snap.pageIds], updatedAt: serverTimestamp() };
    if (!existing.exists()) { data.createdAt = serverTimestamp(); await setDoc(ref, data); }
    else { await updateDoc(ref, data); }
  }

  async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null> {
    const snap = await getDoc(docRef(this.db, accountId, collectionId));
    if (!snap.exists()) return null;
    return KnowledgeCollection.reconstitute(toSnapshot(snap.id, snap.data() as Record<string, unknown>));
  }

  async listByAccountId(accountId: string): Promise<KnowledgeCollection[]> {
    const snaps = await getDocs(col(this.db, accountId));
    return snaps.docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]> {
    const snaps = await getDocs(query(col(this.db, accountId), where("workspaceId", "==", workspaceId)));
    return snaps.docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }
}
````

## File: modules/notion/subdomains/knowledge/infrastructure/firebase/FirebaseKnowledgePageRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgePageRepository.
 * Firestore path: accounts/{accountId}/contentPages/{pageId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as _generateId } from "@lib-uuid";
import { KnowledgePage } from "../../domain/aggregates/KnowledgePage";
import type { KnowledgePageSnapshot } from "../../domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";

function pagesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "contentPages");
}
function pageDoc(db: ReturnType<typeof getFirestore>, accountId: string, pageId: string) {
  return doc(db, "accounts", accountId, "contentPages", pageId);
}

function toSnapshot(id: string, d: Record<string, unknown>): KnowledgePageSnapshot {
  return {
    id,
    accountId: typeof d.accountId === "string" ? d.accountId : "",
    workspaceId: typeof d.workspaceId === "string" ? d.workspaceId : undefined,
    title: typeof d.title === "string" ? d.title : "",
    slug: typeof d.slug === "string" ? d.slug : "",
    parentPageId: typeof d.parentPageId === "string" ? d.parentPageId : null,
    order: typeof d.order === "number" ? d.order : 0,
    blockIds: Array.isArray(d.blockIds) ? (d.blockIds as string[]) : [],
    status: d.status === "archived" ? "archived" : "active",
    approvalState: d.approvalState === "approved" ? "approved" : d.approvalState === "pending" ? "pending" : undefined,
    approvedAtISO: typeof d.approvedAtISO === "string" ? d.approvedAtISO : undefined,
    approvedByUserId: typeof d.approvedByUserId === "string" ? d.approvedByUserId : undefined,
    verificationState: d.verificationState === "verified" ? "verified" : d.verificationState === "needs_review" ? "needs_review" : undefined,
    ownerId: typeof d.ownerId === "string" ? d.ownerId : undefined,
    verifiedByUserId: typeof d.verifiedByUserId === "string" ? d.verifiedByUserId : undefined,
    verifiedAtISO: typeof d.verifiedAtISO === "string" ? d.verifiedAtISO : undefined,
    verificationExpiresAtISO: typeof d.verificationExpiresAtISO === "string" ? d.verificationExpiresAtISO : undefined,
    iconUrl: typeof d.iconUrl === "string" ? d.iconUrl : undefined,
    coverUrl: typeof d.coverUrl === "string" ? d.coverUrl : undefined,
    createdByUserId: typeof d.createdByUserId === "string" ? d.createdByUserId : "",
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseKnowledgePageRepository implements IKnowledgePageRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async save(page: KnowledgePage): Promise<void> {
    const snap = page.getSnapshot();
    const ref = pageDoc(this.db, snap.accountId, snap.id);
    const existing = await getDoc(ref);
    const data: Record<string, unknown> = {
      ...snap,
      blockIds: [...snap.blockIds],
      updatedAt: serverTimestamp(),
    };
    if (!existing.exists()) {
      data.createdAt = serverTimestamp();
      await setDoc(ref, data);
    } else {
      await updateDoc(ref, data);
    }
  }

  async findById(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const snap = await getDoc(pageDoc(this.db, accountId, pageId));
    if (!snap.exists()) return null;
    return KnowledgePage.reconstitute(toSnapshot(snap.id, snap.data() as Record<string, unknown>));
  }

  async listByAccountId(accountId: string): Promise<KnowledgePage[]> {
    const snaps = await getDocs(
      query(pagesCol(this.db, accountId), where("status", "==", "active"), orderBy("order", "asc")),
    );
    return snaps.docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]> {
    const snaps = await getDocs(
      query(pagesCol(this.db, accountId), where("workspaceId", "==", workspaceId), where("status", "==", "active"), orderBy("order", "asc")),
    );
    return snaps.docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async countByParent(accountId: string, parentPageId: string | null): Promise<number> {
    const snaps = await getDocs(
      query(pagesCol(this.db, accountId), where("parentPageId", "==", parentPageId ?? null)),
    );
    return snaps.size;
  }

  async findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
    const page = await this.findById(accountId, pageId);
    return page ? page.getSnapshot() : null;
  }

  async listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]> {
    const pages = await this.listByAccountId(accountId);
    return pages.map((p) => p.getSnapshot());
  }

  async listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
    const pages = await this.listByWorkspaceId(accountId, workspaceId);
    return pages.map((p) => p.getSnapshot());
  }
}
````

## File: modules/notion/subdomains/knowledge/infrastructure/firebase/index.ts
````typescript
export { FirebaseKnowledgePageRepository } from "./FirebaseKnowledgePageRepository";
export { FirebaseContentBlockRepository } from "./FirebaseContentBlockRepository";
export { FirebaseKnowledgeCollectionRepository } from "./FirebaseKnowledgeCollectionRepository";
export { FirebaseBacklinkIndexRepository } from "./FirebaseBacklinkIndexRepository";
````

## File: modules/notion/subdomains/knowledge/infrastructure/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/subdomains/knowledge/interfaces/_actions/index.ts
````typescript
export {
  createKnowledgePage,
  renameKnowledgePage,
  moveKnowledgePage,
  archiveKnowledgePage,
  reorderKnowledgePageBlocks,
  publishKnowledgeVersion,
  approveKnowledgePage,
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
} from "./knowledge-page.actions";

export {
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
} from "./knowledge-block.actions";

export {
  createKnowledgeCollection,
  renameKnowledgeCollection,
  addPageToCollection,
  removePageFromCollection,
  addCollectionColumn,
  archiveKnowledgeCollection,
} from "./knowledge-collection.actions";
````

## File: modules/notion/subdomains/knowledge/interfaces/_actions/knowledge-collection.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCollectionRepo } from "../../api/factories";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../application/use-cases/KnowledgeCollectionUseCases";
import type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../../application/dto/KnowledgeCollectionDto";

export async function createKnowledgeCollection(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new CreateKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_CREATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function renameKnowledgeCollection(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new RenameKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_RENAME_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function addPageToCollection(input: AddPageToCollectionDto): Promise<CommandResult> {
  try { return await new AddPageToCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ADD_PAGE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function removePageFromCollection(input: RemovePageFromCollectionDto): Promise<CommandResult> {
  try { return await new RemovePageFromCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_REMOVE_PAGE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function addCollectionColumn(input: AddCollectionColumnDto): Promise<CommandResult> {
  try { return await new AddCollectionColumnUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ADD_COLUMN_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function archiveKnowledgeCollection(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new ArchiveKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/BlockEditorView.tsx
````typescript
"use client";

import { useRef } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { richTextToPlainText } from "../../application/dto/knowledge.dto";

/**
 * Notion knowledge subdomain — minimal block editor.
 * Full drag-and-drop and rich block types are in the extensions/ layer.
 */
export function BlockEditorView() {
  const { blocks, addBlock, updateBlock, deleteBlock } = useBlockEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, blockId: string) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId);
    }
    if (e.key === "Backspace") {
      const target = e.currentTarget;
      if (target.textContent === "") {
        e.preventDefault();
        deleteBlock(blockId);
      }
    }
  }

  function handleInput(e: React.FormEvent<HTMLDivElement>, blockId: string) {
    const text = (e.currentTarget as HTMLDivElement).textContent ?? "";
    updateBlock(blockId, { type: "text", richText: [{ type: "text", plainText: text }] });
  }

  if (!blocks.length) {
    return (
      <div className="flex min-h-[200px] flex-col gap-1 rounded-lg border border-dashed p-4">
        <div
          role="textbox"
          aria-multiline="true"
          aria-label="新區塊內容"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[32px] w-full rounded px-2 py-1 text-sm outline-none focus:bg-muted/30"
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addBlock(null); }
          }}
          data-placeholder="開始輸入…"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-0.5">
      {blocks.map((block) => {
        const text = richTextToPlainText(block.content.richText);
        return (
          <div
            key={block.id}
            role="textbox"
            aria-multiline="true"
            aria-label={`區塊 ${block.id}`}
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[32px] w-full rounded px-2 py-1 text-sm outline-none focus:bg-muted/30"
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            onInput={(e) => handleInput(e, block.id)}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        );
      })}
    </div>
  );
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/KnowledgePageDetailPage.tsx
````typescript
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Archive, MessageSquare, X } from "lucide-react";

import { getKnowledgePage } from "../queries";
import {
  renameKnowledgePage,
  archiveKnowledgePage,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
} from "../_actions/knowledge-page.actions";
import type { KnowledgePageSnapshot as KnowledgePage } from "../../application/dto/knowledge.dto";
import { PageEditorView } from "./PageEditorView";
import { CommentPanel } from "@/modules/notion/api";
import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { TitleEditor, IconPicker, CoverEditor } from "./KnowledgePageHeaderWidgets";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface KnowledgePageDetailPageProps {
  accountId: string;
  activeWorkspaceId: string | null;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function KnowledgePageDetailPage({
  accountId,
  activeWorkspaceId,
  currentUserId,
}: KnowledgePageDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<KnowledgePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!accountId || !pageId) { setLoading(false); return; }
    setLoading(true);
    try {
      const p = await getKnowledgePage(accountId, pageId);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [accountId, pageId]);

  useEffect(() => { void load(); }, [load]);

  function handleRename(title: string) {
    startTransition(async () => {
      const result = await renameKnowledgePage({ accountId, pageId, title });
      if (result.success) {
        setPage((prev) => prev ? { ...prev, title } : prev);
      }
    });
  }

  function handleIconChange(iconUrl: string) {
    startTransition(async () => {
      const result = await updateKnowledgePageIcon({ accountId, pageId, iconUrl });
      if (result.success) {
        setPage((prev) => prev ? { ...prev, iconUrl: iconUrl || undefined } : prev);
      }
    });
  }

  function handleCoverChange(coverUrl: string) {
    startTransition(async () => {
      const result = await updateKnowledgePageCover({ accountId, pageId, coverUrl });
      if (result.success) {
        setPage((prev) => prev ? { ...prev, coverUrl: coverUrl || undefined } : prev);
      }
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveKnowledgePage({ accountId, pageId });
      router.push("/knowledge/pages");
    });
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────────

  if (!page) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge/pages")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          頁面列表
        </Button>
        <p className="text-sm text-muted-foreground">找不到此頁面，可能已被封存或刪除。</p>
      </div>
    );
  }

  // ── Page view ───────────────────────────────────────────────────────────────

  const updatedAt = page.updatedAtISO
    ? new Date(page.updatedAtISO).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-0">
      {/* Cover image */}
      {page.coverUrl && (
        <div
          className="relative h-40 w-full overflow-hidden rounded-t-xl bg-muted"
          style={{ backgroundImage: `url(${page.coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}

      <div className="space-y-4 px-0 pt-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge/pages")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            頁面列表
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant={commentOpen ? "default" : "outline"}
              onClick={() => setCommentOpen((v) => !v)}
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              留言
            </Button>
            {page.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleArchive}
                disabled={isPending}
              >
                <Archive className="mr-1.5 h-3.5 w-3.5" />
                封存
              </Button>
            )}
          </div>
        </div>

        {/* Page header */}
        <header className="space-y-2 border-b border-border/60 pb-4">
          {/* Icon row */}
          <div className="flex items-end gap-3">
            <IconPicker
              value={page.iconUrl}
              onChange={handleIconChange}
              isPending={isPending}
            />
            <CoverEditor
              value={page.coverUrl}
              onChange={handleCoverChange}
              isPending={isPending}
            />
          </div>
          <TitleEditor
            initialTitle={page.title}
            onSave={handleRename}
            isPending={isPending}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {page.status === "archived" && (
              <Badge variant="secondary">已封存</Badge>
            )}
            {page.approvalState === "approved" && (
              <Badge variant="default">已審核</Badge>
            )}
            {page.verificationState === "verified" && (
              <Badge variant="outline">已驗證</Badge>
            )}
            {page.verificationState === "needs_review" && (
              <Badge variant="destructive">待審查</Badge>
            )}
            {updatedAt && <span>更新於 {updatedAt}</span>}
          </div>
        </header>

        {/* Main content + optional comment side panel */}
        <div className={`flex gap-4 ${commentOpen ? "items-start" : ""}`}>
          {/* Block editor — connected to Firebase */}
          <div className="min-w-0 flex-1">
            {accountId ? (
              <PageEditorView accountId={accountId} pageId={pageId} />
            ) : (
              <p className="text-sm text-muted-foreground">請先登入以載入內容。</p>
            )}
          </div>

          {/* Comment panel — slides in from right */}
          {commentOpen && accountId && (
            <aside className="w-72 shrink-0 rounded-xl border border-border/60 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">留言</span>
                <button
                  type="button"
                  onClick={() => setCommentOpen(false)}
                  className="ml-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="關閉留言面板"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <CommentPanel
                accountId={accountId}
                workspaceId={activeWorkspaceId ?? ""}
                contentId={pageId}
                contentType="page"
                currentUserId={currentUserId}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/KnowledgePageHeaderWidgets.tsx
````typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Pencil, Smile } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui-shadcn/ui/popover";

// ── Title editor ──────────────────────────────────────────────────────────────

export interface TitleEditorProps {
  initialTitle: string;
  onSave: (title: string) => void;
  isPending: boolean;
}

export function TitleEditor({ initialTitle, onSave, isPending }: TitleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setValue(initialTitle); }, [initialTitle]);

  function startEdit() {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== initialTitle) {
      onSave(trimmed);
    } else {
      setValue(initialTitle);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setValue(initialTitle); setEditing(false); }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="h-auto border-0 bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={commit}
          disabled={isPending}
          className="rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="儲存標題"
        >
          <Check className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{value}</h1>
      <button
        type="button"
        onClick={startEdit}
        disabled={isPending}
        className="invisible rounded p-1 text-muted-foreground hover:text-foreground group-hover:visible"
        aria-label="重新命名頁面"
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  );
}

// ── Icon picker ───────────────────────────────────────────────────────────────

const QUICK_EMOJIS = ["📄", "📝", "📚", "💡", "🎯", "🚀", "⭐", "🔑", "📌", "🗂️", "🏷️", "🔖", "📋", "🗒️", "📊", "🔍"];

export interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  isPending: boolean;
}

export function IconPicker({ value, onChange, isPending }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-xl hover:bg-muted/60 transition"
          title="設定頁面圖示"
        >
          {value ? value : <Smile className="h-5 w-5 text-muted-foreground" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">選擇圖示</p>
        <div className="mb-3 grid grid-cols-8 gap-1">
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => { onChange(e); setOpen(false); }}
              className="rounded p-1 text-lg hover:bg-muted transition"
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="輸入 emoji 或文字"
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!custom.trim()}
            onClick={() => { onChange(custom.trim()); setCustom(""); setOpen(false); }}
          >
            套用
          </Button>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full text-xs text-muted-foreground"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            移除圖示
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Cover editor ──────────────────────────────────────────────────────────────

export interface CoverEditorProps {
  value?: string;
  onChange: (url: string) => void;
  isPending: boolean;
}

export function CoverEditor({ value, onChange, isPending }: CoverEditorProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(value ?? "");

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) setUrl(value ?? ""); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          title="設定封面圖片"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {value ? "變更封面" : "新增封面"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">封面圖片 URL</p>
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => { onChange(url.trim()); setOpen(false); }}
          >
            套用
          </Button>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full text-xs text-muted-foreground"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            移除封面
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/KnowledgePagesRouteScreen.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { useAuth } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { KnowledgePageTreeNode } from "../../application/dto/knowledge.dto";
import { getKnowledgePageTree, getKnowledgePageTreeByWorkspace } from "../queries";
import { PageTreeView } from "./PageTreeView";

/**
 * KnowledgePagesRouteScreen
 * Route-level screen component for /knowledge/pages.
 * Encapsulates data-loading, scope resolution and layout so that the
 * Next.js route file stays thin (params/context wiring only).
 */
export function KnowledgePagesRouteScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const scopeParam = searchParams.get("scope")?.trim() ?? "";
  const isAccountSummary = scopeParam === "account";
  const workspaceId = isAccountSummary ? "" : requestedWorkspaceId || appState.activeWorkspaceId || "";
  const currentUserId = authState.user?.id ?? "";

  const [nodes, setNodes] = useState<KnowledgePageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accountId) { setLoading(false); return; }
    if (!isAccountSummary && !workspaceId) {
      setNodes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const tree = isAccountSummary
        ? await getKnowledgePageTree(accountId)
        : await getKnowledgePageTreeByWorkspace(accountId, workspaceId);
      setNodes(tree);
    } finally {
      setLoading(false);
    }
  }, [accountId, isAccountSummary, workspaceId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">頁面</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isAccountSummary ? "secondary" : "outline"}>
            {isAccountSummary ? "Account Summary" : "Workspace Scope"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {isAccountSummary
              ? "這是顯式 account summary mode。僅用於跨工作區總覽，預設不在此建立新頁面。"
              : "知識頁面階層樹預設綁定目前工作區。點選頁面進入內容編輯器。"}
          </p>
        </div>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/knowledge")}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Knowledge Hub
        </button>
      </div>

      {!accountId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號情境，請先登入。
        </p>
      ) : !isAccountSummary && !workspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未選定工作區。請先從工作區進入知識頁面，或在網址帶入 workspaceId 後再查看頁面樹。
        </p>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <PageTreeView
          nodes={nodes}
          accountId={accountId}
          workspaceId={workspaceId || undefined}
          currentUserId={currentUserId}
          allowCreate={!isAccountSummary && Boolean(workspaceId)}
          emptyStateDescription={
            isAccountSummary
              ? "這個 account summary 目前沒有可顯示的頁面。請改從工作區建立與維護頁面。"
              : "這個工作區尚無頁面。點擊「新增頁面」開始建立。"
          }
          onPageClick={(pageId) => router.push(`/knowledge/pages/${pageId}`)}
          onCreated={() => load()}
        />
      )}
    </div>
  );
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/PageDialog.tsx
````typescript
"use client";

import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { createKnowledgePage } from "../_actions/knowledge-page.actions";

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  parentPageId?: string | null;
  onSuccess?: (pageId?: string) => void;
}

export function PageDialog({ open, onOpenChange, accountId, workspaceId, currentUserId, parentPageId, onSuccess }: PageDialogProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() { setTitle(""); setError(null); }
  function handleOpenChange(next: boolean) { if (!next) reset(); onOpenChange(next); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("頁面標題為必填"); return; }
    setError(null);
    startTransition(async () => {
      const result = await createKnowledgePage({ accountId, workspaceId, title: title.trim(), parentPageId: parentPageId ?? null, createdByUserId: currentUserId });
      if (result.success) { reset(); onOpenChange(false); onSuccess?.(result.aggregateId); }
      else { setError(result.error?.message ?? "建立失敗"); }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{parentPageId ? "新增子頁面" : "新增頁面"}</DialogTitle></DialogHeader>
        <form id="page-form" className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="page-title">標題 *</Label>
            <Input id="page-title" placeholder="頁面標題" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus disabled={isPending} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={isPending}>取消</Button>
          <Button type="submit" form="page-form" size="sm" disabled={isPending || !title.trim()}>{isPending ? "建立中…" : "建立"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/PageEditorView.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorView — renders the block editor for a knowledge page.
 *          Connects accountId/pageId context to BlockEditorView.
 */

import { useEffect, useCallback } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { getKnowledgeBlocks } from "../queries";
import { BlockEditorView } from "./BlockEditorView";

export interface PageEditorViewProps {
  accountId: string;
  pageId: string;
}

export function PageEditorView({ accountId, pageId }: PageEditorViewProps) {
  const { setPage, setBlocks } = useBlockEditorStore();

  const loadBlocks = useCallback(async () => {
    if (!accountId || !pageId) return;
    setPage(accountId, pageId);
    const snapshots = await getKnowledgeBlocks(accountId, pageId);
    setBlocks(
      snapshots.map((b) => ({
        id: b.id,
        content: b.content,
        order: b.order,
        parentBlockId: b.parentBlockId,
        isFocused: false,
      })),
    );
  }, [accountId, pageId, setPage, setBlocks]);

  useEffect(() => { void loadBlocks(); }, [loadBlocks]);

  return <BlockEditorView />;
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/PageTreeView.tsx
````typescript
"use client";

import { ChevronDown, ChevronRight, FilePlus, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { KnowledgePageTreeNode } from "../../application/dto/knowledge.dto";
import { PageDialog } from "./PageDialog";

export interface PageTreeViewProps {
  nodes: KnowledgePageTreeNode[];
  accountId: string;
  workspaceId?: string;
  currentUserId: string;
  allowCreate?: boolean;
  emptyStateDescription?: string;
  onPageClick?: (pageId: string) => void;
  onCreated?: () => void;
}

function TreeNode({
  node, accountId, workspaceId, currentUserId, allowCreate, onPageClick, onCreated, depth,
}: { node: KnowledgePageTreeNode; accountId: string; workspaceId?: string; currentUserId: string; allowCreate: boolean; onPageClick?: (id: string) => void; onCreated?: () => void; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const canCreate = allowCreate && Boolean(workspaceId);

  return (
    <li>
      <div className="group flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted/30" style={{ paddingLeft: `${8 + depth * 16}px` }}>
        <button type="button" className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground" onClick={() => setExpanded((v) => !v)}>
          {hasChildren ? (expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : <FileText className="h-3.5 w-3.5" />}
        </button>
        <button type="button" className="min-w-0 flex-1 truncate text-left text-sm" onClick={() => onPageClick?.(node.id)}>
          {node.title}
        </button>
        {canCreate && (
          <button type="button" className="invisible shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground group-hover:visible" onClick={(e) => { e.stopPropagation(); setAddChildOpen(true); }}>
            <FilePlus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {expanded && hasChildren && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} allowCreate={allowCreate} onPageClick={onPageClick} onCreated={onCreated} depth={depth + 1} />
          ))}
        </ul>
      )}
      {addChildOpen && (
        <PageDialog open={addChildOpen} onOpenChange={setAddChildOpen} accountId={accountId} workspaceId={workspaceId ?? ""} currentUserId={currentUserId} parentPageId={node.id} onSuccess={onCreated} />
      )}
    </li>
  );
}

export function PageTreeView({ nodes, accountId, workspaceId, currentUserId, allowCreate = true, emptyStateDescription, onPageClick, onCreated }: PageTreeViewProps) {
  const [createOpen, setCreateOpen] = useState(false);
  if (!nodes.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
        <FileText className="h-8 w-8 opacity-40" />
        <p>{emptyStateDescription ?? "尚無頁面"}</p>
        {allowCreate && workspaceId && (
          <>
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>新增頁面</Button>
            <PageDialog open={createOpen} onOpenChange={setCreateOpen} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} parentPageId={null} onSuccess={onCreated} />
          </>
        )}
      </div>
    );
  }
  return <ul className="space-y-0.5">{nodes.map((n) => <TreeNode key={n.id} node={n} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} allowCreate={allowCreate} onPageClick={onPageClick} onCreated={onCreated} depth={0} />)}</ul>;
}
````

## File: modules/notion/subdomains/knowledge/interfaces/store/block-editor.store.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/store
 * Purpose: Zustand store for the block editor UI state.
 *          Manages optimistic block operations before persistence.
 */
"use client";

import { create } from "zustand";
import type { BlockContent } from "../../application/dto/knowledge.dto";

export interface EditorBlock {
  id: string;
  content: BlockContent;
  order: number;
  parentBlockId: string | null;
  isFocused: boolean;
}

interface BlockEditorState {
  pageId: string | null;
  accountId: string | null;
  blocks: EditorBlock[];
  isDirty: boolean;

  setPage: (accountId: string, pageId: string) => void;
  setBlocks: (blocks: EditorBlock[]) => void;
  addBlock: (after: string | null, content?: BlockContent) => EditorBlock;
  updateBlock: (id: string, content: BlockContent) => void;
  deleteBlock: (id: string) => void;
  reorder: (ids: string[]) => void;
  clearDirty: () => void;
}

function makeId() {
  return crypto.randomUUID();
}

export const useBlockEditorStore = create<BlockEditorState>((set, get) => ({
  pageId: null,
  accountId: null,
  blocks: [],
  isDirty: false,

  setPage(accountId, pageId) {
    set({ accountId, pageId, blocks: [], isDirty: false });
  },

  setBlocks(blocks) {
    set({ blocks, isDirty: false });
  },

  addBlock(afterId, content = { type: "text", richText: [] }) {
    const blocks = [...get().blocks];
    const idx = afterId ? blocks.findIndex((b) => b.id === afterId) : blocks.length - 1;
    const newBlock: EditorBlock = {
      id: makeId(),
      content,
      order: idx + 1,
      parentBlockId: null,
      isFocused: true,
    };
    const updated = [
      ...blocks.slice(0, idx + 1),
      newBlock,
      ...blocks.slice(idx + 1).map((b) => ({ ...b, order: b.order + 1 })),
    ];
    set({ blocks: updated, isDirty: true });
    return newBlock;
  },

  updateBlock(id, content) {
    set({
      blocks: get().blocks.map((b) => (b.id === id ? { ...b, content } : b)),
      isDirty: true,
    });
  },

  deleteBlock(id) {
    set({
      blocks: get().blocks.filter((b) => b.id !== id),
      isDirty: true,
    });
  },

  reorder(ids) {
    const map = new Map(get().blocks.map((b) => [b.id, b]));
    const reordered = ids
      .map((id, i) => {
        const b = map.get(id);
        return b ? { ...b, order: i } : null;
      })
      .filter((b): b is EditorBlock => b !== null);
    set({ blocks: reordered, isDirty: true });
  },

  clearDirty() {
    set({ isDirty: false });
  },
}));
````

## File: modules/notion/subdomains/notes/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/notes/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'notes'.
````

## File: modules/notion/subdomains/notes/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'notes'.
````

## File: modules/notion/subdomains/notes/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'notes'.
````

## File: modules/notion/subdomains/publishing/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/publishing/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'publishing'.
````

## File: modules/notion/subdomains/publishing/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'publishing'.
````

## File: modules/notion/subdomains/publishing/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'publishing'.
````

## File: modules/notion/subdomains/relations/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/relations/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'relations'.
````

## File: modules/notion/subdomains/relations/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'relations'.
````

## File: modules/notion/subdomains/relations/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'relations'.
````

## File: modules/notion/subdomains/taxonomy/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/taxonomy/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'taxonomy'.
````

## File: modules/notion/subdomains/taxonomy/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'taxonomy'.
````

## File: modules/notion/subdomains/taxonomy/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'taxonomy'.
````

## File: modules/notion/subdomains/templates/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notion/subdomains/templates/application/index.ts
````typescript
// Purpose: Application layer placeholder for notion subdomain 'templates'.
````

## File: modules/notion/subdomains/templates/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notion subdomain 'templates'.
````

## File: modules/notion/subdomains/templates/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notion subdomain 'templates'.
````

## File: modules/notion/api/api.instructions.md
````markdown
---
description: 'Notion API boundary rules: cross-module entry surface, knowledge artifact published language, and downstream consumer contracts.'
applyTo: 'modules/notion/api/**/*.{ts,tsx}'
---

# Notion API Layer (Local)

Use this file as execution guardrails for `modules/notion/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface; never expose `domain/`, `application/`, or `infrastructure/` internals.
- Expose stable **factory functions** and **contract types** only — no aggregate classes, no repository interfaces.
- Published language tokens for cross-module use: `knowledgePageRef`, `articleRef`, `collectionId`, `contentBlockRef`, `knowledgeArtifactReference`.
- `notebooklm` consumes knowledge artifact references from this boundary — translate to notebooklm's own domain model via ACL.
- `factories.ts` in subdomains wires services for tRPC or server-action consumption; keep wiring thin.
- Never expose `workspaceId`-scoped data without verifying workspace membership through `platform` entitlement signals.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/api/index.ts
````typescript
/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified ACL for all notion subdomains.
 *          External consumers (app/, other modules) must only import from here.
 */

// ── knowledge subdomain ───────────────────────────────────────────────────────
export * from "../subdomains/knowledge/api";

// ── authoring subdomain ───────────────────────────────────────────────────────
// Migration-Pending: full implementation from modules/knowledge-base/
export * from "../subdomains/authoring/api";

// ── collaboration subdomain ───────────────────────────────────────────────────
// Migration-Pending: full implementation from modules/knowledge-collaboration/
export * from "../subdomains/collaboration/api";

// ── database subdomain ────────────────────────────────────────────────────────
// Migration-Pending: full implementation from modules/knowledge-database/
export * from "../subdomains/database/api";

// ── notes subdomain ───────────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/notes/api";

// ── templates subdomain ───────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/templates/api";

// ── attachments subdomain ─────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/attachments/api";

// ── automation subdomain ──────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/automation/api";

// ── knowledge-analytics subdomain ─────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/knowledge-analytics/api";

// ── knowledge-integration subdomain ───────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/knowledge-integration/api";

// ── knowledge-versioning subdomain ────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/knowledge-versioning/api";

// ── taxonomy subdomain ────────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/taxonomy/api";

// ── relations subdomain ───────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/relations/api";

// ── publishing subdomain ──────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/publishing/api";
````

## File: modules/notion/application/application.instructions.md
````markdown
---
description: 'Notion application layer rules: use-case orchestration, content lifecycle commands, event publishing order, and DTO contracts.'
applyTo: 'modules/notion/application/**/*.{ts,tsx}'
---

# Notion Application Layer (Local)

Use this file as execution guardrails for `modules/notion/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/*`.

## Core Rules

- Context-wide `application/` is reserved for cross-subdomain orchestration; subdomain-specific use cases belong inside `subdomains/<name>/application/`.
- Use cases orchestrate flow only; content validation, backlink extraction, and publication rules stay in `domain/services/`.
- After persisting, call `pullDomainEvents()` and publish — never publish before persistence.
- DTOs are application-layer contracts; never expose domain aggregates (`Article`, `KnowledgePage`, `Database`) across the layer boundary.
- Pure reads (page trees, block queries, collection views) belong in **query handlers**, not use cases.
- Content lifecycle stages (draft → verified → published) must each correspond to a discrete use case with explicit precondition checks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/application/dtos/.gitkeep
````

````

## File: modules/notion/application/services/.gitkeep
````

````

## File: modules/notion/application/use-cases/.gitkeep
````

````

## File: modules/notion/docs/docs.instructions.md
````markdown
---
description: 'Notion documentation rules: strategic doc authority, subdomain list sync, and ubiquitous language enforcement.'
applyTo: 'modules/notion/docs/**/*.md'
---

# Notion Docs Layer (Local)

Use this file as execution guardrails for `modules/notion/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/notion/*`.

## Core Rules

- `modules/notion/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/notion/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting notion must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/notion/ubiquitous-language.md`; do not introduce synonyms.
- Keep this directory in sync with `docs/contexts/notion/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/domain/domain-modeling.instructions.md
````markdown
---
description: 'Notion domain tactical modeling rules (local mirror of root domain-modeling guidance).'
applyTo: '*.{ts,tsx}'
---

# Domain Modeling (Notion Local)

Use this local file as execution guardrails for `modules/notion/domain/*`.
For full reference, align with `.github/instructions/domain-modeling.instructions.md` and `docs/contexts/notion/*`.

## Core Rules

- Keep aggregate invariants inside aggregate methods.
- Use immutable value objects with Zod schemas and inferred types.
- Keep domain framework-free (no Firebase/React/transport imports).
- Emit domain events on state transitions and publish via application orchestration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/domain/services/.gitkeep
````

````

## File: modules/notion/infrastructure/infrastructure.instructions.md
````markdown
---
description: 'Notion infrastructure layer rules: Firebase adapters, repository implementations, Firestore collection ownership, and persistence mapping.'
applyTo: 'modules/notion/infrastructure/**/*.{ts,tsx}'
---

# Notion Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/notion/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md` and `docs/contexts/notion/*`.

## Core Rules

- Implement only **port interfaces** declared in subdomain `domain/ports/` — never invent new contracts here.
- Context-wide `infrastructure/` is for shared adapters that span multiple subdomains; subdomain-specific adapters belong inside `subdomains/<name>/infrastructure/`.
- Each subdomain's Firebase adapter owns its Firestore collection(s); do not read or write sibling subdomain or cross-module collections directly.
- Persistence mappers translate between domain objects and Firestore records — keep them in infrastructure, never in domain.
- Version breaking schema transitions with migration steps; update `firestore.indexes.json` with query-shape changes.
- Content block storage must preserve ordering metadata for consistent tree reconstruction.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill xuanwu-development-contracts
````

## File: modules/notion/interfaces/interfaces.instructions.md
````markdown
---
description: 'Notion interfaces layer rules: input/output translation, Server Actions, rich-text editor wiring, and knowledge UI components.'
applyTo: 'modules/notion/interfaces/**/*.{ts,tsx}'
---

# Notion Interfaces Layer (Local)

Use this file as execution guardrails for `modules/notion/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/notion/*`.

## Core Rules

- This layer owns **input/output translation only** — no content validation rules, no publication policy.
- Server Actions (`_actions/`) must be thin: validate input, call the use case, return a stable result shape.
- Never call repositories directly from components or actions.
- TipTap editor integration belongs here; do not let editor schema types leak into `domain/` or `application/`.
- Block editor stores (`store/block-editor.store.ts`) are UI state only — do not mix domain state with editor state.
- Use shadcn/ui primitives before creating new components; maintain semantic markup and keyboard accessibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: modules/notion/notion.instructions.md
````markdown
---
description: 'Notion bounded context rules: knowledge content lifecycle ownership, downstream dependency position, and subdomain routing.'
applyTo: 'modules/notion/**/*.{ts,tsx,md}'
---

# Notion Bounded Context (Local)

Use this file as execution guardrails for `modules/notion/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/notion/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `notion` is **downstream** of `platform`; never import from platform internals — use `modules/platform/api` only.
- `notion` is **upstream** of `notebooklm`; expose stable knowledge artifact references via `modules/notion/api`, never raw aggregates.
- Cross-module consumers import from `modules/notion/api` only.
- Use ubiquitous language: `KnowledgeArtifact` not `Wiki`/`Doc`, `KnowledgePage` not `Page` (when referring to canonical knowledge), `Article` for authored editorial content.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Article and category lifecycle, publication, verification | `authoring` |
| Knowledge pages, content blocks, collections, backlinks | `knowledge` |
| Structured database records, views, automation | `database` |
| Comments, permissions, version history | `collaboration` |
| File and media attachments | `attachments` |
| Content publishing and distribution | `publishing` |
| Content relations and cross-references | `relations` |
| Tag and taxonomy management | `taxonomy` |
| Page and block templates | `templates` |
| Knowledge analytics and metrics | `knowledge-analytics` |
| External knowledge integration | `knowledge-integration` |
| Knowledge version management | `knowledge-versioning` |
| Personal notes | `notes` |
| Workflow automation on content | `automation` |

## Route Elsewhere When

- Identity, entitlements, credentials, organization → `platform`
- Workspace lifecycle, membership, presence → `workspace`
- Notebook, conversation, retrieval, synthesis → `notebooklm`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/README.md
````markdown
# Notion

知識內容生命週期主域

## Implementation Structure

```text
modules/notion/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── authoring/           # Baseline — Active
    ├── collaboration/        # Baseline — Active
    ├── database/             # Baseline — Active
    ├── knowledge/            # Baseline — Active
    ├── attachments/          # Baseline — Stub
    ├── automation/           # Baseline — Stub
    ├── knowledge-analytics/  # Baseline — Stub
    ├── knowledge-integration/ # Baseline — Stub
    ├── knowledge-versioning/ # Baseline — Stub
    ├── notes/                # Baseline — Stub
    ├── templates/            # Baseline — Stub
    ├── publishing/           # Recommended Gap — Stub
    ├── relations/            # Recommended Gap — Stub
    └── taxonomy/             # Recommended Gap — Stub
```

## Subdomains

### Baseline — Active

| Subdomain | Purpose |
|-----------|--------|
| authoring | 知識庫文章建立、驗證與分類 |
| collaboration | 協作留言、細粒度權限與版本快照 |
| database | 結構化資料多視圖管理 |
| knowledge | 頁面建立、組織、版本化與交付 |

### Baseline — Stub

| Subdomain | Purpose |
|-----------|--------|
| attachments | 附件與媒體關聯儲存 |
| automation | 知識事件觸發自動化動作 |
| knowledge-analytics | 知識使用行為量測 |
| knowledge-integration | 知識與外部系統雙向整合 |
| knowledge-versioning | 全域版本快照策略管理 |
| notes | 個人輕量筆記與正式知識協作 |
| templates | 頁面範本管理與套用 |

### Recommended Gap — Stub

| Subdomain | Purpose |
|-----------|--------|
| publishing | 建立正式發布與對外交付的正典邊界 |
| relations | 建立內容之間關聯與 backlink 的正典邊界 |
| taxonomy | 建立分類法與語義組織的正典邊界 |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notion/README.md)
- [Subdomains](../../docs/contexts/notion/subdomains.md)
- [Context Map](../../docs/contexts/notion/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notion/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/notion/subdomains/attachments/README.md
````markdown
# Attachments

附件與媒體關聯儲存。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/authoring/application/use-cases/index.ts
````typescript
export {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
} from "./ArticleLifecycleUseCases";

export { PublishArticleUseCase } from "./ArticlePublicationUseCases";

export {
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
} from "./ArticleVerificationUseCases";

export {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "./CategoryUseCases";
````

## File: modules/notion/subdomains/authoring/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./events";
export * from "./repositories";
export * from "./value-objects";
// Ports layer — driven port aliases
export type { IArticlePort, ICategoryPort } from "./ports";
````

## File: modules/notion/subdomains/authoring/domain/ports/index.ts
````typescript
/**
 * notion/authoring domain/ports — driven port interfaces for the authoring subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IArticleRepository as IArticlePort } from "../repositories/IArticleRepository";
export type { ICategoryRepository as ICategoryPort } from "../repositories/ICategoryRepository";
````

## File: modules/notion/subdomains/authoring/README.md
````markdown
# Authoring

知識庫文章建立、驗證與分類。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/automation/README.md
````markdown
# Automation

知識事件觸發自動化動作。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/collaboration/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./events";
export * from "./repositories";
export * from "./services";
export * from "./value-objects";
// Ports layer — driven port aliases
export type { ICommentPort, IPermissionPort, IVersionPort } from "./ports";
````

## File: modules/notion/subdomains/collaboration/domain/ports/index.ts
````typescript
/**
 * notion/collaboration domain/ports — driven port interfaces for the collaboration subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { ICommentRepository as ICommentPort } from "../repositories/ICommentRepository";
export type { IPermissionRepository as IPermissionPort } from "../repositories/IPermissionRepository";
export type { IVersionRepository as IVersionPort } from "../repositories/IVersionRepository";
````

## File: modules/notion/subdomains/collaboration/README.md
````markdown
# Collaboration

協作留言、細粒度權限與版本快照。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/database/application/queries/automation.queries.ts
````typescript
import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";
import type { IAutomationRepository } from "../../domain/repositories/IAutomationRepository";

export class ListAutomationsUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    return this.repo.listByDatabase(accountId, databaseId);
  }
}
````

## File: modules/notion/subdomains/database/application/queries/database.queries.ts
````typescript
import type { IDatabaseRepository } from "../../domain/repositories/IDatabaseRepository";
import type { DatabaseSnapshot } from "../../domain/aggregates/Database";
import { GetDatabaseSchema, ListDatabasesSchema } from "../dto/DatabaseDto";
import type { GetDatabaseDto, ListDatabasesDto } from "../dto/DatabaseDto";

export class GetDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: GetDatabaseDto): Promise<DatabaseSnapshot | null> {
    const parsed = GetDatabaseSchema.safeParse(input);
    if (!parsed.success) return null;
    return this.repo.findById(parsed.data.id, parsed.data.accountId);
  }
}

export class ListDatabasesUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: ListDatabasesDto): Promise<DatabaseSnapshot[]> {
    const parsed = ListDatabasesSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByWorkspace(parsed.data.accountId, parsed.data.workspaceId);
  }
}
````

## File: modules/notion/subdomains/database/application/queries/record.queries.ts
````typescript
import type { IDatabaseRecordRepository } from "../../domain/repositories/IDatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
import { ListRecordsSchema } from "../dto/DatabaseDto";
import type { ListRecordsDto } from "../dto/DatabaseDto";

export class ListRecordsUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: ListRecordsDto): Promise<DatabaseRecordSnapshot[]> {
    const parsed = ListRecordsSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByDatabase(parsed.data.accountId, parsed.data.databaseId);
  }
}
````

## File: modules/notion/subdomains/database/application/queries/view.queries.ts
````typescript
import type { IViewRepository } from "../../domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";
import { ListViewsSchema } from "../dto/DatabaseDto";
import type { ListViewsDto } from "../dto/DatabaseDto";

export class ListViewsUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: ListViewsDto): Promise<ViewSnapshot[]> {
    const parsed = ListViewsSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByDatabase(parsed.data.accountId, parsed.data.databaseId);
  }
}
````

## File: modules/notion/subdomains/database/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./events";
export * from "./repositories";
export * from "./services";
export * from "./value-objects";
// Ports layer — driven port aliases
export type { IAutomationPort, IDatabaseRecordPort, IDatabasePort, IViewPort } from "./ports";
````

## File: modules/notion/subdomains/database/domain/ports/index.ts
````typescript
/**
 * notion/database domain/ports — driven port interfaces for the database subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IAutomationRepository as IAutomationPort } from "../repositories/IAutomationRepository";
export type { IDatabaseRecordRepository as IDatabaseRecordPort } from "../repositories/IDatabaseRecordRepository";
export type { IDatabaseRepository as IDatabasePort } from "../repositories/IDatabaseRepository";
export type { IViewRepository as IViewPort } from "../repositories/IViewRepository";
````

## File: modules/notion/subdomains/database/README.md
````markdown
# Database

結構化資料多視圖管理。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/knowledge-analytics/README.md
````markdown
# Knowledge Analytics

知識使用行為量測。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/knowledge-integration/README.md
````markdown
# Knowledge Integration

知識與外部系統雙向整合。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/knowledge-versioning/README.md
````markdown
# Knowledge Versioning

全域版本快照策略管理。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/knowledge/application/dto/index.ts
````typescript
export * from "./KnowledgePageDto";
export * from "./ContentBlockDto";
export * from "./KnowledgeCollectionDto";
export * from "./KnowledgePageLifecycleDto";
````

## File: modules/notion/subdomains/knowledge/application/dto/KnowledgePageLifecycleDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for knowledge page lifecycle use cases.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const VerifyKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  verifiedByUserId: z.string().min(1),
  verificationExpiresAtISO: z.string().datetime({ offset: true }).optional(),
});
export type VerifyKnowledgePageDto = z.infer<typeof VerifyKnowledgePageSchema>;

export const RequestPageReviewSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  requestedByUserId: z.string().min(1),
});
export type RequestPageReviewDto = z.infer<typeof RequestPageReviewSchema>;

export const AssignPageOwnerSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  ownerId: z.string().min(1),
  assignedByUserId: z.string().min(1),
});
export type AssignPageOwnerDto = z.infer<typeof AssignPageOwnerSchema>;

export const UpdatePageIconSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  iconUrl: z.string().max(2000),
});
export type UpdatePageIconDto = z.infer<typeof UpdatePageIconSchema>;

export const UpdatePageCoverSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  coverUrl: z.string().max(2000),
});
export type UpdatePageCoverDto = z.infer<typeof UpdatePageCoverSchema>;
````

## File: modules/notion/subdomains/knowledge/application/queries/backlink.queries.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { BacklinkIndexSnapshot } from "../../domain/aggregates/BacklinkIndex";
import type { IBacklinkIndexRepository } from "../../domain/repositories/IBacklinkIndexRepository";

export class UpdatePageBacklinksUseCase {
  constructor(private readonly repo: IBacklinkIndexRepository) {}
  async execute(input: {
    readonly accountId: string;
    readonly sourcePageId: string;
    readonly sourcePageTitle: string;
    readonly mentionsByTarget: ReadonlyMap<string, ReadonlyArray<{ blockId: string; lastSeenAtISO: string }>>;
  }): Promise<CommandResult> {
    const { accountId, sourcePageId, sourcePageTitle, mentionsByTarget } = input;
    if (!accountId || !sourcePageId) return commandFailureFrom("BACKLINK_INVALID_INPUT", "accountId and sourcePageId required.");
    for (const [targetPageId, mentions] of mentionsByTarget) {
      await this.repo.upsertFromSource({ accountId, targetPageId, sourcePageId, entries: mentions.map(m => ({ sourcePageTitle, blockId: m.blockId, lastSeenAtISO: m.lastSeenAtISO })) });
    }
    const currentTargets = await this.repo.listOutboundTargets(accountId, sourcePageId);
    const newTargetSet = new Set(mentionsByTarget.keys());
    for (const old of currentTargets) {
      if (!newTargetSet.has(old)) await this.repo.upsertFromSource({ accountId, targetPageId: old, sourcePageId, entries: [] });
    }
    return commandSuccess(sourcePageId, Date.now());
  }
}

export class RemovePageBacklinksUseCase {
  constructor(private readonly repo: IBacklinkIndexRepository) {}
  async execute(accountId: string, sourcePageId: string): Promise<CommandResult> {
    await this.repo.removeFromSource({ accountId, sourcePageId });
    return commandSuccess(sourcePageId, Date.now());
  }
}

export class GetPageBacklinksUseCase {
  constructor(private readonly repo: IBacklinkIndexRepository) {}
  async execute(accountId: string, targetPageId: string): Promise<BacklinkIndexSnapshot | null> {
    const idx = await this.repo.findByTargetPage(accountId, targetPageId);
    return idx ? idx.getSnapshot() : null;
  }
}
````

## File: modules/notion/subdomains/knowledge/application/queries/content-block.queries.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { IContentBlockRepository } from "../../domain/repositories/IContentBlockRepository";
import type { BlockContent } from "../../domain/value-objects/BlockContent";
import {
  AddKnowledgeBlockSchema, type AddKnowledgeBlockDto,
  UpdateKnowledgeBlockSchema, type UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockSchema, type DeleteKnowledgeBlockDto,
  NestKnowledgeBlockSchema, type NestKnowledgeBlockDto,
  UnnestKnowledgeBlockSchema, type UnnestKnowledgeBlockDto,
} from "../dto/ContentBlockDto";

export class AddContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: AddKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = AddKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, pageId, content, index, parentBlockId } = parsed.data;
    const count = await this.repo.countByPageId(accountId, pageId);
    const order = index !== undefined ? index : count;
    const id = generateId();
    const block = ContentBlock.create(id, { pageId, accountId, content: content as BlockContent, order, parentBlockId });
    await this.repo.save(block);
    return commandSuccess(block.id, Date.now());
  }
}

export class UpdateContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: UpdateKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = UpdateKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, blockId, content } = parsed.data;
    const block = await this.repo.findById(accountId, blockId);
    if (!block) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    block.update(content as BlockContent);
    await this.repo.save(block);
    return commandSuccess(block.id, Date.now());
  }
}

export class DeleteContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = DeleteKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.blockId);
    return commandSuccess(parsed.data.blockId, Date.now());
  }
}

export class NestContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: NestKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = NestKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, blockId, parentBlockId, index } = parsed.data;
    const [block, parent] = await Promise.all([this.repo.findById(accountId, blockId), this.repo.findById(accountId, parentBlockId)]);
    if (!block || !parent) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block or parent not found.");
    block.nest(parentBlockId, index);
    parent.addChild(blockId, index);
    await Promise.all([this.repo.save(block), this.repo.save(parent)]);
    return commandSuccess(block.id, Date.now());
  }
}

export class UnnestContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: UnnestKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = UnnestKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, blockId, index } = parsed.data;
    const block = await this.repo.findById(accountId, blockId);
    if (!block) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    const parentId = block.parentBlockId;
    block.unnest(index);
    if (parentId) {
      const parent = await this.repo.findById(accountId, parentId);
      if (parent) { parent.removeChild(blockId); await this.repo.save(parent); }
    }
    await this.repo.save(block);
    return commandSuccess(block.id, Date.now());
  }
}

export class ListContentBlocksUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(accountId: string, pageId: string): Promise<ContentBlockSnapshot[]> {
    if (!accountId || !pageId) return [];
    const blocks = await this.repo.listByPageId(accountId, pageId);
    return blocks.map(b => b.getSnapshot());
  }
}
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-collection.queries.ts
````typescript
import type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../domain/repositories/IKnowledgeCollectionRepository";

export class GetKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null> {
    const c = await this.repo.findById(accountId, collectionId);
    return c ? c.getSnapshot() : null;
  }
}

export class ListKnowledgeCollectionsUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string): Promise<KnowledgeCollectionSnapshot[]> {
    const cs = await this.repo.listByAccountId(accountId);
    return cs.map(c => c.getSnapshot());
  }
}

export class ListKnowledgeCollectionsByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string, workspaceId: string): Promise<KnowledgeCollectionSnapshot[]> {
    const cs = await this.repo.listByWorkspaceId(accountId, workspaceId);
    return cs.map(c => c.getSnapshot());
  }
}
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-page.queries.ts
````typescript
import type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";

export function buildKnowledgePageTree(pages: KnowledgePageSnapshot[]): KnowledgePageTreeNode[] {
  const map = new Map<string, KnowledgePageTreeNode>();
  for (const page of pages) {
    map.set(page.id, { ...page, children: [] });
  }
  const roots: KnowledgePageTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentPageId === null || !map.has(node.parentPageId)) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentPageId)!;
      (parent.children as KnowledgePageTreeNode[]).push(node);
    }
  }
  const sortByOrder = (nodes: KnowledgePageTreeNode[]): void => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortByOrder(n.children as KnowledgePageTreeNode[]);
  };
  sortByOrder(roots);
  return roots;
}

export class GetKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
    if (!accountId.trim() || !pageId.trim()) return null;
    return this.repo.findSnapshotById(accountId, pageId);
  }
}

export class ListKnowledgePagesUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageSnapshot[]> {
    if (!accountId.trim()) return [];
    return this.repo.listSnapshotsByAccountId(accountId);
  }
}

export class ListKnowledgePagesByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    return this.repo.listSnapshotsByWorkspaceId(accountId, workspaceId);
  }
}

export class GetKnowledgePageTreeUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim()) return [];
    const pages = await this.repo.listSnapshotsByAccountId(accountId);
    return buildKnowledgePageTree(pages);
  }
}

export class GetKnowledgePageTreeByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    const pages = await this.repo.listSnapshotsByWorkspaceId(accountId, workspaceId);
    return buildKnowledgePageTree(pages);
  }
}
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-version.queries.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateKnowledgeVersionDto } from "../dto/KnowledgePageDto";
import { CreateKnowledgeVersionSchema } from "../dto/KnowledgePageDto";

export class PublishKnowledgeVersionUseCase {
  async execute(input: CreateKnowledgeVersionDto): Promise<CommandResult> {
    const parsed = CreateKnowledgeVersionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_VERSION_INVALID_INPUT", parsed.error.message);
    return commandFailureFrom("CONTENT_VERSION_NOT_IMPLEMENTED", "Version persistence is not yet implemented.");
  }
}

export class ListKnowledgeVersionsUseCase {
  async execute(_accountId: string, _pageId: string): Promise<never[]> { return []; }
}
````

## File: modules/notion/subdomains/knowledge/application/use-cases/KnowledgeCollectionUseCases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { KnowledgeCollection } from "../../domain/aggregates/KnowledgeCollection";
import type { CollectionColumn } from "../../domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../domain/repositories/IKnowledgeCollectionRepository";
import {
  CreateKnowledgeCollectionSchema, type CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionSchema, type RenameKnowledgeCollectionDto,
  AddPageToCollectionSchema, type AddPageToCollectionDto,
  RemovePageFromCollectionSchema, type RemovePageFromCollectionDto,
  AddCollectionColumnSchema, type AddCollectionColumnDto,
  ArchiveKnowledgeCollectionSchema, type ArchiveKnowledgeCollectionDto,
} from "../dto/KnowledgeCollectionDto";

// Re-export read queries for backward compatibility
export {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsUseCase,
  ListKnowledgeCollectionsByWorkspaceUseCase,
} from "../queries/knowledge-collection.queries";

export class CreateKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = CreateKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, name, description, columns, createdByUserId } = parsed.data;
    const columnIds = (columns ?? []).map(() => generateId());
    const id = generateId();
    const collection = KnowledgeCollection.create(id, columnIds, {
      accountId, workspaceId, name: name.trim(), description,
      columns: columns?.map(c => ({ name: c.name, type: c.type as CollectionColumn["type"], options: c.options })),
      createdByUserId,
    });
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class RenameKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = RenameKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, name } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.rename(name.trim());
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class AddPageToCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: AddPageToCollectionDto): Promise<CommandResult> {
    const parsed = AddPageToCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, pageId } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.addPage(pageId);
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class RemovePageFromCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: RemovePageFromCollectionDto): Promise<CommandResult> {
    const parsed = RemovePageFromCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, pageId } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.removePage(pageId);
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class AddCollectionColumnUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: AddCollectionColumnDto): Promise<CommandResult> {
    const parsed = AddCollectionColumnSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, column } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.addColumn({ id: generateId(), name: column.name, type: column.type as CollectionColumn["type"], options: column.options });
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class ArchiveKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.archive();
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}
````

## File: modules/notion/subdomains/knowledge/application/use-cases/KnowledgePageAppearanceUseCases.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page appearance use cases — update icon, update cover.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";
import {
  UpdatePageIconSchema,
  type UpdatePageIconDto,
  UpdatePageCoverSchema,
  type UpdatePageCoverDto,
} from "../dto/KnowledgePageLifecycleDto";

export class UpdatePageIconUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: UpdatePageIconDto): Promise<CommandResult> {
    const parsed = UpdatePageIconSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, iconUrl } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.updateIcon(iconUrl);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class UpdatePageCoverUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: UpdatePageCoverDto): Promise<CommandResult> {
    const parsed = UpdatePageCoverSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, coverUrl } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.updateCover(coverUrl);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}
````

## File: modules/notion/subdomains/knowledge/application/use-cases/KnowledgePageReviewUseCases.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page review/wiki use cases — approve, verify, request review, assign owner.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";
import {
  PublishDomainEventUseCase,
  type IEventStoreRepository,
  type IEventBusRepository,
} from "@shared-events";
import {
  ApproveKnowledgePageSchema,
  type ApproveKnowledgePageDto,
} from "../dto/KnowledgePageDto";
import {
  VerifyKnowledgePageSchema,
  type VerifyKnowledgePageDto,
  RequestPageReviewSchema,
  type RequestPageReviewDto,
  AssignPageOwnerSchema,
  type AssignPageOwnerDto,
} from "../dto/KnowledgePageLifecycleDto";

export class ApproveKnowledgePageUseCase {
  constructor(
    private readonly repo: IKnowledgePageRepository,
    private readonly eventStore: IEventStoreRepository,
    private readonly eventBus: IEventBusRepository,
  ) {}

  async execute(input: ApproveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ApproveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const {
      accountId,
      pageId,
      actorId,
      causationId: inputCausationId,
      extractedTasks,
      extractedInvoices,
      correlationId: inputCorrelationId,
      workspaceId,
    } = parsed.data;

    const causationId = inputCausationId ?? generateId();
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    if (page.status === "archived") return commandFailureFrom("CONTENT_PAGE_ARCHIVED", "Cannot approve an archived page.");
    if (page.approvalState === "approved") return commandFailureFrom("CONTENT_PAGE_ALREADY_APPROVED", "Page is already approved.");

    const nowISO = new Date().toISOString();
    page.approve(actorId, nowISO);
    await this.repo.save(page);

    const correlationId = inputCorrelationId ?? generateId();
    await new PublishDomainEventUseCase(this.eventStore, this.eventBus).execute({
      id: generateId(),
      eventName: "knowledge.page_approved",
      aggregateType: "KnowledgePage",
      aggregateId: pageId,
      payload: {
        pageId,
        accountId,
        workspaceId: workspaceId ?? page.workspaceId,
        extractedTasks,
        extractedInvoices,
        actorId,
        causationId: inputCausationId,
        correlationId,
      },
      metadata: { actorId, causationId, correlationId, workspaceId: workspaceId ?? page.workspaceId },
    });

    return commandSuccess(pageId, Date.now());
  }
}

export class VerifyKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: VerifyKnowledgePageDto): Promise<CommandResult> {
    const parsed = VerifyKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, verifiedByUserId, verificationExpiresAtISO } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.verify(verifiedByUserId, verificationExpiresAtISO);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class RequestPageReviewUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: RequestPageReviewDto): Promise<CommandResult> {
    const parsed = RequestPageReviewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, requestedByUserId } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.requestReview(requestedByUserId);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class AssignPageOwnerUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: AssignPageOwnerDto): Promise<CommandResult> {
    const parsed = AssignPageOwnerSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, ownerId } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.assignOwner(ownerId);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}
````

## File: modules/notion/subdomains/knowledge/application/use-cases/KnowledgePageUseCases.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page lifecycle use cases — create, rename, move, archive, reorder.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import { KnowledgePage } from "../../domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";
import {
  CreateKnowledgePageSchema,
  type CreateKnowledgePageDto,
  RenameKnowledgePageSchema,
  type RenameKnowledgePageDto,
  MoveKnowledgePageSchema,
  type MoveKnowledgePageDto,
  ArchiveKnowledgePageSchema,
  type ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksSchema,
  type ReorderKnowledgePageBlocksDto,
} from "../dto/KnowledgePageDto";

// Re-export read queries for backward compatibility
export {
  buildKnowledgePageTree,
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../queries/knowledge-page.queries";

export class CreateKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: CreateKnowledgePageDto): Promise<CommandResult> {
    const parsed = CreateKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, workspaceId, title, parentPageId, createdByUserId } = parsed.data;
    const order = await this.repo.countByParent(accountId, parentPageId ?? null);
    const id = generateId();
    const page = KnowledgePage.create(id, {
      accountId,
      workspaceId,
      title: title.trim(),
      parentPageId: parentPageId ?? null,
      createdByUserId,
      order,
    });
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class RenameKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: RenameKnowledgePageDto): Promise<CommandResult> {
    const parsed = RenameKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, title } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.rename(title.trim());
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class MoveKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: MoveKnowledgePageDto): Promise<CommandResult> {
    const parsed = MoveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, targetParentPageId } = parsed.data;
    if (pageId === targetParentPageId) {
      return commandFailureFrom("CONTENT_PAGE_CIRCULAR_MOVE", "A page cannot be its own parent.");
    }
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.move(targetParentPageId);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class ArchiveKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.archive();
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class ReorderKnowledgePageBlocksUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
    const parsed = ReorderKnowledgePageBlocksSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, blockIds } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.reorderBlocks(blockIds);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}
````

## File: modules/notion/subdomains/knowledge/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./value-objects";
export * from "./events";
export * from "./repositories";
export * from "./services";
// Ports layer — driven port aliases
export type { IBacklinkIndexPort, IContentBlockPort, IKnowledgeCollectionPort, IKnowledgePagePort } from "./ports";
````

## File: modules/notion/subdomains/knowledge/domain/ports/index.ts
````typescript
/**
 * notion/knowledge domain/ports — driven port interfaces for the knowledge subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IBacklinkIndexRepository as IBacklinkIndexPort } from "../repositories/IBacklinkIndexRepository";
export type { IContentBlockRepository as IContentBlockPort } from "../repositories/IContentBlockRepository";
export type { IKnowledgeCollectionRepository as IKnowledgeCollectionPort } from "../repositories/IKnowledgeCollectionRepository";
export type { IKnowledgePageRepository as IKnowledgePagePort } from "../repositories/IKnowledgePageRepository";
````

## File: modules/notion/subdomains/knowledge/interfaces/_actions/knowledge-block.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeBlockRepo } from "../../api/factories";
import {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
} from "../../application/queries/content-block.queries";
import type { AddKnowledgeBlockDto as AddContentBlockDto, UpdateKnowledgeBlockDto as UpdateContentBlockDto, DeleteKnowledgeBlockDto as DeleteContentBlockDto } from "../../application/dto/ContentBlockDto";

export async function addKnowledgeBlock(input: AddContentBlockDto): Promise<CommandResult> {
  try { return await new AddContentBlockUseCase(makeBlockRepo()).execute(input); }
  catch (e) { return commandFailureFrom("BLOCK_ADD_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgeBlock(input: UpdateContentBlockDto): Promise<CommandResult> {
  try { return await new UpdateContentBlockUseCase(makeBlockRepo()).execute(input); }
  catch (e) { return commandFailureFrom("BLOCK_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function deleteKnowledgeBlock(input: DeleteContentBlockDto): Promise<CommandResult> {
  try { return await new DeleteContentBlockUseCase(makeBlockRepo()).execute(input); }
  catch (e) { return commandFailureFrom("BLOCK_DELETE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
````

## File: modules/notion/subdomains/knowledge/interfaces/components/KnowledgeSidebarSection.tsx
````typescript
"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

interface WorkspaceLinkItem {
  id: string;
  name: string;
  href: string;
}

interface KnowledgeSidebarSectionProps {
  readonly pathname: string;
  readonly workspacesHydrated: boolean;
  readonly allWorkspaceLinks: WorkspaceLinkItem[];
  readonly activeAccountId: string | null;
  readonly activeWorkspaceId: string | null;
  readonly creatingKind: "page" | "database" | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onQuickCreatePage: () => void | Promise<void>;
}

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function withContextQuery(href: string, accountId: string | null, workspaceId: string | null): string {
  if (!accountId && !workspaceId) {
    return href;
  }

  const [path, search = ""] = href.split("?");
  const params = new URLSearchParams(search);

  if (accountId) {
    params.set("accountId", accountId);
  }

  if (workspaceId) {
    params.set("workspaceId", workspaceId);
  }

  const query = params.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}

export function KnowledgeSidebarSection({
  pathname,
  workspacesHydrated,
  allWorkspaceLinks,
  activeAccountId,
  activeWorkspaceId,
  creatingKind,
  onSelectWorkspace,
  onQuickCreatePage,
}: KnowledgeSidebarSectionProps) {
  const [isKnowledgeWorkspacesExpanded, setIsKnowledgeWorkspacesExpanded] = useState(
    () => Boolean(activeWorkspaceId),
  );

  const contextualPagesHref = withContextQuery("/knowledge/pages", activeAccountId, activeWorkspaceId);

  return (
    <nav className="space-y-0.5" aria-label="Knowledge navigation">
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        知識管理
      </p>
      {(activeAccountId || activeWorkspaceId) && (
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {activeAccountId ? `Account: ${activeAccountId.slice(0, 8)}` : "Account: -"}
          {" · "}
          {activeWorkspaceId ? `Workspace: ${activeWorkspaceId.slice(0, 8)}` : "Workspace: -"}
        </p>
      )}
      <div className="relative flex items-center rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
        <Link
          href={contextualPagesHref}
          aria-current={isActiveRoute(pathname, "/knowledge/pages") ? "page" : undefined}
          className={`flex-1 ${
            isActiveRoute(pathname, "/knowledge/pages")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          頁面
        </Link>
        <button
          type="button"
          onClick={() => void onQuickCreatePage()}
          disabled={creatingKind !== null}
          className="ml-1 inline-flex size-5 items-center justify-center rounded transition hover:bg-muted-foreground/15 disabled:opacity-50"
          aria-label="快速新增頁面"
          title="新增頁面"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      {(
        [
          { href: "/knowledge", label: "Knowledge Hub" },
          { href: "/knowledge/block-editor", label: "區塊編輯器" },
        ] as const
      ).map((item) => {
        const active = isActiveRoute(pathname, item.href);
        const contextualHref = withContextQuery(item.href, activeAccountId, activeWorkspaceId);
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="my-1.5 border-t border-border/40" />

      <button
        type="button"
        onClick={() => {
          setIsKnowledgeWorkspacesExpanded((prev) => !prev);
        }}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-expanded={isKnowledgeWorkspacesExpanded}
      >
        <span>Workspaces</span>
        {isKnowledgeWorkspacesExpanded ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
      </button>

      {isKnowledgeWorkspacesExpanded && (
        <div className="space-y-0.5 pl-2">
          {!workspacesHydrated ? (
            <p className="px-2 py-1.5 text-[11px] text-muted-foreground">工作區載入中...</p>
          ) : allWorkspaceLinks.length === 0 ? (
            <p className="px-2 py-1.5 text-[11px] text-muted-foreground">目前帳號沒有工作區</p>
          ) : (
            allWorkspaceLinks.map((workspace) => {
              const active = activeWorkspaceId === workspace.id;
              return (
                <Link
                  key={workspace.id}
                  href={workspace.href}
                  onClick={() => {
                    onSelectWorkspace(workspace.id);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={workspace.name}
                >
                  <span className="truncate">{workspace.name}</span>
                </Link>
              );
            })
          )}
        </div>
      )}
    </nav>
  );
}
````

## File: modules/notion/subdomains/knowledge/interfaces/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side read helpers for the knowledge subdomain.
 */

import { makeBlockRepo, makeCollectionRepo, makePageRepo } from "../../api/factories";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../../application/queries/knowledge-page.queries";
import { ListContentBlocksUseCase } from "../../application/queries/content-block.queries";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsUseCase,
} from "../../application/queries/knowledge-collection.queries";
import type { KnowledgePageSnapshot, ContentBlockSnapshot, KnowledgeCollectionSnapshot } from "../../application/dto/knowledge.dto";

export async function getKnowledgePage(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
  return new GetKnowledgePageUseCase(makePageRepo()).execute(accountId, pageId);
}

export async function getKnowledgePages(accountId: string): Promise<KnowledgePageSnapshot[]> {
  return new ListKnowledgePagesUseCase(makePageRepo()).execute(accountId);
}

export async function getKnowledgePagesByWorkspace(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
  return new ListKnowledgePagesByWorkspaceUseCase(makePageRepo()).execute(accountId, workspaceId);
}

export async function getKnowledgePageTree(accountId: string) {
  return new GetKnowledgePageTreeUseCase(makePageRepo()).execute(accountId);
}

export async function getKnowledgePageTreeByWorkspace(accountId: string, workspaceId: string) {
  return new GetKnowledgePageTreeByWorkspaceUseCase(makePageRepo()).execute(accountId, workspaceId);
}

export async function getKnowledgeBlocks(accountId: string, pageId: string): Promise<ContentBlockSnapshot[]> {
  return new ListContentBlocksUseCase(makeBlockRepo()).execute(accountId, pageId);
}

export async function getKnowledgeCollection(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null> {
  return new GetKnowledgeCollectionUseCase(makeCollectionRepo()).execute(accountId, collectionId);
}

export async function getKnowledgeCollections(accountId: string): Promise<KnowledgeCollectionSnapshot[]> {
  return new ListKnowledgeCollectionsUseCase(makeCollectionRepo()).execute(accountId);
}
````

## File: modules/notion/subdomains/knowledge/README.md
````markdown
# Knowledge

頁面建立、組織、版本化與交付。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/notes/README.md
````markdown
# Notes

個人輕量筆記與正式知識協作。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/publishing/README.md
````markdown
# Publishing

建立正式發布與對外交付的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/relations/README.md
````markdown
# Relations

建立內容之間關聯與 backlink 的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/subdomains.instructions.md
````markdown
---
description: 'Notion subdomains structural rules: hexagonal shape per subdomain, content lifecycle ownership, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notion/subdomains/**/*.{ts,tsx}'
---

# Notion Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notion/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/subdomains.md`.

## Core Rules

- Every subdomain must maintain the full hexagonal shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`.
- Stub subdomains must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notion goes through the **subdomain's own `api/`** — never import a sibling's `domain/`, `application/`, or `infrastructure/` internals.
- Content lifecycle ownership is fixed: `authoring` owns Article state machine; `knowledge` owns KnowledgePage and ContentBlock; `database` owns structured records and views; `collaboration` owns comments, permissions, and versions.
- `knowledge` subdomain is the canonical upstream for knowledge artifact references consumed by `notebooklm` — expose via `api/` only.
- Domain events use the discriminant format `notion.<subdomain>.<action>` (e.g. `notion.knowledge.page-published`).
- Dependency direction inside each subdomain: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/subdomains/taxonomy/README.md
````markdown
# Taxonomy

建立分類法與語義組織的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/templates/README.md
````markdown
# Templates

頁面範本管理與套用。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/database/application/use-cases/AutomationUseCases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: Automation CRUD use cases.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IAutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/IAutomationRepository";

export class CreateAutomationUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(input: CreateAutomationInput): Promise<CommandResult> {
    if (!input.name.trim()) {
      return commandFailureFrom("AUTOMATION_INVALID_INPUT", "Automation name is required.");
    }
    const automation = await this.repo.create(input);
    return commandSuccess(automation.id, Date.now());
  }
}

export class UpdateAutomationUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(input: UpdateAutomationInput): Promise<CommandResult> {
    const result = await this.repo.update(input);
    if (!result) return commandFailureFrom("AUTOMATION_NOT_FOUND", "Automation not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class DeleteAutomationUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(id: string, accountId: string, databaseId: string): Promise<CommandResult> {
    await this.repo.delete(id, accountId, databaseId);
    return commandSuccess(id, Date.now());
  }
}

// Re-export read queries for backward compatibility
export { ListAutomationsUseCase } from "../queries/automation.queries";
````

## File: modules/notion/subdomains/database/application/use-cases/DatabaseUseCases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: Database aggregate use cases — create, update, addField, archive, get, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IDatabaseRepository } from "../../domain/repositories/IDatabaseRepository";
import { CreateDatabaseSchema, UpdateDatabaseSchema, AddFieldSchema, ArchiveDatabaseSchema } from "../dto/DatabaseDto";
import type { CreateDatabaseDto, UpdateDatabaseDto, AddFieldDto, ArchiveDatabaseDto } from "../dto/DatabaseDto";

export class CreateDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: CreateDatabaseDto): Promise<CommandResult> {
    const parsed = CreateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.create(parsed.data);
    return commandSuccess(result.id, 1);
  }
}

export class UpdateDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: UpdateDatabaseDto): Promise<CommandResult> {
    const parsed = UpdateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    return commandSuccess(result?.id ?? parsed.data.id, 0);
  }
}

export class AddFieldUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: AddFieldDto): Promise<CommandResult> {
    const parsed = AddFieldSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.addField(parsed.data);
    return commandSuccess(parsed.data.databaseId, 0);
  }
}

export class ArchiveDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: ArchiveDatabaseDto): Promise<CommandResult> {
    const parsed = ArchiveDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.archive(parsed.data.id, parsed.data.accountId);
    return commandSuccess(parsed.data.id, 0);
  }
}

// Re-export read queries for backward compatibility
export { GetDatabaseUseCase, ListDatabasesUseCase } from "../queries/database.queries";
````

## File: modules/notion/subdomains/database/application/use-cases/RecordUseCases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: DatabaseRecord use cases — create, update, delete, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IDatabaseRecordRepository } from "../../domain/repositories/IDatabaseRecordRepository";
import { CreateRecordSchema, UpdateRecordSchema, DeleteRecordSchema } from "../dto/DatabaseDto";
import type { CreateRecordDto, UpdateRecordDto, DeleteRecordDto } from "../dto/DatabaseDto";

export class CreateRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: CreateRecordDto): Promise<CommandResult> {
    const parsed = CreateRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.create(parsed.data);
    return commandSuccess(result.id, 1);
  }
}

export class UpdateRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: UpdateRecordDto): Promise<CommandResult> {
    const parsed = UpdateRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    return commandSuccess(result.id, 0);
  }
}

export class DeleteRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: DeleteRecordDto): Promise<CommandResult> {
    const parsed = DeleteRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.id, parsed.data.accountId);
    return commandSuccess(parsed.data.id, 0);
  }
}

// Re-export read queries for backward compatibility
export { ListRecordsUseCase } from "../queries/record.queries";
````

## File: modules/notion/subdomains/database/application/use-cases/ViewUseCases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: View use cases — create, update, delete, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IViewRepository } from "../../domain/repositories/IViewRepository";
import { CreateViewSchema, UpdateViewSchema, DeleteViewSchema } from "../dto/DatabaseDto";
import type { CreateViewDto, UpdateViewDto, DeleteViewDto } from "../dto/DatabaseDto";

export class CreateViewUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: CreateViewDto): Promise<CommandResult> {
    const parsed = CreateViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.create(parsed.data);
    return commandSuccess(result.id, 1);
  }
}

export class UpdateViewUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: UpdateViewDto): Promise<CommandResult> {
    const parsed = UpdateViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    return commandSuccess(result.id, 0);
  }
}

export class DeleteViewUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: DeleteViewDto): Promise<CommandResult> {
    const parsed = DeleteViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.id, parsed.data.accountId);
    return commandSuccess(parsed.data.id, 0);
  }
}

// Re-export read queries for backward compatibility
export { ListViewsUseCase } from "../queries/view.queries";
````

## File: modules/notion/subdomains/knowledge/interfaces/_actions/knowledge-page.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { IEventStoreRepository, IEventBusRepository } from "@shared-events";
import { makePageRepo } from "../../api/factories";
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "../../application/use-cases/KnowledgePageUseCases";
import {
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "../../application/use-cases/KnowledgePageReviewUseCases";
import {
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "../../application/use-cases/KnowledgePageAppearanceUseCases";
import { PublishKnowledgeVersionUseCase } from "../../application/queries/knowledge-version.queries";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
} from "../../application/dto/KnowledgePageDto";
import type { VerifyKnowledgePageDto, RequestPageReviewDto, AssignPageOwnerDto, UpdatePageIconDto, UpdatePageCoverDto } from "../../application/dto/KnowledgePageLifecycleDto";

/** Stub event store — persists nothing. Replace with a real impl once infrastructure is wired. */
const makeEventStore = (): IEventStoreRepository => ({
  save: async () => {},
  findById: async () => null,
  findByAggregate: async () => [],
  findUndispatched: async () => [],
  markDispatched: async () => {},
});

/** Stub event bus — publishes nothing. Replace with QStash/Firestore publish once infrastructure is wired. */
const makeEventBus = (): IEventBusRepository => ({
  publish: async () => {},
});

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try { return await new CreateKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_CREATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult> {
  try { return await new RenameKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_RENAME_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult> {
  try { return await new MoveKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_MOVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
  try { return await new ArchiveKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function reorderKnowledgePageBlocks(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
  try { return await new ReorderKnowledgePageBlocksUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_REORDER_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function publishKnowledgeVersion(input: { accountId: string; pageId: string; createdByUserId: string }): Promise<CommandResult> {
  try { return await new PublishKnowledgeVersionUseCase().execute(input); }
  catch (e) { return commandFailureFrom("VERSION_PUBLISH_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult> {
  try { return await new ApproveKnowledgePageUseCase(makePageRepo(), makeEventStore(), makeEventBus()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_APPROVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult> {
  try { return await new VerifyKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_VERIFY_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function requestKnowledgePageReview(input: RequestPageReviewDto): Promise<CommandResult> {
  try { return await new RequestPageReviewUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_REVIEW_REQUEST_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function assignKnowledgePageOwner(input: AssignPageOwnerDto): Promise<CommandResult> {
  try { return await new AssignPageOwnerUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_OWNER_ASSIGN_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgePageIcon(input: UpdatePageIconDto): Promise<CommandResult> {
  try { return await new UpdatePageIconUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_ICON_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgePageCover(input: UpdatePageCoverDto): Promise<CommandResult> {
  try { return await new UpdatePageCoverUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_COVER_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
````