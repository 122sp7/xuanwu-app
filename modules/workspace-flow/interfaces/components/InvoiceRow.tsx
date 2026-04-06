"use client";

import { useState } from "react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import {
  wfApproveInvoice,
  wfCloseInvoice,
  wfPayInvoice,
  wfRejectInvoice,
  wfReviewInvoice,
  wfSubmitInvoice,
} from "../_actions/workspace-flow.actions";

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

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
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

export interface InvoiceRowProps {
  invoice: Invoice;
  onTransitioned: () => void;
}

export function InvoiceRow({ invoice, onTransitioned }: InvoiceRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderActions() {
    switch (invoice.status) {
      case "draft":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitInvoice(invoice.id))}>提交</Button>;
      case "submitted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfReviewInvoice(invoice.id))}>送審</Button>;
      case "finance_review":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveInvoice(invoice.id))}>核准</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfRejectInvoice(invoice.id))}>退回</Button>
          </div>
        );
      case "approved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPayInvoice(invoice.id))}>付款</Button>;
      case "paid":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseInvoice(invoice.id))}>結清</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            #{invoice.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">建立：{formatShortDate(invoice.createdAtISO)}</p>
          {invoice.paidAtISO && (
            <p className="text-xs text-muted-foreground">付款：{formatShortDate(invoice.paidAtISO)}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
          <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.totalAmount)}</p>
          {renderActions()}
        </div>
      </div>
    </div>
  );
}
