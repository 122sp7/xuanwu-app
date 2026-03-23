"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import type { AcceptanceRecord } from "../../domain/entities/AcceptanceRecord";
import {
  canTransitionAcceptance,
  ACCEPTANCE_STATUSES,
  type AcceptanceLifecycleStatus,
} from "../../domain/value-objects/acceptance-state";
import { getWorkspaceAcceptanceSummary } from "../queries/acceptance.queries";
import { createAcceptanceRecord, transitionAcceptanceRecord } from "../_actions/acceptance.actions";
import { getAcceptanceRecords } from "../queries/acceptance-record.queries";

interface WorkspaceAcceptanceTabProps {
  readonly workspace: WorkspaceEntity;
}

const STATUS_VARIANT: Record<AcceptanceLifecycleStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  reviewing: "default",
  accepted: "secondary",
  rejected: "destructive",
};

function nextStatuses(current: AcceptanceLifecycleStatus): AcceptanceLifecycleStatus[] {
  return ACCEPTANCE_STATUSES.filter((s) => canTransitionAcceptance(current, s));
}

export function WorkspaceAcceptanceTab({ workspace }: WorkspaceAcceptanceTabProps) {
  const summary = useMemo(() => getWorkspaceAcceptanceSummary(workspace), [workspace]);

  const [records, setRecords] = useState<AcceptanceRecord[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [taskId, setTaskId] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setLoadState("loading");
    try {
      setRecords(await getAcceptanceRecords(workspace.id));
      setLoadState("loaded");
    } catch {
      setRecords([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await loadRecords(); })();
    return () => { cancelled = true; };
  }, [loadRecords]);

  async function handleCreate() {
    const desc = itemDesc.trim();
    if (!desc) { setActionError("請輸入驗收項目描述。"); return; }
    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createAcceptanceRecord({
        tenantId: workspace.id,
        teamId: workspace.id,
        workspaceId: workspace.id,
        taskId: taskId.trim() || workspace.id,
        items: [{ description: desc }],
      });
      if (!result.success) { setActionError(result.error.message); return; }
      setTaskId("");
      setItemDesc("");
      await loadRecords();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleTransition(
    recordId: string,
    to: AcceptanceLifecycleStatus,
  ) {
    setPendingId(recordId);
    setActionError(null);
    try {
      const result = await transitionAcceptanceRecord(recordId, to, {
        reviewedBy: to === "reviewing" ? "ui" : undefined,
        signedBy: to === "accepted" ? "ui" : undefined,
        rejectionReason: to === "rejected" ? "manual rejection" : undefined,
      });
      if (!result.success) { setActionError(result.error.message); return; }
      await loadRecords();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Acceptance</CardTitle>
        <CardDescription>
          Readiness gates（自動）+ 正式驗收記錄（pending → reviewing → accepted | rejected）。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ── Readiness Gates ─────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Readiness decision</p>
              <Badge variant={summary.overallReady ? "secondary" : "outline"}>
                {summary.overallReady ? "ready-for-acceptance" : "needs-preparation"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {summary.overallReady
                ? "所有 readiness gates 已通過。"
                : "仍有前置條件未完成。"}
            </p>
          </div>
          {summary.gates.map((gate) => (
            <div key={gate.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{gate.label}</p>
                  <p className="text-sm text-muted-foreground">{gate.detail}</p>
                </div>
                <Badge variant={gate.status === "ready" ? "secondary" : "outline"}>{gate.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Acceptance Records ───────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">正式驗收記錄</p>

          <div className="grid gap-3 rounded-xl border border-border/40 p-4 sm:grid-cols-[1fr_1fr_auto]">
            <Input value={taskId} placeholder="Task ID（選填）" onChange={(e) => setTaskId(e.target.value)} disabled={isCreating} />
            <Input value={itemDesc} placeholder="驗收項目描述" onChange={(e) => setItemDesc(e.target.value)} disabled={isCreating} />
            <Button type="button" onClick={() => void handleCreate()} disabled={isCreating} className="w-full sm:w-auto">
              {isCreating ? "建立中…" : "新增記錄"}
            </Button>
          </div>

          {loadState === "loading" && <p className="text-sm text-muted-foreground">Loading records…</p>}
          {loadState === "error" && <p className="text-sm text-destructive">無法載入驗收記錄。</p>}
          {actionError && <p className="text-sm text-destructive">{actionError}</p>}
          {loadState === "loaded" && records.length === 0 && (
            <p className="text-sm text-muted-foreground">尚未建立驗收記錄。</p>
          )}

          <div className="space-y-3">
            {records.map((rec) => {
              const nexts = nextStatuses(rec.status);
              return (
                <div key={rec.id} className="rounded-xl border border-border/40 px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">task: {rec.taskId.slice(0, 8)}…</p>
                    <Badge variant={STATUS_VARIANT[rec.status]}>{rec.status}</Badge>
                    <span className="text-xs text-muted-foreground">{rec.items.length} item{rec.items.length !== 1 ? "s" : ""}</span>
                  </div>
                  {rec.rejectionReason && (
                    <p className="mt-1 text-xs text-destructive">rejected: {rec.rejectionReason}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nexts.map((to) => (
                      <Button
                        key={to}
                        type="button"
                        variant={to === "rejected" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => void handleTransition(rec.id, to)}
                        disabled={pendingId === rec.id}
                      >
                        → {to}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
