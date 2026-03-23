"use client";

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
import type { Invoice, InvoiceStatus } from "../../domain/entities/Invoice";
import { nextInvoiceStatus, isInvoiceMutable } from "../../domain/value-objects/invoice-state";
import { advanceInvoice, createInvoice, deleteInvoice } from "../_actions/finance.actions";
import { getInvoices } from "../queries/finance.queries";

interface WorkspaceFinanceTabProps {
  readonly workspaceId: string;
}

const STATUS_VARIANT: Record<InvoiceStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  submitted: "default",
  finance_review: "default",
  approved: "secondary",
  paid: "secondary",
  closed: "secondary",
};

const ADVANCE_LABEL: Record<string, string> = {
  draft: "Submit →",
  submitted: "Start Review →",
  finance_review: "Approve →",
  approved: "Mark Paid →",
  paid: "Close →",
};

export function WorkspaceFinanceTab({ workspaceId }: WorkspaceFinanceTabProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [currency, setCurrency] = useState<"USD" | "TWD">("TWD");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      setInvoices(await getInvoices(workspaceId));
      setLoadState("loaded");
    } catch {
      setInvoices([]);
      setLoadState("error");
    }
  }, [workspaceId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await load(); })();
    return () => { cancelled = true; };
  }, [load]);

  async function handleCreate() {
    setIsCreating(true);
    setActionError(null);
    try {
      const result = await createInvoice({
        tenantId: workspaceId,
        teamId: workspaceId,
        workspaceId,
        currency,
        invoiceNumber: invoiceNumber.trim() || undefined,
      });
      if (!result.success) { setActionError(result.error.message); return; }
      setInvoiceNumber("");
      await load();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleAdvance(invoiceId: string) {
    setPendingId(invoiceId);
    setActionError(null);
    try {
      const result = await advanceInvoice(invoiceId);
      if (!result.success) { setActionError(result.error.message); return; }
      await load();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(invoiceId: string) {
    setPendingId(invoiceId);
    setActionError(null);
    try {
      const result = await deleteInvoice(invoiceId);
      if (!result.success) { setActionError(result.error.message); return; }
      await load();
    } finally {
      setPendingId(null);
    }
  }

  const paidCount = invoices.filter((i) => i.status === "paid" || i.status === "closed").length;

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Finance — Invoices</CardTitle>
        <CardDescription>
          Invoice 流程：draft → submitted → finance_review → approved → paid → closed。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Invoices</p>
            <p className="mt-1 text-xl font-semibold">{invoices.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Paid / Closed</p>
            <p className="mt-1 text-xl font-semibold">{paidCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Draft</p>
            <p className="mt-1 text-xl font-semibold">{invoices.filter((i) => i.status === "draft").length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 rounded-xl border border-border/40 p-4">
          <input
            value={invoiceNumber}
            placeholder="Invoice No.（選填）"
            onChange={(e) => setInvoiceNumber(e.target.value)}
            disabled={isCreating}
            className="h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "USD" | "TWD")}
            disabled={isCreating}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="TWD">TWD</option>
            <option value="USD">USD</option>
          </select>
          <Button type="button" onClick={() => void handleCreate()} disabled={isCreating}>
            {isCreating ? "建立中…" : "新增 Invoice"}
          </Button>
        </div>

        {loadState === "loading" && <p className="text-sm text-muted-foreground">Loading invoices…</p>}
        {loadState === "error" && <p className="text-sm text-destructive">無法載入 invoices，請重新整理。</p>}
        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
        {loadState === "loaded" && invoices.length === 0 && (
          <p className="text-sm text-muted-foreground">尚未建立 invoice。</p>
        )}

        <div className="space-y-3">
          {invoices.map((inv) => {
            const next = nextInvoiceStatus(inv.status);
            const mutable = isInvoiceMutable(inv.status);
            return (
              <div key={inv.id} className="rounded-xl border border-border/40 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{inv.invoiceNumber ?? inv.id.slice(0, 8)}</p>
                  <Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge>
                  <span className="text-xs text-muted-foreground">{inv.currency}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {inv.items.length} item{inv.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {next && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleAdvance(inv.id)}
                      disabled={pendingId === inv.id}
                    >
                      {ADVANCE_LABEL[inv.status] ?? `→ ${next}`}
                    </Button>
                  )}
                  {mutable && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete(inv.id)}
                      disabled={pendingId === inv.id}
                    >
                      刪除
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
