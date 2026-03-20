"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useApp } from "@/app/providers/app-provider";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { getWorkspaceSchedule } from "@/modules/schedule";
import type { WorkspaceScheduleItem } from "@/modules/schedule";
import { SCHEDULE_ITEM_TYPE_VARIANT_MAP } from "@/modules/schedule/interfaces/schedule-ui.constants";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Calendar } from "@/ui/shadcn/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/ui/shadcn/ui/toggle-group";
import { isOrganizationAccount } from "../_utils";

type ViewMode = "list" | "calendar";

interface BookingRow {
  readonly workspaceId: string;
  readonly workspaceName: string;
  readonly item: WorkspaceScheduleItem;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function OrganizationSchedulePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeOrganizationId = isOrganizationAccount(activeAccount)
    ? activeAccount.id
    : null;

  const viewMode: ViewMode =
    searchParams.get("view") === "calendar" ? "calendar" : "list";

  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);

  // All upcoming items aggregated across workspaces
  const [bookingRows, setBookingRows] = useState<readonly BookingRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  // Calendar month navigation
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  // Fetch workspaces
  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;

    getWorkspacesForAccount(activeOrganizationId)
      .then((data) => {
        if (!cancelled) setWorkspaces(data);
      })
      .catch(() => {
        if (!cancelled) setWorkspaces([]);
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  // Aggregate upcoming items from all workspaces
  useEffect(() => {
    if (workspaces.length === 0) {
      setBookingRows([]);
      setLoadState("loaded");
      return;
    }
    let cancelled = false;

    setLoadState("loading");

    Promise.all(
      workspaces.map(async (ws) => {
        try {
          const items = await getWorkspaceSchedule(ws.id);
          return items
            .filter((item) => item.status === "upcoming")
            .map((item): BookingRow => ({
              workspaceId: ws.id,
              workspaceName: ws.name,
              item,
            }));
        } catch {
          return [] as BookingRow[];
        }
      }),
    )
      .then((results) => {
        if (!cancelled) {
          setBookingRows(results.flat());
          setLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBookingRows([]);
          setLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workspaces]);

  // Days that have at least one upcoming item with a known startAtISO (for calendar highlights)
  const daysWithItems = useMemo<Date[]>(() => {
    const days: Date[] = [];
    for (const row of bookingRows) {
      if (row.item.startAtISO) {
        const d = new Date(row.item.startAtISO);
        if (!Number.isNaN(d.getTime()) && !days.some((e) => isSameDay(e, d))) {
          days.push(d);
        }
      }
    }
    return days;
  }, [bookingRows]);

  // Rows that fall in the currently displayed calendar month
  const calendarMonthRows = useMemo(
    () =>
      bookingRows.filter((row) => {
        if (!row.item.startAtISO) return false;
        const d = new Date(row.item.startAtISO);
        return (
          d.getFullYear() === calendarMonth.getFullYear() &&
          d.getMonth() === calendarMonth.getMonth()
        );
      }),
    [bookingRows, calendarMonth],
  );

  function handleViewChange(value: string) {
    if (value === "calendar") {
      router.replace("?view=calendar");
    } else {
      router.replace("?");
    }
  }

  if (!activeOrganizationId) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">排程</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            組織下所有工作區即將到來的排程總覽。
          </p>
        </div>

        {/* ── List / Calendar toggle ── */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => {
            if (v) handleViewChange(v);
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="list" aria-label="列表檢視">
            列表
          </ToggleGroupItem>
          <ToggleGroupItem value="calendar" aria-label="月曆檢視">
            月曆
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ── Upcoming bookings card ── */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>即將到來</CardTitle>
              <CardDescription>
                組織下所有工作區中狀態為「upcoming」的排程項目。
              </CardDescription>
            </div>
            {loadState === "loaded" && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium tabular-nums text-muted-foreground">
                {bookingRows.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入排程中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取排程失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && bookingRows.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有即將到來的排程項目。</p>
          )}

          {/* ── Calendar view ── */}
          {viewMode === "calendar" && loadState === "loaded" && (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Calendar
                mode="multiple"
                selected={daysWithItems}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                modifiers={{ hasItems: daysWithItems }}
                modifiersClassNames={{
                  hasItems: "bg-primary/20 font-bold text-primary rounded-full",
                }}
                className="rounded-lg border border-border/40 p-3"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {calendarMonth.toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                  })}{" "}
                  有排程的項目
                </p>
                {calendarMonthRows.length === 0 && (
                  <p className="text-xs text-muted-foreground">本月沒有排程項目。</p>
                )}
                {calendarMonthRows.map((row) => (
                  <div
                    key={`${row.workspaceId}-${row.item.id}`}
                    className="rounded-lg border border-border/40 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{row.item.title}</p>
                      <Badge variant={SCHEDULE_ITEM_TYPE_VARIANT_MAP[row.item.type]}>
                        {row.item.type}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{row.item.timeLabel}</span>
                      <Link
                        href={`/workspace/${row.workspaceId}?tab=Schedule`}
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {row.workspaceName}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── List view ── */}
          {viewMode === "list" && loadState === "loaded" && bookingRows.length > 0 && (
            <ul className="divide-y divide-border/40 overflow-hidden rounded-md border border-border/40">
              {bookingRows.map((row) => (
                <li
                  key={`${row.workspaceId}-${row.item.id}`}
                  className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  {/* Left: title + badges + detail */}
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{row.item.title}</p>
                      <Badge variant={SCHEDULE_ITEM_TYPE_VARIANT_MAP[row.item.type]}>
                        {row.item.type}
                      </Badge>
                    </div>
                    {row.item.detail && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.item.detail}</p>
                    )}
                  </div>
                  {/* Right: time + workspace link */}
                  <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                    <span className="tabular-nums">{row.item.timeLabel}</span>
                    <Link
                      href={`/workspace/${row.workspaceId}?tab=Schedule`}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {row.workspaceName}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
