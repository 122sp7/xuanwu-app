"use client";

import { useEffect, useState } from "react";
import { FileText, MoreHorizontal, Plus, Send, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import type { WorkspaceEntity } from "@/modules/workspace";
import { listWorkspaceScheduleMdddFlowProjections } from "../queries/schedule-mddd.queries";
import { submitScheduleRequest } from "../_actions/schedule-request.actions";
import type { ScheduleMdddFlowProjection } from "../../domain/mddd/value-objects/Projection";
import type { RequestStatus } from "../../domain/mddd/value-objects/WorkflowStatuses";
import { Badge } from "@/ui/shadcn/ui/badge";

// ── Request status helpers ────────────────────────────────────────────────────

const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  draft: "草稿",
  submitted: "已提交",
  "under-review": "審查中",
  accepted: "已接受",
  rejected: "已拒絕",
  cancelled: "已取消",
  closed: "已結束",
};

const REQUEST_STATUS_VARIANT: Record<
  RequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  submitted: "secondary",
  "under-review": "default",
  accepted: "default",
  rejected: "destructive",
  cancelled: "outline",
  closed: "outline",
};

interface WorkspaceScheduleTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const { state: appState } = useApp();
  const actorAccountId = appState.activeAccount?.id ?? "";

  const [projections, setProjections] = useState<readonly ScheduleMdddFlowProjection[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestNotes, setRequestNotes] = useState("");
  const [requestWindow, setRequestWindow] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listWorkspaceScheduleMdddFlowProjections(workspace.id)
      .then((rows) => {
        if (!cancelled) setProjections(rows);
      })
      .catch(() => {
        if (!cancelled) setProjections([]);
      });
    return () => {
      cancelled = true;
    };
  }, [workspace.id]);

  async function handleSubmitRequest() {
    if (!requestNotes.trim()) return;
    setSubmitting(true);
    try {
      await submitScheduleRequest({
        workspaceId: workspace.id,
        organizationId: workspace.accountId,
        requiredSkills: [],
        proposedStartAtISO: requestWindow ? new Date(requestWindow).toISOString() : null,
        notes: requestNotes.trim(),
        actorAccountId,
      });
      setRequestNotes("");
      setRequestWindow("");
      setShowRequestForm(false);
      listWorkspaceScheduleMdddFlowProjections(workspace.id)
        .then((rows) => setProjections(rows))
        .catch(() => {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">資源請求</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            向組織提出人力需求，組織將審核並指派成員。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRequestForm((v) => !v)}
          className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          新增請求
        </button>
      </div>

      {/* ── Inline new-request form ── */}
      {showRequestForm && (
        <div className="rounded-md border border-border/60 bg-muted/20 p-3 space-y-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              需求說明 <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={2}
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              placeholder="說明人力需求的背景、工作內容…"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              期望開始時間（選填）
            </label>
            <input
              type="datetime-local"
              value={requestWindow}
              onChange={(e) => setRequestWindow(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowRequestForm(false);
                setRequestNotes("");
                setRequestWindow("");
              }}
              className="flex h-7 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-muted"
            >
              <X className="h-3 w-3" />
              取消
            </button>
            <button
              type="button"
              disabled={submitting || !requestNotes.trim()}
              onClick={() => void handleSubmitRequest()}
              className="flex h-7 items-center gap-1 rounded-md bg-foreground px-2.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              {submitting ? "提交中…" : "提交"}
            </button>
          </div>
        </div>
      )}

      {/* ── Request list ── */}
      {projections.length === 0 ? (
        <div className="rounded-md border border-border/50 px-6 py-8 text-center text-xs text-muted-foreground">
          尚未提出任何資源請求。
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border/50">
          <ul className="divide-y divide-border/40">
            {projections.map((p) => (
              <li
                key={p.requestId}
                className="flex w-full items-center justify-between bg-background px-4 py-3 text-sm hover:bg-muted/30"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={REQUEST_STATUS_VARIANT[p.requestStatus]}>
                      {REQUEST_STATUS_LABEL[p.requestStatus]}
                    </Badge>
                    {p.eventTypes.map((etSlug) => (
                      <Badge key={etSlug} variant="outline" className="text-[10px]">
                        <FileText className="mr-1 h-2.5 w-2.5" />
                        {etSlug}
                      </Badge>
                    ))}
                    {p.assigneeAccountUserId && (
                      <span className="text-xs text-muted-foreground">
                        指派給 {p.assigneeAccountUserId.slice(0, 8)}…
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    更新：{new Date(p.updatedAtISO).toLocaleString("zh-TW")}
                    {p.lastReason ? ` · ${p.lastReason}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {(p.requestStatus === "submitted" || p.requestStatus === "draft") && (
                    <button
                      type="button"
                      title="取消請求"
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="更多選項"
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
