"use client";

/**
 * DailyFeed — 施工動態饋送（IG/FB 瀑布流）。
 * 純無框垂直流，依建立時間倒序，支援無限滾動載入。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import type { QueryScope } from "../../../shared/domain/types";
import type { DailyPost } from "../../domain/schema";
import { getDailyFeed } from "../queries/daily-post.queries";
import { DailyPostCard } from "./DailyPostCard";

// ── 骨架載入畫面 ──────────────────────────────────────────────────────────

function FeedSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-border/30">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="py-3 space-y-3">
          <div className="flex items-center gap-2.5 px-3">
            <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-2.5 w-20 rounded bg-muted" />
            </div>
          </div>
          <div className="h-64 w-full bg-muted" />
          <div className="px-3 h-3 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

// ── 主要元件 ────────────────────────────────────────────────────────────────

interface DailyFeedProps {
  /** 查詢範圍：傳入 workspaceId 限定單一工作區，否則聚合整個帳號 */
  scope: QueryScope;
}

export function DailyFeed({ scope }: DailyFeedProps) {
  const [posts, setPosts] = useState<DailyPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [loadingMore, setLoadingMore] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  // 初次載入
  useEffect(() => {
    if (!scope.accountId || loadedRef.current) return;
    loadedRef.current = true;

    let cancelled = false;
    setStatus("loading");

    void getDailyFeed(scope, null)
      .then((page) => {
        if (cancelled) return;
        setPosts(page.items);
        setNextCursor(page.nextCursor);
        setStatus("loaded");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.accountId, scope.workspaceId]);

  // 載入下一頁
  const fetchNextPage = useCallback(() => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    void getDailyFeed(scope, nextCursor)
      .then((page) => {
        setPosts((prev) => [...prev, ...page.items]);
        setNextCursor(page.nextCursor);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [scope, nextCursor, loadingMore]);

  // IntersectionObserver 無限滾動
  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && nextCursor && !loadingMore) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchNextPage]);

  if (status === "loading") return <FeedSkeleton />;

  if (status === "error") {
    return (
      <p className="text-sm text-destructive py-8 text-center">
        無法載入動態，請稍後再試。
      </p>
    );
  }

  if (status === "loaded" && posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        目前尚無動態，成為第一個發布的人吧！
      </p>
    );
  }

  return (
    <div className="divide-y divide-border/30 pb-20">
      {posts.map((post) => (
        <DailyPostCard key={post.id} post={post} />
      ))}

      {loadingMore && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!nextCursor && status === "loaded" && posts.length > 0 && (
        <p className="text-xs text-muted-foreground text-center py-6">已顯示全部動態</p>
      )}

      <div ref={bottomRef} className="h-2" />
    </div>
  );
}
