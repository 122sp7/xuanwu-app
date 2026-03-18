"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";
import type {
  WorkspaceQualityCheckEntity,
  WorkspaceQualityCheckStatus,
} from "../../domain/entities/QualityCheck";
import {
  createWorkspaceQualityCheck,
  deleteWorkspaceQualityCheck,
  updateWorkspaceQualityCheck,
} from "../_actions/qa.actions";
import { getWorkspaceQualityChecks } from "../queries/qa.queries";

interface WorkspaceQATabProps {
  readonly workspace: WorkspaceEntity;
}

const statusVariantMap = {
  pass: "default",
  warn: "outline",
  fail: "destructive",
} as const;

export function WorkspaceQATab({ workspace }: WorkspaceQATabProps) {
  const [checks, setChecks] = useState<WorkspaceQualityCheckEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingCheckId, setPendingCheckId] = useState<string | null>(null);

  const loadChecks = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoadState("loading");
    }

    try {
      const nextChecks = await getWorkspaceQualityChecks(workspace.id);
      setChecks(nextChecks);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceQATab] Failed to load checks:", error);
      }
      setChecks([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) {
        return;
      }
      await loadChecks({ silent: true });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loadChecks]);

  const passCount = useMemo(() => checks.filter((check) => check.status === "pass").length, [checks]);
  const warnCount = useMemo(() => checks.filter((check) => check.status === "warn").length, [checks]);
  const failCount = useMemo(() => checks.filter((check) => check.status === "fail").length, [checks]);

  async function handleCreateCheck() {
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      setActionError("請輸入 QA check 名稱。");
      return;
    }

    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createWorkspaceQualityCheck({
        workspaceId: workspace.id,
        label: normalizedLabel,
        detail: detail.trim() || undefined,
      });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }

      setLabel("");
      setDetail("");
      await loadChecks({ silent: true });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleStatusChange(qualityCheckId: string, status: WorkspaceQualityCheckStatus) {
    setPendingCheckId(qualityCheckId);
    setActionError(null);
    try {
      const result = await updateWorkspaceQualityCheck(qualityCheckId, { status });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }

      await loadChecks({ silent: true });
    } finally {
      setPendingCheckId(null);
    }
  }

  async function handleDeleteCheck(qualityCheckId: string) {
    setPendingCheckId(qualityCheckId);
    setActionError(null);
    try {
      const result = await deleteWorkspaceQualityCheck(qualityCheckId);
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadChecks();
    } finally {
      setPendingCheckId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>QA</CardTitle>
        <CardDescription>
          以工作區為邊界管理 quality checks，支援建立、狀態更新與刪除。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Checks</p>
            <p className="mt-1 text-xl font-semibold">{checks.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Passing</p>
            <p className="mt-1 text-xl font-semibold">{passCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Warn / Fail</p>
            <p className="mt-1 text-xl font-semibold">
              {warnCount} / {failCount}
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-border/40 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={label}
            placeholder="新增 QA check 名稱"
            onChange={(event) => setLabel(event.target.value)}
            disabled={isCreating}
          />
          <Input
            value={detail}
            placeholder="描述（選填）"
            onChange={(event) => setDetail(event.target.value)}
            disabled={isCreating}
          />
          <Button
            type="button"
            onClick={() => void handleCreateCheck()}
            disabled={isCreating}
            className="w-full sm:w-auto"
          >
            {isCreating ? "建立中…" : "新增 check"}
          </Button>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading quality checks…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入 quality checks，請重新整理頁面或稍後再試。
          </p>
        )}

        {actionError && <p className="text-sm text-destructive">{actionError}</p>}

        {loadState === "loaded" && checks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未建立 quality check，可先新增第一筆紀錄。
          </p>
        )}

        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{check.label}</p>
                  <p className="text-sm text-muted-foreground">{check.detail || "無描述"}</p>
                </div>
                <Badge variant={statusVariantMap[check.status]}>{check.status}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {check.status !== "pass" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(check.id, "pass")}
                    disabled={pendingCheckId === check.id}
                  >
                    標記 pass
                  </Button>
                )}
                {check.status !== "warn" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(check.id, "warn")}
                    disabled={pendingCheckId === check.id}
                  >
                    標記 warn
                  </Button>
                )}
                {check.status !== "fail" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange(check.id, "fail")}
                    disabled={pendingCheckId === check.id}
                  >
                    標記 fail
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDeleteCheck(check.id)}
                  disabled={pendingCheckId === check.id}
                >
                  刪除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
