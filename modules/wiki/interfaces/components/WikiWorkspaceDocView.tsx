"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Workspace-scoped document list view — filter by status/text, RAG search scoped to workspace.
 * Constraints: UI-only; no business logic.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { useMemo, useState } from 'react'
import { FileTextIcon, SearchIcon, UploadIcon } from 'lucide-react'
import Link from 'next/link'

import type { RagDocumentRecord } from '@/modules/file'
import type { WorkspaceKnowledgeSummary } from '@/modules/wiki'
import { Badge } from '@ui-shadcn'
import { Button } from '@ui-shadcn'
import { Input } from '@ui-shadcn'
import { Separator } from '@ui-shadcn'
import { RagSearchBar } from './RagSearchBar'
import type { WorkspaceEntry } from '../view-models/workspace-entry.vm'

// ── Constants ─────────────────────────────────────────────────────────────────

const RAG_STATUS_VARIANT: Record<
  RagDocumentRecord['status'],
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  uploaded: 'outline',
  processing: 'secondary',
  ready: 'default',
  failed: 'destructive',
  archived: 'outline',
}

const RAG_STATUS_LABEL: Record<RagDocumentRecord['status'], string> = {
  uploaded: '已上傳',
  processing: '處理中',
  ready: '已就緒',
  failed: '失敗',
  archived: '已封存',
}

const SUMMARY_STATUS_VARIANT: Record<
  WorkspaceKnowledgeSummary['status'],
  'default' | 'secondary' | 'outline'
> = {
  'needs-input': 'outline',
  staged: 'secondary',
  ready: 'default',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function mimeLabel(mime: string): string {
  if (mime.includes('pdf')) return 'PDF'
  if (mime.includes('word') || mime.includes('docx') || mime.includes('doc')) return 'DOCX'
  if (mime.includes('html')) return 'HTML'
  if (mime.includes('text')) return 'TXT'
  if (mime.includes('markdown')) return 'MD'
  return mime.split('/').pop()?.toUpperCase() ?? 'FILE'
}

// ── Document row ──────────────────────────────────────────────────────────────

function DocRow({ doc }: { readonly doc: RagDocumentRecord }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 px-4 py-3 hover:bg-muted/30">
      <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium">{doc.displayName}</span>
          <Badge variant={RAG_STATUS_VARIANT[doc.status]} className="text-[10px]">
            {RAG_STATUS_LABEL[doc.status]}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {mimeLabel(doc.mimeType)}
          </Badge>
          {doc.taxonomy && (
            <Badge variant="secondary" className="text-[10px]">
              {doc.taxonomy}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span>{formatBytes(doc.sizeBytes)}</span>
          {doc.department && <span>{doc.department}</span>}
          {doc.language && <span>{doc.language}</span>}
          <span>v{doc.versionNumber}</span>
          <span>{formatDate(doc.createdAtISO)}</span>
        </div>
        {doc.statusMessage && (
          <p className="text-[11px] text-destructive">{doc.statusMessage}</p>
        )}
      </div>
      {doc.chunkCount !== undefined && (
        <span className="shrink-0 text-[10px] text-muted-foreground">{doc.chunkCount} chunks</span>
      )}
    </div>
  )
}

// ── WikiWorkspaceDocView ──────────────────────────────────────────────────────

export interface WikiWorkspaceDocViewProps {
  readonly entry: WorkspaceEntry
  readonly organizationId: string
  readonly onBack: () => void
}

export function WikiWorkspaceDocView({
  entry,
  organizationId,
  onBack,
}: WikiWorkspaceDocViewProps) {
  const { workspace, docs } = entry
  const [statusFilter, setStatusFilter] = useState<RagDocumentRecord['status'] | 'all'>('all')
  const [searchText, setSearchText] = useState('')

  const filtered = useMemo(
    () =>
      docs.filter((d) => {
        if (statusFilter !== 'all' && d.status !== statusFilter) return false
        if (searchText.trim() && !d.displayName.toLowerCase().includes(searchText.toLowerCase()))
          return false
        return true
      }),
    [docs, statusFilter, searchText],
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          ← 返回
        </button>
        <Separator orientation="vertical" className="h-4" />
        <h2 className="text-base font-semibold">{workspace.name}</h2>
        <Badge variant={SUMMARY_STATUS_VARIANT[entry.summary.status]}>
          {entry.summary.status}
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>
              <UploadIcon className="size-3" />
              上傳文件
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Wiki`}>管理</Link>
          </Button>
        </div>
      </div>

      {/* Workspace-scoped RAG search */}
      <RagSearchBar organizationId={organizationId} workspaceId={workspace.id} />

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'ready', 'processing', 'uploaded', 'failed', 'archived'] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={[
              'rounded-full border px-3 py-1 text-xs transition',
              statusFilter === s
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
            ].join(' ')}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? '全部' : RAG_STATUS_LABEL[s]}
          </button>
        ))}
        <div className="relative ml-auto">
          <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-7 w-44 pl-6 text-xs"
            placeholder="搜尋檔案名稱…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border/40 px-4 py-8 text-center">
          <FileTextIcon className="mx-auto mb-2 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {docs.length === 0 ? '此工作區尚無知識文件。' : '沒有符合條件的文件。'}
          </p>
          {docs.length === 0 && (
            <Button asChild variant="outline" size="sm" className="mt-3 gap-1.5">
              <Link href={`/workspace/${workspace.id}?tab=Files`}>
                <UploadIcon className="size-3" />
                上傳文件
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">共 {filtered.length} 筆</p>
          {filtered.map((doc) => (
            <DocRow key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  )
}
