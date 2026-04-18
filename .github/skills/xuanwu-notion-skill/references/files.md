# Files

## File: src/modules/notion/adapters/outbound/notion-page-stub.ts
````typescript
/**
 * notion-page-stub — notion outbound adapter stub.
 *
 * Stub implementation of createKnowledgePage. Replace with a real
 * Firestore-backed implementation when the notion infrastructure layer
 * is available.
 */
⋮----
export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly parentPageId: string | null;
  readonly createdByUserId: string;
}
⋮----
export interface CreateKnowledgePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}
⋮----
/** Stub — replace with real Firestore implementation when available. */
export async function createKnowledgePage(
  _input: CreateKnowledgePageInput,
): Promise<CreateKnowledgePageResult>
````

## File: src/modules/notion/orchestration/index.ts
````typescript
// notion — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement NotionFacade if needed.
````

## File: src/modules/notion/shared/errors/index.ts
````typescript
// notion shared/errors placeholder
````

## File: src/modules/notion/shared/events/index.ts
````typescript
// notion shared/events placeholder
````

## File: src/modules/notion/shared/index.ts
````typescript

````

## File: src/modules/notion/shared/types/index.ts
````typescript
// notion shared/types placeholder
````

## File: src/modules/notion/subdomains/block/adapters/inbound/index.ts
````typescript
// block — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/block/adapters/index.ts
````typescript
// block — adapters aggregate
````

