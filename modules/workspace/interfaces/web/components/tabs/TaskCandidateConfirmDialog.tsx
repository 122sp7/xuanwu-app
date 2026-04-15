"use client";

import { useMemo, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Label } from "@ui-shadcn/ui/label";

import type { WorkspaceManagedTaskCandidate } from "@/modules/workspace/api/facade";

interface TaskCandidateConfirmDialogProps {
  readonly open: boolean;
  readonly filename: string;
  readonly candidates: ReadonlyArray<WorkspaceManagedTaskCandidate>;
  readonly usedAiFallback?: boolean;
  readonly submitting?: boolean;
  readonly error?: string | null;
  readonly onClose: () => void;
  readonly onConfirm: (selectedCandidates: ReadonlyArray<WorkspaceManagedTaskCandidate>) => void;
}

function toCandidateKey(candidate: WorkspaceManagedTaskCandidate, index: number): string {
  return `${candidate.title.trim().toLowerCase()}::${candidate.dueDate ?? "none"}::${index}`;
}

export function TaskCandidateConfirmDialog({
  open,
  filename,
  candidates,
  usedAiFallback = false,
  submitting = false,
  error,
  onClose,
  onConfirm,
}: TaskCandidateConfirmDialogProps) {
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({});

  const selectedCandidates = useMemo(
    () => candidates.filter((candidate, index) => selectedKeys[toCandidateKey(candidate, index)] !== false),
    [candidates, selectedKeys],
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !submitting) onClose(); }}>
      <DialogContent className="max-h-[85vh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-hidden p-0 sm:w-full">
        <div className="flex max-h-[85vh] flex-col">
          <DialogHeader className="border-b border-border/50 px-4 py-4 sm:px-6">
            <DialogTitle>確認任務清單</DialogTitle>
            <DialogDescription>
              系統已根據 {filename} 的解析 JSON 抽出 {candidates.length} 項候選任務，請確認後再建立。
            </DialogDescription>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="outline">{usedAiFallback ? "AI 抽取" : "候選結果"}</Badge>
              <Badge variant="secondary">已選 {selectedCandidates.length} 項</Badge>
            </div>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
            {candidates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
                目前沒有可確認的候選任務。你可以先改用手動建立，或修正 AI 金鑰後再重新嘗試。
              </div>
            ) : candidates.map((candidate, index) => {
              const candidateKey = toCandidateKey(candidate, index);
              const checked = selectedKeys[candidateKey] !== false;

              return (
                <div
                  key={candidateKey}
                  className="rounded-xl border border-border/60 bg-card/70 p-3 shadow-sm sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={candidateKey}
                      checked={checked}
                      disabled={submitting}
                      onCheckedChange={(nextChecked) => {
                        setSelectedKeys((current) => ({
                          ...current,
                          [candidateKey]: Boolean(nextChecked),
                        }));
                      }}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Label htmlFor={candidateKey} className="cursor-pointer text-sm font-medium text-foreground sm:text-base">
                        {candidate.title}
                      </Label>
                      {candidate.description ? (
                        <p className="text-sm leading-6 text-muted-foreground text-pretty">
                          {candidate.description}
                        </p>
                      ) : null}
                      {candidate.dueDate ? (
                        <Badge variant="outline">截止：{candidate.dueDate}</Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {error ? (
              <p role="alert" className="text-sm text-destructive">{error}</p>
            ) : null}
          </div>

          <DialogFooter className="border-t border-border/50 px-4 py-4 sm:px-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>取消</Button>
            <Button
              type="button"
              disabled={submitting || selectedCandidates.length === 0}
              onClick={() => onConfirm(selectedCandidates)}
            >
              {submitting ? "建立中…" : `建立 ${selectedCandidates.length} 項任務`}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
