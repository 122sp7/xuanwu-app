/**
 * Module: content
 * Layer: module/barrel (public API)
 *
 * This is the ONLY file that external modules should import from.
 * All internal implementation details (domain, application, infrastructure)
 * are NOT importable from outside — use the exports listed here.
 *
 * Boundary rule: other modules import via `@/modules/content`, never from
 * `@/modules/content/domain/...` or deeper paths.
 *
 * Access pattern:
 *   - Cross-domain programmatic usage → `contentFacade` (or `ContentFacade`)
 *   - UI mutations                    → Server Actions below
 *   - UI reads                        → Query functions below
 */

// ── API: Facade (cross-domain entry point) ────────────────────────────────────
export { ContentFacade, contentFacade } from "./api/content-facade";
export type {
  ContentCreatePageParams,
  ContentRenamePageParams,
  ContentMovePageParams,
  ContentAddBlockParams,
  ContentUpdateBlockParams,
} from "./api/content-facade";

// ── Domain: entity types ──────────────────────────────────────────────────────
export type {
  ContentPage,
  ContentPageStatus,
  ContentPageTreeNode,
} from "./domain/entities/content-page.entity";

export type { ContentBlock } from "./domain/entities/content-block.entity";

export type { ContentVersion } from "./domain/entities/content-version.entity";

export type { BlockContent, BlockType } from "./domain/value-objects/block-content";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export {
  createContentPage,
  renameContentPage,
  moveContentPage,
  archiveContentPage,
  reorderContentPageBlocks,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock,
  publishContentVersion,
} from "./interfaces/_actions/content.actions";

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getContentPage,
  getContentPages,
  getContentPageTree,
  getContentBlocks,
  getContentVersions,
} from "./interfaces/queries/content.queries";

// ── Interfaces: Components ────────────────────────────────────────────────────
export { BlockEditorView } from "./interfaces/components/BlockEditorView";
