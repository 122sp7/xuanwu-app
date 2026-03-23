"use client";

import { useCallback, useEffect, useState } from "react";

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
import type { TestCaseEntity } from "../../domain/entities/TestCase";
import { createTestCase, deleteTestCase } from "../_actions/qa.actions";
import { getTestCases } from "../queries/qa.queries";

interface WorkspaceQATabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceQATab({ workspace }: WorkspaceQATabProps) {
  const [testCases, setTestCases] = useState<TestCaseEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskId, setTaskId] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadTestCases = useCallback(async () => {
    setLoadState("loading");
    try {
      setTestCases(await getTestCases(workspace.id));
      setLoadState("loaded");
    } catch {
      setTestCases([]);
      setLoadState("error");
    }
  }, [workspace.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await loadTestCases(); })();
    return () => { cancelled = true; };
  }, [loadTestCases]);

  async function handleCreate() {
    const t = title.trim();
    if (!t) { setActionError("請輸入測試案例名稱。"); return; }
    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createTestCase({
        tenantId: workspace.id,
        teamId: workspace.id,
        workspaceId: workspace.id,
        taskId: taskId.trim() || workspace.id,
        title: t,
        description: description.trim() || undefined,
        createdBy: "ui",
      });
      if (!result.success) { setActionError(result.error.message); return; }
      setTitle("");
      setDescription("");
      setTaskId("");
      await loadTestCases();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(testCaseId: string) {
    setPendingId(testCaseId);
    setActionError(null);
    try {
      const result = await deleteTestCase(testCaseId);
      if (!result.success) { setActionError(result.error.message); return; }
      await loadTestCases();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>QA — Test Cases</CardTitle>
        <CardDescription>
          為各任務建立測試案例。TestRun（執行測試）在任務進入 qa 階段後啟動。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Test Cases</p>
            <p className="mt-1 text-xl font-semibold">{testCases.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Tasks covered</p>
            <p className="mt-1 text-xl font-semibold">
              {new Set(testCases.map((tc) => tc.taskId)).size}
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-border/40 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input value={title} placeholder="測試案例名稱" onChange={(e) => setTitle(e.target.value)} disabled={isCreating} />
            <Input value={taskId} placeholder="Task ID（選填）" onChange={(e) => setTaskId(e.target.value)} disabled={isCreating} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input value={description} placeholder="驗收條件 / 描述（選填）" onChange={(e) => setDescription(e.target.value)} disabled={isCreating} />
            <Button type="button" onClick={() => void handleCreate()} disabled={isCreating} className="w-full sm:w-auto">
              {isCreating ? "建立中…" : "新增 Test Case"}
            </Button>
          </div>
        </div>

        {loadState === "loading" && <p className="text-sm text-muted-foreground">Loading test cases…</p>}
        {loadState === "error" && <p className="text-sm text-destructive">無法載入測試案例，請重新整理。</p>}
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        {loadState === "loaded" && testCases.length === 0 && (
          <p className="text-sm text-muted-foreground">尚未建立測試案例。</p>
        )}

        <div className="space-y-3">
          {testCases.map((tc) => (
            <div key={tc.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{tc.title}</p>
                    <Badge variant="outline">task: {tc.taskId.slice(0, 8)}…</Badge>
                  </div>
                  {tc.description && (
                    <p className="text-sm text-muted-foreground">{tc.description}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">by {tc.createdBy}</p>
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDelete(tc.id)}
                  disabled={pendingId === tc.id}
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
