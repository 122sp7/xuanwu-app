"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Full-page view for a single wiki page with lifecycle actions and child pages.
 * Constraints: UI-only; mutations call Server Actions; LLM/RAG is not wired here.
 */
import { ArrowLeftIcon, ArchiveIcon, BuildingIcon, FolderIcon, LockIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/ui/shadcn/ui/badge'
import { Button } from '@/ui/shadcn/ui/button'
import { Separator } from '@/ui/shadcn/ui/separator'
import type { WikiPage, WikiPageScope } from '@/core/wiki-core'

const SCOPE_ICON: Record<WikiPageScope, React.ReactNode> = {
  organization: <BuildingIcon className="size-3" />,
  workspace: <FolderIcon className="size-3" />,
  private: <LockIcon className="size-3" />,
}

const SCOPE_LABEL: Record<WikiPageScope, string> = {
  organization: '組織共用',
  workspace: '工作區',
  private: '私人',
}

interface WikiPageViewProps {
  readonly page: WikiPage
  readonly workspaceName?: string
  readonly onBack: () => void
  /** Called when user triggers archive action — caller handles Server Action. */
  readonly onArchive?: (pageId: string) => Promise<void>
}

export function WikiPageView({ page, workspaceName, onBack, onArchive }: WikiPageViewProps) {
  const scopeLabel = page.scope === 'workspace' && workspaceName
    ? `工作區：${workspaceName}`
    : SCOPE_LABEL[page.scope]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-0.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={onBack}
          aria-label="返回"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold leading-tight">{page.title}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {SCOPE_ICON[page.scope]}
              {scopeLabel}
            </span>
            <span>·</span>
            <span>建立者：{page.createdBy}</span>
          </div>
        </div>
        {onArchive && page.status !== 'archived' && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => void onArchive(page.pageId)}
          >
            <ArchiveIcon className="size-3" />
            封存
          </Button>
        )}
      </div>

      <Separator />

      {/* Content */}
      {page.content.trim() ? (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page.content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
          <p className="text-sm text-muted-foreground">此頁面尚無內容。</p>
        </div>
      )}

      <Separator />

      {/* Metadata footer */}
      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span>建立：{new Date(page.createdAtISO).toLocaleDateString('zh-TW')}</span>
        <span>最後更新：{new Date(page.updatedAtISO).toLocaleDateString('zh-TW')}</span>
        <Badge variant="outline" className="text-[10px]">
          {page.scope === 'workspace' ? `工作區` : SCOPE_LABEL[page.scope]}
        </Badge>
      </div>
    </div>
  )
}
