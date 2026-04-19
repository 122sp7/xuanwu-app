"use client";

/**
 * WorkspaceSettlementSection — workspace.settlement tab — invoice settlement.
 */

import { Badge, Button } from "@packages";
import { Calculator, Loader2, ArrowRightLeft, Wallet } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { createActor } from "xstate";

import {
  createInvoiceAction,
  listInvoicesByWorkspaceAction,
  transitionInvoiceStatusAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/settlement-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import type { InvoiceSnapshot } from "@/src/modules/workspace/subdomains/settlement/domain/entities/Invoice";
import type { InvoiceStatus } from "@/src/modules/workspace/subdomains/settlement/domain/value-objects/InvoiceStatus";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import { settlementLifecycleMachine } from "@/src/modules/workspace/subdomains/orchestration/application/machines/settlement-lifecycle.machine";

interface WorkspaceSettlementSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "草稿",
  submitted: "已送審",
  finance_review: "財務審核",
  approved: "已核准",
  paid: "已付款",
  closed: "已結案",
};

const STATUS_BADGE: Record<InvoiceStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  submitted: "secondary",
  finance_review: "secondary",
  approved: "default",
  paid: "default",
  closed: "outline",
};

const STATUS_REPLAY_EVENTS: Record<InvoiceStatus, ReadonlyArray<"ADVANCE" | "ROLLBACK">> = {
  draft: [],
  submitted: ["ADVANCE"],
  finance_review: ["ADVANCE", "ADVANCE"],
  approved: ["ADVANCE", "ADVANCE", "ADVANCE"],
  paid: ["ADVANCE", "ADVANCE", "ADVANCE", "ADVANCE"],
  closed: ["ADVANCE", "ADVANCE", "ADVANCE", "ADVANCE", "ADVANCE"],
};

function resolveNextStatus(invoice: InvoiceSnapshot, eventType: "ADVANCE" | "ROLLBACK"): InvoiceStatus | null {
  const actor = createActor(settlementLifecycleMachine, {
    input: { invoiceId: invoice.id, workspaceId: invoice.workspaceId },
  });
  actor.start();
  for (const event of STATUS_REPLAY_EVENTS[invoice.status]) {
    actor.send({ type: event });
  }
  const current = actor.getSnapshot();
  const next = settlementLifecycleMachine.transition(current, { type: eventType });
  const nextValue = next.value;
  if (typeof nextValue !== "string" || nextValue === current.value) {
    return null;
  }
  return nextValue as InvoiceStatus;
}

export function WorkspaceSettlementSection({
  workspaceId,
  accountId: _accountId,
  currentUserId: _currentUserId,
}: WorkspaceSettlementSectionProps): React.ReactElement {
  const [invoices, setInvoices] = useState<InvoiceSnapshot[]>([]);
  const [tasks, setTasks] = useState<TaskSnapshot[]>([]);
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [pendingInvoiceId, setPendingInvoiceId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isLoading = loadedWorkspaceId !== workspaceId;

  const loadData = useCallback(
    async (targetWorkspaceId: string) => {
      try {
        const [nextInvoices, nextTasks] = await Promise.all([
          listInvoicesByWorkspaceAction(targetWorkspaceId),
          listTasksByWorkspaceAction(targetWorkspaceId),
        ]);
        setInvoices(nextInvoices);
        setTasks(nextTasks);
      } catch {
        setInvoices([]);
        setTasks([]);
      } finally {
        setLoadedWorkspaceId(targetWorkspaceId);
      }
    },
    [],
  );

  useEffect(() => {
    loadData(workspaceId);
  }, [loadData, workspaceId]);

  const acceptedTasks = useMemo(
    () => tasks.filter((task) => task.status === "accepted"),
    [tasks],
  );

  const handleCreateInvoice = () => {
    setPendingInvoiceId("creating");
    startTransition(async () => {
      try {
        await createInvoiceAction({ workspaceId });
      } finally {
        setPendingInvoiceId(null);
        loadData(workspaceId);
      }
    });
  };

  const handleTransition = (invoice: InvoiceSnapshot, eventType: "ADVANCE" | "ROLLBACK") => {
    const nextStatus = resolveNextStatus(invoice, eventType);
    if (!nextStatus) return;

    setPendingInvoiceId(invoice.id);
    startTransition(async () => {
      try {
        await transitionInvoiceStatusAction({
          invoiceId: invoice.id,
          to: nextStatus,
        });
      } finally {
        setPendingInvoiceId(null);
        loadData(workspaceId);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">結算</h2>
        </div>
        <Button size="sm" onClick={handleCreateInvoice} disabled={pendingInvoiceId === "creating"}>
          {pendingInvoiceId === "creating" ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Wallet className="size-3.5" />
          )}
          建立結算單
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/40 bg-card/60 px-3 py-3">
          <p className="text-xs text-muted-foreground">待結算任務（已驗收）</p>
          <p className="mt-1 text-xl font-semibold">{acceptedTasks.length}</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/60 px-3 py-3">
          <p className="text-xs text-muted-foreground">結算單數量</p>
          <p className="mt-1 text-xl font-semibold">{invoices.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <Calculator className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無結算記錄</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            驗收完成後可在此建立結算單，並以狀態機推進送審、核准與收款流程。
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-xl border border-border/40 bg-card/30 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Invoice #{invoice.id.slice(0, 8)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    建立時間：{new Date(invoice.createdAtISO).toLocaleString("zh-TW")}
                  </p>
                </div>
                <Badge variant={STATUS_BADGE[invoice.status]} className="text-xs">
                  {STATUS_LABEL[invoice.status]}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={pendingInvoiceId === invoice.id || !resolveNextStatus(invoice, "ROLLBACK")}
                  onClick={() => handleTransition(invoice, "ROLLBACK")}
                >
                  {pendingInvoiceId === invoice.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="size-3.5" />
                  )}
                  退回上一階段
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={pendingInvoiceId === invoice.id || !resolveNextStatus(invoice, "ADVANCE")}
                  onClick={() => handleTransition(invoice, "ADVANCE")}
                >
                  {pendingInvoiceId === invoice.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Wallet className="size-3.5" />
                  )}
                  推進下一階段
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
