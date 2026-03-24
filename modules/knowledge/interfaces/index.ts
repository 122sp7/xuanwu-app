/**
 * Module: knowledge
 * Layer: interfaces/barrel
 * Purpose: Re-exports all public interface adapters for the Knowledge module.
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

// ── Facade (cross-domain API) ─────────────────────────────────────────────────
export { KnowledgeFacade, knowledgeFacade } from "./api/knowledge-facade";
export type {
  KnowledgeCreatePageParams,
  KnowledgeAddBlockParams,
} from "./api/knowledge-facade";
