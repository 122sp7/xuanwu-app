"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { monitorForElements } from "@lib-dragdrop";

import { useDispatcherStore, selectUnassignedTasks } from "../dispatcher/store";
import { DRAG_TYPE_TASK } from "../dispatcher/types";
import { DraggableTask } from "./dispatcher/DraggableTask";
import { MemberRow } from "./dispatcher/MemberRow";

/**
 * DispatcherView
 *
 * Occam's Razor: Left panel = unassigned task pool (Demand).
 *                Right panel = member rows as drop targets (Supply).
 * No month/week views, no media previews, no API calls — mock data only.
 */
export function DispatcherView() {
  const members = useDispatcherStore((s) => s.members);
  const unassigned = useDispatcherStore(useShallow(selectUnassignedTasks));
  const setDraggingTask = useDispatcherStore((s) => s.setDraggingTask);

  // Global DnD monitor — handles drops that land directly on the monitor
  // (belt-and-suspenders alongside MemberRow's local drop target)
  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data["type"] === DRAG_TYPE_TASK,
      onDrop: () => {
        setDraggingTask(null);
      },
    });
  }, [setDraggingTask]);

  return (
    <div className="flex h-full min-h-0 gap-4">
      {/* ── Left: Task Pool (25%) ── */}
      <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-muted/10">
        <div className="border-b border-border/40 px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">待分派任務</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {unassigned.length} 個任務等待指派
          </p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {unassigned.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">所有任務已分派完畢 ✓</p>
          ) : (
            unassigned.map((task) => <DraggableTask key={task.id} task={task} />)
          )}
        </div>
      </aside>

      {/* ── Right: Resource Timeline (75%) ── */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">成員調度表</h2>
            <p className="text-xs text-muted-foreground">
              將左側任務拖曳至成員列以指派
            </p>
          </div>
          <span className="rounded-full border border-border/50 bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            今日調度
          </span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      </main>
    </div>
  );
}
