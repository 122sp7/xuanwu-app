/**
 * Module: knowledge
 * Layer: api
 * Purpose: KnowledgeFacade — the ONLY authorised entry point for cross-domain
 * access to the Content domain.
 *
 * BOUNDARY RULE:
 *   Other modules MUST import from here:
 *     import { knowledgeFacade } from "@/modules/knowledge";
 *   They must NEVER reach into domain/, application/, infrastructure/ or
 *   interfaces/ directly.
 */

import type { KnowledgePageRepository, KnowledgeBlockRepository } from "../domain/repositories/knowledge.repositories";
import type { KnowledgePage, KnowledgePageTreeNode } from "../domain/entities/knowledge-page.entity";
import type { KnowledgeBlock } from "../domain/entities/content-block.entity";
import type { KnowledgeVersion } from "../domain/entities/content-version.entity";
import type { BlockContent } from "../domain/value-objects/block-content";

import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  GetKnowledgePageTreeUseCase,
} from "../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
  ListKnowledgeBlocksUseCase,
} from "../application/use-cases/knowledge-block.use-cases";

import { FirebaseKnowledgePageRepository } from "../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { FirebaseKnowledgeBlockRepository } from "../infrastructure/firebase/FirebaseContentBlockRepository";

export interface KnowledgeCreatePageParams {
  accountId: string;
  workspaceId: string;
  title: string;
  parentPageId?: string | null;
  createdByUserId: string;
}

export interface KnowledgeRenamePageParams {
  accountId: string;
  pageId: string;
  title: string;
}

export interface KnowledgeMovePageParams {
  accountId: string;
  pageId: string;
  targetParentPageId: string | null;
}

export interface KnowledgeAddBlockParams {
  accountId: string;
  pageId: string;
  content: BlockContent;
  index?: number;
}

export interface KnowledgeUpdateBlockParams {
  accountId: string;
  blockId: string;
  content: BlockContent;
}

export class KnowledgeFacade {
  private readonly pageRepo: KnowledgePageRepository;
  private readonly blockRepo: KnowledgeBlockRepository;

  constructor(
    pageRepo: KnowledgePageRepository = new FirebaseKnowledgePageRepository(),
    blockRepo: KnowledgeBlockRepository = new FirebaseKnowledgeBlockRepository(),
  ) {
    this.pageRepo = pageRepo;
    this.blockRepo = blockRepo;
  }

  async createPage(params: KnowledgeCreatePageParams): Promise<string | null> {
    const result = await new CreateKnowledgePageUseCase(this.pageRepo).execute({
      accountId: params.accountId,
      workspaceId: params.workspaceId,
      title: params.title,
      parentPageId: params.parentPageId ?? null,
      createdByUserId: params.createdByUserId,
    });
    return result.success ? result.aggregateId : null;
  }

  async renamePage(params: KnowledgeRenamePageParams): Promise<boolean> {
    const result = await new RenameKnowledgePageUseCase(this.pageRepo).execute(params);
    return result.success;
  }

  async movePage(params: KnowledgeMovePageParams): Promise<boolean> {
    const result = await new MoveKnowledgePageUseCase(this.pageRepo).execute(params);
    return result.success;
  }

  async archivePage(accountId: string, pageId: string): Promise<boolean> {
    const result = await new ArchiveKnowledgePageUseCase(this.pageRepo).execute({
      accountId,
      pageId,
    });
    return result.success;
  }

  async getPage(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    return new GetKnowledgePageUseCase(this.pageRepo).execute(accountId, pageId);
  }

  async listPages(accountId: string): Promise<KnowledgePage[]> {
    return new ListKnowledgePagesUseCase(this.pageRepo).execute(accountId);
  }

  async getPageTree(accountId: string): Promise<KnowledgePageTreeNode[]> {
    return new GetKnowledgePageTreeUseCase(this.pageRepo).execute(accountId);
  }

  async addBlock(params: KnowledgeAddBlockParams): Promise<string | null> {
    const result = await new AddKnowledgeBlockUseCase(this.blockRepo).execute({
      accountId: params.accountId,
      pageId: params.pageId,
      content: params.content,
      index: params.index,
    });
    return result.success ? result.aggregateId : null;
  }

  async updateBlock(params: KnowledgeUpdateBlockParams): Promise<boolean> {
    const result = await new UpdateKnowledgeBlockUseCase(this.blockRepo).execute(params);
    return result.success;
  }

  async deleteBlock(accountId: string, blockId: string): Promise<boolean> {
    const result = await new DeleteKnowledgeBlockUseCase(this.blockRepo).execute({
      accountId,
      blockId,
    });
    return result.success;
  }

  async listBlocks(accountId: string, pageId: string): Promise<KnowledgeBlock[]> {
    return new ListKnowledgeBlocksUseCase(this.blockRepo).execute(accountId, pageId);
  }

  async listVersions(_accountId: string, _pageId: string): Promise<KnowledgeVersion[]> {
    return [];
  }
}

export const knowledgeFacade = new KnowledgeFacade();
