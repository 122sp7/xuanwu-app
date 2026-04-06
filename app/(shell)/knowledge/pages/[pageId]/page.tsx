"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Archive, Check, MessageSquare, Pencil, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getKnowledgePage,
  renameKnowledgePage,
  archiveKnowledgePage,
  PageEditorView,
} from "@/modules/knowledge/api";
import type { KnowledgePage } from "@/modules/knowledge/api";
import { CommentPanel } from "@/modules/knowledge-collaboration/api";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

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
    <div className="space-y-4">
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
  );
}
