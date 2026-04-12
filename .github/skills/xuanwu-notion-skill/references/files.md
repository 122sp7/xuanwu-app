# Files

## File: modules/notion/application/services/.gitkeep
````

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

## File: modules/notion/domain/events/index.ts
````typescript
export type { NotionDomainEvent } from "./NotionDomainEvent";
````

## File: modules/notion/domain/events/NotionDomainEvent.ts
````typescript
/**
 * Module: notion
 * Layer: domain/events (context-wide)
 * Purpose: Base domain event interface for the notion bounded context.
 *          All subdomain events (knowledge, authoring, collaboration, database, etc.)
 *          should extend this interface.
 *
 * NOTE: subdomains/knowledge/domain/events/NotionDomainEvent.ts carries the same shape.
 *       Future convergence should re-export this context-wide version.
 */

export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
````

## File: modules/notion/domain/published-language/index.ts
````typescript
/**
 * Module: notion
 * Layer: domain (context-wide published language)
 * Purpose: Reference types exposed to downstream bounded contexts.
 *
 * These types represent notion's public vocabulary as defined in the context map.
 * Downstream consumers (notebooklm, workspace) receive opaque references — never
 * raw aggregates or internal domain models.
 *
 * Context Map tokens:
 *   - KnowledgeArtifactReference: opaque ref consumed by notebooklm for retrieval/grounding
 *   - AttachmentReference: traceable ref to an attachment asset
 *   - TaxonomyHint: classification hint forwarded as retrieval aid
 */

/** Opaque reference to a KnowledgePage or Article (cross-module token) */
export interface KnowledgeArtifactReference {
  readonly artifactId: string;
  readonly artifactType: "page" | "article";
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
}

