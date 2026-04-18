"use client";

/**
 * WorkspaceDailySection — workspace.daily tab.
 *
 * IG-style daily post feed at the workspace level.
 * Members can post text and attach photos (by URL) for a given date.
 * Future expansion: today's task completion summary, attendance check-in.
 *
 * Layout:
 *   ① Date navigation bar
 *   ② Post composer (text + photo URLs)
 *   ③ Feed — chronological post cards
 */

import { Badge, Button, Textarea } from "@packages";
import { useState, useEffect, useRef, useTransition } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Send,
  X,
} from "lucide-react";

import { createFeedPostAction, listFeedPostsAction } from "../../../subdomains/feed/adapters/inbound/server-actions/feed-actions";
import type { FeedPostSnapshot } from "../../../subdomains/feed/domain/entities/FeedPost";

interface WorkspaceDailySectionProps {
  workspaceId: string;
  accountId: string;
  /** Current actor's accountId used as authorAccountId. Defaults to accountId. */
  currentUserId?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("zh-Hant-TW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addDays(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return toDateKey(date) === toDateKey(now);
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("zh-Hant-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Post card ─────────────────────────────────────────────────────────────────

function FeedPostCard({ post }: { post: FeedPostSnapshot }) {
  return (
    <article className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary select-none">
            {post.authorAccountId.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-foreground/80">{post.authorAccountId}</span>
        </div>
        <time className="text-xs text-muted-foreground" dateTime={post.createdAtISO}>
          {formatTime(post.createdAtISO)}
        </time>
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
      )}

      {/* Photos */}
      {post.photoUrls.length > 0 && (
        <div className={`grid gap-1.5 ${post.photoUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {post.photoUrls.map((url, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={url}
              alt={`附圖 ${idx + 1}`}
              className="w-full rounded-lg object-cover max-h-72"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </article>
  );
}

// ── Composer ──────────────────────────────────────────────────────────────────

function PostComposer({
  workspaceId,
  accountId,
  authorAccountId,
  onPosted,
}: {
  workspaceId: string;
  accountId: string;
  authorAccountId: string;
  onPosted: () => void;
}) {
  const [content, setContent] = useState("");
  const [photoInput, setPhotoInput] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function addPhoto() {
    const url = photoInput.trim();
    if (!url || photoUrls.length >= 9) return;
    setPhotoUrls((prev) => [...prev, url]);
    setPhotoInput("");
  }

  function removePhoto(idx: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit() {
    if (!content.trim() && photoUrls.length === 0) return;
    startTransition(async () => {
      await createFeedPostAction({
        accountId,
        workspaceId,
        authorAccountId,
        content: content.trim(),
        photoUrls,
      });
      setContent("");
      setPhotoUrls([]);
      setPhotoInput("");
      onPosted();
    });
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-4 space-y-3">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="今天有什麼想分享的？"
        className="min-h-[80px] resize-none bg-transparent text-sm"
        disabled={isPending}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      {/* Photo URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="url"
            value={photoInput}
            onChange={(e) => setPhotoInput(e.target.value)}
            placeholder="貼上圖片網址…"
            className="h-8 w-full rounded-md border border-border/50 bg-transparent pl-7 pr-3 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={isPending || photoUrls.length >= 9}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPhoto(); } }}
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
          onClick={addPhoto}
          disabled={isPending || !photoInput.trim() || photoUrls.length >= 9}
        >
          加入
        </Button>
      </div>

      {/* Photo previews */}
      {photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photoUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-16 rounded-lg object-cover border border-border/40" />
              <button
                onClick={() => removePhoto(idx)}
                className="absolute -right-1.5 -top-1.5 hidden size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                aria-label="移除圖片"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground/60">⌘ + Enter 發布</span>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || (!content.trim() && photoUrls.length === 0)}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Send className="size-3" />
          )}
          發布
        </Button>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function WorkspaceDailySection({
  workspaceId,
  accountId,
  currentUserId,
}: WorkspaceDailySectionProps): React.ReactElement {
  const authorAccountId = currentUserId ?? accountId;
  const [activeDate, setActiveDate] = useState(() => new Date());
  const [posts, setPosts] = useState<FeedPostSnapshot[]>([]);
  const [loading, setLoading] = useState(false);

  const isTodayActive = isToday(activeDate);
  const dateLabel = formatDateLabel(activeDate);
  const dateKey = toDateKey(activeDate);

  async function loadPosts() {
    setLoading(true);
    try {
      const result = await listFeedPostsAction({ accountId, workspaceId, dateKey });
      // Sort newest-first
      const sorted = [...result].sort(
        (a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime(),
      );
      setPosts(sorted);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (workspaceId && accountId) {
      void loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, accountId, dateKey]);

  return (
    <div className="space-y-5">
      {/* ① Date navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">每日動態</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveDate((d) => addDays(d, -1))}
            className="rounded-md border border-border/50 p-1 text-muted-foreground hover:bg-muted/50 transition"
            aria-label="前一天"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <Badge
            variant={isTodayActive ? "default" : "outline"}
            className="cursor-pointer select-none text-xs"
            onClick={() => setActiveDate(new Date())}
          >
            {isTodayActive ? "今天" : "回今天"}
          </Badge>
          <span className="hidden text-xs text-muted-foreground sm:inline">{dateLabel}</span>
          <button
            onClick={() => setActiveDate((d) => addDays(d, 1))}
            className="rounded-md border border-border/50 p-1 text-muted-foreground hover:bg-muted/50 transition"
            aria-label="下一天"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Date label for mobile */}
      <p className="text-xs text-muted-foreground sm:hidden">{dateLabel}</p>

      {/* ② Composer (today only) */}
      {isTodayActive && (
        <PostComposer
          workspaceId={workspaceId}
          accountId={accountId}
          authorAccountId={authorAccountId}
          onPosted={loadPosts}
        />
      )}

      {/* ③ Feed */}
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
            <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              {isTodayActive ? "今日尚無動態" : "此日無動態記錄"}
            </p>
            {isTodayActive && (
              <p className="mt-1 text-xs text-muted-foreground/70">
                在上方發布第一則動態，讓團隊知道你今天的進展。
              </p>
            )}
          </div>
        )}

        {!loading &&
          posts.map((post) => <FeedPostCard key={post.id} post={post} />)}
      </div>
    </div>
  ) as React.ReactElement;
}
