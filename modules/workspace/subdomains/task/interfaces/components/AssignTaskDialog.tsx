"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

import { wfAssignTask } from "../_actions/workspace-flow-task.actions";

export interface AssignTaskDialogProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onDone: () => void;
}

export function AssignTaskDialog({ open, taskId, onClose, onDone }: AssignTaskDialogProps) {
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setAssigneeId("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const a = assigneeId.trim();
    if (!a) { setError("請輸入指派人 ID。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfAssignTask(taskId, a);
      if (!result.success) { setError(result.error.message ?? "指派失敗"); return; }
      onDone();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "指派失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>指派任務</DialogTitle>
          <DialogDescription>填入負責人 ID，任務將進入進行中。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="assignee-id">指派人 ID *</Label>
            <Input
              id="assignee-id"
              placeholder="用戶 ID"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "指派中…" : "指派"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
 
