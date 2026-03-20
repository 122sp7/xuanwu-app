"use server"

/**
 * Module: wiki
 * Layer: interfaces/actions
 * Purpose: Server Actions for wiki page write operations.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from '@/shared/types'

import { CreateWikiPageUseCase, ArchiveWikiPageUseCase, UpdateWikiPageUseCase } from '@/core/wiki-core'
import type { CreateWikiPageDTO, UpdateWikiPageDTO } from '@/core/wiki-core'
import { InMemoryWikiPageRepository } from '@/core/wiki-core'

// Stub repository — replace with FirestoreWikiPageRepository when Phase 3 Firestore adapter lands.
const wikiPageRepository = new InMemoryWikiPageRepository()
const createWikiPageUseCase = new CreateWikiPageUseCase(wikiPageRepository)
const archiveWikiPageUseCase = new ArchiveWikiPageUseCase(wikiPageRepository)
const updateWikiPageUseCase = new UpdateWikiPageUseCase(wikiPageRepository)

export async function createWikiPage(dto: CreateWikiPageDTO): Promise<CommandResult> {
  try {
    const page = await createWikiPageUseCase.execute(dto)
    return commandSuccess(page.pageId, 1)
  } catch (error) {
    return commandFailureFrom(
      'WIKI_PAGE_CREATE_FAILED',
      error instanceof Error ? error.message : 'Unexpected wiki page create error',
    )
  }
}

export async function archiveWikiPage(pageId: string): Promise<CommandResult> {
  if (!pageId.trim()) {
    return commandFailureFrom('WIKI_PAGE_ARCHIVE_FAILED', 'pageId is required')
  }
  try {
    await archiveWikiPageUseCase.execute({ pageId })
    return commandSuccess(pageId, 1)
  } catch (error) {
    return commandFailureFrom(
      'WIKI_PAGE_ARCHIVE_FAILED',
      error instanceof Error ? error.message : 'Unexpected wiki page archive error',
    )
  }
}

export async function updateWikiPage(dto: UpdateWikiPageDTO): Promise<CommandResult> {
  if (!dto.pageId.trim()) {
    return commandFailureFrom('WIKI_PAGE_UPDATE_FAILED', 'pageId is required')
  }
  if (dto.title === undefined && dto.content === undefined) {
    return commandFailureFrom('WIKI_PAGE_UPDATE_FAILED', 'At least one of title or content must be provided')
  }
  try {
    const page = await updateWikiPageUseCase.execute(dto)
    return commandSuccess(page.pageId, 1)
  } catch (error) {
    return commandFailureFrom(
      'WIKI_PAGE_UPDATE_FAILED',
      error instanceof Error ? error.message : 'Unexpected wiki page update error',
    )
  }
}
