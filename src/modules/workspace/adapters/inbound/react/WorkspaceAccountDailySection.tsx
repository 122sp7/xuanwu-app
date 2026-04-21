"use client";

import { Badge } from "@packages";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listAccountFeedPosts } from "../../../adapters/outbound/firebase-composition";
import type { FeedPostSnapshot } from "../../../subdomains/feed/domain/entities/FeedPost";
import { useWorkspaceContext } from "./WorkspaceContext";

interface WorkspaceAccountDailySectionProps {
  accountId: string;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
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

export function WorkspaceAccountDailySection({
  accountId,
}: WorkspaceAccountDailySectionProps): React.ReactElement {
  const { state } = useWorkspaceContext();
  const [activeDate, setActiveDate] = useState(() => new Date());
  const [posts, setPosts] = useState<FeedPostSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const dateKey = toDateKey(activeDate);
  const dateLabel = formatDateLabel(activeDate);

  const workspaceNames = useMemo(() => {
    const names = new Map<string, string>();
    Object.values(state.workspaces).forEach((workspace) => {
      names.set(workspace.id, workspace.name);
    });
    return names;
  }, [state.workspaces]);

  useEffect(() => {
    let active = true;
    void listAccountFeedPosts({
      accountId,
      dateKey,
      limit: 200,
    }).then((result) => {
      if (!active) return;
      const sorted = [...result].sort(
        (a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime(),
      );
      setPosts(sorted);
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setPosts([]);
      setLoading(false);
    });
    return () => { active = false; };
  }, [accountId, dateKey]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">每日</h1>
        </div>
        <Badge variant="outline" className="text-xs">{dateLabel}</Badge>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            setLoading(true);
            setActiveDate((d) => addDays(d, -1));
          }}
          className="rounded-md border border-border/50 p-1 text-muted-foreground hover:bg-muted/50 transition"
          aria-label="前一天"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          onClick={() => {
            setLoading(true);
            setActiveDate((d) => addDays(d, 1));
          }}
          className="rounded-md border border-border/50 p-1 text-muted-foreground hover:bg-muted/50 transition"
          aria-label="下一天"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="space-y-2 rounded-xl border border-border/40 bg-card/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-xs">
                  {workspaceNames.get(post.workspaceId) ?? post.workspaceId}
                </Badge>
                <time className="text-xs text-muted-foreground" dateTime={post.createdAtISO}>
                  {new Date(post.createdAtISO).toLocaleTimeString("zh-Hant-TW", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="text-xs text-muted-foreground">{post.authorAccountId}</p>
              {post.content && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">此日期尚無跨工作區 Daily 記錄</p>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
