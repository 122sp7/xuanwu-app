"use client";

/**
 * DailyFeed — 施工動態饋送（Construction Social Feed）。
 * 使用 TanStack Query v5 的 useInfiniteQuery 實現無限滾動載入。
 */

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@lib-tanstack";
import { Loader2 } from "lucide-react";

import type { QueryScope } from "../../shared/domain/types";
import { getDailyFeed } from "../infrastructure/api";
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
  // 底部偵測 ref，用於觸發載入下一頁
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["daily-feed", scope.accountId, scope.workspaceId ?? "all"],
    queryFn: ({ pageParam }) =>
      getDailyFeed(scope, pageParam as string | null | undefined),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30_000, // 30 秒內不重新請求
  });

  // IntersectionObserver 觸發無限滾動
  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 初始載入
  if (status === "pending") {
    return <FeedSkeleton />;
  }

  // 錯誤狀態
  if (status === "error") {
    return (
      <p className="text-sm text-destructive py-4 text-center">
        無法載入動態，請稍後再試。
        {process.env.NODE_ENV !== "production" && (
          <span className="block text-xs opacity-60 mt-1">
            {error instanceof Error ? error.message : String(error)}
          </span>
        )}
      </p>
    );
  }

  const allPosts = data.pages.flatMap((page) => page.items);

  if (allPosts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        目前尚無施工動態，成為第一個發布紀錄的人吧！
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* 動態卡片列表 */}
      {allPosts.map((post) => (
        <DailyPostCard key={post.id} post={post} />
      ))}

      {/* 載入中指示器 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* 到達最底部 */}
      {!hasNextPage && allPosts.length > 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">已顯示全部動態</p>
      )}

      {/* 底部偵測點 */}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
}
