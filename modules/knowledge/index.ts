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
} from "./domain/entities/content-page.entity";

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
} from "./interfaces/_actions/knowledge.actions";

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePageTree,
  getKnowledgeBlocks,
  getKnowledgeVersions,
} from "./interfaces/queries/knowledge.queries";

// ── Interfaces: Components ────────────────────────────────────────────────────
export { BlockEditorView } from "./interfaces/components/BlockEditorView";
export { PagesView } from "./interfaces/components/PagesView";
export { PagesDnDView } from "./interfaces/components/PagesDnDView";
