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
import { formatDateTime, isOrganizationAccount } from "../_utils";

type ViewMode = "list" | "calendar";

interface UpcomingItemRow {
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
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  // All upcoming items aggregated across workspaces – analogous to cal.com /bookings?status=upcoming
  const [upcomingRows, setUpcomingRows] = useState<readonly UpcomingItemRow[]>([]);
  const [upcomingLoadState, setUpcomingLoadState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  // Calendar month navigation state
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;

    setLoadState("loading");
    getWorkspacesForAccount(activeOrganizationId)
      .then((data) => {
        if (!cancelled) {
          setWorkspaces(data);
          setLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWorkspaces([]);
          setLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  // Aggregate upcoming items (status === "upcoming") from all workspaces
  useEffect(() => {
    if (workspaces.length === 0) return;
    let cancelled = false;

    setUpcomingLoadState("loading");

    Promise.all(
      workspaces.map(async (ws) => {
        try {
          const items = await getWorkspaceSchedule(ws.id);
          return items
            .filter((item) => item.status === "upcoming")
            .map((item): UpcomingItemRow => ({
              workspaceId: ws.id,
              workspaceName: ws.name,
              item,
            }));
        } catch {
          return [] as UpcomingItemRow[];
        }
      }),
    )
      .then((results) => {
        if (!cancelled) {
          setUpcomingRows(results.flat());
          setUpcomingLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUpcomingRows([]);
          setUpcomingLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workspaces]);

  // Derive calendar modifier: days that have at least one upcoming item with a known startAtISO
  const daysWithItems = useMemo<Date[]>(() => {
    const days: Date[] = [];
    for (const row of upcomingRows) {
      if (row.item.startAtISO) {
        const d = new Date(row.item.startAtISO);
        if (!Number.isNaN(d.getTime())) {
          // Deduplicate per day
          const alreadyAdded = days.some((existing) => isSameDay(existing, d));
          if (!alreadyAdded) {
            days.push(d);
          }
        }
      }
    }
    return days;
  }, [upcomingRows]);

  // Upcoming rows that fall in the currently displayed calendar month – used by
  // both the item list and the empty-state check so we don't filter twice.
  const calendarMonthRows = useMemo(
    () =>
      upcomingRows.filter((row) => {
        if (!row.item.startAtISO) return false;
        const d = new Date(row.item.startAtISO);
        return (
          d.getFullYear() === calendarMonth.getFullYear() &&
          d.getMonth() === calendarMonth.getMonth()
        );
      }),
    [upcomingRows, calendarMonth],
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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">排程</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            組織下所有工作區即將到來的排程項目總覽，類比 cal.com /bookings?status=upcoming。
          </p>
        </div>

        {/* ── List / Calendar view toggle – analogous to cal.com ?view=calendar ── */}
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

      {/* ── Upcoming items – hero section ── */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>即將到來</CardTitle>
              <CardDescription>
                組織下所有工作區中狀態為「upcoming」的排程項目彙整。
              </CardDescription>
            </div>
            {upcomingLoadState === "loaded" && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium tabular-nums text-muted-foreground">
                {upcomingRows.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {(loadState === "loading" || upcomingLoadState === "loading") && (
            <p className="text-sm text-muted-foreground">載入即將到來的排程項目…</p>
          )}
          {upcomingLoadState === "error" && (
            <p className="text-sm text-destructive">
              讀取即將到來排程失敗，請稍後重新整理頁面。
            </p>
          )}
          {upcomingLoadState === "loaded" && upcomingRows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              目前沒有任何工作區的 upcoming 排程項目。
            </p>
          )}

          {/* ── Calendar view ── */}
          {viewMode === "calendar" && upcomingLoadState === "loaded" && (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Calendar
                mode="multiple"
                selected={daysWithItems}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                modifiers={{ hasItems: daysWithItems }}
                modifiersClassNames={{
                  hasItems:
                    "bg-primary/20 font-bold text-primary rounded-full",
                }}
                className="rounded-lg border border-border/40 p-3"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {calendarMonth.toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                  })} 有排程的項目
                </p>
                {calendarMonthRows.map((row) => (
                    <div
                      key={`${row.workspaceId}-${row.item.id}`}
                      className="rounded-lg border border-border/40 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{row.item.title}</p>
                        <Badge
                          variant={
                            SCHEDULE_ITEM_TYPE_VARIANT_MAP[row.item.type]
                          }
                        >
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
                {calendarMonthRows.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    本月沒有已標記日期的 upcoming 項目。
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── List view ── */}
          {viewMode === "list" &&
            upcomingLoadState === "loaded" &&
            upcomingRows.map((row) => (
              <div
                key={`${row.workspaceId}-${row.item.id}`}
                className="mb-3 rounded-xl border border-border/40 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{row.item.title}</p>
                  <Badge
                    variant={SCHEDULE_ITEM_TYPE_VARIANT_MAP[row.item.type]}
                  >
                    {row.item.type}
                  </Badge>
                  <Badge variant="default">upcoming</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {row.item.detail}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>

      {/* ── Workspace schedule status list (secondary context) ── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>工作區排程狀態</CardTitle>
          <CardDescription>
            組織下各工作區的 lifecycle 概覽，點選工作區名稱可前往其 Schedule tab。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入排程資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">
              讀取排程資料失敗，請稍後重新整理頁面。
            </p>
          )}
          {loadState === "loaded" && workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">
              目前沒有可顯示的工作區排程資料。
            </p>
          )}
          {loadState === "loaded" &&
            workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="rounded-lg border border-border/40 px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/workspace/${workspace.id}?tab=Schedule`}
                    className="text-sm font-medium underline-offset-2 hover:underline"
                  >
                    {workspace.name}
                  </Link>
                  <Badge variant="outline">{workspace.lifecycleState}</Badge>
                  <Badge variant="secondary">{workspace.visibility}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created: {formatDateTime(workspace.createdAt?.toDate() ?? null)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
