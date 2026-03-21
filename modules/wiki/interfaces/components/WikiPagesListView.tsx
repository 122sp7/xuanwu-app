"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Wiki pages list — scope filter, create dialog, card list.
 * Constraints: UI-only; no business logic.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { useMemo } from 'react'
import { FileTextIcon, PlusIcon } from 'lucide-react'

import type { WikiPage, WikiPageScope } from '@/modules/wiki'
import { Button } from '@ui-shadcn'
import { Skeleton } from '@ui-shadcn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui-shadcn'
import { WikiPageCard } from './WikiPageCard'
import { CreateWikiPageDialog } from './CreateWikiPageDialog'

export interface WikiPagesListViewProps {
  readonly organizationId: string
  readonly pages: readonly WikiPage[]
  readonly pagesLoadState: 'loading' | 'loaded' | 'error'
  readonly scopeFilter: WikiPageScope | 'all'
  readonly onScopeChange: (v: WikiPageScope | 'all') => void
  readonly onSelectPage: (page: WikiPage) => void
  readonly onCreated: () => void
}

export function WikiPagesListView({
  organizationId,
  pages,
  pagesLoadState,
  scopeFilter,
  onScopeChange,
  onSelectPage,
  onCreated,
}: WikiPagesListViewProps) {
  const filtered = useMemo(
    () => pages.filter((p) => scopeFilter === 'all' || p.scope === scopeFilter),
    [pages, scopeFilter],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Wiki 頁面</h2>
        <div className="flex items-center gap-2">
          <Select
            value={scopeFilter}
            onValueChange={(v) => onScopeChange(v as WikiPageScope | 'all')}
          >
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部範圍</SelectItem>
              <SelectItem value="organization">組織共用</SelectItem>
              <SelectItem value="workspace">工作區</SelectItem>
              <SelectItem value="private">私人</SelectItem>
            </SelectContent>
          </Select>
          <CreateWikiPageDialog organizationId={organizationId} onCreated={onCreated} />
        </div>
      </div>

      {pagesLoadState === 'loading' && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}

      {pagesLoadState === 'error' && (
        <p className="text-sm text-destructive">無法載入 Wiki 頁面，請稍後再試。</p>
      )}

      {pagesLoadState === 'loaded' && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
          <FileTextIcon className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {pages.length === 0
              ? '尚無 Wiki 頁面。建立第一個頁面開始協作 →'
              : '沒有符合篩選條件的頁面。'}
          </p>
          {pages.length === 0 && (
            <div className="mt-3">
              <CreateWikiPageDialog
                organizationId={organizationId}
                onCreated={onCreated}
                trigger={
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <PlusIcon className="size-3.5" />
                    建立第一個頁面
                  </Button>
                }
              />
            </div>
          )}
        </div>
      )}

      {pagesLoadState === 'loaded' && filtered.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">共 {filtered.length} 個頁面</p>
          {filtered.map((page) => (
            <WikiPageCard key={page.pageId} page={page} onClick={onSelectPage} />
          ))}
        </div>
      )}
    </div>
  )
}
