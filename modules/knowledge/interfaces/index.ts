/**
 * Module: knowledge
 * Layer: interfaces/barrel
 * Purpose: Re-exports all public interface adapters for the Knowledge module.
 *
 * NOTE: The cross-domain facade (KnowledgeFacade) lives in `api/` not here.
 * It is re-exported from the module root index.ts.
 */

// ── Server Actions ────────────────────────────────────────────────────────────
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
} from "./_actions/knowledge.actions";

// ── Queries ───────────────────────────────────────────────────────────────────
export {
  getKnowledgePage,
  getKnowledgePages,
  getKnowledgePageTree,
  getKnowledgeBlocks,
  getKnowledgeVersions,
} from "./queries/knowledge.queries";
