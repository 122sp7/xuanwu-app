/**
 * Module: wiki
 * Layer: application/use-case
 * Purpose: Write-side orchestration for creating a wiki page record.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { randomUUID } from 'crypto'
import { WikiPage } from '../../domain/entities/wiki-page.entity'
import type { WikiPageScope } from '../../domain/entities/wiki-page.entity'
import type { IWikiPageRepository } from '../../domain/repositories/iwiki-page.repository'

export interface CreateWikiPageDTO {
  organizationId: string
  workspaceId: string | null
  title: string
  content?: string
  scope: WikiPageScope
  parentPageId?: string | null
  order?: number
  createdBy: string
}

export class CreateWikiPageUseCase {
  constructor(private readonly repo: IWikiPageRepository) {}

  async execute(dto: CreateWikiPageDTO): Promise<WikiPage> {
    if (!dto.title.trim()) {
      throw new Error('Wiki page title cannot be empty')
    }

    const now = new Date().toISOString()
    const page = new WikiPage(
      randomUUID(),
      dto.organizationId,
      dto.workspaceId,
      dto.title.trim(),
      dto.content ?? '',
      dto.scope,
      'draft',
      dto.parentPageId ?? null,
      dto.order ?? 0,
      false,
      dto.createdBy,
      now,
      now,
    )

    await this.repo.save(page)
    return page
  }
}
