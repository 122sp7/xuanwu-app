/**
 * Module: knowledge
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer — the sole cross-domain entry point
 * for the knowledge domain.
 */

export { KnowledgeFacade, knowledgeFacade } from "./knowledge-facade";
export type {
  KnowledgeCreatePageParams,
  KnowledgeRenamePageParams,
  KnowledgeMovePageParams,
  KnowledgeAddBlockParams,
  KnowledgeUpdateBlockParams,
} from "./knowledge-facade";

export { KnowledgeApi } from "./knowledge-api";

export { BlockEditorView } from "../interfaces/components/BlockEditorView";
export { useBlockEditorStore } from "../interfaces/store/block-editor.store";
export type { Block } from "../interfaces/store/block-editor.store";

// ── Server Actions (write-side) ───────────────────────────────────────────────

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
  // Collection actions
  createKnowledgeCollection,
  renameKnowledgeCollection,
  addPageToCollection,
  removePageFromCollection,
  addCollectionColumn,
  archiveKnowledgeCollection,
  // Wiki / Knowledge Base verification actions
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
} from "../interfaces/_actions/knowledge.actions";

export type { ApproveKnowledgePageDto } from "../application/dto/knowledge.dto";

// ── Wiki / Knowledge Base DTO types ──────────────────────────────────────────

export type {
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
  CreateWikiSpaceDto,
} from "../application/dto/knowledge.dto";

// ── Collection types ──────────────────────────────────────────────────────────

export type {
  KnowledgeCollection,
  CollectionColumn,
  CollectionColumnType,
  CollectionStatus,
  CollectionSpaceType,
} from "../domain/entities/knowledge-collection.entity";

export type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../application/dto/knowledge.dto";

// ── Public event contracts ────────────────────────────────────────────────────

export {
  KNOWLEDGE_EVENT_TYPES,
} from "./events";

export type {
  KnowledgePageApprovedEvent,
  KnowledgeDomainEvent,
  ExtractedTask,
  ExtractedInvoice,
  KnowledgeEventType,
} from "./events";

// ── Queries (read-side) ──────────────────────────────────────────────

export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePageTree,
  getKnowledgeBlocks,
  getKnowledgeVersions,
  getKnowledgeCollection,
  getKnowledgeCollections,
} from "../interfaces/queries/knowledge.queries";

export type { KnowledgePageTreeNode } from "../domain/entities/content-page.entity";
export type { KnowledgePage } from "../domain/entities/content-page.entity";

// ── UI Components ─────────────────────────────────────────────────────────────
export { PageTreeView } from "../interfaces/components/PageTreeView";
export { PageDialog } from "../interfaces/components/PageDialog";
