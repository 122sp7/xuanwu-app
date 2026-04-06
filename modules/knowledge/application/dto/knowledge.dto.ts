/**
 * Module: knowledge
 * Layer: application/dto
 * Purpose: Barrel re-export for all knowledge DTOs.
 * Split into focused files per IDDD single-responsibility principle:
 *  - knowledge-page.dto.ts        (page lifecycle + approve)
 *  - knowledge-block.dto.ts       (block CRUD + nesting)
 *  - knowledge-collection.dto.ts  (collection management)
 *  - knowledge-wiki.dto.ts        (wiki, verification, appearance)
 */

export {
  KnowledgePageStatusSchema,
  CreateKnowledgePageSchema,
  RenameKnowledgePageSchema,
  MoveKnowledgePageSchema,
  ArchiveKnowledgePageSchema,
  ReorderKnowledgePageBlocksSchema,
  CreateKnowledgeVersionSchema,
  ExtractedTaskSchema,
  ExtractedInvoiceSchema,
  ApproveKnowledgePageSchema,
} from "./knowledge-page.dto";
export type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  CreateKnowledgeVersionDto,
  ApproveKnowledgePageDto,
} from "./knowledge-page.dto";

export {
  BlockTypeSchema,
  BlockContentSchema,
  AddKnowledgeBlockSchema,
  UpdateKnowledgeBlockSchema,
  DeleteKnowledgeBlockSchema,
  NestKnowledgeBlockSchema,
  UnnestKnowledgeBlockSchema,
} from "./knowledge-block.dto";
export type {
  BlockContentDto,
  AddKnowledgeBlockDto,
  UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockDto,
  NestKnowledgeBlockDto,
  UnnestKnowledgeBlockDto,
} from "./knowledge-block.dto";

export {
  CollectionColumnTypeSchema,
  CollectionColumnInputSchema,
  CreateKnowledgeCollectionSchema,
  RenameKnowledgeCollectionSchema,
  AddPageToCollectionSchema,
  RemovePageFromCollectionSchema,
  AddCollectionColumnSchema,
  ArchiveKnowledgeCollectionSchema,
} from "./knowledge-collection.dto";
export type {
  CollectionColumnTypeDto,
  CollectionColumnInputDto,
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "./knowledge-collection.dto";

export {
  PageVerificationStateSchema,
  VerifyKnowledgePageSchema,
  RequestPageReviewSchema,
  AssignPageOwnerSchema,
  CreateWikiSpaceSchema,
  UpdatePageIconSchema,
  UpdatePageCoverSchema,
} from "./knowledge-wiki.dto";
export type {
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
  CreateWikiSpaceDto,
  UpdatePageIconDto,
  UpdatePageCoverDto,
} from "./knowledge-wiki.dto";
