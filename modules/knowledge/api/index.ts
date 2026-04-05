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
} from "../interfaces/_actions/knowledge.actions";

export type { ApproveKnowledgePageDto } from "../application/dto/knowledge.dto";

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
