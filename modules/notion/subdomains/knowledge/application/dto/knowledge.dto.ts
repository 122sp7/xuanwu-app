/**
 * Application-layer DTO re-exports for the knowledge subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
export type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
export type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
export type { BlockContent } from "../../domain/value-objects/BlockContent";
export { richTextToPlainText } from "../../domain/value-objects/BlockContent";
