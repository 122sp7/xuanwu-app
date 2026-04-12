"use client";

import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { createKnowledgePage } from "../_actions/knowledge-page.actions";

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  parentPageId?: string | null;
  onSuccess?: (pageId?: string) => void;
}

export function PageDialog({ open, onOpenChange, accountId, workspaceId, currentUserId, parentPageId, onSuccess }: PageDialogProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() { setTitle(""); setError(null); }
  function handleOpenChange(next: boolean) { if (!next) reset(); onOpenChange(next); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("頁面標題為必填"); return; }
    setError(null);
    startTransition(async () => {
      const result = await createKnowledgePage({ accountId, workspaceId, title: title.trim(), parentPageId: parentPageId ?? null, createdByUserId: currentUserId });
      if (result.success) { reset(); onOpenChange(false); onSuccess?.(result.aggregateId); }
      else { setError(result.error?.message ?? "建立失敗"); }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{parentPageId ? "新增子頁面" : "新增頁面"}</DialogTitle></DialogHeader>
        <form id="page-form" className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="page-title">標題 *</Label>
            <Input id="page-title" placeholder="頁面標題" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={isPending}>取消</Button>
          <Button type="submit" form="page-form" size="sm" disabled={isPending || !title.trim()}>{isPending ? "建立中…" : "建立"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
