"use client";

/**
 * @module workspace-flow/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Workspace-level tab displaying Tasks, Issues, and Invoices managed by workspace-flow.
 *
 * MVP interactive surface:
 * - Create Task dialog
 * - Task lifecycle transition buttons (assign → QA → acceptance → archive)
 * - Per-task expandable Issue sub-list with transition buttons
 * - Open Issue dialog
 * - Create Invoice button + Invoice lifecycle transitions
 *
 * @author workspace-flow
 * @since 2026-03-27
 */

import { useCallback, useEffect, useState } from "react";

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

import type { Invoice } from "../../domain/entities/Invoice";
import type { Task } from "../../domain/entities/Task";
import { wfCreateInvoice } from "../_actions/workspace-flow.actions";
import {
  getWorkspaceFlowInvoices,
  getWorkspaceFlowTasks,
} from "../queries/workspace-flow.queries";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { InvoiceRow } from "./InvoiceRow";
import { TaskRow } from "./TaskRow";

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowSection = "tasks" | "invoices";

interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function WorkspaceFlowTab({ workspaceId, currentUserId = "anonymous" }: WorkspaceFlowTabProps) {
  const [section, setSection] = useState<FlowSection>("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
      setTasks(nextTasks);
      setInvoices(nextInvoices);
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
          variant={section === "invoices" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("invoices")}
        >
          發票{loadState === "loaded" ? ` (${invoices.length})` : ""}
        </Button>
      </div>

      {/* ── Loading state ─────────────────────────────────────────────── */}
      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">載入中…</CardContent>
        </Card>
      )}

      {/* ── Error state ───────────────────────────────────────────────── */}
      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入資料，請重新整理頁面後再試。
          </CardContent>
        </Card>
      )}

      {/* ── Tasks section ─────────────────────────────────────────────── */}
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

      {/* ── Invoices section ──────────────────────────────────────────── */}
      {loadState === "loaded" && section === "invoices" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>發票</CardTitle>
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

      {/* ── Create Task Dialog ─────────────────────────────────────────── */}
      <CreateTaskDialog
        open={createTaskOpen}
        workspaceId={workspaceId}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
}
 
