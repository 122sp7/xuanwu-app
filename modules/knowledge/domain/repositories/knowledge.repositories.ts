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
} from "../entities/content-page.entity";
import type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
} from "../entities/content-block.entity";
import type {
  KnowledgeVersion,
  CreateKnowledgeVersionInput,
} from "../entities/content-version.entity";

export interface KnowledgePageRepository {
  create(input: CreateKnowledgePageInput): Promise<KnowledgePage>;
  rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>;
  move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>;
  reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>;
  archive(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  /** Mark a page as approved (approvalState = "approved"), stamping approvedAtISO. */
  approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null>;
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
}

export interface KnowledgeVersionRepository {
  create(input: CreateKnowledgeVersionInput): Promise<KnowledgeVersion>;
  findById(accountId: string, versionId: string): Promise<KnowledgeVersion | null>;
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeVersion[]>;
}
