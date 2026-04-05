/**
 * Module: knowledge
 * Layer: domain/barrel
 */

export type {
  KnowledgePage,
  KnowledgePageStatus,
  KnowledgePageTreeNode,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ArchiveKnowledgePageInput,
} from "./entities/content-page.entity";

export { KNOWLEDGE_PAGE_STATUSES } from "./entities/content-page.entity";

export type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
  DeleteKnowledgeBlockInput,
} from "./entities/content-block.entity";

export type {
  KnowledgeVersion,
  KnowledgeVersionBlock,
  CreateKnowledgeVersionInput,
} from "./entities/content-version.entity";

export type { BlockContent, BlockType } from "./value-objects/block-content";
export {
  BLOCK_TYPES,
  blockContentEquals,
  emptyTextBlockContent,
} from "./value-objects/block-content";

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

// ── KnowledgeCollection ───────────────────────────────────────────────────────

export type {
  KnowledgeCollection,
  CollectionColumn,
  CollectionColumnType,
  CollectionStatus,
  CreateKnowledgeCollectionInput,
  RenameKnowledgeCollectionInput,
  AddPageToCollectionInput,
  RemovePageFromCollectionInput,
  AddCollectionColumnInput,
  ArchiveKnowledgeCollectionInput,
} from "./entities/knowledge-collection.entity";

export type {
  KnowledgePageRepository,
  KnowledgeBlockRepository,
  KnowledgeVersionRepository,
} from "./repositories/knowledge.repositories";
