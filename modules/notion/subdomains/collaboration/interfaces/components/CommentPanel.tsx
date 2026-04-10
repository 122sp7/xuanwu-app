"use client";

import { useEffect, useState, useTransition } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { Badge } from "@ui-shadcn/ui/badge";
import { Separator } from "@ui-shadcn/ui/separator";

import { subscribeComments } from "../queries";
import { createComment, resolveComment, deleteComment } from "../_actions/comment.actions";
import type { CommentSnapshot } from "../../domain/aggregates/Comment";

interface CommentPanelProps {
  accountId: string;
  workspaceId: string;
  contentId: string;
  contentType: "page" | "article";
  currentUserId: string;
}

export function CommentPanel({ accountId, workspaceId, contentId, contentType, currentUserId }: CommentPanelProps) {
  const [comments, setComments] = useState<CommentSnapshot[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const unsub = subscribeComments(accountId, contentId, setComments);
    return () => unsub();
  }, [accountId, contentId]);

  function handlePost() {
    const trimmed = body.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      const result = await createComment({
        accountId,
        workspaceId,
        contentId,
        contentType,
        authorId: currentUserId,
        body: trimmed,
      });
      if (result.success) {
        setBody("");
      } else {
        setError(result.error.message ?? "留言失敗");
      }
    });
  }

  function handleResolve(commentId: string) {
    startTransition(async () => {
      await resolveComment({ id: commentId, accountId, resolvedByUserId: currentUserId });
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      await deleteComment({ id: commentId, accountId });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">留言</span>
        {comments.length > 0 && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{comments.length}</Badge>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="撰寫留言…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          disabled={isPending}
          className="resize-none text-sm"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          size="sm"
          disabled={isPending || !body.trim()}
          onClick={handlePost}
          className="w-full"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "留言"}
        </Button>
      </div>

      {comments.length > 0 && (
        <>
          <Separator />
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-muted-foreground">{c.authorId}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(c.createdAtISO).toLocaleString("zh-TW", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
                {c.resolvedAt ? (
                  <Badge variant="outline" className="w-fit text-[10px]">已解決</Badge>
                ) : (
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-muted-foreground"
                      disabled={isPending}
                      onClick={() => handleResolve(c.id)}
                    >
                      標記解決
                    </Button>
                    {c.authorId === currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] text-destructive"
                        disabled={isPending}
                        onClick={() => handleDelete(c.id)}
                      >
                        刪除
                      </Button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
