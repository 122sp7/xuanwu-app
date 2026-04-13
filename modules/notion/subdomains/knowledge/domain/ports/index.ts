/**
 * notion/knowledge domain/ports — driven port interfaces for the knowledge subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { BacklinkIndexRepository as IBacklinkIndexPort } from "../repositories/BacklinkIndexRepository";
export type { ContentBlockRepository as IContentBlockPort } from "../repositories/ContentBlockRepository";
export type { KnowledgeCollectionRepository as IKnowledgeCollectionPort } from "../repositories/KnowledgeCollectionRepository";
export type { KnowledgePageRepository as IKnowledgePagePort } from "../repositories/KnowledgePageRepository";
