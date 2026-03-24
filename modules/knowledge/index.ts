/**
 * Module: knowledge
 * Layer: module/barrel (public API)
 *
 * This is the ONLY file that external modules should import from.
 * All internal implementation details (domain, application, infrastructure)
 * are NOT importable from outside — use the exports listed here.
 *
 * Boundary rule: other modules import via `@/modules/knowledge`, never from
 * `@/modules/knowledge/domain/...` or deeper paths.
 *
 * Cross-domain integration: prefer `knowledgeFacade` (or `KnowledgeFacade`)
 * for programmatic usage from other domains. Server Actions are for UI mutations.
 */

// ── Domain: entity types ──────────────────────────────────────────────────────
export type {
  KnowledgePage,
  KnowledgePageStatus,
  KnowledgePageTreeNode,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ArchiveKnowledgePageInput,
} from "./domain/entities/knowledge-page.entity";

export { KNOWLEDGE_PAGE_STATUSES } from "./domain/entities/knowledge-page.entity";

export type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
  DeleteKnowledgeBlockInput,
} from "./domain/entities/knowledge-block.entity";

export type {
  KnowledgeVersion,
  KnowledgeVersionBlock,
  CreateKnowledgeVersionInput,
} from "./domain/entities/knowledge-version.entity";

// ── Domain: value objects ─────────────────────────────────────────────────────
export type { BlockContent, BlockType } from "./domain/value-objects/block-content";
export {
  BLOCK_TYPES,
  blockContentEquals,
  emptyTextBlockContent,
} from "./domain/value-objects/block-content";

// ── Domain: events ────────────────────────────────────────────────────────────
export type {
  KnowledgeDomainEvent,
  KnowledgePageCreatedEvent,
  KnowledgePageRenamedEvent,
  KnowledgePageMovedEvent,
  KnowledgePageArchivedEvent,
  KnowledgeBlockAddedEvent,
  KnowledgeBlockUpdatedEvent,
  KnowledgeBlockDeletedEvent,
  KnowledgeVersionPublishedEvent,
} from "./domain/events/knowledge.events";

// ── Domain: repository ports ──────────────────────────────────────────────────
export type {
  KnowledgePageRepository,
  KnowledgeBlockRepository,
  KnowledgeVersionRepository,
} from "./domain/repositories/knowledge.repositories";

// ── Application: DTOs and schemas ────────────────────────────────────────────
export type {
  BlockContentDto,
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  AddKnowledgeBlockDto,
  UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockDto,
  CreateKnowledgeVersionDto,
} from "./application/dto/knowledge.dto";

export {
  BlockTypeSchema,
  BlockContentSchema,
  CreateKnowledgePageSchema,
  RenameKnowledgePageSchema,
  MoveKnowledgePageSchema,
  ArchiveKnowledgePageSchema,
  ReorderKnowledgePageBlocksSchema,
  AddKnowledgeBlockSchema,
  UpdateKnowledgeBlockSchema,
  DeleteKnowledgeBlockSchema,
  CreateKnowledgeVersionSchema,
  KnowledgePageStatusSchema,
} from "./application/dto/knowledge.dto";

// ── Application: use-case classes ────────────────────────────────────────────
export {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  GetKnowledgePageTreeUseCase,
  buildKnowledgePageTree,
} from "./application/use-cases/knowledge-page.use-cases";

export {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
  ListKnowledgeBlocksUseCase,
} from "./application/use-cases/knowledge-block.use-cases";

export {
  PublishKnowledgeVersionUseCase,
  ListKnowledgeVersionsUseCase,
} from "./application/use-cases/knowledge-version.use-cases";

// ── Infrastructure: Firebase repositories ────────────────────────────────────
export { FirebaseKnowledgePageRepository } from "./infrastructure/firebase/FirebaseKnowledgePageRepository";
export { FirebaseKnowledgeBlockRepository } from "./infrastructure/firebase/FirebaseKnowledgeBlockRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export {
  createKnowledgePage,
  renameKnowledgePage,
  moveKnowledgePage,
  archiveKnowledgePage,
  reorderKnowledgePageBlocks,
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
  publishKnowledgeVersion,
} from "./interfaces/_actions/knowledge.actions";

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePageTree,
  getKnowledgeBlocks,
  getKnowledgeVersions,
} from "./interfaces/queries/knowledge.queries";

// ── API: Facade (cross-domain entry point) ────────────────────────────────────
export { KnowledgeFacade, knowledgeFacade } from "./api/knowledge-facade";
export type {
  KnowledgeCreatePageParams,
  KnowledgeRenamePageParams,
  KnowledgeMovePageParams,
  KnowledgeAddBlockParams,
  KnowledgeUpdateBlockParams,
} from "./api/knowledge-facade";
