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
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
} from "./entities/content-page.entity";

export { KNOWLEDGE_PAGE_STATUSES, PAGE_VERIFICATION_STATES } from "./entities/knowledge-page.entity";
export type { PageVerificationState } from "./entities/knowledge-page.entity";

export type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
  DeleteKnowledgeBlockInput,
  NestKnowledgeBlockInput,
  UnnestKnowledgeBlockInput,
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
  plainTextBlockContent,
  richTextToPlainText,
  extractMentionedPageIds,
  extractMentionedUserIds,
} from "./value-objects/block-content";
export type {
  RichTextSpanType,
  TextAnnotations,
  TextSpan,
  MentionPageSpan,
  MentionUserSpan,
  LinkSpan,
  RichTextSpan,
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
  KnowledgePageVerifiedEvent,
  KnowledgePageReviewRequestedEvent,
  KnowledgePageOwnerAssignedEvent,
} from "./events/knowledge.events";

// ── KnowledgeCollection ───────────────────────────────────────────────────────

export type {
  KnowledgeCollection,
  CollectionColumn,
  CollectionColumnType,
  CollectionStatus,
  CollectionSpaceType,
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
