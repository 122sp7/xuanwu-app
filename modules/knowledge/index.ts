/**
 * Module: knowledge
 * Layer: module/barrel (public API)
 *
 * This is the ONLY file that external modules should import from.
 * All internal implementation details (domain, application, infrastructure)
 * are NOT importable from outside — use the exports listed here.
 *
 * Boundary rule: other modules import via `@/modules/knowledge`, never from
 * `@/modules/knowledge/domain/...` or deeper paths.
 *
 * Access pattern:
 *   - Cross-domain programmatic usage → `knowledgeFacade` (or `KnowledgeFacade`)
 *   - UI mutations                    → Server Actions below
 *   - UI reads                        → Query functions below
 *
 * Current boundary note:
 *   - `Page` / `Block` are owned by this module.
 *   - `KnowledgeCollection` is still exported here as a transitional surface.
 *   - `Article` / `Category` belong to `knowledge-base`.
 */

// ── API: Facade (cross-domain entry point) ────────────────────────────────────
export { KnowledgeFacade, knowledgeFacade } from "./api/knowledge-facade";
export type {
  KnowledgeCreatePageParams,
  KnowledgeRenamePageParams,
  KnowledgeMovePageParams,
  KnowledgeAddBlockParams,
  KnowledgeUpdateBlockParams,
} from "./api/knowledge-facade";

// ── Domain: entity types ──────────────────────────────────────────────────────
export type {
  KnowledgePage,
  KnowledgePageStatus,
  KnowledgePageTreeNode,
} from "./domain/entities/knowledge-page.entity";

export type { KnowledgeBlock } from "./domain/entities/content-block.entity";

export type { KnowledgeVersion } from "./domain/entities/content-version.entity";

export type { BlockContent, BlockType } from "./domain/value-objects/block-content";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export {
  createKnowledgePage,
  renameKnowledgePage,
  moveKnowledgePage,
  archiveKnowledgePage,
  reorderKnowledgePageBlocks,
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
  publishKnowledgeVersion,
  approveKnowledgePage,
  createKnowledgeCollection,
  renameKnowledgeCollection,
  addPageToCollection,
  removePageFromCollection,
  addCollectionColumn,
  archiveKnowledgeCollection,
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
} from "./interfaces/_actions/knowledge.actions";

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePageTree,
  getKnowledgeBlocks,
  getKnowledgeVersions,
  getKnowledgeCollection,
  getKnowledgeCollections,
} from "./interfaces/queries/knowledge.queries";

// ── Domain: Collection + Wiki types ──────────────────────────────────────────
export type {
  KnowledgeCollection,
  CollectionSpaceType,
} from "./domain/entities/knowledge-collection.entity";

export type { PageVerificationState } from "./domain/entities/knowledge-page.entity";

// ── Interfaces: Components ────────────────────────────────────────────────────
export { BlockEditorView } from "./interfaces/components/BlockEditorView";
export { PageTreeView } from "./interfaces/components/PageTreeView";
export { PageDialog } from "./interfaces/components/PageDialog";
