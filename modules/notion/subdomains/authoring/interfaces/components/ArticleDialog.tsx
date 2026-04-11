"use client";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/components
 * Purpose: Dialog for creating and editing Knowledge Base articles.
 */

import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

import { createArticle, updateArticle } from "../_actions/article.actions";
import type { ArticleSnapshot } from "../../application/dto/authoring.dto";
import type { CategorySnapshot } from "../../application/dto/authoring.dto";

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  categories: CategorySnapshot[];
  /** Article to edit — omit for create mode */
  article?: ArticleSnapshot;
  onSuccess?: (articleId?: string) => void;
}

export function ArticleDialog({
  open,
  onOpenChange,
  accountId,
  workspaceId,
  currentUserId,
  categories,
  article,
  onSuccess,
}: ArticleDialogProps) {
  const isEdit = !!article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [categoryId, setCategoryId] = useState<string>(article?.categoryId ?? "__none__");
  const [tags, setTags] = useState(article?.tags.join(", ") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void Promise.resolve().then(() => {
      setTitle(article?.title ?? "");
      setContent(article?.content ?? "");
      setCategoryId(article?.categoryId ?? "__none__");
      setTags(article?.tags.join(", ") ?? "");
      setError(null);
    });
  }, [article, open]);

  function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("標題不可空白");
      return;
    }
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const resolvedCategoryId = categoryId === "__none__" ? null : categoryId;

    startTransition(async () => {
      setError(null);
      if (isEdit) {
        const result = await updateArticle({
          id: article!.id,
          accountId,
          title: trimmedTitle,
          content,
          categoryId: resolvedCategoryId,
          tags: parsedTags,
        });
        if (!result.success) {
          setError(result.error.message ?? "更新失敗");
          return;
        }
        onSuccess?.();
      } else {
        const result = await createArticle({
          accountId,
          workspaceId,
          title: trimmedTitle,
          content,
          categoryId: resolvedCategoryId,
          tags: parsedTags,
          createdByUserId: currentUserId,
        });
        if (!result.success) {
          setError(result.error.message ?? "建立失敗");
          return;
        }
        onSuccess?.(result.aggregateId);
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "編輯文章" : "新增文章"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-title">標題</Label>
            <Input
              id="kb-article-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章標題"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-category">分類</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="kb-article-category">
                <SelectValue placeholder="選擇分類（選填）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— 不指定 —</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-tags">
              標籤{" "}
              <span className="text-muted-foreground text-xs">（以逗號分隔）</span>
            </Label>
            <Input
              id="kb-article-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="標籤1, 標籤2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kb-article-content">內容</Label>
            <Textarea
              id="kb-article-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="文章內容（支援 Markdown）"
              rows={6}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !title.trim()}>
            {isPending ? "儲存中…" : isEdit ? "更新文章" : "建立文章"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
