/**
 * Module: content
 * Layer: module/barrel (public API)
 *
 * This is the ONLY file that external modules should import from.
 * All internal implementation details (domain, application, infrastructure)
 * are NOT importable from outside — use the exports listed here.
 *
 * Boundary rule: other modules import via `@/modules/content`, never from
 * `@/modules/content/domain/...` or deeper paths.
 *
 * Cross-domain integration: prefer `contentFacade` (or `ContentFacade`)
 * for programmatic usage from other domains. Server Actions are for UI mutations.
 */

// ── Domain: entity types ──────────────────────────────────────────────────────
export type {
  ContentPage,
  ContentPageStatus,
  ContentPageTreeNode,
  CreateContentPageInput,
  RenameContentPageInput,
  MoveContentPageInput,
  ReorderContentPageBlocksInput,
  ArchiveContentPageInput,
} from "./domain/entities/content-page.entity";

export { CONTENT_PAGE_STATUSES } from "./domain/entities/content-page.entity";

export type {
  ContentBlock,
  AddContentBlockInput,
  UpdateContentBlockInput,
  DeleteContentBlockInput,
} from "./domain/entities/content-block.entity";

export type {
  ContentVersion,
  ContentVersionBlock,
  CreateContentVersionInput,
} from "./domain/entities/content-version.entity";

// ── Domain: value objects ─────────────────────────────────────────────────────
export type { BlockContent, BlockType } from "./domain/value-objects/block-content";
export {
  BLOCK_TYPES,
  blockContentEquals,
  emptyTextBlockContent,
} from "./domain/value-objects/block-content";

// ── Domain: events ────────────────────────────────────────────────────────────
export type {
  ContentDomainEvent,
  ContentPageCreatedEvent,
  ContentPageRenamedEvent,
  ContentPageMovedEvent,
  ContentPageArchivedEvent,
  ContentBlockAddedEvent,
  ContentBlockUpdatedEvent,
  ContentBlockDeletedEvent,
  ContentVersionPublishedEvent,
} from "./domain/events/content.events";

// ── Domain: repository ports ──────────────────────────────────────────────────
export type {
  ContentPageRepository,
  ContentBlockRepository,
  ContentVersionRepository,
} from "./domain/repositories/content.repositories";

// ── Application: DTOs and schemas ────────────────────────────────────────────
export type {
  BlockContentDto,
  CreateContentPageDto,
  RenameContentPageDto,
  MoveContentPageDto,
  ArchiveContentPageDto,
  ReorderContentPageBlocksDto,
  AddContentBlockDto,
  UpdateContentBlockDto,
  DeleteContentBlockDto,
  CreateContentVersionDto,
} from "./application/dto/content.dto";

export {
  BlockTypeSchema,
  BlockContentSchema,
  CreateContentPageSchema,
  RenameContentPageSchema,
  MoveContentPageSchema,
  ArchiveContentPageSchema,
  ReorderContentPageBlocksSchema,
  AddContentBlockSchema,
  UpdateContentBlockSchema,
  DeleteContentBlockSchema,
  CreateContentVersionSchema,
  ContentPageStatusSchema,
} from "./application/dto/content.dto";

// ── Application: use-case classes ────────────────────────────────────────────
export {
  CreateContentPageUseCase,
  RenameContentPageUseCase,
  MoveContentPageUseCase,
  ArchiveContentPageUseCase,
  ReorderContentPageBlocksUseCase,
  GetContentPageUseCase,
  ListContentPagesUseCase,
  GetContentPageTreeUseCase,
  buildContentPageTree,
} from "./application/use-cases/content-page.use-cases";

export {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
  ListContentBlocksUseCase,
} from "./application/use-cases/content-block.use-cases";

export {
  PublishContentVersionUseCase,
  ListContentVersionsUseCase,
} from "./application/use-cases/content-version.use-cases";

// ── Infrastructure: Firebase repositories ────────────────────────────────────
export { FirebaseContentPageRepository } from "./infrastructure/firebase/FirebaseContentPageRepository";
export { FirebaseContentBlockRepository } from "./infrastructure/firebase/FirebaseContentBlockRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export {
  createContentPage,
  renameContentPage,
  moveContentPage,
  archiveContentPage,
  reorderContentPageBlocks,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock,
  publishContentVersion,
} from "./interfaces/_actions/content.actions";

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getContentPage,
  getContentPages,
  getContentPageTree,
  getContentBlocks,
  getContentVersions,
} from "./interfaces/queries/content.queries";

// ── API: Facade (cross-domain entry point) ────────────────────────────────────
export { ContentFacade, contentFacade } from "./api/content-facade";
export type {
  ContentCreatePageParams,
  ContentRenamePageParams,
  ContentMovePageParams,
  ContentAddBlockParams,
  ContentUpdateBlockParams,
} from "./api/content-facade";
