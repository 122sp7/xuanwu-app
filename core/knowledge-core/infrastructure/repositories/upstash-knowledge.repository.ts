/**
 * Module: knowledge-core
 * Layer: infrastructure/repository
 * Purpose: Adapter implementing domain repository contract via Upstash services.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Knowledge } from '../../domain/entities/knowledge.entity'
import { IKnowledgeRepository } from '../../domain/repositories/iknowledge.repository'

export class UpstashKnowledgeRepository implements IKnowledgeRepository {
  async save(_entity: Knowledge): Promise<void> {
    // Skeleton only: persist source-of-truth data with adapter composition.
  }

  async findById(_id: string): Promise<Knowledge | null> {
    // Skeleton only: hydrate domain entity from storage.
    return null
  }

  async search(_vector: number[]): Promise<Knowledge[]> {
    // Skeleton only: retrieval bridge should return ids then hydrate from source.
    return []
  }
}
