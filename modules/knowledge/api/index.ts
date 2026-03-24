/**
 * Module: knowledge
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer — the sole cross-domain entry point
 * for the Knowledge domain.
 *
 * Other modules import from "@/modules/knowledge" which re-exports these.
 * Direct imports into domain/, application/, infrastructure/ are forbidden.
 */

export { KnowledgeFacade, knowledgeFacade } from "./knowledge-facade";
export type {
  KnowledgeCreatePageParams,
  KnowledgeRenamePageParams,
  KnowledgeMovePageParams,
  KnowledgeAddBlockParams,
  KnowledgeUpdateBlockParams,
} from "./knowledge-facade";
