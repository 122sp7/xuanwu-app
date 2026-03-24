/**
 * Module: knowledge
 * Layer: interfaces/api
 * Purpose: KnowledgeFacade — the ONLY entry point for cross-domain access to the
 * Knowledge domain.
 *
 * OTHER DOMAINS (search, onboarding, ai, audit, etc.) MUST use this facade
 * instead of importing from deeper layers. This enforces MDDD boundary rules
 * and shields consumers from internal refactors.
 *
 * Design principles:
 *  - All parameters and return values are plain TypeScript DTOs (no domain classes).
 *  - The facade never exposes Page aggregates, Block entities, or repository types.
 *  - It accepts simple primitive-based inputs and returns typed results or null.
 *
 * Dependency injection:
 *  The default instance uses Firebase repositories. For testing, pass custom
 *  repositories via the constructor.
 */

import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/knowledge-page.entity";
import type { KnowledgeBlock } from "../../domain/entities/knowledge-block.entity";
import type { BlockContent } from "../../domain/value-objects/block-content";
import {
  CreateKnowledgePageUseCase,
  GetKnowledgePageUseCase,
  GetKnowledgePageTreeUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  ListKnowledgeBlocksUseCase,
} from "../../application/use-cases/knowledge-block.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseKnowledgeBlockRepository";

// ── Facade input/output DTOs (cross-domain contract types) ────────────────────

export interface KnowledgeCreatePageParams {
  /** Account (tenant) ID. */
  accountId: string;
  workspaceId?: string;
  title: string;
  parentPageId?: string | null;
  createdByUserId: string;
}

export interface KnowledgeAddBlockParams {
  accountId: string;
  pageId: string;
  content: BlockContent;
}

// ── Facade class ──────────────────────────────────────────────────────────────

/**
 * KnowledgeFacade — public cross-domain API for the Knowledge module.
 *
 * Usage from another domain:
 * ```typescript
 * import { knowledgeFacade } from "@/modules/knowledge";
 *
 * const pageId = await knowledgeFacade.createPage({ accountId, title, createdByUserId });
 * const tree   = await knowledgeFacade.getPageTree(accountId);
 * ```
 */
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

  // ── Pages ──────────────────────────────────────────────────────────────────

  /**
   * Creates a new page in an account and returns its generated ID.
   * Used by: onboarding (auto-create welcome page), ai (knowledge capture).
   */
  async createPage(params: KnowledgeCreatePageParams): Promise<string | null> {
    const result = await new CreateKnowledgePageUseCase(this.pageRepo).execute({
      accountId: params.accountId,
      workspaceId: params.workspaceId,
      title: params.title,
      parentPageId: params.parentPageId ?? null,
      createdByUserId: params.createdByUserId,
    });
    return result.success ? (result.aggregateId ?? null) : null;
  }

  /**
   * Returns a single page by ID or null.
   * Used by: search (metadata enrichment), ai (content lookup).
   */
  async getPage(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    return new GetKnowledgePageUseCase(this.pageRepo).execute(accountId, pageId);
  }

  /**
   * Returns the full nested page tree for an account.
   * Used by: navigation/sidebar renderers in other feature areas.
   */
  async getPageTree(accountId: string): Promise<KnowledgePageTreeNode[]> {
    return new GetKnowledgePageTreeUseCase(this.pageRepo).execute(accountId);
  }

  // ── Blocks ─────────────────────────────────────────────────────────────────

  /**
   * Appends a block to a page and returns the new block ID.
   * Used by: ai (auto-populate page with generated content), onboarding.
   */
  async addBlock(params: KnowledgeAddBlockParams): Promise<string | null> {
    const result = await new AddKnowledgeBlockUseCase(this.blockRepo).execute({
      accountId: params.accountId,
      pageId: params.pageId,
      content: params.content,
    });
    return result.success ? (result.aggregateId ?? null) : null;
  }

  /**
   * Returns all blocks for a page, ordered by `order` ascending.
   * Used by: search (full-text indexing), ai (context retrieval).
   */
  async getBlocks(accountId: string, pageId: string): Promise<KnowledgeBlock[]> {
    return new ListKnowledgeBlocksUseCase(this.blockRepo).execute(accountId, pageId);
  }
}

// ── Default singleton ─────────────────────────────────────────────────────────

/**
 * Default facade instance (uses Firebase repositories).
 * Import this in other domains for typical usage.
 */
export const knowledgeFacade = new KnowledgeFacade();