/** Opaque reference to an attachment asset (cross-module token) */
export interface AttachmentReference {
  readonly attachmentId: string;
  readonly artifactId: string;
  readonly accountId: string;
  readonly displayName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

/**
 * Classification hint forwarded to downstream contexts as retrieval aid.
 * The downstream context (notebooklm) does not own taxonomy semantics —
 * it only consumes the hint for filtering and ranking.
 */
export interface TaxonomyHint {
  readonly taxonomyId: string;
  readonly label: string;
  readonly path: readonly string[];
}
````

## File: modules/notion/domain/services/.gitkeep
````

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

## File: modules/notion/subdomains/database/application/use-cases/index.ts
````typescript
export { CreateDatabaseUseCase, UpdateDatabaseUseCase, AddFieldUseCase, ArchiveDatabaseUseCase, GetDatabaseUseCase, ListDatabasesUseCase } from "./DatabaseUseCases";
export { CreateRecordUseCase, UpdateRecordUseCase, DeleteRecordUseCase, ListRecordsUseCase } from "./RecordUseCases";
export { CreateViewUseCase, UpdateViewUseCase, DeleteViewUseCase, ListViewsUseCase } from "./ViewUseCases";
export { CreateAutomationUseCase, UpdateAutomationUseCase, DeleteAutomationUseCase, ListAutomationsUseCase } from "./AutomationUseCases";
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

## File: modules/notion/subdomains/knowledge/application/dto/index.ts
````typescript
export * from "./KnowledgePageDto";
export * from "./ContentBlockDto";
export * from "./KnowledgeCollectionDto";
export * from "./KnowledgePageLifecycleDto";
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

## File: modules/notion/subdomains/relations/domain/entities/Relation.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: domain/entities
 * Purpose: Relation — a typed link between two knowledge artifacts.
 *
 * Canonical boundary: relations own backlinks, forward links, and reference graphs.
 * knowledge subdomain already has BacklinkIndex — future convergence or delegation TBD.
 */

export type RelationDirection = "forward" | "backward";

export interface Relation {
  readonly relationId: string;
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly direction: RelationDirection;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
}

export interface CreateRelationInput {
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
````

## File: modules/notion/subdomains/relations/domain/events/RelationEvents.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: domain/events
 * Purpose: Domain events for relation operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface RelationCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.relations.relation_created";
  readonly payload: {
    readonly relationId: string;
    readonly sourceArtifactId: string;
    readonly targetArtifactId: string;
    readonly relationType: string;
    readonly organizationId: string;
  };
}

export interface RelationRemovedEvent extends NotionDomainEvent {
  readonly type: "notion.relations.relation_removed";
  readonly payload: {
    readonly relationId: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/relations/domain/index.ts
````typescript
export type { RelationDirection, Relation, CreateRelationInput } from "./entities/Relation";
export type { IRelationRepository } from "./repositories/IRelationRepository";
export type { RelationCreatedEvent, RelationRemovedEvent } from "./events/RelationEvents";
````

## File: modules/notion/subdomains/relations/domain/repositories/IRelationRepository.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: domain/repositories
 * Purpose: IRelationRepository — domain port for relation persistence.
 */

import type { Relation } from "../entities/Relation";

export interface IRelationRepository {
  findById(relationId: string): Promise<Relation | null>;
  listBySource(sourceArtifactId: string): Promise<readonly Relation[]>;
  listByTarget(targetArtifactId: string): Promise<readonly Relation[]>;
  save(relation: Relation): Promise<void>;
  remove(relationId: string): Promise<void>;
}
````

## File: modules/notion/subdomains/taxonomy/domain/entities/TaxonomyNode.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/entities
 * Purpose: TaxonomyNode — a node in a hierarchical classification system.
 *
 * Canonical boundary: taxonomy owns classification hierarchy and semantic tags.
 * notion/knowledge may reference taxonomy via TaxonomyHint published language.
 */

export interface TaxonomyNode {
  readonly nodeId: string;
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly path: readonly string[];
  readonly depth: number;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaxonomyNodeInput {
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
````

## File: modules/notion/subdomains/taxonomy/domain/events/TaxonomyEvents.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/events
 * Purpose: Domain events for taxonomy operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface TaxonomyNodeCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.taxonomy.node_created";
  readonly payload: {
    readonly nodeId: string;
    readonly label: string;
    readonly parentNodeId: string | null;
    readonly organizationId: string;
  };
}

export interface TaxonomyNodeRemovedEvent extends NotionDomainEvent {
  readonly type: "notion.taxonomy.node_removed";
  readonly payload: {
    readonly nodeId: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/taxonomy/domain/index.ts
````typescript
export type { TaxonomyNode, CreateTaxonomyNodeInput } from "./entities/TaxonomyNode";
export type { ITaxonomyRepository } from "./repositories/ITaxonomyRepository";
export type { TaxonomyNodeCreatedEvent, TaxonomyNodeRemovedEvent } from "./events/TaxonomyEvents";
````

## File: modules/notion/subdomains/taxonomy/domain/repositories/ITaxonomyRepository.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/repositories
 * Purpose: ITaxonomyRepository — domain port for taxonomy node persistence.
 */

import type { TaxonomyNode } from "../entities/TaxonomyNode";

export interface ITaxonomyRepository {
  findById(nodeId: string): Promise<TaxonomyNode | null>;
  listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]>;
  listRoots(organizationId: string): Promise<readonly TaxonomyNode[]>;
  save(node: TaxonomyNode): Promise<void>;
  remove(nodeId: string): Promise<void>;
}
````

## File: modules/notion/AGENT.md
````markdown
# Notion Agent

> Strategic agent documentation: [docs/contexts/notion/AGENT.md](../../docs/contexts/notion/AGENT.md)

## Mission

保護 notion 主域作為知識內容生命週期邊界。notion 擁有正式知識內容（KnowledgePage、Article、Database），不擁有治理、工作區範疇或推理輸出。任何變更都應維持 notion 擁有內容建立、結構化、協作、版本化與交付語言。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期 |
| Upstream | platform（治理、AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core invariant | notion 只能修改自己的正典內容，不可直接呼叫 notebooklm 的推理流程 |
| Published language | KnowledgeArtifact reference、attachment reference、taxonomy hint |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Content Core | knowledge, authoring | 知識頁面與文章生命週期、分類、內容區塊 |
| Collaboration & Change | collaboration | 協作留言、細粒度權限與版本快照 |
| Structured Data | database | 結構化資料多視圖管理與自動化 |
| Semantic Organization | taxonomy, relations | 分類法與語義關聯圖 |
| Future Extensions | publishing, attachments | 正式發布流程、附件管理 |

## Route Here When

- 問題核心是知識頁面（KnowledgePage）、內容區塊（ContentBlock）、知識集合（KnowledgeCollection）。
- 問題需要把內容建立、編輯、分類、關聯、版本或交付收斂到正典狀態。
- 問題涉及知識庫文章（Article）、分類（Category）、樣板（Template）。
- 問題涉及結構化資料視圖（Database、DatabaseView、Record）。
- 問題涉及協作留言（Comment）、細粒度權限（Permission）或版本快照（Version）。
- 問題涉及分類法（Taxonomy）或語義關聯（Relation）。

## Route Elsewhere When

- 身份、租戶、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。
- notebook、conversation、retrieval、grounding、synthesis 屬於 notebooklm。
- browser-facing shell composition、tab orchestration、panel assembly 屬於 workspace；notion 提供下游能力，不擁有外層 UI orchestration。

## Subdomain Delivery Tiers

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates |
|-----------|---------|----------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證、分類與發布工作流程 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照 | Comment, Permission, Version |
| database | 結構化資料多視圖（Table/Board/Calendar/Gallery） | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Domain Contracts — High Business Value)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| taxonomy | 分類法、標籤樹與語義組織（跨頁面分類的正典邊界） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容之間的正式語義關聯與 backlink 管理 | ≠ knowledge.BacklinkIndex（自動反向索引）；relations 是明確語義圖（有類型、有方向） |
| attachments | 附件與媒體關聯儲存 | 檔案儲存整合的正典邊界。待附件需要獨立於頁面的保留策略時充實 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式發布與對外交付（Publication 狀態邊界） | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| knowledge-versioning | 全域版本快照策略（workspace-level checkpoint、保留政策） | ≠ collaboration.Version（逐次編輯歷史）；是策略量，不是操作量 |

### Premature Stubs（目錄保留，不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| automation | database 子域已涵蓋 DatabaseAutomation；跨內容類型事件自動化目前無獨立領域需求 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |

### Domain Invariants

- 知識內容的正典狀態屬於 notion。
- taxonomy 應獨立於具體 UI 視圖存在（目前由 Category 承載部分）。
- BacklinkIndex 描述自動反向連結；Relation 描述主動宣告的語義關係。兩者不互相取代。
- platform.ai 可被 notion use case 消費，但 AI provider / policy ownership 不屬於 notion。
- 任何來自 notebooklm 的輸出，若要成為正典內容，必須先被 notion 吸收。

## Subdomain Analysis — 子域數量合理性

**14 個目錄（4 Active + 2 Domain Contracts + 1 Stub + 3 Medium-Term Stubs + 5 Premature = 15 分類，共 14 目錄），分析如下：**

1. **`knowledge` 與 `authoring` 不重疊**：`knowledge` 是 KnowledgePage + ContentBlock（自由形式的 wiki 頁面）；`authoring` 是 Article + Category（有工作流程的結構化 KB 文章）。
2. **`collaboration.Version` 與 `knowledge-versioning` 不重疊**：`collaboration.Version` 是逐次編輯快照（per-change history）；`knowledge-versioning` 是全域 checkpoint 策略（workspace-level snapshot policy）。
3. **`relations` 與 `knowledge.BacklinkIndex` 不重疊**：`BacklinkIndex` 是自動反向連結索引；`relations` 是明確的語義關係圖（有類型、有方向的關聯）。
4. **5 個 premature stubs** 有明確理由：每個都已被現有 active 子域或 infrastructure 層吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain | Do Not Use |
|------|---------|------------------|------------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 | （跨子域概念） | Doc, Wiki (混指) |
| KnowledgePage | 正典頁面型知識單位（block-based） | knowledge | Wiki, Page (generic) |
| ContentBlock | 知識頁面的最小可組合內容單位 | knowledge | Block (generic) |
| KnowledgeCollection | 頁面集合容器（非 Database） | knowledge | Folder, Section |
| BacklinkIndex | 自動反向連結索引 | knowledge | - |
| PageStatus | 頁面生命週期狀態（draft, published, archived） | knowledge | - |
| Article | 經過撰寫與驗證流程的知識庫文章 | authoring | Post, Content |
| Category | 文章分類樹結構 | authoring | Tag System |
| Template | 可重複套用的內容結構起點 | authoring | Preset, Layout |
| Comment | 內容附著的協作討論 | collaboration | Chat, Discussion |
| Permission | 內容的細粒度存取權限 | collaboration | - |
| Version | 內容某一時點的不可變快照（逐次編輯歷史） | collaboration | - |
| Database | 結構化知識集合 | database | Table, Spreadsheet |
| DatabaseView | 對 Database 的投影與檢視配置 | database | View (generic) |
| DatabaseRecord | Database 中的一筆記錄 | database | - |
| DatabaseAutomation | Database 事件觸發的自動化動作 | database | - |
| Taxonomy | 分類法、標籤樹等語義組織結構 | taxonomy | Tag System, Category (混稱全域分類) |
| Relation | 內容對內容之間的正式語義關聯 | relations | Link, Connection |
| Publication | 對外可見且可交付的內容狀態 | publishing (stub) | Published, Public |
| Attachment | 綁定於知識內容的檔案或媒體 | attachments | File, Upload |
| VersionSnapshot | 全域版本 checkpoint 策略的不可變快照 | knowledge-versioning (stub) | Backup, History |

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Wiki | KnowledgePage 或 Article |
| Table | Database 或 DatabaseView |
| Tag System | Category (current) or Taxonomy (Tier 2) |
| Content Link | BacklinkIndex (automatic) or Relation (explicit semantic) |
| Publish Action | Publication 或 ArticlePublication |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
api/ ← 唯一跨模組入口
```

## Development Order (Domain-First)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration (Strangler Pattern):
1. Find a Use Case to extract
2. Build Domain model in the owning subdomain
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter; remove old path when stable
````

## File: modules/notion/api/index.ts
````typescript
/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified public boundary for notion subdomains.
 *          External consumers (workspace, other modules) must only import from here.
 *          Browser-facing route composition should prefer workspace/api when
 *          workspace is the orchestration owner.
 *
 * Notes:
 * - This file exposes only stable cross-module semantic capabilities.
 * - Internal factory wiring remains private to notion subdomains/interfaces
 *   until a context-wide server-only contract is explicitly justified.
 */

// ── Context-wide published language ───────────────────────────────────────────
export type {
  KnowledgeArtifactReference,
  AttachmentReference,
  TaxonomyHint,
} from "../domain/published-language";

export type { NotionDomainEvent } from "../domain/events";

// ── knowledge subdomain ───────────────────────────────────────────────────────
export * from "../subdomains/knowledge/api";

// ── authoring subdomain ───────────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the knowledge-base convergence.
export * from "../subdomains/authoring/api";

// ── collaboration subdomain ───────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the collaboration convergence.
export * from "../subdomains/collaboration/api";

// ── database subdomain ────────────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the database convergence.
export * from "../subdomains/database/api";

// ── taxonomy subdomain ────────────────────────────────────────────────────────
// Tier 2 — classification hierarchy and semantic organization
export * from "../subdomains/taxonomy/api";

// ── relations subdomain ───────────────────────────────────────────────────────
// Tier 2 — backlinks, forward links, and reference graphs
export * from "../subdomains/relations/api";
````

## File: modules/notion/application/dtos/index.ts
````typescript
export * as authoringDtos from '../../subdomains/authoring/application/dto';
export * as collaborationDtos from '../../subdomains/collaboration/application/dto';
export * as databaseDtos from '../../subdomains/database/application/dto';
export * as knowledgeDtos from '../../subdomains/knowledge/application/dto';

// relations and taxonomy currently expose no DTO barrel.
````

## File: modules/notion/infrastructure/authoring/firebase/FirebaseArticleRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../../subdomains/authoring/domain/aggregates/Article";
import type { IArticleRepository } from "../../../subdomains/authoring/domain/repositories/IArticleRepository";

function articlesPath(accountId: string): string {
  return `accounts/${accountId}/kbArticles`;
}

function articlePath(accountId: string, articleId: string): string {
  return `accounts/${accountId}/kbArticles/${articleId}`;
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
  async getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      articlePath(accountId, articleId),
    );
    if (!data) return null;
    return toSnapshot(articleId, data);
  }

  async list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]> {
    const where = [
      { field: "workspaceId", op: "==", value: params.workspaceId } as const,
      ...(params.categoryId ? [{ field: "categoryId", op: "==", value: params.categoryId } as const] : []),
      ...(params.status ? [{ field: "status", op: "==", value: params.status } as const] : []),
    ];
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      articlesPath(params.accountId),
      where,
      { orderBy: [{ field: "updatedAtISO", direction: "desc" }] },
    );
    const limited = typeof params.limit === "number" && params.limit > 0 ? docs.slice(0, params.limit) : docs;
    return limited.map((d) => toSnapshot(d.id, d.data));
  }

  async listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      articlesPath(accountId),
      [{ field: "linkedArticleIds", op: "array-contains", value: articleId }],
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }

  async save(snapshot: ArticleSnapshot): Promise<void> {
    const { id, accountId, ...rest } = snapshot;
    await firestoreInfrastructureApi.set(articlePath(accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, articleId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(articlePath(accountId, articleId));
  }
}
````

## File: modules/notion/infrastructure/authoring/firebase/FirebaseCategoryRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { CategorySnapshot } from "../../../subdomains/authoring/domain/aggregates/Category";
import type { ICategoryRepository } from "../../../subdomains/authoring/domain/repositories/ICategoryRepository";

function categoriesPath(accountId: string): string {
  return `accounts/${accountId}/kbCategories`;
}

function categoryPath(accountId: string, categoryId: string): string {
  return `accounts/${accountId}/kbCategories/${categoryId}`;
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
  async getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      categoryPath(accountId, categoryId),
    );
    if (!data) return null;
    return toSnapshot(categoryId, data);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      categoriesPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
      { orderBy: [{ field: "depth", direction: "asc" }, { field: "name", direction: "asc" }] },
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }

  async save(snapshot: CategorySnapshot): Promise<void> {
    const { id, accountId, ...rest } = snapshot;
    await firestoreInfrastructureApi.set(categoryPath(accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, categoryId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(categoryPath(accountId, categoryId));
  }
}
````

## File: modules/notion/infrastructure/authoring/firebase/index.ts
````typescript
// TODO: export FirebaseArticleRepository, FirebaseCategoryRepository

export { FirebaseArticleRepository } from "./FirebaseArticleRepository";
export { FirebaseCategoryRepository } from "./FirebaseCategoryRepository";
````

## File: modules/notion/infrastructure/authoring/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/infrastructure/collaboration/firebase/FirebaseCommentRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { CommentSnapshot, SelectionRange } from "../../../subdomains/collaboration/domain/aggregates/Comment";
import type {
  ICommentRepository,
  CommentUnsubscribe,
  CreateCommentInput,
  UpdateCommentInput,
  ResolveCommentInput,
} from "../../../subdomains/collaboration/domain/repositories/ICommentRepository";

function commentsPath(accountId: string): string {
  return `accounts/${accountId}/collaborationComments`;
}

function commentPath(accountId: string, id: string): string {
  return `accounts/${accountId}/collaborationComments/${id}`;
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
  async create(input: CreateCommentInput): Promise<CommentSnapshot> {
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
    };
    await firestoreInfrastructureApi.set(commentPath(input.accountId, id), data);
    return toComment(id, data);
  }

  async update(input: UpdateCommentInput): Promise<CommentSnapshot | null> {
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      commentPath(input.accountId, input.id),
    );
    if (!existing) return null;
    const now = new Date().toISOString();
    await firestoreInfrastructureApi.update(commentPath(input.accountId, input.id), {
      body: input.body,
      updatedAtISO: now,
    });
    return toComment(input.id, { ...existing, body: input.body, updatedAtISO: now });
  }

  async resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null> {
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      commentPath(input.accountId, input.id),
    );
    if (!existing) return null;
    const now = new Date().toISOString();
    await firestoreInfrastructureApi.update(commentPath(input.accountId, input.id), {
      resolvedAt: now,
      resolvedByUserId: input.resolvedByUserId,
    });
    return toComment(input.id, { ...existing, resolvedAt: now, resolvedByUserId: input.resolvedByUserId });
  }

  async delete(accountId: string, commentId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(commentPath(accountId, commentId));
  }

  async findById(accountId: string, commentId: string): Promise<CommentSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      commentPath(accountId, commentId),
    );
    if (!data) return null;
    return toComment(commentId, data);
  }

  async listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      commentsPath(accountId),
      [{ field: "contentId", op: "==", value: contentId }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toComment(d.id, d.data));
  }

  subscribe(accountId: string, contentId: string, onUpdate: (comments: CommentSnapshot[]) => void): CommentUnsubscribe {
    return firestoreInfrastructureApi.watchCollection<Record<string, unknown>>(
      commentsPath(accountId),
      {
        onNext: (documents) => {
          const mapped = documents
            .map((d) => toComment(d.id, d.data))
            .sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO));
          onUpdate(mapped);
        },
      },
      [{ field: "contentId", op: "==", value: contentId }],
    );
  }

  
}
````

## File: modules/notion/infrastructure/collaboration/firebase/FirebasePermissionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationPermissions/{id}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../../../subdomains/collaboration/domain/aggregates/Permission";
import type { IPermissionRepository, GrantPermissionInput } from "../../../subdomains/collaboration/domain/repositories/IPermissionRepository";

function permissionsPath(accountId: string): string {
  return `accounts/${accountId}/collaborationPermissions`;
}

function permissionPath(accountId: string, id: string): string {
  return `accounts/${accountId}/collaborationPermissions/${id}`;
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
  async grant(input: GrantPermissionInput): Promise<PermissionSnapshot> {
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
    };
    await firestoreInfrastructureApi.set(permissionPath(input.accountId, id), data);
    return toPermission(id, data);
  }

  async revoke(accountId: string, permissionId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(permissionPath(accountId, permissionId));
  }

  async findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      permissionPath(accountId, permissionId),
    );
    if (!data) return null;
    return toPermission(permissionId, data);
  }

  async listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      permissionsPath(accountId),
      [{ field: "subjectId", op: "==", value: subjectId }],
    );
    return docs.map((d) => toPermission(d.id, d.data));
  }
}
````

## File: modules/notion/infrastructure/collaboration/firebase/FirebaseVersionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationVersions/{versionId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { VersionSnapshot } from "../../../subdomains/collaboration/domain/aggregates/Version";
import type { IVersionRepository, CreateVersionInput } from "../../../subdomains/collaboration/domain/repositories/IVersionRepository";

function versionsPath(accountId: string): string {
  return `accounts/${accountId}/collaborationVersions`;
}

function versionPath(accountId: string, id: string): string {
  return `accounts/${accountId}/collaborationVersions/${id}`;
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
  async create(input: CreateVersionInput): Promise<VersionSnapshot> {
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
    };
    await firestoreInfrastructureApi.set(versionPath(input.accountId, id), data);
    return toVersion(id, data);
  }

  async findById(accountId: string, versionId: string): Promise<VersionSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      versionPath(accountId, versionId),
    );
    if (!data) return null;
    return toVersion(versionId, data);
  }

  async listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      versionsPath(accountId),
      [{ field: "contentId", op: "==", value: contentId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toVersion(d.id, d.data));
  }

  async delete(accountId: string, versionId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(versionPath(accountId, versionId));
  }
}
````

## File: modules/notion/infrastructure/collaboration/firebase/index.ts
````typescript
export { FirebaseCommentRepository } from "./FirebaseCommentRepository";
export { FirebaseVersionRepository } from "./FirebaseVersionRepository";
export { FirebasePermissionRepository } from "./FirebasePermissionRepository";
````

## File: modules/notion/infrastructure/collaboration/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/infrastructure/database/firebase/FirebaseAutomationRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}/automations/{automationId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";

import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
} from "../../../subdomains/database/domain/aggregates/DatabaseAutomation";
import type { IAutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../../subdomains/database/domain/repositories/IAutomationRepository";

function automationsPath(accountId: string, databaseId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/automations`;
}

function automationPath(accountId: string, databaseId: string, automationId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/automations/${automationId}`;
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
  async create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot> {
    const id = generateId();
    const now = new Date().toISOString();
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
    };
    await firestoreInfrastructureApi.set(automationPath(input.accountId, input.databaseId, id), payload);
    return toAutomation(id, payload);
  }

  async update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null> {
    const { id, accountId, databaseId, ...fields } = input;
    const path = automationPath(accountId, databaseId, id);
    const updates: Record<string, unknown> = { ...fields, updatedAtISO: new Date().toISOString() };
    await firestoreInfrastructureApi.update(path, updates);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;
    return toAutomation(id, snap);
  }

  async delete(id: string, accountId: string, databaseId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(automationPath(accountId, databaseId, id));
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      automationsPath(accountId, databaseId),
      [{ field: "databaseId", op: "==", value: databaseId }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toAutomation(d.id, d.data));
  }
}
````

## File: modules/notion/infrastructure/database/firebase/FirebaseDatabaseRecordRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IDatabaseRecordRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{recordId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { IDatabaseRecordRepository, CreateRecordInput, UpdateRecordInput } from "../../../subdomains/database/domain/repositories/IDatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../../subdomains/database/domain/aggregates/DatabaseRecord";

function recordsPath(accountId: string, databaseId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/records`;
}

function recordPath(accountId: string, databaseId: string, recordId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/records/${recordId}`;
}

function toISO(ts: unknown): string {
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
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
    const id = generateId();
    const countDocs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      recordsPath(input.accountId, input.databaseId),
    );
    const now = new Date().toISOString();
    const data = {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      pageId: input.pageId ?? null,
      properties: input.properties ?? {},
      order: countDocs.length,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(recordPath(input.accountId, input.databaseId, id), data);
    return toSnapshot(id, data);
  }

  async update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot> {
    // We need to find which database this record belongs to. Properties are keyed by field IDs.
    // The record stores databaseId on the document; we fetch it via a collection-group query approach.
    // For simplicity, the input should come from a context where databaseId is available.
    // Here we use a direct path by reading the doc first from a stored databaseId lookup.
    // Since the record doc lives in accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{id},
    // and we only have id+accountId, we do collection group query.
    const { id, accountId, properties } = input;
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "records",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((d) => d.id === id);
    if (!target) throw new Error(`Record ${id} not found`);
    await firestoreInfrastructureApi.update(target.path, { properties, updatedAtISO: new Date().toISOString() });
    const refreshed = await firestoreInfrastructureApi.get<Record<string, unknown>>(target.path);
    if (!refreshed) {
      throw new Error(`Record ${id} not found after update`);
    }
    return toSnapshot(id, refreshed);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "records",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((d) => d.id === id);
    if (target) {
      await firestoreInfrastructureApi.delete(target.path);
    }
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      recordsPath(accountId, databaseId),
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }
}
````

## File: modules/notion/infrastructure/database/firebase/FirebaseDatabaseRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IDatabaseRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { generateId } from "@shared-utils";
import type { IDatabaseRepository, CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "../../../subdomains/database/domain/repositories/IDatabaseRepository";
import type { DatabaseSnapshot, Field } from "../../../subdomains/database/domain/aggregates/Database";

function databasesPath(accountId: string): string {
  return `accounts/${accountId}/knowledgeDatabases`;
}

function databasePath(accountId: string, id: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${id}`;
}

function toISO(ts: unknown): string {
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
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
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      name: input.name,
      description: input.description ?? null,
      fields: [],
      viewIds: [],
      icon: null,
      coverImageUrl: null,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(databasePath(input.accountId, id), data);
    return toSnapshot(id, data);
  }

  async update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot> {
    const path = databasePath(input.accountId, input.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!existing) {
      throw new Error(`Database ${input.id} not found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAtISO: new Date().toISOString() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.description !== undefined) changes.description = input.description;
    if (input.icon !== undefined) changes.icon = input.icon;
    if (input.coverImageUrl !== undefined) changes.coverImageUrl = input.coverImageUrl;
    await firestoreInfrastructureApi.update(path, changes);
    return toSnapshot(input.id, { ...existing, ...changes });
  }

  async addField(input: AddFieldInput): Promise<Field> {
    const path = databasePath(input.accountId, input.databaseId);
    const data = (await firestoreInfrastructureApi.get<Record<string, unknown>>(path)) ?? {};
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
    await firestoreInfrastructureApi.update(path, { fields, updatedAtISO: new Date().toISOString() });
    return newField;
  }

  async archive(id: string, accountId: string): Promise<void> {
    const now = new Date().toISOString();
    await firestoreInfrastructureApi.update(databasePath(accountId, id), {
      archived: true,
      archivedAtISO: now,
      updatedAtISO: now,
    });
  }

  async findById(id: string, accountId: string): Promise<DatabaseSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(databasePath(accountId, id));
    if (!data) return null;
    return toSnapshot(id, data);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      databasesPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    return docs
      .filter((d) => d.data.archived !== true)
      .map((d) => toSnapshot(d.id, d.data));
  }
}
````

## File: modules/notion/infrastructure/database/firebase/FirebaseViewRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IViewRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/views/{viewId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { IViewRepository, CreateViewInput, UpdateViewInput } from "../../../subdomains/database/domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../../subdomains/database/domain/aggregates/View";

function viewsPath(accountId: string, databaseId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/views`;
}

function viewPath(accountId: string, databaseId: string, id: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/views/${id}`;
}

function toISO(ts: unknown): string {
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
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
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
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
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(viewPath(input.accountId, input.databaseId, id), data);
    return toSnapshot(id, data);
  }

  async update(input: UpdateViewInput): Promise<ViewSnapshot> {
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "views",
      [{ field: "accountId", op: "==", value: input.accountId }],
    );
    const target = docs.find((d) => d.id === input.id);
    if (!target) {
      throw new Error(`View ${input.id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAtISO: new Date().toISOString() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.filters !== undefined) changes.filters = input.filters;
    if (input.sorts !== undefined) changes.sorts = input.sorts;
    if (input.visibleFieldIds !== undefined) changes.visibleFieldIds = input.visibleFieldIds;
    if (input.hiddenFieldIds !== undefined) changes.hiddenFieldIds = input.hiddenFieldIds;
    await firestoreInfrastructureApi.update(target.path, changes);
    const refreshed = await firestoreInfrastructureApi.get<Record<string, unknown>>(target.path);
    if (!refreshed) {
      throw new Error(`View ${input.id} not found after update`);
    }
    return toSnapshot(input.id, refreshed);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "views",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((d) => d.id === id);
    if (target) {
      await firestoreInfrastructureApi.delete(target.path);
    }
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      viewsPath(accountId, databaseId),
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }
}
````

## File: modules/notion/infrastructure/database/firebase/index.ts
````typescript
export { FirebaseDatabaseRepository } from "./FirebaseDatabaseRepository";
export { FirebaseDatabaseRecordRepository } from "./FirebaseDatabaseRecordRepository";
export { FirebaseViewRepository } from "./FirebaseViewRepository";
export { FirebaseAutomationRepository } from "./FirebaseAutomationRepository";
````

## File: modules/notion/infrastructure/database/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseBacklinkIndexRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IBacklinkIndexRepository.
 * Firestore paths:
 *   accounts/{accountId}/backlinkIndex/{targetPageId}
 *   accounts/{accountId}/backlinkOutbound/{sourcePageId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { IBacklinkIndexRepository, UpsertBacklinkEntriesInput, RemoveBacklinksFromSourceInput } from "../../../subdomains/knowledge/domain/repositories/IBacklinkIndexRepository";
import { BacklinkIndex } from "../../../subdomains/knowledge/domain/aggregates/BacklinkIndex";
import type { BacklinkEntry, BacklinkIndexSnapshot } from "../../../subdomains/knowledge/domain/aggregates/BacklinkIndex";

function backlinkIndexPath(accountId: string, targetPageId: string): string {
  return `accounts/${accountId}/backlinkIndex/${targetPageId}`;
}

function backlinkOutboundPath(accountId: string, sourcePageId: string): string {
  return `accounts/${accountId}/backlinkOutbound/${sourcePageId}`;
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
  async upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void> {
    const { accountId, targetPageId, sourcePageId, entries } = input;
    const existingIndex = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkIndexPath(accountId, targetPageId),
    );
    const existing = existingIndex ? toEntries(existingIndex.entries) : [];
    const nowISO = new Date().toISOString();
    const filtered = existing.filter((e) => !entries.some((ne) => e.blockId === ne.blockId && e.sourcePageId === sourcePageId));
    const newEntries: BacklinkEntry[] = entries.map((e) => ({ sourcePageId, sourcePageTitle: (e as BacklinkEntry).sourcePageTitle ?? "", blockId: e.blockId, lastSeenAtISO: nowISO }));
    const merged = [...filtered, ...newEntries];

    const existingOut = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkOutboundPath(accountId, sourcePageId),
    );
    const currentTargetIds = Array.isArray(existingOut?.targetPageIds)
      ? existingOut.targetPageIds.filter((item): item is string => typeof item === "string")
      : [];

    const nextTargetIds = Array.from(new Set([...currentTargetIds, targetPageId]));

    await firestoreInfrastructureApi.setMany([
      {
        path: backlinkIndexPath(accountId, targetPageId),
        data: { targetPageId, accountId, entries: merged, updatedAtISO: nowISO },
      },
      {
        path: backlinkOutboundPath(accountId, sourcePageId),
        data: { sourcePageId, accountId, targetPageIds: nextTargetIds, updatedAtISO: nowISO },
      },
    ]);
  }

  async removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void> {
    const { accountId, sourcePageId } = input;
    const outbound = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkOutboundPath(accountId, sourcePageId),
    );
    const targetPageIds = Array.isArray(outbound?.targetPageIds)
      ? outbound.targetPageIds.filter((item): item is string => typeof item === "string")
      : [];

    const nowISO = new Date().toISOString();

    const writes: { path: string; data: Record<string, unknown> }[] = [];
    for (const targetPageId of targetPageIds) {
      const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(
        backlinkIndexPath(accountId, targetPageId),
      );
      if (!existing) continue;
      const entries = toEntries(existing.entries).filter((e) => e.sourcePageId !== sourcePageId);
      writes.push({
        path: backlinkIndexPath(accountId, targetPageId),
        data: {
          targetPageId,
          accountId,
          entries,
          updatedAtISO: nowISO,
        },
      });
    }
    writes.push({
      path: backlinkOutboundPath(accountId, sourcePageId),
      data: { sourcePageId, accountId, targetPageIds: [], updatedAtISO: nowISO },
    });
    await firestoreInfrastructureApi.setMany(writes);
  }

  async findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null> {
    const d = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkIndexPath(accountId, targetPageId),
    );
    if (!d) return null;
    const snapshot: BacklinkIndexSnapshot = {
      targetPageId,
      accountId,
      entries: toEntries(d.entries),
      updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
    };
    return BacklinkIndex.reconstitute(snapshot);
  }

