/**
 * Module: knowledge
 * Layer: domain/repositories
 * Purpose: Repository port interfaces for Content domain persistence.
 */

import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ApproveKnowledgePageInput,
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
  UpdatePageIconInput,
  UpdatePageCoverInput,
} from "../entities/knowledge-page.entity";
import type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
  NestKnowledgeBlockInput,
  UnnestKnowledgeBlockInput,
} from "../entities/content-block.entity";
import type {
  KnowledgeVersion,
  CreateKnowledgeVersionInput,
} from "../entities/content-version.entity";
import type {
  KnowledgeCollection,
  CreateKnowledgeCollectionInput,
  RenameKnowledgeCollectionInput,
  AddPageToCollectionInput,
  RemovePageFromCollectionInput,
  AddCollectionColumnInput,
  ArchiveKnowledgeCollectionInput,
} from "../entities/knowledge-collection.entity";

export interface KnowledgePageRepository {
  create(input: CreateKnowledgePageInput): Promise<KnowledgePage>;
  rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>;
  move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>;
  reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>;
  archive(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  /** Mark a page as approved (approvalState = "approved"), stamping approvedAtISO. */
  approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null>;
  /** Mark a wiki page as verified (verificationState = "verified"). */
  verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null>;
  /** Flag a wiki page for review (verificationState = "needs_review"). */
  requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null>;
  /** Assign or change the owner of a wiki page. */
  assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null>;
  /** Set or clear the page icon (emoji or image URL). */
  updateIcon(input: UpdatePageIconInput): Promise<KnowledgePage | null>;
  /** Set or clear the page cover image URL. */
  updateCover(input: UpdatePageCoverInput): Promise<KnowledgePage | null>;
  findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  listByAccountId(accountId: string): Promise<KnowledgePage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
}

export interface KnowledgeBlockRepository {
  add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock>;
  update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null>;
  delete(accountId: string, blockId: string): Promise<void>;
  findById(accountId: string, blockId: string): Promise<KnowledgeBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]>;
  /** Nest a block under a parent block (creates parent → child relationship). */
  nest(input: NestKnowledgeBlockInput): Promise<KnowledgeBlock | null>;
  /** Unnest a block, moving it back to page-level. */
  unnest(input: UnnestKnowledgeBlockInput): Promise<KnowledgeBlock | null>;
}

export interface KnowledgeVersionRepository {
  create(input: CreateKnowledgeVersionInput): Promise<KnowledgeVersion>;
  findById(accountId: string, versionId: string): Promise<KnowledgeVersion | null>;
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeVersion[]>;
}

export interface KnowledgeCollectionRepository {
  create(input: CreateKnowledgeCollectionInput): Promise<KnowledgeCollection>;
  rename(input: RenameKnowledgeCollectionInput): Promise<KnowledgeCollection | null>;
  addPage(input: AddPageToCollectionInput): Promise<KnowledgeCollection | null>;
  removePage(input: RemovePageFromCollectionInput): Promise<KnowledgeCollection | null>;
  addColumn(input: AddCollectionColumnInput): Promise<KnowledgeCollection | null>;
  archive(input: ArchiveKnowledgeCollectionInput): Promise<KnowledgeCollection | null>;
  findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
  listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
}
