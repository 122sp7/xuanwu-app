"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useApp } from "@/app/providers/app-provider";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { getOrganizationScheduleEventTypes } from "@/modules/schedule";
import type { ScheduleEventType } from "@/modules/schedule";
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
import { formatDateTime, isOrganizationAccount } from "../_utils";

interface UpcomingItemRow {
  readonly workspaceId: string;
  readonly workspaceName: string;
  readonly item: WorkspaceScheduleItem;
}

export default function OrganizationSchedulePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount)
    ? activeAccount.id
    : null;

  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  // Event types – analogous to cal.com EventType catalog
  const [eventTypes, setEventTypes] = useState<readonly ScheduleEventType[]>([]);
  const [eventTypesLoadState, setEventTypesLoadState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  // Upcoming items aggregated across all workspaces – analogous to cal.com
  // upcoming bookings (startTime >= now)
  const [upcomingRows, setUpcomingRows] = useState<readonly UpcomingItemRow[]>([]);
  const [upcomingLoadState, setUpcomingLoadState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

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

  // Load event types when org is known
  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;

    setEventTypesLoadState("loading");
    getOrganizationScheduleEventTypes(activeOrganizationId)
      .then((data) => {
        if (!cancelled) {
          setEventTypes(data);
          setEventTypesLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEventTypes([]);
          setEventTypesLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  // Aggregate upcoming items from all workspaces (analogous to cal.com
  // upcoming bookings filter: startTime >= now → here status === "upcoming")
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

  if (!activeOrganizationId) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">排程</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          組織下各工作區的 lifecycle / milestone 排程總覽。
        </p>
      </div>

      {/* ── Schedule Event Types – analogous to cal.com /event-types ── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>排程類型</CardTitle>
          <CardDescription>
            組織支援的排程樣板，定義可在各工作區建立的排程項目種類。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {eventTypesLoadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入排程類型中…</p>
          )}
          {eventTypesLoadState === "error" && (
            <p className="text-sm text-destructive">
              讀取排程類型失敗，請稍後重新整理頁面。
            </p>
          )}
          {eventTypesLoadState === "loaded" &&
            eventTypes.map((et) => (
              <div
                key={et.id}
                className="flex flex-col gap-1 rounded-xl border border-border/40 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{et.title}</p>
                    <Badge variant={SCHEDULE_ITEM_TYPE_VARIANT_MAP[et.itemType]}>
                      {et.itemType}
                    </Badge>
                    {!et.isActive && (
                      <Badge variant="secondary">停用</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {et.description}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {et.durationLabel}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* ── Upcoming across all workspaces – analogous to cal.com upcoming bookings ── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>即將到來</CardTitle>
          <CardDescription>
            組織下所有工作區中狀態為「upcoming」的排程項目彙整。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
          {upcomingLoadState === "loaded" &&
            upcomingRows.map((row) => (
              <div
                key={`${row.workspaceId}-${row.item.id}`}
                className="rounded-xl border border-border/40 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{row.item.title}</p>
                  <Badge variant={SCHEDULE_ITEM_TYPE_VARIANT_MAP[row.item.type]}>
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

      {/* ── Workspace list ── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>工作區排程狀態</CardTitle>
          <CardDescription>
            組織下各工作區的 lifecycle / milestone 排程總覽。
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
                  <p className="text-sm font-medium">{workspace.name}</p>
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