  async listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>> {
    const d = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      backlinkOutboundPath(accountId, sourcePageId),
    );
    if (!d) return [];
    return Array.isArray(d.targetPageIds) ? (d.targetPageIds as string[]) : [];
  }
}
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseContentBlockRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IContentBlockRepository.
 * Firestore path: accounts/{accountId}/contentBlocks/{blockId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as _generateId } from "@lib-uuid";
import { ContentBlock } from "../../../subdomains/knowledge/domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../../subdomains/knowledge/domain/aggregates/ContentBlock";
import type { IContentBlockRepository } from "../../../subdomains/knowledge/domain/repositories/IContentBlockRepository";
import type { BlockContent } from "../../../subdomains/knowledge/domain/value-objects/BlockContent";
import { BLOCK_TYPES } from "../../../subdomains/knowledge/domain/value-objects/BlockContent";

const VALID_TYPES = new Set<string>(BLOCK_TYPES);

function blocksPath(accountId: string): string {
  return `accounts/${accountId}/contentBlocks`;
}

function blockPath(accountId: string, blockId: string): string {
  return `accounts/${accountId}/contentBlocks/${blockId}`;
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
  async save(block: ContentBlock): Promise<void> {
    const snap = block.getSnapshot();
    const path = blockPath(snap.accountId, snap.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    const data: Record<string, unknown> = { ...snap };
    if (!existing) {
      await firestoreInfrastructureApi.set(path, data);
    } else {
      await firestoreInfrastructureApi.update(path, data);
    }
  }

  async findById(accountId: string, blockId: string): Promise<ContentBlock | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      blockPath(accountId, blockId),
    );
    if (!data) return null;
    return ContentBlock.reconstitute(toSnapshot(blockId, data));
  }

  async listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      blocksPath(accountId),
      [{ field: "pageId", op: "==", value: pageId }],
    );
    return docs.map((d) => ContentBlock.reconstitute(toSnapshot(d.id, d.data)));
  }

  async delete(accountId: string, blockId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(blockPath(accountId, blockId));
  }

  async nextOrder(accountId: string, pageId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      blocksPath(accountId),
      [{ field: "pageId", op: "==", value: pageId }],
    );
    return docs.length;
  }

  async countByPageId(accountId: string, pageId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      blocksPath(accountId),
      [{ field: "pageId", op: "==", value: pageId }],
    );
    return docs.length;
  }
}
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgeCollectionRepository.
 * Firestore path: accounts/{accountId}/knowledgeCollections/{collectionId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { KnowledgeCollection } from "../../../subdomains/knowledge/domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionSnapshot } from "../../../subdomains/knowledge/domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../../subdomains/knowledge/domain/repositories/IKnowledgeCollectionRepository";

function collectionsPath(accountId: string): string {
  return `accounts/${accountId}/knowledgeCollections`;
}

function collectionPath(accountId: string, id: string): string {
  return `accounts/${accountId}/knowledgeCollections/${id}`;
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
  async save(coll: KnowledgeCollection): Promise<void> {
    const snap = coll.getSnapshot();
    const path = collectionPath(snap.accountId, snap.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    const data: Record<string, unknown> = { ...snap, columns: [...snap.columns], pageIds: [...snap.pageIds] };
    if (!existing) {
      await firestoreInfrastructureApi.set(path, data);
    } else {
      await firestoreInfrastructureApi.update(path, data);
    }
  }

  async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      collectionPath(accountId, collectionId),
    );
    if (!data) return null;
    return KnowledgeCollection.reconstitute(toSnapshot(collectionId, data));
  }

  async listByAccountId(accountId: string): Promise<KnowledgeCollection[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionsPath(accountId),
    );
    return docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionsPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    return docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data)));
  }
}
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgePageRepository.
 * Firestore path: accounts/{accountId}/contentPages/{pageId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as _generateId } from "@lib-uuid";
import { KnowledgePage } from "../../../subdomains/knowledge/domain/aggregates/KnowledgePage";
import type { KnowledgePageSnapshot } from "../../../subdomains/knowledge/domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../../subdomains/knowledge/domain/repositories/IKnowledgePageRepository";

function pagesPath(accountId: string): string {
  return `accounts/${accountId}/contentPages`;
}

function pagePath(accountId: string, pageId: string): string {
  return `accounts/${accountId}/contentPages/${pageId}`;
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
  async save(page: KnowledgePage): Promise<void> {
    const snap = page.getSnapshot();
    const path = pagePath(snap.accountId, snap.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    const data: Record<string, unknown> = {
      ...snap,
      blockIds: [...snap.blockIds],
    };
    if (!existing) {
      await firestoreInfrastructureApi.set(path, data);
    } else {
      await firestoreInfrastructureApi.update(path, data);
    }
  }

  async findById(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(pagePath(accountId, pageId));
    if (!data) return null;
    return KnowledgePage.reconstitute(toSnapshot(pageId, data));
  }

  async listByAccountId(accountId: string): Promise<KnowledgePage[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      pagesPath(accountId),
      [{ field: "status", op: "==", value: "active" }],
      { orderBy: [{ field: "order", direction: "asc" }] },
    );
    return docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      pagesPath(accountId),
      [
        { field: "workspaceId", op: "==", value: workspaceId },
        { field: "status", op: "==", value: "active" },
      ],
      { orderBy: [{ field: "order", direction: "asc" }] },
    );
    return docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data)));
  }

  async countByParent(accountId: string, parentPageId: string | null): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      pagesPath(accountId),
      [{ field: "parentPageId", op: "==", value: parentPageId ?? null }],
    );
    return docs.length;
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

## File: modules/notion/infrastructure/knowledge/firebase/index.ts
````typescript
export { FirebaseKnowledgePageRepository } from "./FirebaseKnowledgePageRepository";
export { FirebaseContentBlockRepository } from "./FirebaseContentBlockRepository";
export { FirebaseKnowledgeCollectionRepository } from "./FirebaseKnowledgeCollectionRepository";
export { FirebaseBacklinkIndexRepository } from "./FirebaseBacklinkIndexRepository";
````

