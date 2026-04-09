"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2, Send, Share2, Star } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { workspaceFeedFacade } from "../../api/workspace-feed.facade";
import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";

interface WorkspaceFeedWorkspaceViewProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly workspaceName: string;
}

export function WorkspaceFeedWorkspaceView({
  accountId,
  workspaceId,
  workspaceName,
}: WorkspaceFeedWorkspaceViewProps) {
  const { state: appState } = useApp();
  const actor = appState.activeAccount;
  const actorId = actor?.id ?? accountId;

  const [posts, setPosts] = useState<WorkspaceFeedPost[]>([]);
  const [composer, setComposer] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [actingPostId, setActingPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actorName = actor?.name ?? "未知";
  const actorAvatar = "photoURL" in (actor ?? {}) ? (actor as { photoURL?: string }).photoURL : undefined;
  const actorInitial = actorName.charAt(0).toUpperCase();

  const canPublish = useMemo(() => composer.trim().length > 0, [composer]);

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await workspaceFeedFacade.getWorkspaceFeed(accountId, workspaceId, 50);
      setPosts(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入 feed 失敗");
    } finally {
      setIsLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  async function handlePublish() {
    if (!canPublish || isPublishing) return;
    setIsPublishing(true);
    setError(null);
    try {
      const createdId = await workspaceFeedFacade.createPost({
        accountId,
        workspaceId,
        authorAccountId: actorId,
        content: composer.trim(),
      });
      if (!createdId) {
        setError("建立貼文失敗");
        return;
      }
      setComposer("");
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立貼文失敗");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleAction(postId: string, action: "like" | "view" | "bookmark" | "share" | "repost") {
    setActingPostId(postId);
    setError(null);
    try {
      if (action === "like") {
        await workspaceFeedFacade.like({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "view") {
        await workspaceFeedFacade.view({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "bookmark") {
        await workspaceFeedFacade.bookmark({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "share") {
        await workspaceFeedFacade.share({ accountId, postId, actorAccountId: actorId });
      }
      if (action === "repost") {
        const current = posts.find((row) => row.id === postId);
        if (!current) return;
        await workspaceFeedFacade.repost({
          accountId,
          workspaceId: current.workspaceId,
          sourcePostId: postId,
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

  async function handleReply(postId: string) {
    const text = replyDrafts[postId]?.trim() ?? "";
    if (!text) return;
    setActingPostId(postId);
    setError(null);
    try {
      const current = posts.find((row) => row.id === postId);
      if (!current) return;
      await workspaceFeedFacade.reply({
        accountId,
        workspaceId: current.workspaceId,
        parentPostId: postId,
        authorAccountId: actorId,
        content: text,
      });
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      await refreshFeed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "回覆失敗");
    } finally {
      setActingPostId(null);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card/50 p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={actorAvatar} alt={actorName} />
            <AvatarFallback className="text-sm font-bold">{actorInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{workspaceName} Feed</p>
            <p className="text-xs text-muted-foreground">workspaceId: {workspaceId}</p>
          </div>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          live
        </div>
      </header>

      <div className="space-y-3 rounded-2xl border border-border/60 bg-background/80 p-4">
        <Textarea
          value={composer}
          onChange={(event) => setComposer(event.target.value)}
          placeholder="發佈你的想法到 workspace feed..."
          rows={4}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">actor: {actorName} / account: {accountId}</p>
          <Button type="button" onClick={handlePublish} disabled={!canPublish || isPublishing}>
            <Send className="mr-2 h-4 w-4" />
            {isPublishing ? "送出中..." : "發佈"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">載入 feed 中...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">目前還沒有貼文，發佈第一則吧。</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {post.type.toUpperCase()} · {post.workspaceId} · {new Date(post.createdAtISO).toLocaleString()}
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
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "repost")} disabled={actingPostId === post.id}>
                  <Repeat2 className="mr-1 h-4 w-4" />
                  Repost {post.repostCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "like")} disabled={actingPostId === post.id}>
                  <Heart className="mr-1 h-4 w-4" />
                  Like {post.likeCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "view")} disabled={actingPostId === post.id}>
                  <Eye className="mr-1 h-4 w-4" />
                  View {post.viewCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "bookmark")} disabled={actingPostId === post.id}>
                  <Star className="mr-1 h-4 w-4" />
                  bookmark {post.bookmarkCount}
                </Button>
                <Button size="sm" variant="outline" onClick={() => void handleAction(post.id, "share")} disabled={actingPostId === post.id}>
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
                      onClick={() => void handleReply(post.id)}
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
    </section>
  );
}