## File: src/modules/notion/subdomains/block/adapters/outbound/index.ts
````typescript
// block — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/block/adapters/outbound/memory/InMemoryBlockRepository.ts
````typescript
import type { BlockSnapshot } from "../../../domain/entities/Block";
import type { BlockRepository } from "../../../domain/repositories/BlockRepository";
⋮----
export class InMemoryBlockRepository implements BlockRepository {
⋮----
async save(snapshot: BlockSnapshot): Promise<void>
⋮----
async saveAll(snapshots: BlockSnapshot[]): Promise<void>
⋮----
async findById(id: string): Promise<BlockSnapshot | null>
⋮----
async findByPageId(pageId: string): Promise<BlockSnapshot[]>
⋮----
async findChildren(parentBlockId: string): Promise<BlockSnapshot[]>
⋮----
async delete(id: string): Promise<void>
⋮----
async deleteByPageId(pageId: string): Promise<void>
````

## File: src/modules/notion/subdomains/block/domain/repositories/BlockRepository.ts
````typescript
import type { BlockSnapshot } from "../entities/Block";
⋮----
export interface BlockRepository {
  save(snapshot: BlockSnapshot): Promise<void>;
  saveAll(snapshots: BlockSnapshot[]): Promise<void>;
  findById(id: string): Promise<BlockSnapshot | null>;
  findByPageId(pageId: string): Promise<BlockSnapshot[]>;
  findChildren(parentBlockId: string): Promise<BlockSnapshot[]>;
  delete(id: string): Promise<void>;
  deleteByPageId(pageId: string): Promise<void>;
}
⋮----
save(snapshot: BlockSnapshot): Promise<void>;
saveAll(snapshots: BlockSnapshot[]): Promise<void>;
findById(id: string): Promise<BlockSnapshot | null>;
findByPageId(pageId: string): Promise<BlockSnapshot[]>;
findChildren(parentBlockId: string): Promise<BlockSnapshot[]>;
delete(id: string): Promise<void>;
deleteByPageId(pageId: string): Promise<void>;
````

## File: src/modules/notion/subdomains/collaboration/adapters/inbound/index.ts
````typescript
// collaboration — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/collaboration/adapters/index.ts
````typescript
// collaboration — adapters aggregate
````

## File: src/modules/notion/subdomains/collaboration/adapters/outbound/index.ts
````typescript
// collaboration — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/collaboration/application/index.ts
````typescript
// collaboration — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/notion/subdomains/collaboration/application/use-cases/CollaborationUseCases.ts
````typescript
// TODO: implement collaboration use-cases (commenting, presence, sharing)
````

## File: src/modules/notion/subdomains/collaboration/domain/entities/Comment.ts
````typescript
export type PresenceStatus = "online" | "idle" | "offline";
⋮----
export interface PagePresence {
  readonly pageId: string;
  readonly accountId: string;
  readonly cursorPosition?: number;
  readonly status: PresenceStatus;
  readonly lastSeenISO: string;
}
⋮----
export interface Comment {
  readonly id: string;
  readonly pageId: string;
  readonly blockId?: string;
  readonly accountId: string;
  readonly content: string;
  readonly resolved: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  findById(id: string): Promise<Comment | null>;
  findByPageId(pageId: string): Promise<Comment[]>;
  resolveComment(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
⋮----
save(comment: Comment): Promise<void>;
findById(id: string): Promise<Comment | null>;
findByPageId(pageId: string): Promise<Comment[]>;
resolveComment(id: string): Promise<void>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/collaboration/domain/index.ts
````typescript
// collaboration — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/notion/subdomains/database/adapters/inbound/index.ts
````typescript
// database — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/database/adapters/index.ts
````typescript
// database — adapters aggregate
````

## File: src/modules/notion/subdomains/database/adapters/outbound/index.ts
````typescript
// database — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/database/adapters/outbound/memory/InMemoryDatabaseRepository.ts
````typescript
import type { DatabaseSnapshot } from "../../../domain/entities/Database";
import type { DatabaseRepository } from "../../../domain/repositories/DatabaseRepository";
⋮----
export class InMemoryDatabaseRepository implements DatabaseRepository {
⋮----
async save(snapshot: DatabaseSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<DatabaseSnapshot | null>
⋮----
async findByPageId(pageId: string): Promise<DatabaseSnapshot[]>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notion/subdomains/database/domain/repositories/DatabaseRepository.ts
````typescript
import type { DatabaseSnapshot } from "../entities/Database";
⋮----
export interface DatabaseRepository {
  save(snapshot: DatabaseSnapshot): Promise<void>;
  findById(id: string): Promise<DatabaseSnapshot | null>;
  findByPageId(pageId: string): Promise<DatabaseSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: DatabaseSnapshot): Promise<void>;
findById(id: string): Promise<DatabaseSnapshot | null>;
findByPageId(pageId: string): Promise<DatabaseSnapshot[]>;
findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/page/adapters/inbound/index.ts
````typescript
// page — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/page/adapters/index.ts
````typescript
// page — adapters aggregate
````

## File: src/modules/notion/subdomains/page/adapters/outbound/index.ts
````typescript
// page — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/page/adapters/outbound/memory/InMemoryPageRepository.ts
````typescript
import type { PageSnapshot, PageStatus } from "../../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../../domain/repositories/PageRepository";
⋮----
export class InMemoryPageRepository implements PageRepository {
⋮----
async save(snapshot: PageSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<PageSnapshot | null>
⋮----
async findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>
⋮----
async findChildren(parentPageId: string): Promise<PageSnapshot[]>
⋮----
async query(params: PageQuery): Promise<PageSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notion/subdomains/page/domain/repositories/PageRepository.ts
````typescript
import type { PageSnapshot, PageStatus } from "../entities/Page";
⋮----
export interface PageQuery {
  readonly accountId?: string;
  readonly workspaceId?: string;
  readonly parentPageId?: string | null;
  readonly status?: PageStatus;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface PageRepository {
  save(snapshot: PageSnapshot): Promise<void>;
  findById(id: string): Promise<PageSnapshot | null>;
  findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>;
  findChildren(parentPageId: string): Promise<PageSnapshot[]>;
  query(params: PageQuery): Promise<PageSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: PageSnapshot): Promise<void>;
findById(id: string): Promise<PageSnapshot | null>;
findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>;
findChildren(parentPageId: string): Promise<PageSnapshot[]>;
query(params: PageQuery): Promise<PageSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/template/adapters/inbound/index.ts
````typescript
// template — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/template/adapters/index.ts
````typescript
// template — adapters aggregate
````

## File: src/modules/notion/subdomains/template/adapters/outbound/index.ts
````typescript
// template — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/template/application/index.ts
````typescript
// template — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/notion/subdomains/template/application/use-cases/TemplateUseCases.ts
````typescript
// TODO: implement template management use-cases
````

## File: src/modules/notion/subdomains/template/domain/entities/Template.ts
````typescript
/**
 * Template — distilled from notion taxonomy subdomain
 * Represents a reusable page/database template.
 */
export type TemplateScope = "workspace" | "organization" | "global";
export type TemplateCategory = "page" | "database" | "workflow";
⋮----
export interface Template {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly scope: TemplateScope;
  readonly category: TemplateCategory;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly createdByUserId: string;
  readonly pageSnapshotId?: string;
  readonly databaseSnapshotId?: string;
  readonly tags: string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface TemplateRepository {
  save(template: Template): Promise<void>;
  findById(id: string): Promise<Template | null>;
  findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]>;
  listByCategory(category: TemplateCategory): Promise<Template[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(template: Template): Promise<void>;
findById(id: string): Promise<Template | null>;
findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]>;
listByCategory(category: TemplateCategory): Promise<Template[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/template/domain/index.ts
````typescript
// template — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/notion/subdomains/view/adapters/inbound/index.ts
````typescript
// view — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/view/adapters/index.ts
````typescript
// view — adapters aggregate
````

## File: src/modules/notion/subdomains/view/adapters/outbound/index.ts
````typescript
// view — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/view/application/index.ts
````typescript
// view — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/notion/subdomains/view/application/use-cases/ViewUseCases.ts
````typescript
// TODO: implement view CRUD use-cases
````

## File: src/modules/notion/subdomains/view/domain/entities/View.ts
````typescript
/**
 * View — distilled from modules/notion/subdomains/knowledge (relations/filters)
 * Represents a filtered/sorted view of a database.
 */
export type ViewType = "table" | "board" | "gallery" | "list" | "calendar" | "timeline";
⋮----
export interface FilterCondition {
  readonly propertyId: string;
  readonly operator: "equals" | "not_equals" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "greater_than" | "less_than";
  readonly value?: unknown;
}
⋮----
export interface SortCondition {
  readonly propertyId: string;
  readonly direction: "asc" | "desc";
}
⋮----
export interface ViewSnapshot {
  readonly id: string;
  readonly databaseId: string;
  readonly name: string;
  readonly type: ViewType;
  readonly filters: FilterCondition[];
  readonly sorts: SortCondition[];
  readonly visiblePropertyIds: string[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface ViewRepository {
  save(snapshot: ViewSnapshot): Promise<void>;
  findById(id: string): Promise<ViewSnapshot | null>;
  findByDatabaseId(databaseId: string): Promise<ViewSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: ViewSnapshot): Promise<void>;
findById(id: string): Promise<ViewSnapshot | null>;
findByDatabaseId(databaseId: string): Promise<ViewSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/view/domain/index.ts
````typescript
// view — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/notion/index.ts
````typescript
/**
 * Notion Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// page
⋮----
// block
⋮----
// database
⋮----
// view
⋮----
// collaboration
⋮----
// template
````

## File: src/modules/notion/subdomains/block/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/block/application/use-cases/BlockUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Block, type CreateBlockInput, type BlockContent } from "../../domain/entities/Block";
import type { BlockRepository } from "../../domain/repositories/BlockRepository";
⋮----
export class CreateBlockUseCase {
⋮----
constructor(private readonly repo: BlockRepository)
⋮----
async execute(input: CreateBlockInput): Promise<CommandResult>
⋮----
export class UpdateBlockUseCase {
⋮----
async execute(blockId: string, content: Partial<BlockContent>): Promise<CommandResult>
⋮----
export class GetPageBlocksUseCase {
⋮----
async execute(pageId: string)
````

## File: src/modules/notion/subdomains/block/domain/entities/Block.ts
````typescript
/**
 * Block — distilled from modules/notion/subdomains/knowledge/domain/aggregates/ContentBlock.ts
 */
import { v4 as uuid } from "uuid";
⋮----
export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list"
  | "numbered_list"
  | "todo"
  | "toggle"
  | "code"
  | "quote"
  | "callout"
  | "divider"
  | "image"
  | "file"
  | "embed";
⋮----
export interface BlockContent {
  readonly type: BlockType;
  readonly text?: string;
  readonly checked?: boolean;
  readonly url?: string;
  readonly language?: string;
  readonly attributes?: Record<string, unknown>;
}
⋮----
export interface BlockSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly parentBlockId?: string;
  readonly order: number;
  readonly content: BlockContent;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateBlockInput {
  readonly pageId: string;
  readonly parentBlockId?: string;
  readonly order: number;
  readonly content: BlockContent;
  readonly createdByUserId: string;
}
⋮----
export class Block {
⋮----
private constructor(private _props: BlockSnapshot)
⋮----
static create(input: CreateBlockInput): Block
⋮----
static reconstitute(snapshot: BlockSnapshot): Block
⋮----
update(content: Partial<BlockContent>): void
⋮----
reorder(order: number): void
⋮----
get id(): string
get pageId(): string
get content(): BlockContent
get order(): number
⋮----
getSnapshot(): Readonly<BlockSnapshot>
````

## File: src/modules/notion/subdomains/block/domain/index.ts
````typescript

````

## File: src/modules/notion/subdomains/database/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/database/application/use-cases/DatabaseUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Database, type CreateDatabaseInput, type DatabaseProperty } from "../../domain/entities/Database";
import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";
⋮----
export class CreateDatabaseUseCase {
⋮----
constructor(private readonly repo: DatabaseRepository)
⋮----
async execute(input: CreateDatabaseInput): Promise<CommandResult>
⋮----
export class AddPropertyUseCase {
⋮----
async execute(databaseId: string, property: DatabaseProperty): Promise<CommandResult>
````

## File: src/modules/notion/subdomains/database/domain/entities/Database.ts
````typescript
/**
 * Database — distilled from modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts
 * Represents a structured collection of pages with typed properties (Notion-style database).
 */
import { v4 as uuid } from "uuid";
⋮----
export type PropertyType = "text" | "number" | "select" | "multi_select" | "date" | "checkbox" | "url" | "email" | "file" | "relation";
⋮----
export interface DatabaseProperty {
  readonly id: string;
  readonly name: string;
  readonly type: PropertyType;
  readonly options?: string[];
}
⋮----
export type DatabaseStatus = "active" | "archived";
⋮----
export interface DatabaseSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties: DatabaseProperty[];
  readonly status: DatabaseStatus;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateDatabaseInput {
  readonly pageId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties?: DatabaseProperty[];
  readonly createdByUserId: string;
}
⋮----
export class Database {
⋮----
private constructor(private _props: DatabaseSnapshot)
⋮----
static create(input: CreateDatabaseInput): Database
⋮----
static reconstitute(snapshot: DatabaseSnapshot): Database
⋮----
addProperty(property: DatabaseProperty): void
⋮----
get id(): string
get title(): string
get pageId(): string
get properties(): DatabaseProperty[]
⋮----
getSnapshot(): Readonly<DatabaseSnapshot>
````

## File: src/modules/notion/subdomains/database/domain/index.ts
````typescript

````

## File: src/modules/notion/subdomains/page/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/page/application/use-cases/PageUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Page, type CreatePageInput } from "../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../domain/repositories/PageRepository";
⋮----
export class CreatePageUseCase {
⋮----
constructor(private readonly repo: PageRepository)
⋮----
async execute(input: CreatePageInput): Promise<CommandResult>
⋮----
export class RenamePageUseCase {
⋮----
async execute(pageId: string, title: string): Promise<CommandResult>
⋮----
export class ArchivePageUseCase {
⋮----
async execute(pageId: string): Promise<CommandResult>
⋮----
export class QueryPagesUseCase {
⋮----
async execute(params: PageQuery)
````

## File: src/modules/notion/subdomains/page/domain/entities/Page.ts
````typescript
/**
 * Page — distilled from modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts
 */
import { v4 as uuid } from "uuid";
⋮----
export type PageStatus = "active" | "archived";
⋮----
export interface PageSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: PageStatus;
  readonly ownerId?: string;
  readonly iconUrl?: string;
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreatePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
  readonly order?: number;
}
⋮----
function slugify(title: string): string
⋮----
export class Page {
⋮----
private constructor(private _props: PageSnapshot)
⋮----
static create(input: CreatePageInput): Page
⋮----
static reconstitute(snapshot: PageSnapshot): Page
⋮----
rename(title: string): void
⋮----
appendBlock(blockId: string): void
⋮----
archive(): void
⋮----
get id(): string
get title(): string
get slug(): string
get status(): PageStatus
get blockIds(): readonly string[]
get parentPageId(): string | null
⋮----
getSnapshot(): Readonly<PageSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notion/subdomains/page/domain/index.ts
````typescript

````

## File: src/modules/notion/README.md
````markdown
# Notion Module

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體。  
> **子域不重複原則：** 分類法（標籤）整合至 `page` / `database` metadata；關聯圖以 `view` 呈現。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `page` | 🔨 骨架建立，實作進行中 | Page 實體（知識文件創作、版本、metadata）|
| `block` | 🔨 骨架建立，實作進行中 | Block 實體（Page 內容區塊：文字、圖片、代碼、嵌入等）|
| `database` | 🔨 骨架建立，實作進行中 | Database 實體（結構化知識庫、欄位定義）|
| `view` | 🔨 骨架建立，實作進行中 | View 實體（Database / Page 關聯的顯示方式、篩選、排序）|
| `collaboration` | 🔨 骨架建立，實作進行中 | Collaboration 實體（協作評論、共編、提及通知）|
| `template` | 🔨 骨架建立，實作進行中 | Template 實體（Page / Database 的可重用模板）|

---

## 預期目錄結構

```
src/modules/notion/
  index.ts
  README.md
  AGENT.md
  orchestration/
    NotionFacade.ts
  shared/
    domain/index.ts             ← PageRef / BlockRef（跨子域共用 reference VO）
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    page/
      domain/
      application/
      adapters/outbound/
    block/
    database/
    view/
    collaboration/
    template/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 讓其他模組直接修改 `Page` / `Block` / `Database` | notion 是唯一可寫的所有者 |
| 使用 `knowledge-database` / `authoring` / `relations` / `taxonomy` 作為子域名 | 已整合至名詞域（`database` / `page` / `view` / `template`）|
| 在 barrel 使用 `export *` | 破壞可追蹤性 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````

## File: src/modules/notion/AGENT.md
````markdown
# Notion Module — Agent Guide

## Purpose

`src/modules/notion` 是 **Notion 知識內容能力模組**，為 Xuanwu 系統提供知識頁面（Page）、內容區塊（Block）、資料庫（Database）、視圖（View）、協作（Collaboration）、模板（Template）等正典知識能力的實作落點。

> **⚠ 邊界警示：** notion 是 `KnowledgeArtifact`（Page / Block / Database）的**唯一可寫所有者**。notebooklm 只能透過 `src/modules/notion/index.ts` 唯讀引用；workspace 不直接修改 notion 內容。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `page` | Page 實體（知識文件創作、編輯、版本）| 🔨 骨架建立，實作進行中 |
| `block` | Block 實體（Page 內內容區塊：文字、圖片、代碼等）| 🔨 骨架建立，實作進行中 |
| `database` | Database 實體（結構化知識庫）| 🔨 骨架建立，實作進行中 |
| `view` | View 實體（Database 的顯示方式 / 篩選 / 排序）| 🔨 骨架建立，實作進行中 |
| `collaboration` | Collaboration 實體（協作評論、共編、提及）| 🔨 骨架建立，實作進行中 |
| `template` | Template 實體（Page / Database 模板）| 🔨 骨架建立，實作進行中 |

> **子域不重複原則：**  
> - `taxonomy`（分類/標籤）的標籤能力整合至 `page` / `database` 的 metadata；不設獨立 taxonomy 子域  
> - `relations`（關聯圖）以 `view` 呈現；Page 間的關聯是 View 的一種形式  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- `Page` 與 `Block` 是 notion 核心 Aggregate；`Database` 是另一個 Aggregate。
- 其他模組（notebooklm、workspace）只能透過 `src/modules/notion/index.ts` 唯讀引用 notion 內容。
- `database` 是 `knowledge-database` 的語意化名稱（已完成重命名）；禁止使用舊名。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 notion 的新 use case、entity、adapter 實作。
- 實作 page authoring、database CRUD、collaboration、template 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/notion/AGENT.md`
- 跨模組 API boundary → `src/modules/notion/index.ts`
- RAG / 知識檢索 → `src/modules/notebooklm/`（notebooklm 消費 notion 內容）
- AI 生成輔助 → `src/modules/ai/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/notion/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/notion/`（本層）|
| 跨模組 API boundary | `src/modules/notion/index.ts` |

**嚴禁事項：**
- ❌ 讓 notebooklm 或 workspace 直接修改 `Page` / `Block` / `Database`（只可讀取）
- ❌ 在 barrel 使用 `export *`
- ❌ 使用 `database` 以外的舊名（`knowledge-database`、`knowledge` 已整合至 `page`）
- ❌ 在 notion 模組定義 AI 生成能力（屬 ai）

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````