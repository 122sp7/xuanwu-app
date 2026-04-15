"use client";

/**
 * @module orchestration/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Composite tab rendering Tasks, Issues, and Invoices across all workflow subdomains.
 *
 * This component orchestrates read/write surfaces from the task, issue, and settlement
 * subdomains without owning any domain logic. All mutations route through the respective
 * subdomain server actions.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";

import type { Invoice } from "../../../settlement/api";
import type { Issue } from "../../../issue/api";
import type { Task } from "../../../task/api";
import { wfCreateInvoice } from "../../../settlement/api";
import { getWorkspaceFlowTasks } from "../../../task/api";
import { getWorkspaceFlowIssues } from "../../../issue/api";
import { getWorkspaceFlowInvoices } from "../../../settlement/api";
import { CreateTaskDialog } from "../../../task/interfaces/components/CreateTaskDialog";
import { TaskRow } from "../../../task/interfaces/components/TaskRow";
import { IssueRow } from "../../../issue/interfaces/components/IssueRow";
import { InvoiceRow } from "../../../settlement/interfaces/components/InvoiceRow";

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowSection = "tasks" | "qa" | "acceptance" | "issues" | "invoices";

interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
  readonly initialSection?: FlowSection;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function WorkspaceFlowTab({
  workspaceId,
  currentUserId = "anonymous",
  initialSection = "tasks",
}: WorkspaceFlowTabProps) {
  const [section, setSection] = useState<FlowSection>(initialSection);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadState("loading");
    try {
      const [nextTasks, nextInvoices] = await Promise.all([
        getWorkspaceFlowTasks(workspaceId),
        getWorkspaceFlowInvoices(workspaceId),
      ]);
      const issueMatrix = await Promise.all(
        nextTasks.map(async (task) => {
          try {
            return await getWorkspaceFlowIssues(task.id);
          } catch {
            return [] as Issue[];
          }
        }),
      );
      setTasks(nextTasks);
      setInvoices(nextInvoices);
      setIssues(issueMatrix.flat());
      setLoadState("loaded");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceFlowTab] Failed to load flow data:", err);
      }
      setLoadState("error");
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  const qaTasks = useMemo(
    () => tasks.filter((task) => task.status === "qa"),
    [tasks],
  );

  const acceptanceTasks = useMemo(
    () => tasks.filter((task) => task.status === "acceptance" || task.status === "accepted"),
    [tasks],
  );

  async function handleCreateInvoice() {
    setCreatingInvoice(true);
    setActionError(null);
    try {
      const result = await wfCreateInvoice(workspaceId);
      if (!result.success) { setActionError(result.error.message ?? "建立發票失敗"); }
      else { await loadData(); }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "建立發票失敗");
    } finally {
      setCreatingInvoice(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Section switcher ─────────────────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          variant={section === "tasks" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("tasks")}
        >
          任務{loadState === "loaded" ? ` (${tasks.length})` : ""}
        </Button>
        <Button
          variant={section === "qa" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("qa")}
        >
          質檢{loadState === "loaded" ? ` (${qaTasks.length})` : ""}
        </Button>
        <Button
          variant={section === "acceptance" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("acceptance")}
        >
          驗收{loadState === "loaded" ? ` (${acceptanceTasks.length})` : ""}
        </Button>
        <Button
          variant={section === "issues" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("issues")}
        >
          問題單{loadState === "loaded" ? ` (${issues.length})` : ""}
        </Button>
        <Button
          variant={section === "invoices" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("invoices")}
        >
          財務{loadState === "loaded" ? ` (${invoices.length})` : ""}
        </Button>
      </div>

      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">載入中…</CardContent>
        </Card>
      )}

      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入資料，請重新整理頁面後再試。
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && section === "tasks" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>任務</CardTitle>
                <CardDescription>工作區所有任務與其進度狀態。</CardDescription>
              </div>
              <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                建立任務
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無任務，點擊右上角「建立任務」開始。</p>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && section === "qa" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>質檢</CardTitle>
            <CardDescription>等待 QA 審查或處於 QA 階段的任務。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qaTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有等待質檢的任務。</p>
            ) : (
              qaTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && section === "acceptance" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>驗收</CardTitle>
            <CardDescription>進行驗收中與已完成驗收的任務。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {acceptanceTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有驗收中的任務。</p>
            ) : (
              acceptanceTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && section === "issues" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>問題單</CardTitle>
            <CardDescription>跨任務檢視所有議題狀態與處理進度。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有問題單。</p>
            ) : (
              issues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && section === "invoices" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>財務</CardTitle>
                <CardDescription>工作區帳務請款紀錄。</CardDescription>
              </div>
              <Button size="sm" disabled={creatingInvoice} onClick={handleCreateInvoice}>
                <Plus className="mr-1.5 h-4 w-4" />
                {creatingInvoice ? "建立中…" : "建立發票"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionError && (
              <p role="alert" className="text-sm text-destructive">{actionError}</p>
            )}
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無發票紀錄，點擊右上角「建立發票」開始。</p>
            ) : (
              <>
                <Separator />
                {invoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    onTransitioned={loadData}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <CreateTaskDialog
        open={createTaskOpen}
        workspaceId={workspaceId}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
}
