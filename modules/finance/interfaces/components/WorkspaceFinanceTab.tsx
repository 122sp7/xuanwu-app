"use client";

import { useEffect, useMemo, useState } from "react";

import type { FinanceAggregateEntity } from "../../domain/entities/Finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn";
import { Badge } from "@ui-shadcn";
import { getFinanceByWorkspaceId } from "../queries/finance.queries";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatFinanceDate(value: string | null) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

interface WorkspaceFinanceTabProps {
  readonly workspaceId: string;
}

export function WorkspaceFinanceTab({ workspaceId }: WorkspaceFinanceTabProps) {
  const [finance, setFinance] = useState<FinanceAggregateEntity | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadFinance() {
      setLoadState("loading");

      try {
        const nextFinance = await getFinanceByWorkspaceId(workspaceId);
        if (cancelled) {
          return;
        }

        setFinance(nextFinance);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceFinanceTab] Failed to load finance:", error);
        }

        if (!cancelled) {
          setFinance(null);
          setLoadState("error");
        }
      }
    }

    void loadFinance();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  const totalClaimAmount = useMemo(
    () =>
      finance?.currentClaimLineItems.reduce((sum, item) => sum + item.lineAmount, 0) ?? 0,
    [finance],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Finance</CardTitle>
        <CardDescription>
          工作區目前的請款階段、金額摘要與收款節點。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Stage</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {finance?.stage ?? "claim-preparation"}
            </p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Cycle</p>
            <p className="mt-1 text-xl font-semibold">{finance?.cycleIndex ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Claim total</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalClaimAmount)}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Received</p>
            <p className="mt-1 text-xl font-semibold">
              {formatCurrency(finance?.receivedAmount ?? 0)}
            </p>
          </div>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading finance status…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入財務資料，請重新整理頁面或稍後再試。
          </p>
        )}

        {loadState === "loaded" && !finance && (
          <p className="text-sm text-muted-foreground">
            目前尚未建立這個工作區的 finance aggregate，可在後續流程補上請款與收款紀錄。
          </p>
        )}

        {loadState === "loaded" && finance && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{finance.stage}</Badge>
              <Badge variant="outline">
                Payment term: {formatFinanceDate(finance.paymentTermStartAtISO)}
              </Badge>
              <Badge variant="outline">
                Payment received: {formatFinanceDate(finance.paymentReceivedAtISO)}
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Claim line items</p>
              {finance.currentClaimLineItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  尚未建立請款項目。
                </p>
              ) : (
                finance.currentClaimLineItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex flex-col gap-2 rounded-xl border border-border/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty {item.quantity} · Unit {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.lineAmount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
