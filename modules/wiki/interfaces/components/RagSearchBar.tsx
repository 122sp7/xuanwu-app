"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Shared stub RAG search bar for the wiki hub and workspace doc views.
 *          Replace the stub `setTimeout` body with a real Genkit flow invocation
 *          when the RAG backend is wired.
 * Constraints: UI-only stub; no business logic.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { useCallback, useState } from 'react'
import { Loader2Icon, SearchIcon } from 'lucide-react'

import { Button } from '@ui-shadcn/ui/button'
import { Input } from '@ui-shadcn/ui/input'

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
  const [hasResult, setHasResult] = useState(false)

  const handleSearch = useCallback(() => {
    if (!query.trim() || !organizationId) return
    setIsSearching(true)
    setHasResult(false)
    // Stub: replace with Genkit flow invocation when RAG backend is wired.
    setTimeout(() => {
      setIsSearching(false)
      setHasResult(true)
    }, 800)
  }, [query, organizationId])

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
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>
        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={handleSearch}
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
      {hasResult && (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">AI 回答（示範）</p>
          <p className="mt-1">
            🚧 RAG 查詢功能尚在建置中。Genkit Flow 串接完成後，此處將顯示 AI 生成回答與引用來源。
          </p>
          <p className="mt-2 font-mono text-[10px]">{query}</p>
        </div>
      )}
    </div>
  )
}
