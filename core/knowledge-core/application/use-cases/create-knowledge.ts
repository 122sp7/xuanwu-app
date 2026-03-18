/**
 * Module: knowledge-core
 * Layer: application/use-case
 * Purpose: Write-side orchestration for creating knowledge source-of-truth records.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Knowledge } from '../../domain/entities/knowledge.entity'
import { IKnowledgeRepository } from '../../domain/repositories/iknowledge.repository'

export interface CreateKnowledgeDTO {
  title: string
  content: string
}

export class CreateKnowledgeUseCase {
  constructor(private readonly repo: IKnowledgeRepository) {}

  async execute(dto: CreateKnowledgeDTO): Promise<Knowledge> {
    // Skeleton only: keep creation flow here without factory dependency.
    const entity = new Knowledge('TODO_ID', dto.title, dto.content, 'DRAFT', new Date())

    // Skeleton only: taxonomy/retrieval/governance orchestration belongs here.
    await this.repo.save(entity)
    return entity
  }
}
