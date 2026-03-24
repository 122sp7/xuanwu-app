/**
 * Module: knowledge
 * Layer: domain/barrel
 * Purpose: Re-exports all public domain types for consumption within this module.
 *
 * Other layers within the knowledge module import from here (or directly from
 * the source file). External consumers import from the module root index.ts.
 */

// ── Entities ──────────────────────────────────────────────────────────────────

export type {
  KnowledgePage,
  KnowledgePageStatus,
  KnowledgePageTreeNode,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ArchiveKnowledgePageInput,
} from "./entities/knowledge-page.entity";

export { KNOWLEDGE_PAGE_STATUSES } from "./entities/knowledge-page.entity";

export type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
  DeleteKnowledgeBlockInput,
} from "./entities/knowledge-block.entity";

export type {
  KnowledgeVersion,
  KnowledgeVersionBlock,
  CreateKnowledgeVersionInput,
} from "./entities/knowledge-version.entity";

// ── Value Objects ─────────────────────────────────────────────────────────────

export type { BlockContent, BlockType } from "./value-objects/block-content";
export {
  BLOCK_TYPES,
  blockContentEquals,
  emptyTextBlockContent,
} from "./value-objects/block-content";

// ── Events ────────────────────────────────────────────────────────────────────

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
} from "./events/knowledge.events";

// ── Repository ports ──────────────────────────────────────────────────────────

export type {
  KnowledgePageRepository,
  KnowledgeBlockRepository,
  KnowledgeVersionRepository,
} from "./repositories/knowledge.repositories";
