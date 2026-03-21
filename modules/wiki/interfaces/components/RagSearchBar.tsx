"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: RAG search bar for the wiki hub and workspace doc views.
 *          Calls the `searchWikiDocuments` server action to perform Upstash Vector
 *          similarity search and displays results.
 * Constraints: UI component — delegates to server action for business logic.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { useCallback, useState } from 'react'
import { Loader2Icon, SearchIcon } from 'lucide-react'

import { Button } from '@ui-shadcn/ui/button'
import { Input } from '@ui-shadcn/ui/input'
import { searchWikiDocuments, type WikiSearchHit } from '../_actions/wiki-search.actions'

export interface RagSearchBarProps {
  readonly organizationId: string | null
  readonly workspaceId?: string | null
  /** Placeholder text for the search input. Defaults to the org-scoped prompt. */
  readonly placeholder?: string
}

export function RagSearchBar({
  organizationId,
  workspaceId,
  placeholder = '向知識庫提問，例如：特休天數如何計算？',
}: RagSearchBarProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hits, setHits] = useState<WikiSearchHit[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !organizationId) return
    setIsSearching(true)
    setError(null)
    setHits([])
    setHasSearched(false)
    try {
      const result = await searchWikiDocuments(query, organizationId, workspaceId)
      if (result.ok) {
        setHits(result.hits)
      } else {
        setError(result.error ?? '搜尋失敗')
      }
    } catch {
      setError('搜尋時發生錯誤')
    } finally {
      setIsSearching(false)
      setHasSearched(true)
    }
  }, [query, organizationId, workspaceId])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-8 text-sm"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSearch()
            }}
          />
        </div>
        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => void handleSearch()}
          disabled={!query.trim() || !organizationId || isSearching}
        >
          {isSearching ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <SearchIcon className="size-3.5" />
          )}
          搜尋
        </Button>
      </div>
      {workspaceId && (
        <p className="text-[11px] text-muted-foreground">搜尋範圍：目前工作區文件</p>
      )}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}
      {hasSearched && !error && hits.length === 0 && (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <p>找不到符合「{query}」的文件。</p>
        </div>
      )}
      {hits.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground">
            找到 {hits.length} 筆結果
          </p>
          <ul className="divide-y divide-border/40 rounded-lg border border-border/60">
            {hits.map((hit) => (
              <li key={hit.id} className="flex items-center gap-2 px-3 py-2">
                <SearchIcon className="size-3 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{hit.title}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {hit.category || hit.scope}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
