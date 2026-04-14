/**
 * notion/knowledge domain/ports — driven port interfaces for the knowledge subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { BacklinkIndexRepository } from "../repositories/BacklinkIndexRepository";
export type { ContentBlockRepository } from "../repositories/ContentBlockRepository";
export type { KnowledgeCollectionRepository } from "../repositories/KnowledgeCollectionRepository";
export type { KnowledgePageRepository } from "../repositories/KnowledgePageRepository";
export type {
  KnowledgeSummaryInput,
  KnowledgeSummaryResult,
  KnowledgeSummaryPort,
} from "./KnowledgeSummaryPort";
