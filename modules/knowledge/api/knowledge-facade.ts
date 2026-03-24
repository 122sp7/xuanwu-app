/**
 * Module: knowledge
 * Layer: api
 * Purpose: KnowledgeFacade — the ONLY authorised entry point for cross-domain
 * access to the Knowledge domain.
 *
 * BOUNDARY RULE:
 *   Other modules (ai, search, onboarding, audit, etc.) MUST import from here:
 *     import { knowledgeFacade } from "@/modules/knowledge";
 *   They must NEVER reach into domain/, application/, infrastructure/ or
 *   interfaces/ directly.  This anti-corruption layer ensures that internal
 *   refactors never break consumers.
 *
 * CONTRACT:
 *   - All method parameters and return values are plain TypeScript primitives
 *     or DTOs — no domain aggregate classes are ever exposed.
 *   - Write methods return `string | null` (new ID) or `boolean` (success).
 *   - Read methods return typed DTOs or empty arrays; never throw to callers.
 *   - Dependency injection via constructor allows test doubles.
 */

import type { KnowledgePageRepository, KnowledgeBlockRepository } from "../domain/repositories/knowledge.repositories";
import type { KnowledgePage, KnowledgePageTreeNode } from "../domain/entities/knowledge-page.entity";
import type { KnowledgeBlock } from "../domain/entities/knowledge-block.entity";
import type { KnowledgeVersion } from "../domain/entities/knowledge-version.entity";
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
import { FirebaseKnowledgeBlockRepository } from "../infrastructure/firebase/FirebaseKnowledgeBlockRepository";

// ── Facade param types (cross-domain contract) ────────────────────────────────

/** Params for creating a new page. */
export interface KnowledgeCreatePageParams {
  /** Account (tenant) scope. */
  accountId: string;
  /** Optional workspace scope. */
  workspaceId?: string;
  title: string;
  /** null = root-level page. */
  parentPageId?: string | null;
  createdByUserId: string;
}

/** Params for renaming a page. */
export interface KnowledgeRenamePageParams {
  accountId: string;
  pageId: string;
  title: string;
}

/** Params for moving a page to a new parent (or to root). */
export interface KnowledgeMovePageParams {
  accountId: string;
  pageId: string;
  /** null = promote to root. */
  targetParentPageId: string | null;
}

/** Params for appending or inserting a block onto a page. */
export interface KnowledgeAddBlockParams {
  accountId: string;
  pageId: string;
  content: BlockContent;
  /** Insert at this position; omit to append at end. */
  index?: number;
}

/** Params for updating the content of an existing block. */
export interface KnowledgeUpdateBlockParams {
  accountId: string;
  blockId: string;
  content: BlockContent;
}

// ── Facade class ──────────────────────────────────────────────────────────────

