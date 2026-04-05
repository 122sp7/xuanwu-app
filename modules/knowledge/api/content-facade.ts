/**
 * Module: knowledge
 * Layer: api
 * Purpose: ContentFacade — the ONLY authorised entry point for cross-domain
 * access to the Content domain.
 *
 * BOUNDARY RULE:
 *   Other modules MUST import from here:
 *     import { contentFacade } from "@/modules/knowledge";
 *   They must NEVER reach into domain/, application/, infrastructure/ or
 *   interfaces/ directly.
 */

import type { ContentPageRepository, ContentBlockRepository } from "../domain/repositories/content.repositories";
import type { ContentPage, ContentPageTreeNode } from "../domain/entities/content-page.entity";
import type { ContentBlock } from "../domain/entities/content-block.entity";
import type { ContentVersion } from "../domain/entities/content-version.entity";
import type { BlockContent } from "../domain/value-objects/block-content";

import {
  CreateContentPageUseCase,
  RenameContentPageUseCase,
  MoveContentPageUseCase,
  ArchiveContentPageUseCase,
  GetContentPageUseCase,
  ListContentPagesUseCase,
  GetContentPageTreeUseCase,
} from "../application/use-cases/content-page.use-cases";
import {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
  ListContentBlocksUseCase,
} from "../application/use-cases/content-block.use-cases";

import { FirebaseContentPageRepository } from "../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseContentBlockRepository } from "../infrastructure/firebase/FirebaseContentBlockRepository";

export interface ContentCreatePageParams {
  accountId: string;
  workspaceId?: string;
  title: string;
  parentPageId?: string | null;
  createdByUserId: string;
}

export interface ContentRenamePageParams {
  accountId: string;
  pageId: string;
  title: string;
}

export interface ContentMovePageParams {
  accountId: string;
  pageId: string;
  targetParentPageId: string | null;
}

export interface ContentAddBlockParams {
  accountId: string;
  pageId: string;
  content: BlockContent;
  index?: number;
}

export interface ContentUpdateBlockParams {
  accountId: string;
  blockId: string;
  content: BlockContent;
}

export class ContentFacade {
  private readonly pageRepo: ContentPageRepository;
  private readonly blockRepo: ContentBlockRepository;

  constructor(
    pageRepo: ContentPageRepository = new FirebaseContentPageRepository(),
    blockRepo: ContentBlockRepository = new FirebaseContentBlockRepository(),
  ) {
    this.pageRepo = pageRepo;
    this.blockRepo = blockRepo;
  }

  async createPage(params: ContentCreatePageParams): Promise<string | null> {
    const result = await new CreateContentPageUseCase(this.pageRepo).execute({
      accountId: params.accountId,
      workspaceId: params.workspaceId,
      title: params.title,
      parentPageId: params.parentPageId ?? null,
      createdByUserId: params.createdByUserId,
    });
    return result.success ? result.aggregateId : null;
  }

  async renamePage(params: ContentRenamePageParams): Promise<boolean> {
    const result = await new RenameContentPageUseCase(this.pageRepo).execute(params);
    return result.success;
  }

  async movePage(params: ContentMovePageParams): Promise<boolean> {
    const result = await new MoveContentPageUseCase(this.pageRepo).execute(params);
    return result.success;
  }

  async archivePage(accountId: string, pageId: string): Promise<boolean> {
    const result = await new ArchiveContentPageUseCase(this.pageRepo).execute({
      accountId,
      pageId,
    });
    return result.success;
  }

  async getPage(accountId: string, pageId: string): Promise<ContentPage | null> {
    return new GetContentPageUseCase(this.pageRepo).execute(accountId, pageId);
  }

  async listPages(accountId: string): Promise<ContentPage[]> {
    return new ListContentPagesUseCase(this.pageRepo).execute(accountId);
  }

  async getPageTree(accountId: string): Promise<ContentPageTreeNode[]> {
    return new GetContentPageTreeUseCase(this.pageRepo).execute(accountId);
  }

  async addBlock(params: ContentAddBlockParams): Promise<string | null> {
    const result = await new AddContentBlockUseCase(this.blockRepo).execute({
      accountId: params.accountId,
      pageId: params.pageId,
      content: params.content,
      index: params.index,
    });
    return result.success ? result.aggregateId : null;
  }

  async updateBlock(params: ContentUpdateBlockParams): Promise<boolean> {
    const result = await new UpdateContentBlockUseCase(this.blockRepo).execute(params);
    return result.success;
  }

  async deleteBlock(accountId: string, blockId: string): Promise<boolean> {
    const result = await new DeleteContentBlockUseCase(this.blockRepo).execute({
      accountId,
      blockId,
    });
    return result.success;
  }

  async listBlocks(accountId: string, pageId: string): Promise<ContentBlock[]> {
    return new ListContentBlocksUseCase(this.blockRepo).execute(accountId, pageId);
  }

  async listVersions(_accountId: string, _pageId: string): Promise<ContentVersion[]> {
    return [];
  }
}

export const contentFacade = new ContentFacade();
