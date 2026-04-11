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

import type { IssueStage } from "../../application/dto/workflow.dto";
import { wfOpenIssue } from "../_actions/workspace-flow.actions";
import { ISSUE_STAGE_LABEL } from "./IssueRow";

export interface OpenIssueDialogProps {
  open: boolean;
  taskId: string;
  currentUserId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function OpenIssueDialog({ open, taskId, currentUserId, onClose, onCreated }: OpenIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<IssueStage>("task");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setStage("task");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入議題標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfOpenIssue({
        taskId,
        stage,
        title: t,
        description: description.trim() || undefined,
        createdBy: currentUserId,
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
          <DialogTitle>開啟議題</DialogTitle>
          <DialogDescription>記錄此任務發現的問題或異常。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">標題 *</Label>
            <Input
              id="issue-title"
              placeholder="問題簡述"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue-description">描述（選填）</Label>
            <Textarea
              id="issue-description"
              placeholder="問題詳情、重現步驟…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label>發生階段</Label>
            <div className="flex gap-2">
              {(["task", "qa", "acceptance"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={stage === s ? "default" : "outline"}
                  onClick={() => setStage(s)}
                  disabled={submitting}
                >
                  {ISSUE_STAGE_LABEL[s]}
                </Button>
              ))}
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "開啟議題"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
 
