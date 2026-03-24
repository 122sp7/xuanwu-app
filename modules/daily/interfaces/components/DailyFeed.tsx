"use client";

/**
 * DailyFeed — 施工動態饋送（Construction Social Feed）。
 * 使用 useEffect + useState 實現手動分頁載入，與現有程式庫風格一致。
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
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/40 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted" />
            <div className="space-y-1 flex-1">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
          <div className="h-14 w-full rounded bg-muted" />
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

  // 底部偵測 ref，用於觸發載入下一頁
  const bottomRef = useRef<HTMLDivElement>(null);
  // 防止 effect 重複執行的 ref
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
    // scope 物件以字串鍵聚合，避免每次渲染都重新載入
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

  // IntersectionObserver 觸發無限滾動
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

  if (status === "loading") {
    return <FeedSkeleton />;
  }

  if (status === "error") {
    return (
      <p className="text-sm text-destructive py-4 text-center">
        無法載入施工動態，請稍後再試。
      </p>
    );
  }

  if (status === "loaded" && posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        目前尚無施工動態，成為第一個發布紀錄的人吧！
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* 動態卡片列表 */}
      {posts.map((post) => (
        <DailyPostCard key={post.id} post={post} />
      ))}

      {/* 載入中指示器 */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* 到達最底部 */}
      {!nextCursor && status === "loaded" && posts.length > 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">已顯示全部動態</p>
      )}

      {/* 底部偵測點 */}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
}
