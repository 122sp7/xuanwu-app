"use client";

/**
 * Module: workspace-scheduling
 * Layer: interfaces
 * Purpose: Workspace (tenant) view — submit demands, view own schedule.
 *
 * Occam's Razor: calendar + quick-capture form only.
 * No complex state machines — useState + server actions.
 */

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Plus } from "lucide-react";

import type { WorkspaceEntity } from "@/modules/workspace/api";

import type { WorkDemand } from "../domain/types";
import { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../domain/types";
import { submitWorkDemand } from "./_actions/work-demand.actions";
import { getWorkspaceDemands } from "./queries/work-demand.queries";
import { CalendarWidget } from "./components/CalendarWidget";
import { CreateDemandForm } from "./components/CreateDemandForm";
import type { CreateDemandFormValues } from "./components/CreateDemandForm";

// ── Status badge variant ──────────────────────────────────────────────────────

const STATUS_VARIANT: Record<WorkDemand["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  open: "secondary",
  in_progress: "default",
  completed: "default",
};

const PRIORITY_CLASS: Record<WorkDemand["priority"], string> = {
  low: "text-muted-foreground",
  medium: "text-amber-600",
  high: "text-red-600",
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface WorkspaceSchedulingTabProps {
  readonly workspace: WorkspaceEntity;
  /** Account ID for scoping demands. */
  readonly accountId: string;
  /** ID of the current user (requesterId). */
  readonly currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WorkspaceSchedulingTab({
  workspace,
  accountId,
  currentUserId,
}: WorkspaceSchedulingTabProps) {
  const [demands, setDemands] = useState<WorkDemand[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDemands = useCallback(async () => {
    setLoadState("loading");
    try {
      const data = await getWorkspaceDemands(workspace.id);
      setDemands(data);
      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadDemands();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDemands]);

  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setFormOpen(true);
  }

  function handleNewDemand() {
    setSelectedDate(undefined);
    setFormOpen(true);
  }

  async function handleSubmit(values: CreateDemandFormValues) {
    setActionError(null);
    const result = await submitWorkDemand({
      workspaceId: workspace.id,
      accountId,
      requesterId: currentUserId,
      title: values.title,
      description: values.description,
      priority: values.priority,
      scheduledAt: values.scheduledAt,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    await loadDemands();
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{workspace.name} — 工作規劃</h2>
          <p className="text-sm text-muted-foreground">
            點擊日期或「新增需求」快速建立工作需求。
          </p>
        </div>
        <Button size="sm" onClick={handleNewDemand}>
          <Plus className="mr-1.5 h-4 w-4" />
          新增需求
        </Button>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      {/* ── Calendar ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">排程日曆</CardTitle>
          <CardDescription className="text-xs">
            點擊日期快速排程新需求
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadState === "loading" ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              載入中…
            </div>
          ) : (
            <CalendarWidget demands={demands} onDayClick={handleDayClick} />
          )}
        </CardContent>
      </Card>

      {/* ── Demand list ────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          需求列表 ({demands.length})
        </h3>

        {loadState === "error" && (
          <p className="text-sm text-destructive">載入失敗，請重新整理。</p>
        )}

        {loadState === "loaded" && demands.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            目前尚無需求。點擊日曆日期或「新增需求」開始排程。
          </div>
        )}

        {demands.map((demand) => (
          <div
            key={demand.id}
            className="flex items-start justify-between rounded-lg border border-border/60 bg-card px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">{demand.title}</p>
              {demand.description && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {demand.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                排程日期：{demand.scheduledAt}
              </p>
            </div>
            <div className="ml-4 flex shrink-0 flex-col items-end gap-1.5">
              <Badge variant={STATUS_VARIANT[demand.status]}>
                {DEMAND_STATUS_LABELS[demand.status]}
              </Badge>
              <span className={`text-xs font-medium ${PRIORITY_CLASS[demand.priority]}`}>
                {DEMAND_PRIORITY_LABELS[demand.priority]}優先
              </span>
              {demand.assignedUserId && (
                <span className="text-xs text-muted-foreground">已指派</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Create form dialog ─────────────────────────────────────────── */}
      <CreateDemandForm
        open={formOpen}
        initialDate={selectedDate}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
