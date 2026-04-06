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
import { Textarea } from "@ui-shadcn/ui/textarea";

import { wfCreateTask } from "../_actions/workspace-flow-task.actions";

export interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  workspaceId: string;
}

export function CreateTaskDialog({ open, onClose, onCreated, workspaceId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDateISO, setDueDateISO] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setDueDateISO("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入任務標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfCreateTask({
        workspaceId,
        title: t,
        description: description.trim() || undefined,
        assigneeId: assigneeId.trim() || undefined,
        dueDateISO: dueDateISO || undefined,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立任務</DialogTitle>
          <DialogDescription>新增一個工作任務到此工作區。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">標題 *</Label>
            <Input
              id="task-title"
              placeholder="任務名稱"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-description">描述（選填）</Label>
            <Textarea
              id="task-description"
              placeholder="任務詳情或驗收條件…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">指派人 ID（選填）</Label>
              <Input
                id="task-assignee"
                placeholder="用戶 ID"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">截止日期（選填）</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDateISO}
                onChange={(e) => setDueDateISO(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "建立任務"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
