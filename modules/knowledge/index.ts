/**
 * @deprecated modules/knowledge is a compatibility shim.
 *
 * Domain types and use-cases have moved to core/wiki-core.
 * The cross-module query (getWorkspaceKnowledgeSummary) and its infrastructure
 * adapter (DefaultWorkspaceKnowledgeRepository) remain here because they depend
 * on @/modules/file, @/modules/parser, and @/modules/workspace.
 *
 * Canonical domain home: @/core/wiki-core
 * Do NOT add new features here — build them in core/wiki-core instead.
 */
export * from "./domain";
export * from "./application";
export * from "./infrastructure";
export * from "./interfaces";
