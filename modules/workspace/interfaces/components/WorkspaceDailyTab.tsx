"use client";

/**
 * WorkspaceDailyTab — 工作區施工動態（IG 瀑布流骨架）。
 * 奧卡姆剃刀：Feed + 浮動發布按鈕 + 極簡撰寫面板。
 */

import { useRef, useState } from "react";
import { PenSquare, Send, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import type { DailyPostType } from "@/modules/daily";
import { DailyFeed, DAILY_POST_TYPES } from "@/modules/daily";
import { createDailyPost } from "@/modules/daily/interfaces/_actions/daily-post.actions";
import type { WorkspaceEntity } from "@/modules/workspace";

import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

// ── 類型標籤 ────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<DailyPostType, string> = {
  progress: "進度",
  issue: "問題",
  safety: "安全",
  material: "材料",
};

const TYPE_ACTIVE_CLASS: Record<DailyPostType, string> = {
  progress: "bg-green-600 text-white border-green-600",
  issue: "bg-red-600 text-white border-red-600",
  safety: "bg-yellow-500 text-white border-yellow-500",
  material: "bg-blue-600 text-white border-blue-600",
};

// ── 元件 ────────────────────────────────────────────────────────────────────

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  const { state: appState } = useApp();
  const actor = appState.activeAccount;

  const actorId = actor?.id ?? "";
  const actorName = actor?.name ?? "未知";
  const actorAvatar = "photoURL" in (actor ?? {}) ? (actor as { photoURL?: string }).photoURL : undefined;
  const actorInitial = actorName.charAt(0).toUpperCase();

  const [showComposer, setShowComposer] = useState(false);
  const [postType, setPostType] = useState<DailyPostType>("progress");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function openComposer() {
    setShowComposer(true);
    // 下一個 tick 後聚焦 textarea
    setTimeout(() => textareaRef.current?.focus(), 80);
  }

  function closeComposer() {
    setShowComposer(false);
    setActionError(null);
    setContent("");
    setPostType("progress");
  }

  async function handlePost() {
    if (!actorId || !content.trim()) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const result = await createDailyPost({
        accountId: workspace.accountId,
        workspaceId: workspace.id,
        content: content.trim(),
        type: postType,
        createdBy: { id: actorId, name: actorName, avatarUrl: actorAvatar },
      });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      closeComposer();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      {/* ── 動態瀑布流 ── */}
      <DailyFeed scope={{ accountId: workspace.accountId, workspaceId: workspace.id }} />

      {/* ── FAB（右下浮動發布按鈕） ── */}
      {!showComposer && (
        <button
          type="button"
          aria-label="新增 Daily"
          onClick={openComposer}
          className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-foreground shadow-lg text-background hover:bg-foreground/90 active:scale-95 transition-all"
        >
          <PenSquare className="h-5 w-5" />
        </button>
      )}

      {/* ── 撰寫面板（底部滑出，IG 極簡風） ── */}
      {showComposer && (
        <div className="fixed inset-x-0 bottom-0 z-30 max-w-lg mx-auto bg-background border-t border-border shadow-2xl rounded-t-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-bottom duration-200">
          {/* 頂部操作列 */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="關閉"
              onClick={closeComposer}
              className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={submitting || !content.trim()}
              onClick={() => void handlePost()}
              className="flex h-8 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? "發布中…" : "發布"}
            </button>
          </div>

          {/* 作者列 + 輸入框 */}
          <div className="flex items-start gap-2.5">
            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
              <AvatarImage src={actorAvatar} alt={actorName} />
              <AvatarFallback className="text-xs font-bold">{actorInitial}</AvatarFallback>
            </Avatar>
            <textarea
              ref={textareaRef}
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享今天的施工動態…"
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>

          {/* 類型選擇（pill 群組） */}
          <div className="flex items-center gap-2 flex-wrap pl-10">
            {DAILY_POST_TYPES.map((t: DailyPostType) => (
              <button
                key={t}
                type="button"
                onClick={() => setPostType(t)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  postType === t
                    ? TYPE_ACTIVE_CLASS[t]
                    : "border-border text-muted-foreground hover:border-foreground/40"
                }`}
              >
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          {actionError && (
            <p className="text-xs text-destructive pl-10">{actionError}</p>
          )}
        </div>
      )}
    </div>
  );
}