## File: modules/notion/infrastructure/knowledge/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/infrastructure/relations/firebase/FirebaseRelationRepository.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IRelationRepository.
 * Firestore path: notionRelations/{relationId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { Relation } from "../../../subdomains/relations/domain/entities/Relation";
import type { IRelationRepository } from "../../../subdomains/relations/domain/repositories/IRelationRepository";

function relationsPath(): string {
  return "notionRelations";
}

function relationPath(relationId: string): string {
  return `notionRelations/${relationId}`;
}

function toRelation(relationId: string, data: Record<string, unknown>): Relation {
  return {
    relationId,
    sourceArtifactId: typeof data.sourceArtifactId === "string" ? data.sourceArtifactId : "",
    targetArtifactId: typeof data.targetArtifactId === "string" ? data.targetArtifactId : "",
    relationType: typeof data.relationType === "string" ? data.relationType : "related",
    direction: data.direction === "backward" ? "backward" : "forward",
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseRelationRepository implements IRelationRepository {
  async findById(relationId: string): Promise<Relation | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(relationPath(relationId));
    if (!data) return null;
    return toRelation(relationId, data);
  }

  async listBySource(sourceArtifactId: string): Promise<readonly Relation[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      relationsPath(),
      [{ field: "sourceArtifactId", op: "==", value: sourceArtifactId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toRelation(d.id, d.data));
  }

  async listByTarget(targetArtifactId: string): Promise<readonly Relation[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      relationsPath(),
      [{ field: "targetArtifactId", op: "==", value: targetArtifactId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toRelation(d.id, d.data));
  }

  async save(relation: Relation): Promise<void> {
    const { relationId, ...rest } = relation;
    await firestoreInfrastructureApi.set(relationPath(relationId), { relationId, ...rest });
  }

  async remove(relationId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(relationPath(relationId));
  }
}
````

## File: modules/notion/infrastructure/relations/firebase/index.ts
````typescript
export { FirebaseRelationRepository } from "./FirebaseRelationRepository";
````

## File: modules/notion/infrastructure/relations/index.ts
````typescript
export * from "./firebase";
````

## File: modules/notion/infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing ITaxonomyRepository.
 * Firestore path: notionTaxonomyNodes/{nodeId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { TaxonomyNode } from "../../../subdomains/taxonomy/domain/entities/TaxonomyNode";
import type { ITaxonomyRepository } from "../../../subdomains/taxonomy/domain/repositories/ITaxonomyRepository";

function collectionPath(): string {
  return "notionTaxonomyNodes";
}

function docPath(nodeId: string): string {
  return `notionTaxonomyNodes/${nodeId}`;
}

function toTaxonomyNode(nodeId: string, data: Record<string, unknown>): TaxonomyNode {
  const rawPath = data.path;
  const path: readonly string[] =
    Array.isArray(rawPath) && rawPath.every((s) => typeof s === "string")
      ? (rawPath as string[])
      : [nodeId];

  return {
    nodeId,
    label: typeof data.label === "string" ? data.label : "",
    parentNodeId: typeof data.parentNodeId === "string" ? data.parentNodeId : null,
    path,
    depth: typeof data.depth === "number" ? data.depth : 0,
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseTaxonomyRepository implements ITaxonomyRepository {
  async findById(nodeId: string): Promise<TaxonomyNode | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(docPath(nodeId));
    if (!data) return null;
    return toTaxonomyNode(nodeId, data);
  }

  async listRoots(organizationId: string): Promise<readonly TaxonomyNode[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionPath(),
      [
        { field: "organizationId", op: "==", value: organizationId },
        { field: "depth", op: "==", value: 0 },
      ],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toTaxonomyNode(d.id, d.data));
  }

  async listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionPath(),
      [{ field: "parentNodeId", op: "==", value: parentNodeId }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toTaxonomyNode(d.id, d.data));
  }

  async save(node: TaxonomyNode): Promise<void> {
    await firestoreInfrastructureApi.set(docPath(node.nodeId), {
      nodeId: node.nodeId,
      label: node.label,
      parentNodeId: node.parentNodeId ?? null,
      path: [...node.path],
      depth: node.depth,
      organizationId: node.organizationId,
      workspaceId: node.workspaceId ?? null,
      createdAtISO: node.createdAtISO,
      updatedAtISO: node.updatedAtISO,
    });
  }

  async remove(nodeId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(docPath(nodeId));
  }
}
````

## File: modules/notion/infrastructure/taxonomy/firebase/index.ts
````typescript
export { FirebaseTaxonomyRepository } from "./FirebaseTaxonomyRepository";
````

## File: modules/notion/infrastructure/taxonomy/index.ts
````typescript
export { FirebaseTaxonomyRepository } from "./firebase/FirebaseTaxonomyRepository";
````

## File: modules/notion/interfaces/authoring/_actions/index.ts
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

## File: modules/notion/interfaces/authoring/components/ArticleDetailPanel.tsx
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
import type { ArticleSnapshot as Article } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
import { CommentPanel, VersionHistoryPanel } from "@/modules/notion/api";
import { ReactMarkdown } from "@lib-react-markdown";
import { remarkGfm } from "@lib-remark-gfm";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ArticleDetailPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticleDetailPanel({
  accountId,
  workspaceId,
  currentUserId,
}: ArticleDetailPanelProps) {
  const params = useParams();
  const router = useRouter();
  const articleId = params.articleId as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [backlinks, setBacklinks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const articleListHref =
    accountId && workspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/knowledge-base/articles`
      : "/knowledge-base/articles";

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
        <Button variant="ghost" size="sm" onClick={() => router.push(articleListHref)}>
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

## File: modules/notion/interfaces/authoring/components/ArticleDialog.tsx
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
import type { ArticleSnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";

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

## File: modules/notion/interfaces/authoring/components/CategoryTreePanel.tsx
````typescript
"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Layers } from "lucide-react";

import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";

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

## File: modules/notion/interfaces/authoring/components/index.ts
````typescript
// TODO: export ArticleEditorView, ArticleListView, CategoryTreeView

export { ArticleDialog } from "./ArticleDialog";
````

## File: modules/notion/interfaces/authoring/composition/repositories.ts
````typescript
import { FirebaseArticleRepository } from "../../../infrastructure/authoring/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../../infrastructure/authoring/firebase/FirebaseCategoryRepository";

export function makeArticleRepo() {
  return new FirebaseArticleRepository();
}

export function makeCategoryRepo() {
  return new FirebaseCategoryRepository();
}
````

## File: modules/notion/interfaces/authoring/composition/use-cases.ts
````typescript
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
  PublishArticleUseCase,
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../../subdomains/authoring/application/use-cases";
import type { IArticleRepository } from "../../../subdomains/authoring/domain/repositories/IArticleRepository";
import type { ICategoryRepository } from "../../../subdomains/authoring/domain/repositories/ICategoryRepository";
import { makeArticleRepo, makeCategoryRepo } from "./repositories";

export interface AuthoringUseCases {
  readonly createArticle: CreateArticleUseCase;
  readonly updateArticle: UpdateArticleUseCase;
  readonly archiveArticle: ArchiveArticleUseCase;
  readonly deleteArticle: DeleteArticleUseCase;
  readonly publishArticle: PublishArticleUseCase;
  readonly verifyArticle: VerifyArticleUseCase;
  readonly requestArticleReview: RequestArticleReviewUseCase;
  readonly createCategory: CreateCategoryUseCase;
  readonly renameCategory: RenameCategoryUseCase;
  readonly moveCategory: MoveCategoryUseCase;
  readonly deleteCategory: DeleteCategoryUseCase;
}

export function makeAuthoringUseCases(
  articleRepo: IArticleRepository = makeArticleRepo(),
  categoryRepo: ICategoryRepository = makeCategoryRepo(),
): AuthoringUseCases {
  return {
    createArticle: new CreateArticleUseCase(articleRepo),
    updateArticle: new UpdateArticleUseCase(articleRepo),
    archiveArticle: new ArchiveArticleUseCase(articleRepo),
    deleteArticle: new DeleteArticleUseCase(articleRepo),
    publishArticle: new PublishArticleUseCase(articleRepo),
    verifyArticle: new VerifyArticleUseCase(articleRepo),
    requestArticleReview: new RequestArticleReviewUseCase(articleRepo),
    createCategory: new CreateCategoryUseCase(categoryRepo),
    renameCategory: new RenameCategoryUseCase(categoryRepo),
    moveCategory: new MoveCategoryUseCase(categoryRepo),
    deleteCategory: new DeleteCategoryUseCase(categoryRepo),
  };
}
````

## File: modules/notion/interfaces/authoring/store/index.ts
````typescript
// TODO: export useArticleEditorStore

export {};
````

## File: modules/notion/interfaces/collaboration/_actions/index.ts
````typescript
export { createComment, updateComment, resolveComment, deleteComment } from "./comment.actions";
export { createVersion, deleteVersion } from "./version.actions";
export { grantPermission, revokePermission } from "./permission.actions";
````

## File: modules/notion/interfaces/collaboration/components/CommentPanel.tsx
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
import type { CommentSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";

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

## File: modules/notion/interfaces/collaboration/components/index.ts
````typescript
export { CommentPanel } from "./CommentPanel";
export { VersionHistoryPanel } from "./VersionHistoryPanel";
````

## File: modules/notion/interfaces/collaboration/components/VersionHistoryPanel.tsx
````typescript
"use client";

import { useEffect, useState, useTransition } from "react";
import { History, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getVersions } from "../queries";
import { deleteVersion } from "../_actions/version.actions";
import type { VersionSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";

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

## File: modules/notion/interfaces/collaboration/composition/repositories.ts
````typescript
import { FirebaseCommentRepository } from "../../../infrastructure/collaboration/firebase/FirebaseCommentRepository";
import { FirebasePermissionRepository } from "../../../infrastructure/collaboration/firebase/FirebasePermissionRepository";
import { FirebaseVersionRepository } from "../../../infrastructure/collaboration/firebase/FirebaseVersionRepository";

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

## File: modules/notion/interfaces/collaboration/composition/use-cases.ts
````typescript
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
  ListCommentsUseCase,
  CreateVersionUseCase,
  DeleteVersionUseCase,
  GrantPermissionUseCase,
  RevokePermissionUseCase,
} from "../../../subdomains/collaboration/application/use-cases";
import type { ICommentRepository } from "../../../subdomains/collaboration/domain/repositories/ICommentRepository";
import type { IVersionRepository } from "../../../subdomains/collaboration/domain/repositories/IVersionRepository";
import type { IPermissionRepository } from "../../../subdomains/collaboration/domain/repositories/IPermissionRepository";
import { makeCommentRepo, makeVersionRepo, makePermissionRepo } from "./repositories";

export interface CollaborationUseCases {
  readonly createComment: CreateCommentUseCase;
  readonly updateComment: UpdateCommentUseCase;
  readonly resolveComment: ResolveCommentUseCase;
  readonly deleteComment: DeleteCommentUseCase;
  readonly listComments: ListCommentsUseCase;
  readonly createVersion: CreateVersionUseCase;
  readonly deleteVersion: DeleteVersionUseCase;
  readonly grantPermission: GrantPermissionUseCase;
  readonly revokePermission: RevokePermissionUseCase;
}

export function makeCollaborationUseCases(
  commentRepo: ICommentRepository = makeCommentRepo(),
  versionRepo: IVersionRepository = makeVersionRepo(),
  permissionRepo: IPermissionRepository = makePermissionRepo(),
): CollaborationUseCases {
  return {
    createComment: new CreateCommentUseCase(commentRepo),
    updateComment: new UpdateCommentUseCase(commentRepo),
    resolveComment: new ResolveCommentUseCase(commentRepo),
    deleteComment: new DeleteCommentUseCase(commentRepo),
    listComments: new ListCommentsUseCase(commentRepo),
    createVersion: new CreateVersionUseCase(versionRepo),
    deleteVersion: new DeleteVersionUseCase(versionRepo),
    grantPermission: new GrantPermissionUseCase(permissionRepo),
    revokePermission: new RevokePermissionUseCase(permissionRepo),
  };
}
````

## File: modules/notion/interfaces/collaboration/store/index.ts
````typescript
// TODO: export useCommentStore, usePermissionStore

export {};
````

## File: modules/notion/interfaces/database/_actions/index.ts
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

## File: modules/notion/interfaces/database/components/DatabaseAddFieldDialog.tsx
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

## File: modules/notion/interfaces/database/components/DatabaseDialog.tsx
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

## File: modules/notion/interfaces/database/composition/repositories.ts
````typescript
import { FirebaseAutomationRepository } from "../../../infrastructure/database/firebase/FirebaseAutomationRepository";
import { FirebaseDatabaseRecordRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseDatabaseRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRepository";
import { FirebaseViewRepository } from "../../../infrastructure/database/firebase/FirebaseViewRepository";

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

## File: modules/notion/interfaces/database/composition/use-cases.ts
````typescript
import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
  GetDatabaseUseCase,
  ListDatabasesUseCase,
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  ListRecordsUseCase,
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
  ListViewsUseCase,
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
  ListAutomationsUseCase,
} from "../../../subdomains/database/application/use-cases";
import type { IDatabaseRepository } from "../../../subdomains/database/domain/repositories/IDatabaseRepository";
import type { IDatabaseRecordRepository } from "../../../subdomains/database/domain/repositories/IDatabaseRecordRepository";
import type { IViewRepository } from "../../../subdomains/database/domain/repositories/IViewRepository";
import type { IAutomationRepository } from "../../../subdomains/database/domain/repositories/IAutomationRepository";
import { makeDatabaseRepo, makeRecordRepo, makeViewRepo, makeAutomationRepo } from "./repositories";

export interface DatabaseUseCases {
  readonly createDatabase: CreateDatabaseUseCase;
  readonly updateDatabase: UpdateDatabaseUseCase;
  readonly addField: AddFieldUseCase;
  readonly archiveDatabase: ArchiveDatabaseUseCase;
  readonly getDatabase: GetDatabaseUseCase;
  readonly listDatabases: ListDatabasesUseCase;
  readonly createRecord: CreateRecordUseCase;
  readonly updateRecord: UpdateRecordUseCase;
  readonly deleteRecord: DeleteRecordUseCase;
  readonly listRecords: ListRecordsUseCase;
  readonly createView: CreateViewUseCase;
  readonly updateView: UpdateViewUseCase;
  readonly deleteView: DeleteViewUseCase;
  readonly listViews: ListViewsUseCase;
  readonly createAutomation: CreateAutomationUseCase;
  readonly updateAutomation: UpdateAutomationUseCase;
  readonly deleteAutomation: DeleteAutomationUseCase;
  readonly listAutomations: ListAutomationsUseCase;
}

export function makeDatabaseUseCases(
  databaseRepo: IDatabaseRepository = makeDatabaseRepo(),
  recordRepo: IDatabaseRecordRepository = makeRecordRepo(),
  viewRepo: IViewRepository = makeViewRepo(),
  automationRepo: IAutomationRepository = makeAutomationRepo(),
): DatabaseUseCases {
  return {
    createDatabase: new CreateDatabaseUseCase(databaseRepo),
    updateDatabase: new UpdateDatabaseUseCase(databaseRepo),
    addField: new AddFieldUseCase(databaseRepo),
    archiveDatabase: new ArchiveDatabaseUseCase(databaseRepo),
    getDatabase: new GetDatabaseUseCase(databaseRepo),
    listDatabases: new ListDatabasesUseCase(databaseRepo),
    createRecord: new CreateRecordUseCase(recordRepo),
    updateRecord: new UpdateRecordUseCase(recordRepo),
    deleteRecord: new DeleteRecordUseCase(recordRepo),
    listRecords: new ListRecordsUseCase(recordRepo),
    createView: new CreateViewUseCase(viewRepo),
    updateView: new UpdateViewUseCase(viewRepo),
    deleteView: new DeleteViewUseCase(viewRepo),
    listViews: new ListViewsUseCase(viewRepo),
    createAutomation: new CreateAutomationUseCase(automationRepo),
    updateAutomation: new UpdateAutomationUseCase(automationRepo),
    deleteAutomation: new DeleteAutomationUseCase(automationRepo),
    listAutomations: new ListAutomationsUseCase(automationRepo),
  };
}
````

## File: modules/notion/interfaces/database/store/index.ts
````typescript
// TODO: export useDatabaseStore, useRecordStore

export {};
````

## File: modules/notion/interfaces/knowledge/_actions/index.ts
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

## File: modules/notion/interfaces/knowledge/components/KnowledgePageHeaderWidgets.tsx
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

## File: modules/notion/interfaces/knowledge/components/KnowledgeSidebarSection.tsx
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

  const workspaceBasePath =
    activeAccountId && activeWorkspaceId
      ? `/${encodeURIComponent(activeAccountId)}/${encodeURIComponent(activeWorkspaceId)}`
      : "";

  const contextualPagesHref = workspaceBasePath
    ? `${workspaceBasePath}/knowledge/pages`
    : withContextQuery("/knowledge/pages", activeAccountId, activeWorkspaceId);

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
          aria-current={pathname.includes("/knowledge/pages") ? "page" : undefined}
          className={`flex-1 ${
            pathname.includes("/knowledge/pages")
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
          {
            href: workspaceBasePath
              ? `${workspaceBasePath}?tab=Overview&panel=knowledge-pages`
              : "/",
            label: "Knowledge Hub",
          },
          {
            href: workspaceBasePath
              ? `${workspaceBasePath}/knowledge/block-editor`
              : "/",
            label: "區塊編輯器",
          },
        ] as const
      ).map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const contextualHref = workspaceBasePath
          ? item.href
          : withContextQuery(item.href, activeAccountId, activeWorkspaceId);
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

## File: modules/notion/interfaces/knowledge/components/PageDialog.tsx
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
            <Input id="page-title" placeholder="頁面標題" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} />
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

## File: modules/notion/interfaces/knowledge/components/PageEditorPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorPanel ??renders the block editor for a knowledge page.
 *          Connects accountId/pageId context to BlockEditorPanel.
 */

import { useEffect, useCallback } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { getKnowledgeBlocks } from "../queries";
import { BlockEditorPanel } from "./BlockEditorPanel";

export interface PageEditorPanelProps {
  accountId: string;
  pageId: string;
}

export function PageEditorPanel({ accountId, pageId }: PageEditorPanelProps) {
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

  return <BlockEditorPanel />;
}
````

## File: modules/notion/interfaces/knowledge/composition/repositories.ts
````typescript
import { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";

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

## File: modules/notion/interfaces/knowledge/composition/use-cases.ts
````typescript
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
  VerifyKnowledgePageUseCase,
  ApproveKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../../subdomains/knowledge/application/use-cases";
import type { IKnowledgePageRepository } from "../../../subdomains/knowledge/domain/repositories/IKnowledgePageRepository";
import type { IKnowledgeCollectionRepository } from "../../../subdomains/knowledge/domain/repositories/IKnowledgeCollectionRepository";
import type { IEventStoreRepository, IEventBusRepository } from "@shared-events";
import { makePageRepo, makeCollectionRepo } from "./repositories";

/** Stub event store — persists nothing. Replace with a real impl once infrastructure is wired. */
function makeEventStore(): IEventStoreRepository {
  return {
    save: async () => {},
    findById: async () => null,
    findByAggregate: async () => [],
    findUndispatched: async () => [],
    markDispatched: async () => {},
  };
}

/** Stub event bus — publishes nothing. Replace with QStash/Firestore publish once infrastructure is wired. */
function makeEventBus(): IEventBusRepository {
  return {
    publish: async () => {},
  };
}

export interface KnowledgeUseCases {
  readonly createKnowledgePage: CreateKnowledgePageUseCase;
  readonly renameKnowledgePage: RenameKnowledgePageUseCase;
  readonly moveKnowledgePage: MoveKnowledgePageUseCase;
  readonly archiveKnowledgePage: ArchiveKnowledgePageUseCase;
  readonly reorderKnowledgePageBlocks: ReorderKnowledgePageBlocksUseCase;
  readonly verifyKnowledgePage: VerifyKnowledgePageUseCase;
  readonly approveKnowledgePage: ApproveKnowledgePageUseCase;
  readonly requestPageReview: RequestPageReviewUseCase;
  readonly assignPageOwner: AssignPageOwnerUseCase;
  readonly updatePageIcon: UpdatePageIconUseCase;
  readonly updatePageCover: UpdatePageCoverUseCase;
  readonly createKnowledgeCollection: CreateKnowledgeCollectionUseCase;
  readonly renameKnowledgeCollection: RenameKnowledgeCollectionUseCase;
  readonly addPageToCollection: AddPageToCollectionUseCase;
  readonly removePageFromCollection: RemovePageFromCollectionUseCase;
  readonly archiveKnowledgeCollection: ArchiveKnowledgeCollectionUseCase;
}

export function makeKnowledgeUseCases(
  pageRepo: IKnowledgePageRepository = makePageRepo(),
  collectionRepo: IKnowledgeCollectionRepository = makeCollectionRepo(),
  eventStore: IEventStoreRepository = makeEventStore(),
  eventBus: IEventBusRepository = makeEventBus(),
): KnowledgeUseCases {
  return {
    createKnowledgePage: new CreateKnowledgePageUseCase(pageRepo),
    renameKnowledgePage: new RenameKnowledgePageUseCase(pageRepo),
    moveKnowledgePage: new MoveKnowledgePageUseCase(pageRepo),
    archiveKnowledgePage: new ArchiveKnowledgePageUseCase(pageRepo),
    reorderKnowledgePageBlocks: new ReorderKnowledgePageBlocksUseCase(pageRepo),
    verifyKnowledgePage: new VerifyKnowledgePageUseCase(pageRepo),
    approveKnowledgePage: new ApproveKnowledgePageUseCase(pageRepo, eventStore, eventBus),
    requestPageReview: new RequestPageReviewUseCase(pageRepo),
    assignPageOwner: new AssignPageOwnerUseCase(pageRepo),
    updatePageIcon: new UpdatePageIconUseCase(pageRepo),
    updatePageCover: new UpdatePageCoverUseCase(pageRepo),
    createKnowledgeCollection: new CreateKnowledgeCollectionUseCase(collectionRepo),
    renameKnowledgeCollection: new RenameKnowledgeCollectionUseCase(collectionRepo),
    addPageToCollection: new AddPageToCollectionUseCase(collectionRepo),
    removePageFromCollection: new RemovePageFromCollectionUseCase(collectionRepo),
    archiveKnowledgeCollection: new ArchiveKnowledgeCollectionUseCase(collectionRepo),
  };
}
````

## File: modules/notion/interfaces/knowledge/store/block-editor.store.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/store
 * Purpose: Zustand store for the block editor UI state.
 *          Manages optimistic block operations before persistence.
 */
"use client";

import { create } from "zustand";
import type { BlockContent } from "../../../subdomains/knowledge/application/dto/knowledge.dto";

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

## File: modules/notion/interfaces/relations/_actions/.gitkeep
````

````

## File: modules/notion/interfaces/relations/components/.gitkeep
````

````

## File: modules/notion/interfaces/relations/composition/repositories.ts
````typescript
import { FirebaseRelationRepository } from "../../../infrastructure/relations/firebase/FirebaseRelationRepository";

export function makeRelationRepo() {
  return new FirebaseRelationRepository();
}
````

## File: modules/notion/interfaces/relations/composition/use-cases.ts
````typescript
import {
  CreateRelationUseCase,
  ListRelationsBySourceUseCase,
  ListRelationsByTargetUseCase,
  RemoveRelationUseCase,
} from "../../../subdomains/relations/application/use-cases/RelationUseCases";
import type { IRelationRepository } from "../../../subdomains/relations/domain/repositories/IRelationRepository";
import { makeRelationRepo } from "./repositories";

export interface RelationUseCases {
  readonly createRelation: CreateRelationUseCase;
  readonly removeRelation: RemoveRelationUseCase;
  readonly listRelationsBySource: ListRelationsBySourceUseCase;
  readonly listRelationsByTarget: ListRelationsByTargetUseCase;
}

export function makeRelationUseCases(repo: IRelationRepository = makeRelationRepo()): RelationUseCases {
  return {
    createRelation: new CreateRelationUseCase(repo),
    removeRelation: new RemoveRelationUseCase(repo),
    listRelationsBySource: new ListRelationsBySourceUseCase(repo),
    listRelationsByTarget: new ListRelationsByTargetUseCase(repo),
  };
}
````

## File: modules/notion/interfaces/relations/queries/.gitkeep
````

````

## File: modules/notion/interfaces/relations/store/.gitkeep
````

````

## File: modules/notion/interfaces/taxonomy/_actions/.gitkeep
````

````

## File: modules/notion/interfaces/taxonomy/components/.gitkeep
````

````

## File: modules/notion/interfaces/taxonomy/composition/repositories.ts
````typescript
import { FirebaseTaxonomyRepository } from "../../../infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository";

export function makeTaxonomyRepo() {
  return new FirebaseTaxonomyRepository();
}
````

## File: modules/notion/interfaces/taxonomy/composition/use-cases.ts
````typescript
import {
  CreateTaxonomyNodeUseCase,
  ListTaxonomyChildrenUseCase,
  ListTaxonomyRootsUseCase,
  RemoveTaxonomyNodeUseCase,
} from "../../../subdomains/taxonomy/application/use-cases/TaxonomyUseCases";
import type { ITaxonomyRepository } from "../../../subdomains/taxonomy/domain/repositories/ITaxonomyRepository";
import { makeTaxonomyRepo } from "./repositories";

export interface TaxonomyUseCases {
  readonly createTaxonomyNode: CreateTaxonomyNodeUseCase;
  readonly removeTaxonomyNode: RemoveTaxonomyNodeUseCase;
  readonly listTaxonomyRoots: ListTaxonomyRootsUseCase;
  readonly listTaxonomyChildren: ListTaxonomyChildrenUseCase;
}

export function makeTaxonomyUseCases(
  repo: ITaxonomyRepository = makeTaxonomyRepo(),
): TaxonomyUseCases {
  return {
    createTaxonomyNode: new CreateTaxonomyNodeUseCase(repo),
    removeTaxonomyNode: new RemoveTaxonomyNodeUseCase(repo),
    listTaxonomyRoots: new ListTaxonomyRootsUseCase(repo),
    listTaxonomyChildren: new ListTaxonomyChildrenUseCase(repo),
  };
}
````

## File: modules/notion/interfaces/taxonomy/queries/.gitkeep
````

````

## File: modules/notion/interfaces/taxonomy/store/.gitkeep
````

````

## File: modules/notion/README.md
````markdown
# Notion

知識內容生命週期主域

## Bounded Context

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期（頁面、文章、資料庫、協作、版本） |
| Upstream | platform（治理、AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core principle | notion 擁有正典知識內容，不擁有治理或推理過程 |
| Cross-module boundary | `api/` only — no direct import of platform/workspace/notebooklm internals |

## Ubiquitous Language

| Term | Meaning |
|------|---------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 |
| KnowledgePage | 正典頁面型知識單位（block-based 自由頁面） |
| ContentBlock | 知識頁面的最小可組合內容單位（段落、標題、程式碼等） |
| KnowledgeCollection | 頁面集合容器（分組 KnowledgePage，非 Database） |
| BacklinkIndex | 自動反向連結索引（哪些頁面引用了此頁面） |
| Article | 經過撰寫與驗證工作流程的知識庫文章 |
| Database | 結構化知識集合（可投影多種視圖） |
| DatabaseView | 對 Database 的投影配置（Table/Board/Calendar/Gallery/Form） |
| DatabaseRecord | Database 中的一筆記錄 |
| Taxonomy | 跨頁面的分類法與語義組織結構 |
| Relation | 內容對內容之間的正式語義關聯（有類型、有方向） |
| Publication | 對外可見且可交付的內容狀態 |
| VersionSnapshot | 全域版本 checkpoint 策略的不可變快照（≠ 逐次編輯 Version） |
| Template | 可重複套用的內容結構起點 |
| Attachment | 綁定於知識內容的檔案或媒體 |

## Implementation Structure

```text
modules/notion/
├── api/              # Public API boundary — cross-module entry point only
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts (events, published-language)
├── infrastructure/   # Context-wide driven adapters, grouped by subdomain when needed
├── interfaces/       # Context-wide driving adapters, grouped by subdomain when needed
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── knowledge/             # Tier 1 — Active (KnowledgePage, ContentBlock)
    ├── authoring/             # Tier 1 — Active (Article, Category)
    ├── collaboration/         # Tier 1 — Active (Comment, Permission, Version)
    ├── database/              # Tier 1 — Active (Database, Record, View)
    ├── taxonomy/              # Tier 2 — Domain contracts (semantic classification)
    ├── relations/             # Tier 2 — Domain contracts (explicit semantic graph)
    ├── attachments/           # Tier 2 — Stub (file/media association)
    ├── publishing/            # Tier 3 — Stub (external delivery boundary)
    ├── knowledge-versioning/  # Tier 3 — Stub (global snapshot policy)
    ├── notes/                 # Premature — absorbed by KnowledgePage
    ├── templates/             # Premature — absorbed by authoring
    ├── automation/            # Premature — absorbed by database
    ├── knowledge-analytics/   # Premature — read model concern
    └── knowledge-integration/ # Premature — infrastructure adapter concern
```

> **Premature stubs** — `notes/`, `templates/`, `automation/`, `knowledge-analytics/`, `knowledge-integration/` 目錄存在但不建議擴充。見 [Premature Stubs](#premature-stubs) 段落。

## Subdomains

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex、版本查詢 | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證工作流程與分類目錄 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照（逐次編輯歷史） | Comment, Permission, Version |
| database | 結構化資料視圖（Table/Board/Calendar/Gallery/Form）、記錄、自動化 | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Domain Contracts — High Business Value)

| Subdomain | Purpose | Distinction |
|-----------|---------|------------|
| taxonomy | 跨頁面分類法與語義組織（全域標籤樹、主題分類） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容對內容的明確語義關聯（有類型、方向） | ≠ knowledge.BacklinkIndex（自動反向連結）；relations 是主動宣告的語義圖 |
| attachments | 附件與媒體關聯儲存（Storage 整合正典邊界） | 獨立於知識頁面內容模型。待附件需要獨立保留策略時充實 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式對外交付的 Publication 狀態邊界 | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| knowledge-versioning | 全域版本 checkpoint 策略（workspace-level, 保留政策） | ≠ collaboration.Version（per-edit 歷史）；是策略量，不是操作量 |

### Premature Stubs（目錄保留，不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |
| automation | database 子域已涵蓋 DatabaseAutomation；跨內容類型事件自動化目前無獨立領域需求 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |

## Subdomain Analysis

**14 個目錄（4 Active + 2 Domain Contracts + 1 Stub + 2 Medium-Term + 5 Premature），分析如下：**

- ✅ `knowledge` 與 `authoring` 分工正確：自由頁面（block-based wiki）vs. 結構化文章（KB article workflow）。
- ✅ `collaboration.Version`（逐次編輯快照）與 `knowledge-versioning`（全域 checkpoint 策略）是不同責任，分開正確。
- ✅ `knowledge.BacklinkIndex`（自動反向索引）與 `relations`（明確語義圖）不重疊。
- ✅ `taxonomy` 是全域語義組織核心，與 `authoring.Category`（局部文章分類）不重疊，維持 Tier 2。
- ✅ 5 個 premature stubs 有明確理由：每個都已被現有 active 子域或 infrastructure 層吸收。
- ⚠️ `knowledge-versioning` 需持續明確與 `collaboration.Version` 的分界，避免實作者混淆。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- `domain/` must not import infrastructure, interfaces, React, Firebase SDK, or any runtime framework.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notion/README.md)
- [Subdomains](../../docs/contexts/notion/subdomains.md)
- [Bounded Context](../../docs/contexts/notion/bounded-contexts.md)
- [Context Map](../../docs/contexts/notion/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notion/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/notion/subdomains/authoring/api/server.ts
````typescript
/**
 * authoring subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseArticleRepository } from "../../../infrastructure/authoring/firebase/FirebaseArticleRepository";
export { FirebaseCategoryRepository } from "../../../infrastructure/authoring/firebase/FirebaseCategoryRepository";
export { makeArticleRepo, makeCategoryRepo } from "../../../interfaces/authoring/composition/repositories";
export type { AuthoringUseCases } from "../../../interfaces/authoring/composition/use-cases";
export { makeAuthoringUseCases } from "../../../interfaces/authoring/composition/use-cases";
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
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
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
export { createComment, updateComment, resolveComment, deleteComment } from "../../../interfaces/collaboration/_actions/comment.actions";
export { createVersion, deleteVersion } from "../../../interfaces/collaboration/_actions/version.actions";
export { grantPermission, revokePermission } from "../../../interfaces/collaboration/_actions/permission.actions";

// Queries
export { getComments, getVersions, getPermissions, subscribeComments } from "../../../interfaces/collaboration/queries";

// UI components
export { CommentPanel } from "../../../interfaces/collaboration/components/CommentPanel";
export { VersionHistoryPanel } from "../../../interfaces/collaboration/components/VersionHistoryPanel";
````

## File: modules/notion/subdomains/collaboration/api/server.ts
````typescript
/**
 * collaboration subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseCommentRepository } from "../../../infrastructure/collaboration/firebase/FirebaseCommentRepository";
export { FirebasePermissionRepository } from "../../../infrastructure/collaboration/firebase/FirebasePermissionRepository";
export { FirebaseVersionRepository } from "../../../infrastructure/collaboration/firebase/FirebaseVersionRepository";
export { makeCommentRepo, makeVersionRepo, makePermissionRepo } from "../../../interfaces/collaboration/composition/repositories";
export type { CollaborationUseCases } from "../../../interfaces/collaboration/composition/use-cases";
export { makeCollaborationUseCases } from "../../../interfaces/collaboration/composition/use-cases";
````

## File: modules/notion/subdomains/collaboration/domain/events/CollaborationEvents.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/events
 * Purpose: Domain events for collaboration operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface CommentCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.comment_created";
  readonly payload: {
    readonly commentId: string;
    readonly pageId: string;
    readonly authorId: string;
    readonly organizationId: string;
  };
}

export interface CommentResolvedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.comment_resolved";
  readonly payload: {
    readonly commentId: string;
    readonly resolvedById: string;
    readonly organizationId: string;
  };
}

export interface PermissionGrantedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.permission_granted";
  readonly payload: {
    readonly permissionId: string;
    readonly resourceId: string;
    readonly granteeId: string;
    readonly level: string;
    readonly organizationId: string;
  };
}

export interface PermissionRevokedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.permission_revoked";
  readonly payload: {
    readonly permissionId: string;
    readonly resourceId: string;
    readonly granteeId: string;
    readonly organizationId: string;
  };
}

export interface VersionCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.version_created";
  readonly payload: {
    readonly versionId: string;
    readonly pageId: string;
    readonly authorId: string;
    readonly versionNumber: number;
    readonly organizationId: string;
  };
}

export interface VersionRestoredEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.version_restored";
  readonly payload: {
    readonly versionId: string;
    readonly pageId: string;
    readonly restoredById: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/collaboration/domain/events/index.ts
````typescript
export type {
  CommentCreatedEvent,
  CommentResolvedEvent,
  PermissionGrantedEvent,
  PermissionRevokedEvent,
  VersionCreatedEvent,
  VersionRestoredEvent,
} from "./CollaborationEvents";
````

## File: modules/notion/subdomains/collaboration/domain/services/index.ts
````typescript
/**
 * Domain services for the collaboration subdomain.
 * Deferred: PermissionResolutionService and VersionRetentionService
 * will be defined when permission and versioning use cases are scoped.
 */
export {};
````

## File: modules/notion/subdomains/collaboration/domain/value-objects/index.ts
````typescript
/**
 * Value objects for the collaboration subdomain.
 * Deferred: CommentId, PermissionId, VersionId, ContentId, PermissionLevel
 * will be defined when collaboration use cases are scoped.
 */
export {};
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
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/database/api/server.ts
````typescript
/**
 * database subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseDatabaseRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRepository";
export { FirebaseDatabaseRecordRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRecordRepository";
export { FirebaseViewRepository } from "../../../infrastructure/database/firebase/FirebaseViewRepository";
export { FirebaseAutomationRepository } from "../../../infrastructure/database/firebase/FirebaseAutomationRepository";
export { makeDatabaseRepo, makeRecordRepo, makeViewRepo, makeAutomationRepo } from "../../../interfaces/database/composition/repositories";
export type { DatabaseUseCases } from "../../../interfaces/database/composition/use-cases";
export { makeDatabaseUseCases } from "../../../interfaces/database/composition/use-cases";
````

## File: modules/notion/subdomains/database/domain/events/DatabaseEvents.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/events
 * Purpose: Domain events for database operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface DatabaseCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.database_created";
  readonly payload: {
    readonly databaseId: string;
    readonly accountId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}

export interface DatabaseRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.database.database_renamed";
  readonly payload: {
    readonly databaseId: string;
    readonly previousTitle: string;
    readonly newTitle: string;
    readonly organizationId: string;
  };
}

export interface FieldAddedEvent extends NotionDomainEvent {
  readonly type: "notion.database.field_added";
  readonly payload: {
    readonly databaseId: string;
    readonly fieldId: string;
    readonly fieldName: string;
    readonly fieldType: string;
    readonly organizationId: string;
  };
}

export interface FieldDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.database.field_deleted";
  readonly payload: {
    readonly databaseId: string;
    readonly fieldId: string;
    readonly organizationId: string;
  };
}

export interface RecordAddedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record_added";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}

export interface RecordUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record_updated";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}

export interface RecordDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record_deleted";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}

export interface ViewCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.view_created";
  readonly payload: {
    readonly databaseId: string;
    readonly viewId: string;
    readonly viewType: string;
    readonly organizationId: string;
  };
}

export interface ViewUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.view_updated";
  readonly payload: {
    readonly databaseId: string;
    readonly viewId: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/database/domain/events/index.ts
````typescript
export type {
  DatabaseCreatedEvent,
  DatabaseRenamedEvent,
  FieldAddedEvent,
  FieldDeletedEvent,
  RecordAddedEvent,
  RecordUpdatedEvent,
  RecordDeletedEvent,
  ViewCreatedEvent,
  ViewUpdatedEvent,
} from "./DatabaseEvents";
````

## File: modules/notion/subdomains/database/domain/services/index.ts
````typescript
/**
 * Domain services for the database subdomain.
 * Deferred: DatabaseQueryService, FormulaEvaluationService, RollupComputationService
 * will be defined when filter/sort/formula use cases are scoped.
 */
export {};
````

## File: modules/notion/subdomains/database/domain/value-objects/index.ts
````typescript
/**
 * Value objects for the database subdomain.
 * Deferred: DatabaseId, RecordId, ViewId, FieldId, FieldType, ViewType, FieldValue
 * will be defined when database record and view use cases are scoped.
 */
export {};
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
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/knowledge/api/server.ts
````typescript
/**
 * knowledge subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";
export { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
export { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
export { FirebaseBacklinkIndexRepository } from "../../../infrastructure/knowledge/firebase/FirebaseBacklinkIndexRepository";
export { makePageRepo, makeBlockRepo, makeCollectionRepo } from "../../../interfaces/knowledge/composition/repositories";
export type { KnowledgeUseCases } from "../../../interfaces/knowledge/composition/use-cases";
export { makeKnowledgeUseCases } from "../../../interfaces/knowledge/composition/use-cases";
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
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/relations/api/server.ts
````typescript
/**
 * relations subdomain - server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseRelationRepository } from "../../../infrastructure/relations/firebase/FirebaseRelationRepository";
export { makeRelationRepo } from "../../../interfaces/relations/composition/repositories";
export type { RelationUseCases } from "../../../interfaces/relations/composition/use-cases";
export { makeRelationUseCases } from "../../../interfaces/relations/composition/use-cases";
````

## File: modules/notion/subdomains/relations/application/dto/RelationDto.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: application/dto
 * Purpose: Input/output contracts for relation operations.
 */

export interface CreateRelationDto {
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
}

export interface RelationDto {
  readonly relationId: string;
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly direction: "forward" | "backward";
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
}
````

## File: modules/notion/subdomains/relations/application/index.ts
````typescript
export type { CreateRelationDto, RelationDto } from "./dto/RelationDto";
export {
  CreateRelationUseCase,
  RemoveRelationUseCase,
  ListRelationsBySourceUseCase,
  ListRelationsByTargetUseCase,
} from "./use-cases/RelationUseCases";
````

## File: modules/notion/subdomains/relations/application/use-cases/RelationUseCases.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: application/use-cases
 * Purpose: Use case orchestration for relation operations.
 */

import type { IRelationRepository } from "../../domain/repositories/IRelationRepository";
import type { Relation, CreateRelationInput } from "../../domain/entities/Relation";

export class CreateRelationUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(input: CreateRelationInput): Promise<Relation> {
    const now = new Date().toISOString();
    const relation: Relation = {
      relationId: crypto.randomUUID(),
      sourceArtifactId: input.sourceArtifactId,
      targetArtifactId: input.targetArtifactId,
      relationType: input.relationType,
      direction: "forward",
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      createdAtISO: now,
    };
    await this.relationRepo.save(relation);
    return relation;
  }
}

export class RemoveRelationUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(relationId: string): Promise<void> {
    await this.relationRepo.remove(relationId);
  }
}

export class ListRelationsBySourceUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(sourceArtifactId: string): Promise<readonly Relation[]> {
    return this.relationRepo.listBySource(sourceArtifactId);
  }
}

export class ListRelationsByTargetUseCase {
  constructor(private readonly relationRepo: IRelationRepository) {}

  async execute(targetArtifactId: string): Promise<readonly Relation[]> {
    return this.relationRepo.listByTarget(targetArtifactId);
  }
}
````

## File: modules/notion/subdomains/taxonomy/api/index.ts
````typescript
/**
 * Public API boundary for the taxonomy subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Recommended Gap Subdomain
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  TaxonomyNode,
  CreateTaxonomyNodeInput,
} from "../domain/entities/TaxonomyNode";

// ── Repository contracts ───────────────────────────────────────────────────────
export type {
  ITaxonomyRepository,
} from "../domain/repositories/ITaxonomyRepository";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  TaxonomyNodeCreatedEvent,
  TaxonomyNodeRemovedEvent,
} from "../domain/events/TaxonomyEvents";

// ── Application DTOs ──────────────────────────────────────────────────────────
export type {
  CreateTaxonomyNodeDto,
  TaxonomyNodeDto,
} from "../application/dto/TaxonomyDto";

// ── Use cases ─────────────────────────────────────────────────────────────────
export {
  CreateTaxonomyNodeUseCase,
  RemoveTaxonomyNodeUseCase,
  ListTaxonomyRootsUseCase,
  ListTaxonomyChildrenUseCase,
} from "../application/use-cases/TaxonomyUseCases";
````

## File: modules/notion/subdomains/taxonomy/api/server.ts
````typescript
/**
 * taxonomy subdomain - server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseTaxonomyRepository } from "../../../infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository";
export { makeTaxonomyRepo } from "../../../interfaces/taxonomy/composition/repositories";
export type { TaxonomyUseCases } from "../../../interfaces/taxonomy/composition/use-cases";
export { makeTaxonomyUseCases } from "../../../interfaces/taxonomy/composition/use-cases";
````

## File: modules/notion/subdomains/taxonomy/application/dto/TaxonomyDto.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: application/dto
 * Purpose: Input/output contracts for taxonomy operations.
 */

export interface CreateTaxonomyNodeDto {
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly organizationId: string;
  readonly workspaceId?: string;
}

export interface TaxonomyNodeDto {
  readonly nodeId: string;
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly path: readonly string[];
  readonly depth: number;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/notion/subdomains/taxonomy/application/index.ts
````typescript
export type { CreateTaxonomyNodeDto, TaxonomyNodeDto } from "./dto/TaxonomyDto";
export {
  CreateTaxonomyNodeUseCase,
  RemoveTaxonomyNodeUseCase,
  ListTaxonomyRootsUseCase,
  ListTaxonomyChildrenUseCase,
} from "./use-cases/TaxonomyUseCases";
````

## File: modules/notion/subdomains/taxonomy/application/use-cases/TaxonomyUseCases.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: application/use-cases
 * Purpose: Use case orchestration for taxonomy node operations.
 */

import type { ITaxonomyRepository } from "../../domain/repositories/ITaxonomyRepository";
import type { TaxonomyNode, CreateTaxonomyNodeInput } from "../../domain/entities/TaxonomyNode";

export class CreateTaxonomyNodeUseCase {
  constructor(private readonly taxonomyRepo: ITaxonomyRepository) {}

  async execute(input: CreateTaxonomyNodeInput): Promise<TaxonomyNode> {
    let parentPath: readonly string[] = [];
    let depth = 0;

    if (input.parentNodeId) {
      const parent = await this.taxonomyRepo.findById(input.parentNodeId);
      if (!parent) {
        throw new Error(`Parent node not found: ${input.parentNodeId}`);
      }
      parentPath = parent.path;
      depth = parent.depth + 1;
    }

    const now = new Date().toISOString();
    const nodeId = crypto.randomUUID();
    const node: TaxonomyNode = {
      nodeId,
      label: input.label.trim(),
      parentNodeId: input.parentNodeId,
      path: [...parentPath, nodeId],
      depth,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await this.taxonomyRepo.save(node);
    return node;
  }
}

export class RemoveTaxonomyNodeUseCase {
  constructor(private readonly taxonomyRepo: ITaxonomyRepository) {}

  async execute(nodeId: string): Promise<void> {
    const children = await this.taxonomyRepo.listChildren(nodeId);
    if (children.length > 0) {
      throw new Error("Cannot remove node with children. Remove children first.");
    }
    await this.taxonomyRepo.remove(nodeId);
  }
}

export class ListTaxonomyRootsUseCase {
  constructor(private readonly taxonomyRepo: ITaxonomyRepository) {}

  async execute(organizationId: string): Promise<readonly TaxonomyNode[]> {
    return this.taxonomyRepo.listRoots(organizationId);
  }
}

export class ListTaxonomyChildrenUseCase {
  constructor(private readonly taxonomyRepo: ITaxonomyRepository) {}

  async execute(parentNodeId: string): Promise<readonly TaxonomyNode[]> {
    return this.taxonomyRepo.listChildren(parentNodeId);
  }
}
````

## File: modules/notion/application/use-cases/index.ts
````typescript
export * as authoringUseCases from '../../subdomains/authoring/application/use-cases';
export * as collaborationUseCases from '../../subdomains/collaboration/application/use-cases';
export * as databaseUseCases from '../../subdomains/database/application/use-cases';
export * as knowledgeUseCases from '../../subdomains/knowledge/application/use-cases';

// relations/taxonomy are still placeholder-only at the application layer.
````

## File: modules/notion/interfaces/authoring/_actions/article.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Article Server Actions — thin adapter over article use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeArticleRepo } from "../composition/repositories";
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
} from "../../../subdomains/authoring/application/use-cases/ArticleLifecycleUseCases";
import { PublishArticleUseCase } from "../../../subdomains/authoring/application/use-cases/ArticlePublicationUseCases";
import {
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
} from "../../../subdomains/authoring/application/use-cases/ArticleVerificationUseCases";
import type { z } from "@lib-zod";
import type {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  DeleteArticleSchema,
} from "../../../subdomains/authoring/application/dto/ArticleDto";

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

## File: modules/notion/interfaces/authoring/_actions/category.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Category Server Actions — thin adapter over category use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCategoryRepo } from "../composition/repositories";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../../subdomains/authoring/application/use-cases/CategoryUseCases";
import type { z } from "@lib-zod";
import type {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../../../subdomains/authoring/application/dto/CategoryDto";

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

## File: modules/notion/interfaces/authoring/queries/index.ts
````typescript
// TODO: export getArticle, getArticlesByWorkspace, getCategoryTree

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/queries
 * Purpose: Direct-instantiation query functions (read-side).
 */

import { makeArticleRepo, makeCategoryRepo } from "../composition/repositories";
import type { ArticleSnapshot, ArticleStatus } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";

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

## File: modules/notion/interfaces/collaboration/_actions/comment.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Comment aggregate server actions — create, update, resolve, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { dispatchNotification } from "@/modules/platform/api";
import { makeCommentRepo } from "../composition/repositories";
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
} from "../../../subdomains/collaboration/application/use-cases/CommentUseCases";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  ResolveCommentDto,
  DeleteCommentDto,
} from "../../../subdomains/collaboration/application/dto/CollaborationDto";

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

## File: modules/notion/interfaces/collaboration/_actions/permission.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Permission aggregate server actions — grant, revoke.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makePermissionRepo } from "../composition/repositories";
import { GrantPermissionUseCase, RevokePermissionUseCase } from "../../../subdomains/collaboration/application/use-cases/PermissionUseCases";
import type { GrantPermissionDto, RevokePermissionDto } from "../../../subdomains/collaboration/application/dto/CollaborationDto";

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

## File: modules/notion/interfaces/collaboration/_actions/version.actions.ts
````typescript
"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Version aggregate server actions — create, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeVersionRepo } from "../composition/repositories";
import { CreateVersionUseCase, DeleteVersionUseCase } from "../../../subdomains/collaboration/application/use-cases/VersionUseCases";
import type { CreateVersionDto, DeleteVersionDto } from "../../../subdomains/collaboration/application/dto/CollaborationDto";

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

## File: modules/notion/interfaces/collaboration/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/queries
 * Purpose: Read-side queries for comment, version, and permission data.
 */

import { makeCommentRepo, makePermissionRepo, makeVersionRepo } from "../composition/repositories";
import type { CommentSnapshot, CommentUnsubscribe, VersionSnapshot, PermissionSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";

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

## File: modules/notion/interfaces/database/_actions/database.actions.ts
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
} from "../composition/repositories";
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
} from "../../../subdomains/database/application/use-cases";
import type { CreateAutomationInput, UpdateAutomationInput } from "../../../subdomains/database/application/dto/database.dto";
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
} from "../../../subdomains/database/application/dto/DatabaseDto";

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

