/**
 * Module: notion/subdomains/knowledge
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// ── Types (read-only snapshots – no aggregate class refs) ─────────────────────
export type { KnowledgePageSnapshot } from "../domain/aggregates/KnowledgePage";
/** @alias KnowledgePageSnapshot — provided for backward-compatibility */
export type { KnowledgePageSnapshot as KnowledgePage } from "../domain/aggregates/KnowledgePage";
export type { ContentBlockSnapshot } from "../domain/aggregates/ContentBlock";
export type { KnowledgeCollectionSnapshot } from "../domain/aggregates/KnowledgeCollection";

// ── Server action DTOs ────────────────────────────────────────────────────────
export type { CreateKnowledgePageDto, RenameKnowledgePageDto, MoveKnowledgePageDto, ArchiveKnowledgePageDto, ReorderKnowledgePageBlocksDto } from "../application/dto/KnowledgePageDto";
export type { AddKnowledgeBlockDto, UpdateKnowledgeBlockDto, DeleteKnowledgeBlockDto } from "../application/dto/ContentBlockDto";
export type { CreateKnowledgeCollectionDto } from "../application/dto/KnowledgeCollectionDto";

// ── Query functions (server-side reads) ───────────────────────────────────────
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePagesByWorkspace,
  getKnowledgePageTree,
  getKnowledgePageTreeByWorkspace,
  getKnowledgeBlocks,
  getKnowledgeCollection,
  getKnowledgeCollections,
} from "../interfaces/queries";

// ── Server actions (drives: app router, Server Components) ────────────────────
export {
  createKnowledgePage,
  renameKnowledgePage,
  moveKnowledgePage,
  archiveKnowledgePage,
  reorderKnowledgePageBlocks,
  publishKnowledgeVersion,
  approveKnowledgePage,
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
  createKnowledgeCollection,
  renameKnowledgeCollection,
  addPageToCollection,
  removePageFromCollection,
  archiveKnowledgeCollection,
} from "../interfaces/_actions";

// ── UI Components ─────────────────────────────────────────────────────────────
export { PageTreeView } from "../interfaces/components/PageTreeView";
export type { PageTreeViewProps } from "../interfaces/components/PageTreeView";
export { PageDialog } from "../interfaces/components/PageDialog";
export { BlockEditorView } from "../interfaces/components/BlockEditorView";
export { PageEditorView } from "../interfaces/components/PageEditorView";
export type { PageEditorViewProps } from "../interfaces/components/PageEditorView";

// ── Store ─────────────────────────────────────────────────────────────────────
export { useBlockEditorStore } from "../interfaces/store/block-editor.store";
export type { EditorBlock } from "../interfaces/store/block-editor.store";

// ── Tree node type (needed by app/ pages) ─────────────────────────────────────
export type { KnowledgePageTreeNode } from "../domain/aggregates/KnowledgePage";

// ── Domain events (published language — for cross-module event subscriptions) ─
export type { PageApprovedEvent, PageApprovedPayload, ExtractedTask, ExtractedInvoice } from "../domain/events/KnowledgePageEvents";
