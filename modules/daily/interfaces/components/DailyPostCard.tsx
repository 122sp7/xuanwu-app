"use client";

/**
 * DailyPostCard — 施工動態貼文卡片。
 * 仿 Facebook/Instagram 風格，呈現貼文內容、附件網格與互動按鈕。
 */

import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale/zh-TW";
import { AlertTriangle, Heart, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Card, CardContent, CardHeader } from "@ui-shadcn/ui/card";

import type { DailyPost, DailyPostType } from "../../domain/schema";

// ── 類型標籤顏色映射 ───────────────────────────────────────────────────────

const TYPE_LABEL: Record<DailyPostType, string> = {
  progress: "進度",
  issue: "問題",
  safety: "安全",
  material: "材料",
};

const TYPE_CLASS: Record<DailyPostType, string> = {
  progress: "bg-green-100 text-green-800 border-green-200",
  issue: "bg-red-100 text-red-800 border-red-200",
  safety: "bg-yellow-100 text-yellow-800 border-yellow-200",
  material: "bg-blue-100 text-blue-800 border-blue-200",
};

// ── 媒體附件網格 ───────────────────────────────────────────────────────────

interface MediaGridProps {
  attachments: DailyPost["attachments"];
}

function MediaGrid({ attachments }: MediaGridProps) {
  if (attachments.length === 0) return null;

  const gridClass =
    attachments.length === 1
      ? "grid-cols-1"
      : attachments.length === 2
        ? "grid-cols-2"
        : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-1 rounded-lg overflow-hidden`}>
      {attachments.slice(0, 4).map((media) => (
        <div key={media.id} className="relative aspect-video bg-muted">
          {media.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.thumbnailUrl ?? media.url}
              alt="施工現場照片"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">
              {media.type === "video" ? "🎬 影片" : "📄 文件"}
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

  return (
    <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start space-x-3 p-4 pb-2">
        {/* 使用者頭像 */}
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={post.createdBy.avatarUrl} alt={post.createdBy.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          {/* 使用者名稱與時間 */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold truncate">{post.createdBy.name}</span>
            <time className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</time>
          </div>

          {/* 工作區來源與分類標籤 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">@{post.workspaceId}</span>
            <Badge
              variant="outline"
              className={`text-xs px-1.5 py-0 ${TYPE_CLASS[post.type]}`}
            >
              {TYPE_LABEL[post.type]}
            </Badge>
            {post.isFlagged && (
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* 貼文正文 */}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>

        {/* 媒體附件 */}
        <MediaGrid attachments={post.attachments} />

        {/* 互動按鈕列 */}
        <div className="flex items-center gap-4 border-t border-border/40 pt-3">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>{post.reactionCount}</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount} 留言</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
