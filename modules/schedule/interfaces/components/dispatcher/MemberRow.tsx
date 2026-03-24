"use client";

import { useEffect, useRef, useState } from "react";

import { dropTargetForElements } from "@lib-dragdrop";

import { useDispatcherStore, selectMemberLoad } from "../../dispatcher/store";
import { DRAG_TYPE_TASK, type MemberResource } from "../../dispatcher/types";

const DEFAULT_START_TIME = "09:00";

interface MemberRowProps {
  readonly member: MemberResource;
}

/**
 * MemberRow
 *
 * Drop target row for a single member.
 * Assigned tasks are shown as labelled duration chips in a horizontal strip.
 */
export function MemberRow({ member }: MemberRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  const assignTask = useDispatcherStore((s) => s.assignTask);
  const unassignTask = useDispatcherStore((s) => s.unassignTask);
  const assignments = useDispatcherStore((s) =>
    s.assignments.filter((a) => a.memberId === member.id),
  );
  const tasks = useDispatcherStore((s) => s.tasks);
  const loadMinutes = useDispatcherStore((s) => selectMemberLoad(s, member.id));

  const loadPercent = Math.min(100, Math.round((loadMinutes / member.capacityMinutes) * 100));
  const isOverloaded = loadMinutes > member.capacityMinutes;

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data["type"] === DRAG_TYPE_TASK,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: ({ source }) => {
        setIsOver(false);
        const taskId = source.data["taskId"];
        if (typeof taskId === "string") {
          assignTask(taskId, member.id, DEFAULT_START_TIME);
        }
      },
    });
  }, [member.id, assignTask]);

  return (
    <div
      ref={rowRef}
      className={`rounded-lg border transition-colors ${
        isOver
          ? "border-primary/60 bg-primary/5"
          : "border-border/60 bg-background"
      }`}
    >
      {/* Member header */}
      <div className="flex items-center gap-3 border-b border-border/40 px-4 py-2.5">
        {/* Avatar */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {member.avatar}
        </div>

        {/* Name + capacity bar */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{member.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${
                  isOverloaded ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span
              className={`text-[10px] ${isOverloaded ? "text-destructive" : "text-muted-foreground"}`}
            >
              {loadMinutes}/{member.capacityMinutes} 分鐘
            </span>
          </div>
        </div>

        {/* Drop hint */}
        {isOver && (
          <span className="shrink-0 text-xs font-medium text-primary">放置任務</span>
        )}
      </div>

      {/* Assigned tasks strip */}
      <div className="flex min-h-[48px] flex-wrap items-start gap-1.5 px-4 py-2">
        {assignments.length === 0 ? (
          <span className="self-center text-xs text-muted-foreground/60">
            {isOver ? "放置於此" : "尚未分派任務"}
          </span>
        ) : (
          assignments.map((a) => {
            const task = tasks.find((t) => t.id === a.taskId);
            if (!task) return null;
            return (
              <div
                key={a.taskId}
                className="group flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs"
              >
                <span className="font-medium text-primary">{task.title}</span>
                <span className="text-primary/60">{task.durationMinutes}m</span>
                <button
                  type="button"
                  aria-label={`移除 ${task.title}`}
                  onClick={() => unassignTask(a.taskId)}
                  className="ml-0.5 rounded-full p-0.5 text-primary/40 opacity-0 transition-opacity hover:bg-primary/20 hover:text-primary group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
