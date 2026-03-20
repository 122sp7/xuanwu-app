/**
 * Infrastructure layer for modules/knowledge.
 * DefaultWorkspaceKnowledgeRepository depends on cross-module adapters
 * (file, parser, workspace) and therefore stays at the module boundary.
 * Its domain contracts are sourced from @/core/wiki-core.
 */
export { DefaultWorkspaceKnowledgeRepository } from "./default/DefaultWorkspaceKnowledgeRepository";
