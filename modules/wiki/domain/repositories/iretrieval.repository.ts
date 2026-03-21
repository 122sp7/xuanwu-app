/**
 * Module: wiki
 * Layer: domain/port
 * Purpose: Retrieval index contract; index is disposable and rebuildable.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiDocument } from '../entities/wiki-document.entity'

export interface RetrievalHit {
  entity: WikiDocument
  score: number
}

export interface IRetrievalRepository {
  searchByVector(vector: number[], topK: number): Promise<RetrievalHit[]>
  searchByMetadata(filter: string, vector: number[]): Promise<WikiDocument[]>
}