## File: modules/notion/interfaces/database/components/DatabaseTablePanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseTablePanel ??spreadsheet-style table with inline cell editing.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries";
import { createRecord, updateRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseTablePanelProps {
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

export function DatabaseTablePanel({ database, accountId, workspaceId, currentUserId }: DatabaseTablePanelProps) {
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
        No fields yet. Add at least one field to start entering records.
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
                  No records
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
        <Plus className="mr-1.5 h-3 w-3" /> Add record
      </Button>
    </div>
  );
}
````

## File: modules/notion/interfaces/database/components/index.ts
````typescript
export { DatabaseDialog } from "./DatabaseDialog";
export { DatabaseTablePanel } from "./DatabaseTablePanel";
export { DatabaseBoardPanel } from "./DatabaseBoardPanel";
export { DatabaseListPanel } from "./DatabaseListPanel";
export { DatabaseCalendarPanel } from "./DatabaseCalendarPanel";
export { DatabaseGalleryPanel } from "./DatabaseGalleryPanel";
export { DatabaseFormPanel } from "./DatabaseFormPanel";
export { DatabaseAutomationPanel } from "./DatabaseAutomationPanel";
````

## File: modules/notion/interfaces/database/components/KnowledgeDatabasesPanel.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Table2 } from "lucide-react";

import { useAuth } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { DatabaseSnapshot as Database } from "../../../subdomains/database/application/dto/database.dto";
import { getDatabases } from "../queries";
import { DatabaseDialog } from "./DatabaseDialog";

/**
 * KnowledgeDatabasesPanel
 * Route-level screen component for /knowledge-database/databases.
 * Encapsulates data-loading and layout so the Next.js route file stays thin.
 */
export interface KnowledgeDatabasesPanelProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly currentUserId?: string | null;
}

