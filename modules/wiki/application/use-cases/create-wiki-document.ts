/**
 * Module: wiki-core
 * Layer: application/use-case
 * Purpose: Write-side orchestration for creating wiki document records.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { randomBytes } from 'crypto'
import { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { WikiDocumentScope } from '../../domain/entities/wiki-document.entity'
import type { IWikiDocumentRepository } from '../../domain/repositories/iwiki-document.repository'
import type { IEmbeddingRepository } from '../../domain/repositories/iembedding.repository'
import { Taxonomy } from '../../domain/value-objects/taxonomy.vo'

/** Generates a unique document ID aligned with the wiki-contract documentId spec. */
function generateDocumentId(): string {
  return 'doc_' + randomBytes(8).toString('hex')
}

export interface CreateWikiDocumentDTO {
  title: string
  content: string
  organizationId: string
  workspaceId: string | null
  taxonomy?: Taxonomy
  scope?: WikiDocumentScope
  createdBy?: string
}

export class CreateWikiDocumentUseCase {
  constructor(
    private readonly repo: IWikiDocumentRepository,
    /** Optional: provide to embed document content at creation time. */
    private readonly embedder?: IEmbeddingRepository,
  ) {}

  async execute(dto: CreateWikiDocumentDTO): Promise<WikiDocument> {
    const id = generateDocumentId()

    const taxonomy = dto.taxonomy ?? new Taxonomy('other', [], 'default')
    const scope = dto.scope ?? 'organization'

    const entity = new WikiDocument(
      id,
      dto.title,
      dto.content,
      'DRAFT',
      new Date(),
      dto.organizationId,
      dto.workspaceId,
      taxonomy,
      scope,
    )

    // Embed document content when an embedder is available; the Python ingestion
    // worker handles embedding for bulk uploads so this is optional at creation time.
    if (this.embedder && dto.content.trim()) {
      await this.embedder.embed({ text: dto.content, documentId: id })
    }

    await this.repo.save(entity)
    return entity
  }
}
