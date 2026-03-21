"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Archived wiki pages list view.
 * Constraints: UI-only; no business logic.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { ArchiveIcon } from 'lucide-react'

import type { WikiPage } from '@/core/wiki-core'
import { Skeleton } from '@/ui/shadcn/ui/skeleton'
import { WikiPageCard } from './WikiPageCard'

export interface WikiArchivedViewProps {
  readonly archivedPages: readonly WikiPage[]
  readonly loadState: 'loading' | 'loaded' | 'error'
  readonly onSelectPage: (page: WikiPage) => void
}

export function WikiArchivedView({ archivedPages, loadState, onSelectPage }: WikiArchivedViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">封存</h2>
      {loadState === 'loading' && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}
      {loadState === 'loaded' && archivedPages.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
          <ArchiveIcon className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">沒有封存的頁面或文件。</p>
        </div>
      )}
      {loadState === 'loaded' && archivedPages.length > 0 && (
        <div className="space-y-2">
          {archivedPages.map((page) => (
            <WikiPageCard key={page.pageId} page={page} onClick={onSelectPage} />
          ))}
        </div>
      )}
    </div>
  )
}
