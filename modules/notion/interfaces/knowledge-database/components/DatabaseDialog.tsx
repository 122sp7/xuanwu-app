"use client";

/**
 * Module: notion/subdomains/knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseDialog — modal for creating a new Database.
 */

import { useState, useTransition } from "react";

import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { createDatabase } from "../_actions/knowledge-database.actions";

interface DatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  onSuccess?: () => void;
}

export function DatabaseDialog({ open, onOpenChange, accountId, workspaceId, currentUserId, onSuccess }: DatabaseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setName("");
    setDescription("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await createDatabase({
        accountId,
        workspaceId,
        name: name.trim(),
        description: description.trim() || undefined,
        createdByUserId: currentUserId,
      });
      if (result.success) {
        handleOpenChange(false);
        onSuccess?.();
      } else {
        setError(result.error.message ?? "建立失敗");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增資料庫</DialogTitle>
        </DialogHeader>
        <form id="db-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="db-name">名稱 *</Label>
            <Input
              id="db-name"
              placeholder="資料庫名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="db-desc">說明</Label>
            <Textarea
              id="db-desc"
              placeholder="選填：說明此資料庫的用途"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            取消
          </Button>
          <Button type="submit" form="db-form" disabled={isPending || !name.trim()}>
            {isPending ? "建立中…" : "建立"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
