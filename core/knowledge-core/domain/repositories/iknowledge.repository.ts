/**
 * Module: knowledge-core
 * Layer: domain/port
 * Purpose: Source-of-truth repository contract for knowledge entities.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Knowledge } from '../entities/knowledge.entity'

export interface IKnowledgeRepository {
  save(entity: Knowledge): Promise<void>
  findById(id: string): Promise<Knowledge | null>
  search(vector: number[]): Promise<Knowledge[]>
}
