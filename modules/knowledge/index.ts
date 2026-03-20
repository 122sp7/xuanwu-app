/**
 * @deprecated modules/knowledge is a temporary shim.
 *
 * The UI components (WorkspaceKnowledgeTab, OrganizationKnowledgeTab) have been
 * absorbed into WorkspaceWikiTab and the wiki hub page. The remaining domain
 * types and query are re-exported here only until the wiki module defines its own.
 *
 * Canonical home for knowledge domain: core/knowledge-core (wiki foundation).
 * Do NOT add new features here — build them in the wiki section instead.
 */
export * from "./domain";
export * from "./application";
export * from "./infrastructure";
export * from "./interfaces";
