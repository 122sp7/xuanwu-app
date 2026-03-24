/**
 * Module: knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side query helpers for reading Knowledge domain data.
 *
 * These are plain async functions (not Server Actions) that can be called
 * from Server Components or Server Actions to fetch read-side data.
 */

import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/knowledge-page.entity";
import type { KnowledgeBlock } from "../../domain/entities/knowledge-block.entity";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  GetKnowledgePageTreeUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import { ListKnowledgeBlocksUseCase } from "../../application/use-cases/knowledge-block.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseKnowledgeBlockRepository";
import type { KnowledgeVersion } from "../../domain/entities/knowledge-version.entity";

// ── Page queries ──────────────────────────────────────────────────────────────

/** Returns a single page or null if not found. */
export async function getKnowledgePage(
  accountId: string,
  pageId: string,
): Promise<KnowledgePage | null> {
  return new GetKnowledgePageUseCase(new FirebaseKnowledgePageRepository()).execute(
    accountId,
    pageId,
  );
}

/** Returns all active pages for an account as a flat list. */
export async function getKnowledgePages(accountId: string): Promise<KnowledgePage[]> {
  return new ListKnowledgePagesUseCase(new FirebaseKnowledgePageRepository()).execute(accountId);
}

/**
 * Returns the full page tree rooted at the account level.
 * Useful for rendering sidebar navigation.
 */
export async function getKnowledgePageTree(accountId: string): Promise<KnowledgePageTreeNode[]> {
  return new GetKnowledgePageTreeUseCase(new FirebaseKnowledgePageRepository()).execute(accountId);
}

// ── Block queries ─────────────────────────────────────────────────────────────

/** Returns all blocks for a page, ordered by `order` ascending. */
export async function getKnowledgeBlocks(
  accountId: string,
  pageId: string,
): Promise<KnowledgeBlock[]> {
  return new ListKnowledgeBlocksUseCase(new FirebaseKnowledgeBlockRepository()).execute(
    accountId,
    pageId,
  );
}

// ── Version queries ───────────────────────────────────────────────────────────

/**
 * Returns version history for a page (newest first).
 * Returns an empty array until FirebaseKnowledgeVersionRepository is implemented.
 */
export async function getKnowledgeVersions(
  _accountId: string,
  _pageId: string,
): Promise<KnowledgeVersion[]> {
  // Placeholder: returns empty until infrastructure layer is complete
  return [];
}
