"use client";

import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceSchedule } from "../queries/schedule.queries";
import { getWorkspaceScheduleEventTypes } from "../queries/schedule-event-types.queries";
import type { ScheduleEventType } from "../../domain/entities/ScheduleEventType";
import type { WorkspaceScheduleItem } from "../../domain/entities/ScheduleItem";
import { Badge } from "@/ui/shadcn/ui/badge";
import { SCHEDULE_ITEM_TYPE_VARIANT_MAP } from "../schedule-ui.constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceScheduleTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const [scheduleEventTypes, setScheduleEventTypes] = useState<readonly ScheduleEventType[]>([]);
  const [items, setItems] = useState<readonly WorkspaceScheduleItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    getWorkspaceScheduleEventTypes(workspace.accountId, workspace.id)
      .then((types) => {
        if (!cancelled) setScheduleEventTypes(types);
      })
      .catch(() => {
        if (!cancelled) setScheduleEventTypes([]);
      });
    return () => {
      cancelled = true;
    };
  }, [workspace.accountId, workspace.id]);

  useEffect(() => {
    let cancelled = false;
    getWorkspaceSchedule(workspace.id)
      .then((nextItems) => {
        if (!cancelled) setItems(nextItems);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [workspace.id]);

  // Per-type item count – shown inline on each event type row
  const itemTypeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>排程類型</CardTitle>
        <CardDescription>工作區可用的排程樣板</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {scheduleEventTypes.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            此工作區尚無排程類型定義。
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {scheduleEventTypes.map((et) => (
              <li
                key={et.id}
                className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50"
              >
                {/* Left: title + /workspaceId/slug + description + meta */}
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{et.title}</span>
                    <small className="hidden font-normal text-muted-foreground sm:inline">
                      /{workspace.id}/{et.slug}
                    </small>
                    <Badge variant={SCHEDULE_ITEM_TYPE_VARIANT_MAP[et.itemType]}>
                      {et.itemType}
                    </Badge>
                    {!et.isActive && (
                      <Badge variant="secondary">停用</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{et.description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {et.durationLabel}
                    {itemTypeBreakdown[et.itemType] != null && (
                      <>
                        {" · "}
                        <span className="font-medium tabular-nums text-foreground">
                          {itemTypeBreakdown[et.itemType]}
                        </span>{" "}
                        個排程
                      </>
                    )}
                  </p>
                </div>
                {/* Right: copy-link button */}
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  onClick={() => void navigator.clipboard.writeText(`/${workspace.id}/${et.slug}`)}
                  title="複製連結"
                >
                  複製連結
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
