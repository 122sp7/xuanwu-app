/**
 * Module: wiki
 * Layer: application/use-case
 * Purpose: Write-side orchestration for archiving a wiki page.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { IWikiPageRepository } from '../../domain/repositories/iwiki-page.repository'

export interface ArchiveWikiPageDTO {
  pageId: string
}

export class ArchiveWikiPageUseCase {
  constructor(private readonly repo: IWikiPageRepository) {}

  async execute(dto: ArchiveWikiPageDTO): Promise<void> {
    const page = await this.repo.findById(dto.pageId)
    if (!page) {
      throw new Error(`Wiki page not found: ${dto.pageId}`)
    }
    page.archive()
    await this.repo.save(page)
  }
}
