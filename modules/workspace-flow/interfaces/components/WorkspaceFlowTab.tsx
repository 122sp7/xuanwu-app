"use client";

/**
 * @module workspace-flow/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Workspace-level tab displaying Tasks and Invoices managed by workspace-flow.
 *
 * Issues are linked per-task (taskId scope) so they are surfaced as a count
 * within each Task row rather than as a top-level list.
 *
 * @author workspace-flow
 * @created 2026-03-27
 */

import { useEffect, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import type { Invoice } from "../../domain/entities/Invoice";
import type { Task } from "../../domain/entities/Task";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import {
  getWorkspaceFlowInvoices,
  getWorkspaceFlowTasks,
} from "../queries/workspace-flow.queries";

// ── Status display maps ────────────────────────────────────────────────────────

const TASK_STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  in_progress: "secondary",
  qa: "secondary",
  acceptance: "default",
  accepted: "default",
  archived: "outline",
};

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "草稿",
  in_progress: "進行中",
  qa: "QA 審查",
  acceptance: "驗收中",
  accepted: "已驗收",
  archived: "已歸檔",
};

const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  submitted: "secondary",
  finance_review: "secondary",
  approved: "default",
  paid: "default",
  closed: "outline",
};

const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "草稿",
  submitted: "已提交",
  finance_review: "財務審核",
  approved: "已核准",
  paid: "已付款",
  closed: "已結清",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatShortDate(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `TWD ${amount}`;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowSection = "tasks" | "invoices";

interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function WorkspaceFlowTab({ workspaceId }: WorkspaceFlowTabProps) {
  const [section, setSection] = useState<FlowSection>("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoadState("loading");

      try {
        const [nextTasks, nextInvoices] = await Promise.all([
          getWorkspaceFlowTasks(workspaceId),
          getWorkspaceFlowInvoices(workspaceId),
        ]);

        if (cancelled) {
          return;
        }

        setTasks(nextTasks);
        setInvoices(nextInvoices);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceFlowTab] Failed to load flow data:", error);
        }

        if (!cancelled) {
          setLoadState("error");
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

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
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            載入中…
          </CardContent>
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
          <CardHeader>
            <CardTitle>任務</CardTitle>
            <CardDescription>
              工作區所有任務與其進度狀態。議題（Issues）附屬於各任務。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無任務。</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-border/40 px-4 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      {task.assigneeId && (
                        <p className="text-xs text-muted-foreground">
                          指派 (ID)：{task.assigneeId}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge variant={TASK_STATUS_VARIANT[task.status]}>
                        {TASK_STATUS_LABEL[task.status]}
                      </Badge>
                      {task.dueDateISO && (
                        <p className="text-xs text-muted-foreground">
                          截止：{formatShortDate(task.dueDateISO)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Invoices section ──────────────────────────────────────────── */}
      {loadState === "loaded" && section === "invoices" && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>發票</CardTitle>
            <CardDescription>工作區帳務請款紀錄。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無發票紀錄。</p>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="rounded-xl border border-border/40 px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        #{invoice.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        建立：{formatShortDate(invoice.createdAtISO)}
                      </p>
                      {invoice.paidAtISO && (
                        <p className="text-xs text-muted-foreground">
                          付款：{formatShortDate(invoice.paidAtISO)}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
                        {INVOICE_STATUS_LABEL[invoice.status]}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(invoice.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
