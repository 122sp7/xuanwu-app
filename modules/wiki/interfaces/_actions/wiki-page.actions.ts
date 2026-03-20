"use server"

/**
 * Module: wiki
 * Layer: interfaces/actions
 * Purpose: Server Actions for wiki page write operations.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from '@/shared/types'

import { CreateWikiPageUseCase } from '@/core/wiki-core'
import type { CreateWikiPageDTO } from '@/core/wiki-core'
import { InMemoryWikiPageRepository } from '@/core/wiki-core'

// Stub repository — replace with FirestoreWikiPageRepository when Phase 3 Firestore adapter lands.
const wikiPageRepository = new InMemoryWikiPageRepository()
const createWikiPageUseCase = new CreateWikiPageUseCase(wikiPageRepository)

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
