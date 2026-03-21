"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Knowledge hub main view — org KPI row, taxonomy browse,
 *   workspace health cards, and RAG search entry point.
 * Constraints: UI-only; data fetching remains in the page layer.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { useMemo } from 'react'
import {
  Building2Icon,
  ChevronRightIcon,
  RefreshCwIcon,
  UploadIcon,
} from 'lucide-react'
import Link from 'next/link'

import type { WorkspaceKnowledgeSummary } from '@/modules/wiki'
import { Badge } from '@ui-shadcn/ui/badge'
import { Button } from '@ui-shadcn/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui-shadcn/ui/card'
import { Progress } from '@ui-shadcn/ui/progress'
import { Skeleton } from '@ui-shadcn/ui/skeleton'
import { RagSearchBar } from './RagSearchBar'
import type { WorkspaceEntry } from '../view-models/workspace-entry.vm'

export type { WorkspaceEntry }

// ── Constants ─────────────────────────────────────────────────────────────────

const SUMMARY_STATUS_VARIANT: Record<
  WorkspaceKnowledgeSummary['status'],
  'default' | 'secondary' | 'outline'
> = {
  'needs-input': 'outline',
  staged: 'secondary',
  ready: 'default',
}

const TAXONOMY_TILES = [
  { key: '規章制度', className: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/40' },
  { key: '技術文件', className: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200/60 dark:border-purple-800/40' },
  { key: '產品手冊', className: 'bg-green-50 dark:bg-green-950/30 border-green-200/60 dark:border-green-800/40' },
  { key: '流程指引', className: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200/60 dark:border-orange-800/40' },
  { key: '教育訓練', className: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200/60 dark:border-pink-800/40' },
  { key: '其他', className: 'bg-muted/40 border-border/60' },
] as const

// ── Org KPI row ───────────────────────────────────────────────────────────────

function OrgKpiRow({ entries }: { readonly entries: readonly WorkspaceEntry[] }) {
  const totalDocs = entries.reduce((s, e) => s + e.summary.registeredAssetCount, 0)
  const readyDocs = entries.reduce((s, e) => s + e.summary.readyAssetCount, 0)
  const processingDocs = entries.reduce(
    (s, e) => s + e.docs.filter((d) => d.status === 'processing').length,
    0,
  )
  const failedDocs = entries.reduce(
    (s, e) => s + e.docs.filter((d) => d.status === 'failed').length,
    0,
  )

  const kpis = [
    { label: '文件總數', value: `${totalDocs} 份` },
    { label: '已就緒', value: `${readyDocs} 份` },
    { label: '處理中', value: `${processingDocs} 份` },
    { label: '失敗', value: `${failedDocs} 份` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-[11px] text-muted-foreground">{k.label}</p>
          <p className="mt-1 text-lg font-semibold">{k.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Taxonomy browse ───────────────────────────────────────────────────────────

function TaxonomyBrowse({ entries }: { readonly entries: readonly WorkspaceEntry[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const entry of entries) {
      for (const doc of entry.docs) {
        const cat = doc.taxonomy ?? '其他'
        map[cat] = (map[cat] ?? 0) + 1
      }
    }
    return map
  }, [entries])

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">分類瀏覽</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TAXONOMY_TILES.map((tile) => (
          <div
            key={tile.key}
            className={`rounded-xl border px-3 py-3 text-center ${tile.className}`}
          >
            <p className="text-xs font-medium">{tile.key}</p>
            <p className="mt-1 text-lg font-semibold">{counts[tile.key] ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">份</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Workspace health card ─────────────────────────────────────────────────────

function WorkspaceHealthCard({
  entry,
  onSelectWorkspace,
}: {
  readonly entry: WorkspaceEntry
  readonly onSelectWorkspace: (id: string) => void
}) {
  const { workspace, summary, docs } = entry
  const ready = docs.filter((d) => d.status === 'ready').length
  const total = docs.length
  const ratio = total > 0 ? Math.round((ready / total) * 100) : 0

  return (
    <div className="rounded-xl border border-border/40 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="text-sm font-semibold text-primary hover:underline"
              onClick={() => onSelectWorkspace(workspace.id)}
            >
              {workspace.name}
            </button>
            <Badge variant={SUMMARY_STATUS_VARIANT[summary.status]}>{summary.status}</Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {ready} / {total} 份文件就緒
              </span>
              <span>{ratio}%</span>
            </div>
            <Progress value={ratio} className="h-1.5" />
          </div>
          {summary.blockedReasons.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-amber-600 dark:text-amber-400">
              {summary.blockedReasons.slice(0, 2).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 text-xs"
            onClick={() => onSelectWorkspace(workspace.id)}
          >
            <ChevronRightIcon className="size-3" />
            文件
          </Button>
          <Button asChild variant="outline" size="sm" className="h-6 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>
              <UploadIcon className="size-3" />
              上傳
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── WikiHubView ───────────────────────────────────────────────────────────────

export interface WikiHubViewProps {
  readonly entries: readonly WorkspaceEntry[]
  readonly loadState: 'loading' | 'loaded' | 'error'
  readonly organizationId: string
  readonly onSelectWorkspace: (id: string) => void
  readonly onRefresh: () => void
}

export function WikiHubView({
  entries,
  loadState,
  organizationId,
  onSelectWorkspace,
  onRefresh,
}: WikiHubViewProps) {
  return (
    <div className="space-y-6">
      {/* RAG search */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">知識庫搜尋</CardTitle>
          <CardDescription>向整個組織的企業知識庫提問</CardDescription>
        </CardHeader>
        <CardContent>
          <RagSearchBar organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* KPI */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">知識庫總覽</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onRefresh}
            disabled={loadState === 'loading'}
          >
            <RefreshCwIcon className="size-3" />
            重新整理
          </Button>
        </div>
        {loadState === 'loading' ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <OrgKpiRow entries={entries} />
        )}
      </div>

      {/* Taxonomy browse */}
      {loadState === 'loaded' && entries.length > 0 && <TaxonomyBrowse entries={entries} />}

      {/* Workspace health */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">工作區知識庫狀態</h2>
        {loadState === 'loading' && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        )}
        {loadState === 'error' && (
          <p className="text-sm text-destructive">無法載入知識摘要，請稍後再試。</p>
        )}
        {loadState === 'loaded' && entries.length === 0 && (
          <div className="rounded-xl border border-border/40 px-4 py-8 text-center">
            <Building2Icon className="mx-auto mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">目前沒有工作區。</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href="/organization/workspaces">建立工作區</Link>
            </Button>
          </div>
        )}
        {loadState === 'loaded' &&
          entries.map((entry) => (
            <div key={entry.workspace.id} className="mb-3">
              <WorkspaceHealthCard entry={entry} onSelectWorkspace={onSelectWorkspace} />
            </div>
          ))}
      </div>
    </div>
  )
}
