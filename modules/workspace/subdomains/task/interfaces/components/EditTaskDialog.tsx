"use client";

import { useEffect, useState } from "react";

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

import type { Task } from "../../application/dto/workflow.dto";
import { wfUpdateTask } from "../_actions/workspace-flow-task.actions";

export interface EditTaskDialogProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditTaskDialog({ open, task, onClose, onUpdated }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [assigneeId, setAssigneeId] = useState(task.assigneeId ?? "");
  const [dueDateISO, setDueDateISO] = useState(task.dueDateISO?.slice(0, 10) ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? "");
    setAssigneeId(task.assigneeId ?? "");
    setDueDateISO(task.dueDateISO?.slice(0, 10) ?? "");
    setError(null);
  }, [open, task]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      setError("請輸入任務標題。");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await wfUpdateTask(task.id, {
        title: nextTitle,
        description: description.trim() || undefined,
        assigneeId: assigneeId.trim() || undefined,
        dueDateISO: dueDateISO || undefined,
      });

      if (!result.success) {
        setError(result.error.message ?? "更新失敗");
        return;
      }

      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>編輯任務</DialogTitle>
          <DialogDescription>更新任務標題、指派與到期日。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-task-title">標題 *</Label>
            <Input
              id="edit-task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-task-description">描述</Label>
            <Textarea
              id="edit-task-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-task-assignee">指派人 ID</Label>
              <Input
                id="edit-task-assignee"
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-task-due">截止日期</Label>
              <Input
                id="edit-task-due"
                type="date"
                value={dueDateISO}
                onChange={(event) => setDueDateISO(event.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "儲存中…" : "儲存變更"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
