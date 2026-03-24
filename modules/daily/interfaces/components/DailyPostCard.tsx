"use client";

/**
 * DailyPostCard — 施工動態貼文卡片（IG/FB 瀑布流風格）。
 * 無外框 Card，採用白底分隔線，上方為作者資訊，中間為媒體，下方為互動列。
 */

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale/zh-TW";
import { AlertTriangle, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";

import type { DailyPost, DailyPostType } from "../../domain/schema";

// ── 類型標籤顏色映射 ───────────────────────────────────────────────────────

const TYPE_LABEL: Record<DailyPostType, string> = {
  progress: "進度",
  issue: "問題",
  safety: "安全",
  material: "材料",
};

const TYPE_CLASS: Record<DailyPostType, string> = {
  progress: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  issue: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  safety: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  material: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
};

// ── 媒體附件網格 ───────────────────────────────────────────────────────────

interface MediaGridProps {
  attachments: DailyPost["attachments"];
}

function MediaGrid({ attachments }: MediaGridProps) {
  if (attachments.length === 0) return null;

  const count = attachments.length;
  const gridClass =
    count === 1 ? "grid-cols-1" : count === 2 ? "grid-cols-2" : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-0.5 overflow-hidden`}>
      {attachments.slice(0, 4).map((media, index) => (
        <div
          key={media.id}
          className={`relative bg-muted ${
            count === 3 && index === 0 ? "row-span-2" : ""
          } ${count === 1 ? "aspect-[4/5]" : "aspect-square"}`}
        >
          {media.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.thumbnailUrl ?? media.url}
              alt="施工現場照片"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-1 text-xs text-muted-foreground">
              <span className="text-2xl">{media.type === "video" ? "🎬" : "📄"}</span>
              <span>{media.type === "video" ? "影片" : "文件"}</span>
            </div>
          )}
          {/* 超過 4 張時顯示 +N */}
          {count > 4 && index === 3 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-bold">
              +{count - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── 主要元件 ────────────────────────────────────────────────────────────────

interface DailyPostCardProps {
  post: DailyPost;
}

export function DailyPostCard({ post }: DailyPostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactionCount);

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: zhTW,
      });
    } catch {
      return post.createdAt;
    }
  })();

  const initials = post.createdBy.name.charAt(0).toUpperCase();

  function handleLike() {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({
        title: post.createdBy.name,
        text: post.content,
      });
    }
  }

  return (
    <article className="border-b border-border/30 bg-background pb-2">
      {/* ── 作者列 ── */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 ring-2 ring-border/40">
            <AvatarImage src={post.createdBy.avatarUrl} alt={post.createdBy.name} />
            <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">{post.createdBy.name}</span>
              {post.isFlagged && (
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <Badge
                variant="outline"
                className={`text-[10px] px-1 py-0 leading-4 ${TYPE_CLASS[post.type]}`}
              >
                {TYPE_LABEL[post.type]}
              </Badge>
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="更多選項"
          className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* ── 媒體區（無間距，全寬） ── */}
      <MediaGrid attachments={post.attachments} />

      {/* ── 互動按鈕列 ── */}
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex items-center gap-1">
          {/* 愛心 */}
          <button
            type="button"
            aria-label={liked ? "取消讚" : "按讚"}
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-sm font-medium transition-colors ${
              liked
                ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                : "text-muted-foreground hover:text-rose-500 hover:bg-muted"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-transform ${liked ? "fill-rose-500 scale-110" : ""}`}
            />
            {likeCount > 0 && <span className="tabular-nums">{likeCount}</span>}
          </button>

          {/* 留言 */}
          <button
            type="button"
            aria-label="留言"
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            {post.commentCount > 0 && (
              <span className="tabular-nums">{post.commentCount}</span>
            )}
          </button>

          {/* 分享 */}
          <button
            type="button"
            aria-label="分享"
            onClick={handleShare}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── 貼文正文 ── */}
      <div className="px-3 pb-3 space-y-1">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          <span className="font-semibold mr-1.5">{post.createdBy.name}</span>
          {post.content}
        </p>
        {post.commentCount > 0 && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            查看全部 {post.commentCount} 則留言
          </button>
        )}
      </div>
    </article>
  );
}
