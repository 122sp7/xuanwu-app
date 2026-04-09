"use client";

import { useState } from "react";

import { format } from "@lib-date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { DEMAND_PRIORITY_LABELS } from "../../domain/types";
import type { DemandPriority } from "../../domain/types";

export interface CreateDemandFormValues {
  title: string;
  description: string;
  priority: DemandPriority;
  scheduledAt: string;
}

interface CreateDemandFormProps {
  open: boolean;
  initialDate?: Date;
  onClose: () => void;
  onSubmit: (values: CreateDemandFormValues) => Promise<void>;
}

export function CreateDemandForm({
  open,
  initialDate,
  onClose,
  onSubmit,
}: CreateDemandFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<DemandPriority>("medium");
  const [scheduledAt, setScheduledAt] = useState(
    initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && initialDate) {
      setScheduledAt(format(initialDate, "yyyy-MM-dd"));
    }
    if (!isOpen) handleClose();
  };

  function handleClose() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setScheduledAt(initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("請輸入需求標題。");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title: t, description: description.trim(), priority, scheduledAt });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立工作需求</DialogTitle>
          <DialogDescription>
            填寫需求詳情後送出，Account 管理員將收到通知並指派成員。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="demand-title">標題 *</Label>
            <Input
              id="demand-title"
              placeholder="需要完成什麼工作？"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="demand-description">描述（選填）</Label>
            <Textarea
              id="demand-description"
              placeholder="詳細說明需求背景或驗收條件…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="demand-priority">優先級</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as DemandPriority)}
                disabled={submitting}
              >
                <SelectTrigger id="demand-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high"] as const).map((p) => (
                    <SelectItem key={p} value={p}>
                      {DEMAND_PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="demand-date">排程日期 *</Label>
              <Input
                id="demand-date"
                type="date"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              取消
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "提交中…" : "建立需求"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

