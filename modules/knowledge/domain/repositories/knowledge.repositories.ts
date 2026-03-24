/**
 * Module: knowledge
 * Layer: domain/repositories
 * Purpose: Repository port interfaces for Knowledge domain persistence.
 *
 * All interfaces are pure TypeScript — no framework imports.
 * Implementations live in infrastructure/firebase/.
 *
 * Dependency direction: domain ← infrastructure (implementations depend on ports).
 */

import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
} from "../entities/knowledge-page.entity";
import type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
} from "../entities/knowledge-block.entity";
import type {
  KnowledgeVersion,
  CreateKnowledgeVersionInput,
} from "../entities/knowledge-version.entity";

// ── Page repository ───────────────────────────────────────────────────────────

export interface KnowledgePageRepository {
  /** Creates a new page and returns the persisted entity. */
  create(input: CreateKnowledgePageInput): Promise<KnowledgePage>;
  /** Renames a page; returns updated entity or null if not found. */
  rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>;
  /** Moves a page to a new parent; returns updated entity or null if not found. */
  move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>;
  /** Replaces blockIds order; returns updated entity or null if not found. */
  reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>;
  /** Marks a page as archived; returns updated entity or null if not found. */
  archive(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  /** Fetches a single page by ID. */
  findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  /** Lists all active pages for an account (flat list; caller builds tree). */
  listByAccountId(accountId: string): Promise<KnowledgePage[]>;
  /** Lists all active pages scoped to a workspace. */
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
}

// ── Block repository ──────────────────────────────────────────────────────────

export interface KnowledgeBlockRepository {
  /** Creates a new block and returns the persisted entity. */
  add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock>;
  /** Updates block content; returns updated entity or null if not found. */
  update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null>;
  /** Deletes a block by ID. */
  delete(accountId: string, blockId: string): Promise<void>;
  /** Fetches a single block by ID. */
  findById(accountId: string, blockId: string): Promise<KnowledgeBlock | null>;
  /** Lists all blocks for a page, ordered by `order` ascending. */
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]>;
}

// ── Version repository ────────────────────────────────────────────────────────

export interface KnowledgeVersionRepository {
  /**
   * Captures the current state of a page as a new version snapshot.
   * The implementation is responsible for reading page + blocks and
   * assembling the snapshot.
   */
  create(input: CreateKnowledgeVersionInput): Promise<KnowledgeVersion>;
  /** Fetches a single version by ID. */
  findById(accountId: string, versionId: string): Promise<KnowledgeVersion | null>;
  /** Lists all versions for a page, newest first. */
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeVersion[]>;
}
