/**
 * Module: knowledge
 * Layer: domain/repositories
 * Purpose: Repository port interfaces for Content domain persistence.
 */

import type {
  ContentPage,
  CreateContentPageInput,
  RenameContentPageInput,
  MoveContentPageInput,
  ReorderContentPageBlocksInput,
  ApproveContentPageInput,
} from "../entities/content-page.entity";
import type {
  ContentBlock,
  AddContentBlockInput,
  UpdateContentBlockInput,
} from "../entities/content-block.entity";
import type {
  ContentVersion,
  CreateContentVersionInput,
} from "../entities/content-version.entity";

export interface ContentPageRepository {
  create(input: CreateContentPageInput): Promise<ContentPage>;
  rename(input: RenameContentPageInput): Promise<ContentPage | null>;
  move(input: MoveContentPageInput): Promise<ContentPage | null>;
  reorderBlocks(input: ReorderContentPageBlocksInput): Promise<ContentPage | null>;
  archive(accountId: string, pageId: string): Promise<ContentPage | null>;
  /** Mark a page as approved (approvalState = "approved"), stamping approvedAtISO. */
  approve(input: ApproveContentPageInput): Promise<ContentPage | null>;
  findById(accountId: string, pageId: string): Promise<ContentPage | null>;
  listByAccountId(accountId: string): Promise<ContentPage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<ContentPage[]>;
}

export interface ContentBlockRepository {
  add(input: AddContentBlockInput): Promise<ContentBlock>;
  update(input: UpdateContentBlockInput): Promise<ContentBlock | null>;
  delete(accountId: string, blockId: string): Promise<void>;
  findById(accountId: string, blockId: string): Promise<ContentBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>;
}

export interface ContentVersionRepository {
  create(input: CreateContentVersionInput): Promise<ContentVersion>;
  findById(accountId: string, versionId: string): Promise<ContentVersion | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentVersion[]>;
}
