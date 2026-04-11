/**
 * notion/knowledge domain/ports — driven port interfaces for the knowledge subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IBacklinkIndexRepository as IBacklinkIndexPort } from "../repositories/IBacklinkIndexRepository";
export type { IContentBlockRepository as IContentBlockPort } from "../repositories/IContentBlockRepository";
export type { IKnowledgeCollectionRepository as IKnowledgeCollectionPort } from "../repositories/IKnowledgeCollectionRepository";
export type { IKnowledgePageRepository as IKnowledgePagePort } from "../repositories/IKnowledgePageRepository";
