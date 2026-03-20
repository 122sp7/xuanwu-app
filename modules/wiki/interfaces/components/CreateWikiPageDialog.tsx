"use client"

/**
 * Module: wiki
 * Layer: interfaces/components
 * Purpose: Dialog for creating a new wiki page.
 * Constraints: Calls createWikiPage Server Action; UI-only — no business logic.
 */
import { useState, useTransition } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/ui/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/shadcn/ui/dialog'
import { Input } from '@/ui/shadcn/ui/input'
import { Label } from '@/ui/shadcn/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/ui/select'
import { Textarea } from '@/ui/shadcn/ui/textarea'
import type { WikiPageScope } from '@/core/wiki-core'
import { createWikiPage } from '../_actions/wiki-page.actions'

interface CreateWikiPageDialogProps {
  readonly organizationId: string
  readonly workspaceId?: string | null
  readonly onCreated?: () => void
  readonly trigger?: React.ReactNode
}

export function CreateWikiPageDialog({
  organizationId,
  workspaceId,
  onCreated,
  trigger,
}: CreateWikiPageDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [scope, setScope] = useState<WikiPageScope>(workspaceId ? 'workspace' : 'organization')
  const [isPending, startTransition] = useTransition()

  function reset() {
    setTitle('')
    setContent('')
    setScope(workspaceId ? 'workspace' : 'organization')
  }

  function handleSubmit() {
    if (!title.trim()) return

    startTransition(async () => {
      const result = await createWikiPage({
        organizationId,
        workspaceId: workspaceId ?? null,
        title: title.trim(),
        content,
        scope,
        createdBy: organizationId, // placeholder until auth context is wired
        order: 0,
      })

      if (result.success) {
        toast.success('Wiki 頁面已建立')
        setOpen(false)
        reset()
        onCreated?.()
      } else {
        toast.error('建立失敗', { description: result.error?.message })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-1.5 h-8">
            <PlusIcon className="size-3.5" />
            新增頁面
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>新增 Wiki 頁面</DialogTitle>
          <DialogDescription>建立一個新的知識頁面，選擇可見範圍後儲存。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="wiki-title">頁面標題</Label>
            <Input
              id="wiki-title"
              placeholder="輸入頁面標題…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Scope */}
          <div className="space-y-1.5">
            <Label htmlFor="wiki-scope">可見範圍</Label>
            <Select value={scope} onValueChange={(v) => setScope(v as WikiPageScope)}>
              <SelectTrigger id="wiki-scope" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization">🏢 組織共用</SelectItem>
                {workspaceId && <SelectItem value="workspace">🗂️ 工作區</SelectItem>}
                <SelectItem value="private">🔒 私人</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="wiki-content">初始內容（Markdown，可選）</Label>
            <Textarea
              id="wiki-content"
              placeholder="可使用 Markdown 語法…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || isPending}>
            {isPending ? '建立中…' : '建立頁面'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
