"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MessageSquare, Send, CheckCheck, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { subscribeComments } from "../queries/knowledge-collaboration.queries";
import {
  createComment,
  resolveComment,
  deleteComment,
} from "../_actions/knowledge-collaboration.actions";
import type { Comment } from "../../domain/entities/comment.entity";

interface CommentPanelProps {
  accountId: string;
  workspaceId: string;
  contentId: string;
  contentType: "page" | "article";
  currentUserId: string;
}

export function CommentPanel({ accountId, workspaceId, contentId, contentType, currentUserId }: CommentPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeComments(accountId, contentId, (data) => {
      setComments(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [accountId, contentId]);

  function handlePost() {
    const trimmed = body.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await createComment({ accountId, workspaceId, contentId, contentType, authorId: currentUserId, body: trimmed });
      setBody("");
      textareaRef.current?.focus();
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

  const active = comments.filter((c) => !c.resolvedAt);
  const resolved = comments.filter((c) => c.resolvedAt);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">留言</span>
        {active.length > 0 && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{active.length}</Badge>
        )}
      </div>

      {/* Comment input */}
      <div className="flex flex-col gap-2">
        <Textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="新增留言..."
          rows={2}
          className="resize-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePost();
          }}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handlePost} disabled={!body.trim() || isPending}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            送出
          </Button>
        </div>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)}
        </div>
      ) : active.length === 0 && resolved.length === 0 ? (
        <p className="text-xs text-muted-foreground">尚無留言。</p>
      ) : (
        <div className="space-y-2">
          {active.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              isOwner={c.authorId === currentUserId}
              onResolve={() => handleResolve(c.id)}
              onDelete={() => handleDelete(c.id)}
              isPending={isPending}
            />
          ))}
          {resolved.length > 0 && (
            <details className="text-xs text-muted-foreground cursor-pointer">
              <summary className="select-none">已解決 ({resolved.length})</summary>
              <div className="mt-2 space-y-2">
                {resolved.map((c) => (
                  <CommentItem
                    key={c.id}
                    comment={c}
                    isOwner={c.authorId === currentUserId}
                    onDelete={() => handleDelete(c.id)}
                    isPending={isPending}
                  />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onResolve?: () => void;
  onDelete?: () => void;
  isPending: boolean;
}

function CommentItem({ comment, isOwner, onResolve, onDelete, isPending }: CommentItemProps) {
  const resolved = !!comment.resolvedAt;
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${resolved ? "border-border/30 bg-muted/10 opacity-60" : "border-border/60 bg-background"}`}>
      <p className={`leading-relaxed ${resolved ? "line-through text-muted-foreground" : ""}`}>{comment.body}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">
          {new Date(comment.createdAtISO).toLocaleString("zh-TW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
        {resolved && <Badge variant="outline" className="h-3.5 px-1 text-[9px]">已解決</Badge>}
        <div className="ml-auto flex gap-1">
          {!resolved && onResolve && (
            <button
              type="button"
              onClick={onResolve}
              disabled={isPending}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              title="標記為已解決"
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </button>
          )}
          {isOwner && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isPending}
              className="rounded p-0.5 text-muted-foreground hover:text-destructive"
              title="刪除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