/**
 * KnowledgeFacade — complete cross-domain API for the Knowledge module.
 *
 * Typical usage from another domain:
 * ```typescript
 * import { knowledgeFacade } from "@/modules/knowledge";
 *
 * // Create a welcome page during onboarding
 * const pageId = await knowledgeFacade.createPage({
 *   accountId, title: "Welcome", createdByUserId
 * });
 *
 * // Add generated AI content as a block
 * if (pageId) {
 *   await knowledgeFacade.addBlock({ accountId, pageId, content: { type: "text", text: summary } });
 * }
 *
 * // Retrieve the full page tree for sidebar rendering
 * const tree = await knowledgeFacade.getPageTree(accountId);
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

  // ── Page writes ───────────────────────────────────────────────────────────

  /**
   * Creates a new page and returns its generated ID.
   * Used by: onboarding (welcome page), ai (knowledge capture).
   *
   * @returns the new page ID, or null on validation / persistence failure.
   */
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

  /**
   * Renames an existing page.
   * Used by: ai (update page title after summarisation).
   *
   * @returns true on success, false if the page was not found or input invalid.
   */
  async renamePage(params: KnowledgeRenamePageParams): Promise<boolean> {
    const result = await new RenameKnowledgePageUseCase(this.pageRepo).execute(params);
    return result.success;
  }

  /**
   * Moves a page to a new parent (or promotes it to root when targetParentPageId is null).
   * Used by: ai (reorganise knowledge structure).
   *
   * @returns true on success, false if the page was not found or the move is invalid.
   */
  async movePage(params: KnowledgeMovePageParams): Promise<boolean> {
    const result = await new MoveKnowledgePageUseCase(this.pageRepo).execute(params);
    return result.success;
  }

  /**
   * Archives (soft-deletes) a page.
   * Used by: workspace cleanup flows, admin tools.
   *
   * @returns true on success, false if the page was not found.
   */
  async archivePage(accountId: string, pageId: string): Promise<boolean> {
    const result = await new ArchiveKnowledgePageUseCase(this.pageRepo).execute({
      accountId,
      pageId,
    });
    return result.success;
  }

  // ── Page reads ────────────────────────────────────────────────────────────

  /**
   * Returns a single page by ID, or null if not found.
   * Used by: search (metadata enrichment), ai (content lookup).
   */
  async getPage(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    return new GetKnowledgePageUseCase(this.pageRepo).execute(accountId, pageId);
  }

  /**
   * Returns all active pages for an account as a flat list.
   * Used by: search (full-text index build), export flows.
   */
  async listPages(accountId: string): Promise<KnowledgePage[]> {
    return new ListKnowledgePagesUseCase(this.pageRepo).execute(accountId);
  }

  /**
   * Returns the full nested page tree rooted at the account level.
   * Used by: sidebar navigation renderers in other feature areas.
   */
  async getPageTree(accountId: string): Promise<KnowledgePageTreeNode[]> {
    return new GetKnowledgePageTreeUseCase(this.pageRepo).execute(accountId);
  }

  // ── Block writes ──────────────────────────────────────────────────────────

  /**
   * Appends (or inserts) a block on a page and returns its generated ID.
   * Used by: ai (auto-populate pages with generated content), onboarding.
   *
   * @returns the new block ID, or null on failure.
   */
  async addBlock(params: KnowledgeAddBlockParams): Promise<string | null> {
    const result = await new AddKnowledgeBlockUseCase(this.blockRepo).execute({
      accountId: params.accountId,
      pageId: params.pageId,
      content: params.content,
      index: params.index,
    });
    return result.success ? result.aggregateId : null;
  }

  /**
   * Updates the content of an existing block.
   * Used by: ai (refine / expand generated content).
   *
   * @returns true on success, false if the block was not found or input invalid.
   */
  async updateBlock(params: KnowledgeUpdateBlockParams): Promise<boolean> {
    const result = await new UpdateKnowledgeBlockUseCase(this.blockRepo).execute(params);
    return result.success;
  }

  /**
   * Deletes a block from a page.
   * Used by: ai (remove outdated content), workspace cleanup.
   *
   * @returns true on success (idempotent — always succeeds even if not found).
   */
  async deleteBlock(accountId: string, blockId: string): Promise<boolean> {
    const result = await new DeleteKnowledgeBlockUseCase(this.blockRepo).execute({
      accountId,
      blockId,
    });
    return result.success;
  }

  // ── Block reads ───────────────────────────────────────────────────────────

  /**
   * Returns all blocks for a page ordered by position (ascending).
   * Used by: search (full-text indexing), ai (context window assembly).
   */
  async listBlocks(accountId: string, pageId: string): Promise<KnowledgeBlock[]> {
    return new ListKnowledgeBlocksUseCase(this.blockRepo).execute(accountId, pageId);
  }

  // ── Version reads (stub until FirebaseKnowledgeVersionRepository is added) ─

  /**
   * Returns version history for a page (newest first).
   * Currently returns an empty array — version persistence is not yet implemented.
   */
  async listVersions(_accountId: string, _pageId: string): Promise<KnowledgeVersion[]> {
    return [];
  }
}

// ── Default singleton ─────────────────────────────────────────────────────────

/**
 * Pre-built facade instance backed by Firebase repositories.
 * Import this in other modules for normal usage.
 *
 * ```typescript
 * import { knowledgeFacade } from "@/modules/knowledge";
 * ```
 */
export const knowledgeFacade = new KnowledgeFacade();
