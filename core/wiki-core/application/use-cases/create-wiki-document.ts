/**
 * Module: wiki-core
 * Layer: application/use-case
 * Purpose: Write-side orchestration for creating wiki document records.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IWikiDocumentRepository } from '../../domain/repositories/iwiki-document.repository'

export interface CreateWikiDocumentDTO {
  title: string
  content: string
}

export class CreateWikiDocumentUseCase {
  constructor(private readonly repo: IWikiDocumentRepository) {}

  async execute(dto: CreateWikiDocumentDTO): Promise<WikiDocument> {
    // Skeleton only: keep creation flow here without factory dependency.
    const entity = new WikiDocument('TODO_ID', dto.title, dto.content, 'DRAFT', new Date())

    // Skeleton only: taxonomy/retrieval/governance orchestration belongs here.
    await this.repo.save(entity)
    return entity
  }
}
