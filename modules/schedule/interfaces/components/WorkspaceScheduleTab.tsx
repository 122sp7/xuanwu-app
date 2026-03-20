"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, ExternalLink, Link2, MoreHorizontal, Plus, Search } from "lucide-react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceScheduleEventTypes } from "../queries/schedule-event-types.queries";
import type { ScheduleEventType } from "../../domain/entities/ScheduleEventType";
import { Switch } from "@/ui/shadcn/ui/switch";

interface WorkspaceScheduleTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceScheduleTab({ workspace }: WorkspaceScheduleTabProps) {
  const [scheduleEventTypes, setScheduleEventTypes] = useState<readonly ScheduleEventType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = useMemo(
    () =>
      scheduleEventTypes.filter(
        (et) =>
          et.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          et.slug.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [scheduleEventTypes, searchQuery],
  );

  return (
    <div className="space-y-4">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">活動類型</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            為您的行事曆設定不同的活動，方便他人預約。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              aria-label="搜尋活動類型"
              placeholder="搜尋"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {/* New event type button */}
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" />
            全新
          </button>
        </div>
      </div>

      {/* ── Event type list ── */}
      {filtered.length === 0 ? (
        <div className="rounded-md border border-border/50 px-6 py-12 text-center text-sm text-muted-foreground">
          {searchQuery ? "找不到符合的活動類型。" : "此工作區尚無活動類型。"}
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border/50">
          <ul className="divide-y divide-border/40">
            {filtered.map((et) => (
              <li
                key={et.id}
                className="flex w-full items-center justify-between bg-background px-4 py-3 transition-colors hover:bg-muted/30"
              >
                {/* Left: title + slug path + duration badge */}
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-sm font-medium text-foreground">{et.title}</span>
                    <span className="text-xs text-muted-foreground">
                      /{workspace.id}/{et.slug}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{et.durationLabel}</span>
                  </div>
                </div>

                {/* Right: 隱藏 toggle + icon buttons */}
                <div className="flex shrink-0 items-center gap-3">
                  {/* Active/hidden toggle */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs ${
                        et.isActive ? "text-muted-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      隱藏
                    </span>
                    <Switch
                      checked={et.isActive}
                      onCheckedChange={() => {
                        /* mutation not yet wired */
                      }}
                      aria-label={et.isActive ? "設為隱藏" : "設為顯示"}
                    />
                  </div>

                  {/* Icon buttons */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="在新分頁開啟"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="複製連結"
                      onClick={() =>
                        void navigator.clipboard.writeText(`/${workspace.id}/${et.slug}`)
                      }
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="更多選項"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
