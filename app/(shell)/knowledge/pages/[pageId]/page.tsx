"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Archive, Check, ImageIcon, MessageSquare, Pencil, Smile, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getKnowledgePage,
  renameKnowledgePage,
  archiveKnowledgePage,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
  PageEditorView,
} from "@/modules/knowledge/api";
import type { KnowledgePage } from "@/modules/knowledge/api";
import { CommentPanel } from "@/modules/knowledge-collaboration/api";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@ui-shadcn/ui/popover";

// ── Inline title editor ───────────────────────────────────────────────────────

interface TitleEditorProps {
  initialTitle: string;
  onSave: (title: string) => void;
  isPending: boolean;
}

function TitleEditor({ initialTitle, onSave, isPending }: TitleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setValue(initialTitle); }, [initialTitle]);

  function startEdit() {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== initialTitle) {
      onSave(trimmed);
    } else {
      setValue(initialTitle);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setValue(initialTitle); setEditing(false); }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="h-auto border-0 bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={commit}
          disabled={isPending}
          className="rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="儲存標題"
        >
          <Check className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{value}</h1>
      <button
        type="button"
        onClick={startEdit}
        disabled={isPending}
        className="invisible rounded p-1 text-muted-foreground hover:text-foreground group-hover:visible"
        aria-label="重新命名頁面"
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  );
}

// ── Icon picker ───────────────────────────────────────────────────────────────

const QUICK_EMOJIS = ["📄", "📝", "📚", "💡", "🎯", "🚀", "⭐", "🔑", "📌", "🗂️", "🏷️", "🔖", "📋", "🗒️", "📊", "🔍"];

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  isPending: boolean;
}

function IconPicker({ value, onChange, isPending }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-xl hover:bg-muted/60 transition"
          title="設定頁面圖示"
        >
          {value ? value : <Smile className="h-5 w-5 text-muted-foreground" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">選擇圖示</p>
        <div className="mb-3 grid grid-cols-8 gap-1">
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => { onChange(e); setOpen(false); }}
              className="rounded p-1 text-lg hover:bg-muted transition"
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="輸入 emoji 或文字"
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!custom.trim()}
            onClick={() => { onChange(custom.trim()); setCustom(""); setOpen(false); }}
          >
            套用
          </Button>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full text-xs text-muted-foreground"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            移除圖示
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Cover editor ─────────────────────────────────────────────────────────────

interface CoverEditorProps {
  value?: string;
  onChange: (url: string) => void;
  isPending: boolean;
}

function CoverEditor({ value, onChange, isPending }: CoverEditorProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(value ?? "");

  useEffect(() => { setUrl(value ?? ""); }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          title="設定封面圖片"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {value ? "變更封面" : "新增封面"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">封面圖片 URL</p>
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => { onChange(url.trim()); setOpen(false); }}
          >
            套用
          </Button>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full text-xs text-muted-foreground"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            移除封面
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KnowledgePageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";

  const [page, setPage] = useState<KnowledgePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!accountId || !pageId) { setLoading(false); return; }
    setLoading(true);
    try {
      const p = await getKnowledgePage(accountId, pageId);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [accountId, pageId]);

  useEffect(() => { void load(); }, [load]);

  function handleRename(title: string) {
    startTransition(async () => {
      const result = await renameKnowledgePage({ accountId, pageId, title });
      if (result.success) {
        setPage((prev) => prev ? { ...prev, title } : prev);
      }
    });
  }

  function handleIconChange(iconUrl: string) {
    startTransition(async () => {
      const result = await updateKnowledgePageIcon({ accountId, pageId, iconUrl });
      if (result.success) {
        setPage((prev) => prev ? { ...prev, iconUrl: iconUrl || undefined } : prev);
      }
    });
  }

  function handleCoverChange(coverUrl: string) {
    startTransition(async () => {
      const result = await updateKnowledgePageCover({ accountId, pageId, coverUrl });
      if (result.success) {
        setPage((prev) => prev ? { ...prev, coverUrl: coverUrl || undefined } : prev);
      }
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveKnowledgePage({ accountId, pageId });
      router.push("/knowledge/pages");
    });
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────────

  if (!page) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge/pages")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          頁面列表
        </Button>
        <p className="text-sm text-muted-foreground">找不到此頁面，可能已被封存或刪除。</p>
      </div>
    );
  }

  // ── Page view ───────────────────────────────────────────────────────────────

  const updatedAt = page.updatedAtISO
    ? new Date(page.updatedAtISO).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-0">
      {/* Cover image */}
      {page.coverUrl && (
        <div
          className="relative h-40 w-full overflow-hidden rounded-t-xl bg-muted"
          style={{ backgroundImage: `url(${page.coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}

      <div className="space-y-4 px-0 pt-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge/pages")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            頁面列表
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant={commentOpen ? "default" : "outline"}
              onClick={() => setCommentOpen((v) => !v)}
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              留言
            </Button>
            {page.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleArchive}
                disabled={isPending}
              >
                <Archive className="mr-1.5 h-3.5 w-3.5" />
                封存
              </Button>
            )}
          </div>
        </div>

        {/* Page header */}
        <header className="space-y-2 border-b border-border/60 pb-4">
          {/* Icon row */}
          <div className="flex items-end gap-3">
            <IconPicker
              value={page.iconUrl}
              onChange={handleIconChange}
              isPending={isPending}
            />
            <CoverEditor
              value={page.coverUrl}
              onChange={handleCoverChange}
              isPending={isPending}
            />
          </div>
          <TitleEditor
            initialTitle={page.title}
            onSave={handleRename}
            isPending={isPending}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {page.status === "archived" && (
              <Badge variant="secondary">已封存</Badge>
            )}
            {page.approvalState === "approved" && (
              <Badge variant="default">已審核</Badge>
            )}
            {page.verificationState === "verified" && (
              <Badge variant="outline">已驗證</Badge>
            )}
            {page.verificationState === "needs_review" && (
              <Badge variant="destructive">待審查</Badge>
            )}
            {updatedAt && <span>更新於 {updatedAt}</span>}
          </div>
        </header>

        {/* Main content + optional comment side panel */}
        <div className={`flex gap-4 ${commentOpen ? "items-start" : ""}`}>
          {/* Block editor — connected to Firebase */}
          <div className="min-w-0 flex-1">
            {accountId ? (
              <PageEditorView accountId={accountId} pageId={pageId} />
            ) : (
              <p className="text-sm text-muted-foreground">請先登入以載入內容。</p>
            )}
          </div>

          {/* Comment panel — slides in from right */}
          {commentOpen && accountId && (
            <aside className="w-72 shrink-0 rounded-xl border border-border/60 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">留言</span>
                <button
                  type="button"
                  onClick={() => setCommentOpen(false)}
                  className="ml-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="關閉留言面板"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <CommentPanel
                accountId={accountId}
                workspaceId={appState.activeWorkspaceId ?? ""}
                contentId={pageId}
                contentType="page"
                currentUserId={authState.user?.id ?? ""}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
