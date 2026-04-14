"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2, Share2, Star } from "lucide-react";

import { useApp } from "@/modules/platform/api/ui";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { workspaceFeedFacade } from "../../api/workspace-feed.facade";
import type { WorkspaceFeedPost } from "../../application/dto/workspace-feed.dto";

interface WorkspaceFeedAccountViewProps {
  readonly accountId: string;
  readonly actorAccountId?: string | null;
}

export function WorkspaceFeedAccountView({ accountId, actorAccountId }: WorkspaceFeedAccountViewProps) {
  const { state: appState } = useApp();
  const actorId = actorAccountId ?? appState.activeAccount?.id ?? accountId;

  const [posts, setPosts] = useState<WorkspaceFeedPost[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actingPostId, setActingPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await workspaceFeedFacade.getAccountFeed(accountId, 80);
      setPosts(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入 account feed 失敗");
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  async function handleAction(post: WorkspaceFeedPost, action: "like" | "view" | "bookmark" | "share" | "repost") {
    setActingPostId(post.id);
    setError(null);
    try {
      if (action === "like") {
        await workspaceFeedFacade.like({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "view") {
        await workspaceFeedFacade.view({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "bookmark") {
        await workspaceFeedFacade.bookmark({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "share") {
        await workspaceFeedFacade.share({ accountId, postId: post.id, actorAccountId: actorId });
      }
      if (action === "repost") {
        await workspaceFeedFacade.repost({
          accountId,
          workspaceId: post.workspaceId,
          sourcePostId: post.id,
          actorAccountId: actorId,
        });
      }
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "互動失敗");
    } finally {
      setActingPostId(null);
    }
  }

  async function handleReply(post: WorkspaceFeedPost) {
    const content = replyDrafts[post.id]?.trim() ?? "";
    if (!content) return;

    setActingPostId(post.id);
    setError(null);
    try {
      await workspaceFeedFacade.reply({
        accountId,
        workspaceId: post.workspaceId,
        parentPostId: post.id,
        authorAccountId: actorId,
        content,
      });
      setReplyDrafts((prev) => ({ ...prev, [post.id]: "" }));
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "回覆失敗");
    } finally {
      setActingPostId(null);
    }
  }

  return (
    <>
      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">載入 account feed 中...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">目前沒有任何 workspace 貼文。</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {post.type.toUpperCase()} · workspace {post.workspaceId} · {new Date(post.createdAtISO).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">by {post.authorAccountId}</p>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6">{post.content}</p>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeReplyPostId === post.id ? "default" : "outline"}
                  onClick={() => setActiveReplyPostId((current) => (current === post.id ? null : post.id))}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Reply {post.replyCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "repost")} disabled={actingPostId === post.id}>
                  <Repeat2 className="mr-1 h-4 w-4" />
                  Repost {post.repostCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "like")} disabled={actingPostId === post.id}>
                  <Heart className="mr-1 h-4 w-4" />
                  Like {post.likeCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "view")} disabled={actingPostId === post.id}>
                  <Eye className="mr-1 h-4 w-4" />
                  View {post.viewCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "bookmark")} disabled={actingPostId === post.id}>
                  <Star className="mr-1 h-4 w-4" />
                  bookmark {post.bookmarkCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post, "share")} disabled={actingPostId === post.id}>
                  <Share2 className="mr-1 h-4 w-4" />
                  share {post.shareCount}
                </Button>
              </div>

              {activeReplyPostId === post.id && (
                <div className="space-y-2 rounded-xl border border-border/40 p-3">
                  <Textarea
                    value={replyDrafts[post.id] ?? ""}
                    onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))}
                    placeholder="回覆這則貼文..."
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" type="button" variant="ghost" onClick={() => setActiveReplyPostId(null)}>
                      取消
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => void handleReply(post)}
                      disabled={actingPostId === post.id || !(replyDrafts[post.id] ?? "").trim()}
                    >
                      回覆
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </>
  );
}