export function KnowledgeDatabasesPanel({
  accountId,
  workspaceId,
  currentUserId,
}: KnowledgeDatabasesPanelProps) {
  const router = useRouter();
  const { state: authState } = useAuth();

  const resolvedAccountId = accountId.trim();
  const resolvedWorkspaceId = workspaceId.trim();
  const resolvedCurrentUserId = (currentUserId?.trim() || authState.user?.id) ?? "";
  const workspaceBasePath =
    resolvedAccountId && resolvedWorkspaceId
      ? `/${encodeURIComponent(resolvedAccountId)}/${encodeURIComponent(resolvedWorkspaceId)}`
      : resolvedAccountId
        ? `/${encodeURIComponent(resolvedAccountId)}`
        : "/";
  const overviewHref = resolvedWorkspaceId
    ? `${workspaceBasePath}?tab=Overview&panel=knowledge-databases`
    : resolvedAccountId
      ? `/${encodeURIComponent(resolvedAccountId)}`
      : "/";

  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    if (!resolvedAccountId || !resolvedWorkspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getDatabases(resolvedAccountId, resolvedWorkspaceId);
      setDatabases(data);
    } finally {
      setLoading(false);
    }
  }, [resolvedAccountId, resolvedWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  function handleSuccess(databaseId?: string) {
    if (databaseId) {
      if (resolvedAccountId && resolvedWorkspaceId) {
        router.push(
          `${workspaceBasePath}/knowledge-database/databases/${encodeURIComponent(databaseId)}`,
        );
      } else {
        router.push(resolvedAccountId ? `/${encodeURIComponent(resolvedAccountId)}` : "/");
      }
    } else {
      load();
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Database</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Databases</h1>
        <p className="text-sm text-muted-foreground">
          Manage structured knowledge collections for your workspace.
        </p>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(overviewHref)}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Back to Knowledge Hub
        </button>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!resolvedAccountId || !resolvedWorkspaceId}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Database
        </Button>
      </div>

      <DatabaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={resolvedAccountId}
        workspaceId={resolvedWorkspaceId}
        currentUserId={resolvedCurrentUserId}
        onSuccess={handleSuccess}
      />

      {!resolvedAccountId || !resolvedWorkspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          Account and workspace are required to load databases.
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
          <p className="text-sm text-muted-foreground">No databases yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {databases.map((db) => (
            <Card
              key={db.id}
              className="cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => handleSuccess(db.id)}
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
                  <span>{db.fields.length} fields</span>
                  <span>繚</span>
                  <span>{db.viewIds.length} views</span>
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

## File: modules/notion/interfaces/database/queries/index.ts
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
} from "../composition/repositories";
import type { DatabaseSnapshot, DatabaseRecordSnapshot, ViewSnapshot, DatabaseAutomationSnapshot } from "../../../subdomains/database/application/dto/database.dto";

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

## File: modules/notion/interfaces/knowledge/_actions/knowledge-block.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeBlockRepo } from "../composition/repositories";
import {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
} from "../../../subdomains/knowledge/application/queries/content-block.queries";
import type { AddKnowledgeBlockDto as AddContentBlockDto, UpdateKnowledgeBlockDto as UpdateContentBlockDto, DeleteKnowledgeBlockDto as DeleteContentBlockDto } from "../../../subdomains/knowledge/application/dto/ContentBlockDto";

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

## File: modules/notion/interfaces/knowledge/_actions/knowledge-collection.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCollectionRepo } from "../composition/repositories";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgeCollectionUseCases";
import type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgeCollectionDto";

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

## File: modules/notion/interfaces/knowledge/_actions/knowledge-page.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { IEventStoreRepository, IEventBusRepository } from "@shared-events";
import { makePageRepo } from "../composition/repositories";
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgePageUseCases";
import {
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgePageReviewUseCases";
import {
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgePageAppearanceUseCases";
import { PublishKnowledgeVersionUseCase } from "../../../subdomains/knowledge/application/queries/knowledge-version.queries";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgePageDto";
import type { VerifyKnowledgePageDto, RequestPageReviewDto, AssignPageOwnerDto, UpdatePageIconDto, UpdatePageCoverDto } from "../../../subdomains/knowledge/application/dto/KnowledgePageLifecycleDto";

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

## File: modules/notion/interfaces/knowledge/components/BlockEditorPanel.tsx
````typescript
"use client";

import { useRef } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { richTextToPlainText } from "../../../subdomains/knowledge/application/dto/knowledge.dto";

/**
 * Notion knowledge subdomain ??minimal block editor.
 * Full drag-and-drop and rich block types are in the extensions/ layer.
 */
export function BlockEditorPanel() {
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
          aria-label="Add block"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[32px] w-full rounded px-2 py-1 text-sm outline-none focus:bg-muted/30"
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addBlock(null); }
          }}
          data-placeholder="Type '/' for commands"
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
            aria-label={`?憛?${block.id}`}
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

## File: modules/notion/interfaces/knowledge/components/PageTreePanel.tsx
````typescript
"use client";

import { ChevronDown, ChevronRight, FilePlus, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { KnowledgePageTreeNode } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { PageDialog } from "./PageDialog";

export interface PageTreePanelProps {
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

export function PageTreePanel({ nodes, accountId, workspaceId, currentUserId, allowCreate = true, emptyStateDescription, onPageClick, onCreated }: PageTreePanelProps) {
  const [createOpen, setCreateOpen] = useState(false);
  if (!nodes.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
        <FileText className="h-8 w-8 opacity-40" />
        <p>{emptyStateDescription ?? "No pages yet"}</p>
        {allowCreate && workspaceId && (
          <>
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>Create page</Button>
            <PageDialog open={createOpen} onOpenChange={setCreateOpen} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} parentPageId={null} onSuccess={onCreated} />
          </>
        )}
      </div>
    );
  }
  return <ul className="space-y-0.5">{nodes.map((n) => <TreeNode key={n.id} node={n} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} allowCreate={allowCreate} onPageClick={onPageClick} onCreated={onCreated} depth={0} />)}</ul>;
}
````

## File: modules/notion/interfaces/knowledge/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side read helpers for the knowledge subdomain.
 */

import { makeBlockRepo, makeCollectionRepo, makePageRepo } from "../composition/repositories";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../../../subdomains/knowledge/application/queries/knowledge-page.queries";
import { ListContentBlocksUseCase } from "../../../subdomains/knowledge/application/queries/content-block.queries";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsUseCase,
} from "../../../subdomains/knowledge/application/queries/knowledge-collection.queries";
import type { KnowledgePageSnapshot, ContentBlockSnapshot, KnowledgeCollectionSnapshot } from "../../../subdomains/knowledge/application/dto/knowledge.dto";

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

## File: modules/notion/subdomains/knowledge/application/use-cases/index.ts
````typescript
export {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "./KnowledgePageUseCases";

export {
  VerifyKnowledgePageUseCase,
  ApproveKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "./KnowledgePageReviewUseCases";

export {
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "./KnowledgePageAppearanceUseCases";

export {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "./KnowledgeCollectionUseCases";
````

## File: modules/notion/subdomains/relations/api/index.ts
````typescript
/**
 * Public API boundary for the relations subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Recommended Gap Subdomain
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  RelationDirection,
  Relation,
  CreateRelationInput,
} from "../domain/entities/Relation";

// ── Repository contracts ───────────────────────────────────────────────────────
export type {
  IRelationRepository,
} from "../domain/repositories/IRelationRepository";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  RelationCreatedEvent,
  RelationRemovedEvent,
} from "../domain/events/RelationEvents";

// ── Application DTOs ──────────────────────────────────────────────────────────
export type {
  CreateRelationDto,
  RelationDto,
} from "../application/dto/RelationDto";

// ── Application contracts ─────────────────────────────────────────────────────
export * from "../application";

// Note: server-only composition and infrastructure adapters are exported from
// `./server` to keep the default boundary runtime-safe.
````

## File: modules/notion/subdomains/relations/README.md
````markdown
# Relations

建立內容之間關聯與 backlink 的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Active — domain + application + infrastructure adapter + composition wired

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/subdomains/taxonomy/README.md
````markdown
# Taxonomy

建立分類法與語義組織的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Active — domain + application + infrastructure adapter + composition wired

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notion/interfaces/database/components/DatabaseAutomationPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: Manage automation rules for a database ??list/create/toggle/delete.
 */

import { useEffect, useState, useTransition } from "react";
import type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType } from "../../../subdomains/database/application/dto/database.dto";
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

export function DatabaseAutomationPanel({ databaseId, accountId, currentUserId }: Props) {
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

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading automations...</div>;

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
                  Trigger: {a.trigger} | Action: {a.actions[0]?.type ?? "N/A"}
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

## File: modules/notion/interfaces/database/components/DatabaseBoardPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseBoardPanel ??Kanban board grouped by first select/multi_select field.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseBoardPanelProps {
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

export function DatabaseBoardPanel({ database, accountId, workspaceId, currentUserId }: DatabaseBoardPanelProps) {
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
    return String(getProperty(record, textField.id) ?? "Untitled");
  }

  const groups: Record<string, DatabaseRecordSnapshot[]> = {};
  if (!groupField) {
    groups["No Group"] = records;
  } else {
    for (const record of records) {
      const val = getProperty(record, groupField.id);
      const key = val != null && val !== "" ? String(val) : "No Group";
      (groups[key] ??= []).push(record);
    }
    if ("No Group" in groups) {
      const noGroup = groups["No Group"];
      delete groups["No Group"];
      groups["No Group"] = noGroup;
    }
  }

  function handleAdd(groupValue: string) {
    startTransition(async () => {
      const props: Record<string, unknown> = groupField && groupValue !== "No Group"
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
            <Plus className="mr-1 h-3 w-3" /> Add record
          </Button>
        </div>
      ))}
    </div>
  );
}
````

## File: modules/notion/interfaces/database/components/DatabaseCalendarPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseCalendarPanel ??month-grid calendar grouped by a date field.
 */

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseCalendarPanelProps {
  database: DatabaseSnapshot;
  accountId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

export function DatabaseCalendarPanel({ database, accountId }: DatabaseCalendarPanelProps) {
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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!dateField) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        Please configure a date field before using calendar view.
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
          {year}撟?{month + 1}??
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
                    const title = titleField ? String(getProperty(record, titleField.id) ?? "") || "Untitled" : "Untitled";
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

## File: modules/notion/interfaces/database/components/DatabaseFormPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseFormPanel ??public-facing form to collect one Record into a Database.
 */

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { createRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseFormPanelProps {
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

export function DatabaseFormPanel({ database, accountId, workspaceId, submitterId, fieldIds, title, description }: DatabaseFormPanelProps) {
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
        setError("Failed to submit form.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <h2 className="text-lg font-semibold">Submitted successfully</h2>
        <p className="text-sm text-muted-foreground">Your response has been recorded.</p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Submit another response
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
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
````

## File: modules/notion/interfaces/database/components/DatabaseGalleryPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseGalleryPanel ??card grid for database records.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseGalleryPanelProps {
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

export function DatabaseGalleryPanel({ database, accountId, workspaceId, currentUserId }: DatabaseGalleryPanelProps) {
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
          <p className="col-span-full rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">No records</p>
        ) : (
          records.map((record) => {
            const title = titleField ? String(getProperty(record, titleField.id) ?? "") || "Untitled" : "Untitled";
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
        <Plus className="mr-1.5 h-3 w-3" /> Add record
      </Button>
    </div>
  );
}
````

## File: modules/notion/interfaces/authoring/components/KnowledgeBaseArticlesPanel.tsx
````typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, CircleDot, FileClock, Plus } from "lucide-react";

import { useAuth } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { ArticleSnapshot as Article, ArticleStatus, ArticleVerificationState as VerificationState } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
import { getArticles, getCategories } from "../queries";
import { ArticleDialog } from "./ArticleDialog";
import { CategoryTreePanel } from "./CategoryTreePanel";

const STATUS_CONFIG: Record<ArticleStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  archived: { label: "Archived", variant: "secondary" },
};

const VERIFICATION_CONFIG: Record<VerificationState, { label: string; icon: React.ElementType }> = {
  verified: { label: "Verified", icon: BadgeCheck },
  needs_review: { label: "Needs Review", icon: FileClock },
  unverified: { label: "Unverified", icon: CircleDot },
};

/**
 * KnowledgeBaseArticlesPanel
 * Route-level screen component for /knowledge-base/articles.
 * Encapsulates data-loading, filtering and layout so the Next.js route
 * file stays thin (params/context wiring only).
 */
export interface KnowledgeBaseArticlesPanelProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly currentUserId?: string | null;
}

export function KnowledgeBaseArticlesPanel({
  accountId,
  workspaceId,
  currentUserId,
}: KnowledgeBaseArticlesPanelProps) {
  const router = useRouter();
  const { state: authState } = useAuth();

  const resolvedAccountId = accountId.trim();
  const resolvedWorkspaceId = workspaceId.trim();
  const resolvedCurrentUserId = (currentUserId?.trim() || authState.user?.id) ?? "";
  const workspaceBasePath =
    resolvedAccountId && resolvedWorkspaceId
      ? `/${encodeURIComponent(resolvedAccountId)}/${encodeURIComponent(resolvedWorkspaceId)}`
      : resolvedAccountId
        ? `/${encodeURIComponent(resolvedAccountId)}`
        : "/";
  const overviewHref = resolvedWorkspaceId
    ? `${workspaceBasePath}?tab=Overview&panel=knowledge-base-articles`
    : resolvedAccountId
      ? `/${encodeURIComponent(resolvedAccountId)}`
      : "/";

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!resolvedAccountId || !resolvedWorkspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [arts, cats] = await Promise.all([
        getArticles({ accountId: resolvedAccountId, workspaceId: resolvedWorkspaceId }),
        getCategories(resolvedAccountId, resolvedWorkspaceId),
      ]);
      setArticles(arts);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }, [resolvedAccountId, resolvedWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    const cat = categories.find((c) => c.id === selectedCategoryId);
    if (!cat) return articles;
    return articles.filter((a) => cat.articleIds.includes(a.id));
  }, [articles, categories, selectedCategoryId]);

  function handleSuccess(articleId?: string) {
    if (articleId) {
      if (resolvedAccountId && resolvedWorkspaceId) {
        router.push(
          `${workspaceBasePath}/knowledge-base/articles/${encodeURIComponent(articleId)}`,
        );
      } else {
        router.push(`/knowledge-base/articles/${encodeURIComponent(articleId)}`);
      }
    } else {
      load();
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Base</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Articles</h1>
        <p className="text-sm text-muted-foreground">
          Manage articles, SOPs, and operational documentation.
        </p>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(overviewHref)}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Back to Knowledge Hub
        </button>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!resolvedAccountId || !resolvedWorkspaceId}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Article
        </Button>
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={resolvedAccountId}
        workspaceId={resolvedWorkspaceId}
        currentUserId={resolvedCurrentUserId}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {!resolvedAccountId || !resolvedWorkspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          Account and workspace are required to load articles.
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
                  {selectedCategoryId ? "No articles in this category yet." : "No articles yet. Create your first article."}
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
                      onClick={() => handleSuccess(article.id)}
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
                          v{article.version} 繚 {new Date(article.updatedAtISO).toLocaleDateString("zh-TW")}
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

## File: modules/notion/interfaces/database/components/DatabaseFormsPanel.tsx
````typescript
"use client";

/**
 * Route: /knowledge-database/databases/[databaseId]/forms
 * Purpose: Manage database forms ??create and embed form links for a specific database.
 */

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";

import { getDatabase } from "../queries";
import { DatabaseFormPanel } from "./DatabaseFormPanel";
import type { DatabaseSnapshot as Database } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";

// ?? Props ?????????????????????????????????????????????????????????????????????

export interface DatabaseFormsPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ?? Component ?????????????????????????????????????????????????????????????????

export function DatabaseFormsPanel({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseFormsPanelProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "share">("preview");
  const databaseDetailHref =
    accountId && workspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/knowledge-database/databases/${encodeURIComponent(databaseId)}`
      : `/knowledge-database/databases/${encodeURIComponent(databaseId)}`;

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
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <p className="text-sm text-muted-foreground">Database not found.</p>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(databaseDetailHref)}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to database
        </Button>
        <div className="ml-auto">
          <Button size="sm" variant="outline" disabled>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Form builder coming soon
          </Button>
        </div>
      </div>

      <header className="space-y-1 border-b border-border/60 pb-4">
        <h1 className="text-xl font-semibold">{database.name} Forms</h1>
        <p className="text-sm text-muted-foreground">
          Preview and share forms for collecting structured input.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "share")}>
        <TabsList>
          <TabsTrigger value="preview">Preview form</TabsTrigger>
          <TabsTrigger value="share">Share link</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card px-6 py-2">
            <DatabaseFormPanel
              database={database}
              accountId={accountId}
              workspaceId={workspaceId}
              submitterId={currentUserId}
              title={`${database.name} Form`}
              description={database.description ?? undefined}
            />
          </div>
        </TabsContent>

        <TabsContent value="share" className="mt-4">
          <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Form URL</p>
              <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span className="flex-1 truncate">{shareUrl}</span>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(shareUrl)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title="Copy URL"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this URL with users who need to submit records.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
````

## File: modules/notion/interfaces/knowledge/components/KnowledgePagesPanel.tsx
````typescript
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { KnowledgePageTreeNode } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { getKnowledgePageTree, getKnowledgePageTreeByWorkspace } from "../queries";
import { PageTreePanel } from "./PageTreePanel";

/**
 * KnowledgePagesPanel
 * Route-level screen component for /knowledge/pages.
 * Encapsulates data-loading, scope resolution and layout so that the
 * Next.js route file stays thin (params/context wiring only).
 */
export interface KnowledgePagesPanelProps {
  readonly accountId: string;
  readonly workspaceId?: string | null;
  readonly currentUserId?: string | null;
  readonly scope?: "workspace" | "account";
}

export function KnowledgePagesPanel({
  accountId,
  workspaceId,
  currentUserId,
  scope,
}: KnowledgePagesPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: authState } = useAuth();

  const resolvedAccountId = accountId.trim();
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const scopeParam = scope ?? searchParams.get("scope")?.trim() ?? "";
  const isAccountSummary = scopeParam === "account";
  const resolvedWorkspaceId = isAccountSummary ? "" : workspaceId?.trim() || requestedWorkspaceId || "";
  const resolvedCurrentUserId = (currentUserId?.trim() || authState.user?.id) ?? "";
  const workspaceBasePath =
    resolvedAccountId && resolvedWorkspaceId
      ? `/${encodeURIComponent(resolvedAccountId)}/${encodeURIComponent(resolvedWorkspaceId)}`
      : resolvedAccountId
        ? `/${encodeURIComponent(resolvedAccountId)}`
        : "/";
  const overviewHref = resolvedWorkspaceId
    ? `${workspaceBasePath}?tab=Overview&panel=knowledge-pages`
    : resolvedAccountId
      ? `/${encodeURIComponent(resolvedAccountId)}`
      : "/";

  function buildPageDetailHref(pageId: string) {
    if (resolvedAccountId && resolvedWorkspaceId) {
      return `${workspaceBasePath}/knowledge/pages/${encodeURIComponent(pageId)}`;
    }
    return `/knowledge/pages/${encodeURIComponent(pageId)}${
      resolvedWorkspaceId ? `?workspaceId=${encodeURIComponent(resolvedWorkspaceId)}` : ""
    }`;
  }

  const [nodes, setNodes] = useState<KnowledgePageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!resolvedAccountId) {
      setLoading(false);
      return;
    }
    if (!isAccountSummary && !resolvedWorkspaceId) {
      setNodes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const tree = isAccountSummary
        ? await getKnowledgePageTree(resolvedAccountId)
        : await getKnowledgePageTreeByWorkspace(resolvedAccountId, resolvedWorkspaceId);
      setNodes(tree);
    } finally {
      setLoading(false);
    }
  }, [resolvedAccountId, isAccountSummary, resolvedWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pages</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isAccountSummary ? "secondary" : "outline"}>
            {isAccountSummary ? "Account Summary" : "Workspace Scope"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {isAccountSummary
              ? "Account summary mode: showing account-level pages and metadata."
              : "Workspace scope mode: showing pages for the selected workspace."}
          </p>
        </div>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(overviewHref)}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Back to Knowledge Hub
        </button>
      </div>

      {!resolvedAccountId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          Account is required to load pages.
        </p>
      ) : !isAccountSummary && !resolvedWorkspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          Workspace ID is required when viewing workspace-scoped pages.
        </p>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <PageTreePanel
          nodes={nodes}
          accountId={resolvedAccountId}
          workspaceId={resolvedWorkspaceId || undefined}
          currentUserId={resolvedCurrentUserId}
          allowCreate={!isAccountSummary && Boolean(resolvedWorkspaceId)}
          emptyStateDescription={
            isAccountSummary
              ? "No pages in account summary yet."
              : "No pages in this workspace yet."
          }
          onPageClick={(pageId) => router.push(buildPageDetailHref(pageId))}
          onCreated={() => load()}
        />
      )}
    </div>
  );
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

// ??? Read contracts ????????????????????????????????????????????????????????????
export type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../domain/aggregates/Article";
export type { CategorySnapshot } from "../domain/aggregates/Category";

// ??? Identifiers used by other BCs ????????????????????????????????????????????
export type ArticleId = string;
export type CategoryId = string;

// ??? Server Actions (write-side) ??????????????????????????????????????????????
export {
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
  deleteArticle,
} from "../../../interfaces/authoring/_actions/article.actions";

export {
  createCategory,
  renameCategory,
  moveCategory,
  deleteCategory,
} from "../../../interfaces/authoring/_actions/category.actions";

// ??? Queries (read-side) ??????????????????????????????????????????????????????
export { getArticles, getArticle, getCategories, getBacklinks } from "../../../interfaces/authoring/queries";

// ??? UI Components ????????????????????????????????????????????????????????????
export { ArticleDialog } from "../../../interfaces/authoring/components/ArticleDialog";
export { KnowledgeBaseArticlesPanel } from "../../../interfaces/authoring/components/KnowledgeBaseArticlesPanel";
export type { KnowledgeBaseArticlesPanelProps } from "../../../interfaces/authoring/components/KnowledgeBaseArticlesPanel";
export { ArticleDetailPanel } from "../../../interfaces/authoring/components/ArticleDetailPanel";
export type { ArticleDetailPanelProps } from "../../../interfaces/authoring/components/ArticleDetailPanel";
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
 *   - getDatabaseById  ??consumed by knowledge subdomain (opaque reference resolution)
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
} from "../../../interfaces/database/_actions/database.actions";

// Queries
export {
  getDatabases,
  getDatabase,
  getRecords,
  getViews,
  getAutomations,
} from "../../../interfaces/database/queries";

// UI components
export { DatabaseDialog } from "../../../interfaces/database/components/DatabaseDialog";
export { DatabaseTablePanel } from "../../../interfaces/database/components/DatabaseTablePanel";
export { DatabaseBoardPanel } from "../../../interfaces/database/components/DatabaseBoardPanel";
export { DatabaseListPanel } from "../../../interfaces/database/components/DatabaseListPanel";
export { DatabaseCalendarPanel } from "../../../interfaces/database/components/DatabaseCalendarPanel";
export { DatabaseGalleryPanel } from "../../../interfaces/database/components/DatabaseGalleryPanel";
export { DatabaseFormPanel } from "../../../interfaces/database/components/DatabaseFormPanel";
export { DatabaseAutomationPanel } from "../../../interfaces/database/components/DatabaseAutomationPanel";
export { KnowledgeDatabasesPanel } from "../../../interfaces/database/components/KnowledgeDatabasesPanel";
export type { KnowledgeDatabasesPanelProps } from "../../../interfaces/database/components/KnowledgeDatabasesPanel";
export { AddFieldDialog, FIELD_TYPES } from "../../../interfaces/database/components/DatabaseAddFieldDialog";
export { DatabaseDetailPanel } from "../../../interfaces/database/components/DatabaseDetailPanel";
export type { DatabaseDetailPanelProps } from "../../../interfaces/database/components/DatabaseDetailPanel";
export { DatabaseFormsPanel } from "../../../interfaces/database/components/DatabaseFormsPanel";
export type { DatabaseFormsPanelProps } from "../../../interfaces/database/components/DatabaseFormsPanel";
````

## File: modules/notion/subdomains/knowledge/api/index.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// ?? Types (read-only snapshots ??no aggregate class refs) ?????????????????????
export type { KnowledgePageSnapshot } from "../domain/aggregates/KnowledgePage";
/** @alias KnowledgePageSnapshot ??provided for backward-compatibility */
export type { KnowledgePageSnapshot as KnowledgePage } from "../domain/aggregates/KnowledgePage";
export type { ContentBlockSnapshot } from "../domain/aggregates/ContentBlock";
export type { KnowledgeCollectionSnapshot } from "../domain/aggregates/KnowledgeCollection";

// ?? Server action DTOs ????????????????????????????????????????????????????????
export type { CreateKnowledgePageDto, RenameKnowledgePageDto, MoveKnowledgePageDto, ArchiveKnowledgePageDto, ReorderKnowledgePageBlocksDto } from "../application/dto/KnowledgePageDto";
export type { AddKnowledgeBlockDto, UpdateKnowledgeBlockDto, DeleteKnowledgeBlockDto } from "../application/dto/ContentBlockDto";
export type { CreateKnowledgeCollectionDto } from "../application/dto/KnowledgeCollectionDto";

// ?? Query functions (server-side reads) ???????????????????????????????????????
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePagesByWorkspace,
  getKnowledgePageTree,
  getKnowledgePageTreeByWorkspace,
  getKnowledgeBlocks,
  getKnowledgeCollection,
  getKnowledgeCollections,
} from "../../../interfaces/knowledge/queries";

// ?? Server actions (drives: app router, Server Components) ????????????????????
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
} from "../../../interfaces/knowledge/_actions";

// ?? UI Components ?????????????????????????????????????????????????????????????
export { PageTreePanel } from "../../../interfaces/knowledge/components/PageTreePanel";
export type { PageTreePanelProps } from "../../../interfaces/knowledge/components/PageTreePanel";
export { PageDialog } from "../../../interfaces/knowledge/components/PageDialog";
export { BlockEditorPanel } from "../../../interfaces/knowledge/components/BlockEditorPanel";
export { PageEditorPanel } from "../../../interfaces/knowledge/components/PageEditorPanel";
export type { PageEditorPanelProps } from "../../../interfaces/knowledge/components/PageEditorPanel";
export { KnowledgePagesPanel } from "../../../interfaces/knowledge/components/KnowledgePagesPanel";
export type { KnowledgePagesPanelProps } from "../../../interfaces/knowledge/components/KnowledgePagesPanel";

// ?? Store ?????????????????????????????????????????????????????????????????????
export { useBlockEditorStore } from "../../../interfaces/knowledge/store/block-editor.store";
export type { EditorBlock } from "../../../interfaces/knowledge/store/block-editor.store";

// ?? Tree node type (needed by app/ pages) ?????????????????????????????????????
export type { KnowledgePageTreeNode } from "../domain/aggregates/KnowledgePage";

// ?? Domain events (published language ??for cross-module event subscriptions) ?
export type { PageApprovedEvent, PageApprovedPayload, ExtractedTask, ExtractedInvoice } from "../domain/events/KnowledgePageEvents";

// ?? Sidebar component ?????????????????????????????????????????????????????????
export { KnowledgeSidebarSection } from "../../../interfaces/knowledge/components/KnowledgeSidebarSection";

// ?? Page header widgets ???????????????????????????????????????????????????????
export { TitleEditor, IconPicker, CoverEditor } from "../../../interfaces/knowledge/components/KnowledgePageHeaderWidgets";
export type { TitleEditorProps, IconPickerProps, CoverEditorProps } from "../../../interfaces/knowledge/components/KnowledgePageHeaderWidgets";

// ?? Route screen components ???????????????????????????????????????????????????
export { KnowledgeDetailPanel } from "../../../interfaces/knowledge/components/KnowledgeDetailPanel";
export type { KnowledgeDetailPanelProps } from "../../../interfaces/knowledge/components/KnowledgeDetailPanel";
````

## File: modules/notion/interfaces/database/components/DatabaseListPanel.tsx
````typescript
"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseListPanel ??flat record list with fields as readable rows.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";

interface DatabaseListPanelProps {
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
  if (type === "checkbox") return val ? "Yes" : "No";
  return String(val);
}

export function DatabaseListPanel({ database, accountId, workspaceId, currentUserId }: DatabaseListPanelProps) {
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
        <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">No records</p>
      ) : (
        records.map((record) => {
          const isOpen = expanded.has(record.id);
          const title = titleField
            ? displayValue(getProperty(record, titleField.id), titleField.type) || "Untitled"
            : record.id.slice(0, 8);

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
                        {field.name}: {val.length > 12 ? `${val.slice(0, 12)}...` : val}
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
                          <dd className="text-foreground">{val || <span className="text-muted-foreground/50">N/A</span>}</dd>
                        </div>
                      );
                    })}
                    <div className="contents">
                      <dt className="text-muted-foreground">Created at</dt>
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
        <Plus className="mr-1.5 h-3 w-3" /> Add record
      </Button>
    </div>
  );
}
````

## File: modules/notion/interfaces/database/components/DatabaseDetailPanel.tsx
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
import { DatabaseTablePanel } from "./DatabaseTablePanel";
import { DatabaseBoardPanel } from "./DatabaseBoardPanel";
import { DatabaseListPanel } from "./DatabaseListPanel";
import { DatabaseCalendarPanel } from "./DatabaseCalendarPanel";
import { DatabaseGalleryPanel } from "./DatabaseGalleryPanel";
import { DatabaseAutomationPanel } from "./DatabaseAutomationPanel";
import { AddFieldDialog } from "./DatabaseAddFieldDialog";
import type { DatabaseSnapshot as Database, FieldType } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// ?? Props ?????????????????????????????????????????????????????????????????????

export interface DatabaseDetailPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ?? Component ?????????????????????????????????????????????????????????????????

export function DatabaseDetailPanel({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseDetailPanelProps) {
  const params = useParams();
  const router = useRouter();
  const databaseId = params.databaseId as string;

  const [database, setDatabase] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "board" | "list" | "calendar" | "gallery" | "automations">("table");
  const [isPending, startTransition] = useTransition();
  const workspaceBasePath =
    accountId && workspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`
      : accountId
        ? `/${encodeURIComponent(accountId)}`
        : "/";
  const databasesHref =
    accountId && workspaceId
      ? `${workspaceBasePath}/knowledge-database/databases`
      : "/knowledge-database/databases";
  const formsHref =
    accountId && workspaceId
      ? `${workspaceBasePath}/knowledge-database/databases/${encodeURIComponent(databaseId)}/forms`
      : `/knowledge-database/databases/${encodeURIComponent(databaseId)}/forms`;

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
      router.push(databasesHref);
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
        <Button variant="ghost" size="sm" onClick={() => router.push(databasesHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <p className="text-sm text-muted-foreground">Database not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push(databasesHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to databases
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
          {database.fields.length} fields | Updated {new Date(database.updatedAtISO).toLocaleDateString("zh-TW")}
        </p>
      </header>

      {/* View switcher + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-md border border-border/60 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="Table view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Table2 className="h-3 w-3" /> Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode("board")}
            title="Board view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Kanban className="h-3 w-3" /> Board
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-3 w-3" /> List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            title="Calendar view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Calendar className="h-3 w-3" /> Calendar
          </button>
          <button
            type="button"
            onClick={() => setViewMode("gallery")}
            title="Gallery view"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "gallery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-3 w-3" /> Gallery
          </button>
          <button
            type="button"
            onClick={() => setViewMode("automations")}
            title="Automations"
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${viewMode === "automations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Zap className="h-3 w-3" /> Automations
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(formsHref)}
            disabled={isPending}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" /> Forms
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAddFieldOpen(true)} disabled={isPending}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add field
          </Button>
          <Button size="sm" variant="outline" onClick={handleArchive} disabled={isPending}>
            <Archive className="mr-1.5 h-3.5 w-3.5" /> Archive
          </Button>
        </div>
      </div>

      {/* View */}
      {viewMode === "table" && (
        <DatabaseTablePanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "board" && (
        <DatabaseBoardPanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "list" && (
        <DatabaseListPanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "calendar" && (
        <DatabaseCalendarPanel
          database={database}
          accountId={accountId}
        />
      )}
      {viewMode === "gallery" && (
        <DatabaseGalleryPanel
          database={database}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
        />
      )}
      {viewMode === "automations" && (
        <DatabaseAutomationPanel
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

## File: modules/notion/interfaces/knowledge/components/KnowledgeDetailPanel.tsx
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
import type { KnowledgePageSnapshot as KnowledgePage } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { PageEditorPanel } from "./PageEditorPanel";
import { CommentPanel } from "@/modules/notion/api";
import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { TitleEditor, IconPicker, CoverEditor } from "./KnowledgePageHeaderWidgets";

// ?? Props ?????????????????????????????????????????????????????????????????????

export interface KnowledgeDetailPanelProps {
  accountId: string;
  activeWorkspaceId: string | null;
  currentUserId: string;
}

// ?? Component ?????????????????????????????????????????????????????????????????

export function KnowledgeDetailPanel({
  accountId,
  activeWorkspaceId,
  currentUserId,
}: KnowledgeDetailPanelProps) {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<KnowledgePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const workspaceBasePath =
    accountId && activeWorkspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(activeWorkspaceId)}`
      : accountId
        ? `/${encodeURIComponent(accountId)}`
        : "/";
  const pageListHref =
    accountId && activeWorkspaceId
      ? `${workspaceBasePath}/knowledge/pages`
      : accountId
        ? `/${encodeURIComponent(accountId)}?tab=Overview&panel=knowledge-pages`
        : "/";

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
      router.push(pageListHref);
    });
  }

  // ?? Loading skeleton ????????????????????????????????????????????????????????

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // ?? Not found ???????????????????????????????????????????????????????????????

  if (!page) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(pageListHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to pages
        </Button>
        <p className="text-sm text-muted-foreground">Unable to load page. It may have been removed.</p>
      </div>
    );
  }

  // ?? Page view ???????????????????????????????????????????????????????????????

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
          <Button variant="ghost" size="sm" onClick={() => router.push(pageListHref)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to pages
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant={commentOpen ? "default" : "outline"}
              onClick={() => setCommentOpen((v) => !v)}
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              Comments
            </Button>
            {page.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleArchive}
                disabled={isPending}
              >
                <Archive className="mr-1.5 h-3.5 w-3.5" />
                Archive
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
              <Badge variant="secondary">Archived</Badge>
            )}
            {page.approvalState === "approved" && (
              <Badge variant="default">Approved</Badge>
            )}
            {page.verificationState === "verified" && (
              <Badge variant="outline">Verified</Badge>
            )}
            {page.verificationState === "needs_review" && (
              <Badge variant="destructive">Needs review</Badge>
            )}
            {updatedAt && <span>Updated {updatedAt}</span>}
          </div>
        </header>

        {/* Main content + optional comment side panel */}
        <div className={`flex gap-4 ${commentOpen ? "items-start" : ""}`}>
          {/* Block editor ??connected to Firebase */}
          <div className="min-w-0 flex-1">
            {accountId ? (
              <PageEditorPanel accountId={accountId} pageId={pageId} />
            ) : (
              <p className="text-sm text-muted-foreground">Account is required to edit this page.</p>
            )}
          </div>

          {/* Comment panel ??slides in from right */}
          {commentOpen && accountId && (
            <aside className="w-72 shrink-0 rounded-xl border border-border/60 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Comments</span>
                <button
                  type="button"
                  onClick={() => setCommentOpen(false)}
                  className="ml-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="Close comments"
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