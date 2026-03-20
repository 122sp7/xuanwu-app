/**
 * Module: wiki-core
 * Layer: application/use-case
 * Purpose: Write-side orchestration for updating wiki page title and/or content.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiPage } from '../../domain/entities/wiki-page.entity'
import type { IWikiPageRepository } from '../../domain/repositories/iwiki-page.repository'

export interface UpdateWikiPageDTO {
  pageId: string
  title?: string
  content?: string
}

export class UpdateWikiPageUseCase {
  constructor(private readonly repo: IWikiPageRepository) {}

  async execute(dto: UpdateWikiPageDTO): Promise<WikiPage> {
    const page = await this.repo.findById(dto.pageId)
    if (!page) {
      throw new Error(`Wiki page not found: ${dto.pageId}`)
    }
    if (dto.title !== undefined) {
      page.updateTitle(dto.title)
    }
    if (dto.content !== undefined) {
      page.updateContent(dto.content)
    }
    await this.repo.save(page)
    return page
  }
}
