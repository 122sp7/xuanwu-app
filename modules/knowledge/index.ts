/**
 * knowledge module public API
 */
export type {
  KnowledgeDocumentEntity,
  KnowledgeChunkEntity,
} from "./domain/entities/KnowledgeDocument";
export type { KnowledgeRepository } from "./domain/repositories/KnowledgeRepository";
export {
  UpsertKnowledgeDocumentUseCase,
  ListKnowledgeDocumentsUseCase,
} from "./application/use-cases/knowledge.use-cases";
export { KnowledgeRepoImpl } from "./infrastructure/KnowledgeRepoImpl";
