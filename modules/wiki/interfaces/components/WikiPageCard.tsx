"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Card displaying a single wiki page in a list.
 * Constraints: UI-only; no business logic.
 */
import { FileTextIcon, LockIcon, BuildingIcon, FolderIcon } from 'lucide-react'
import { Badge } from '@ui-shadcn/ui/badge'
import type { WikiPage, WikiPageScope } from '@/modules/wiki'

interface WikiPageCardProps {
  readonly page: WikiPage
  readonly onClick?: (page: WikiPage) => void
}

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

const STATUS_VARIANT = {
  draft: 'outline',
  published: 'default',
  archived: 'secondary',
} as const

const STATUS_LABEL = {
  draft: '草稿',
  published: '已發佈',
  archived: '已封存',
} as const

function formatRelativeDate(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return '剛剛'
    if (mins < 60) return `${mins} 分鐘前`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} 小時前`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} 天前`
    return new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
      new Date(iso),
    )
  } catch {
    return iso
  }
}

export function WikiPageCard({ page, onClick }: WikiPageCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-lg border border-border/40 px-4 py-3 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
      onClick={() => onClick?.(page)}
    >
      <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium leading-tight">{page.title}</span>
          <Badge variant={STATUS_VARIANT[page.status]} className="text-[10px]">
            {STATUS_LABEL[page.status]}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-0.5 text-[10px]">
            {SCOPE_ICON[page.scope]}
            {SCOPE_LABEL[page.scope]}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {formatRelativeDate(page.updatedAtISO)}
        </p>
      </div>
    </button>
  )
}
