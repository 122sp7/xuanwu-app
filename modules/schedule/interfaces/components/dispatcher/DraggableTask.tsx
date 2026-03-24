"use client";

import { useEffect, useRef } from "react";
import { GripVertical } from "lucide-react";

import { draggable } from "@lib-dragdrop";

import { useDispatcherStore } from "../../dispatcher/store";
import { DRAG_TYPE_TASK, type TaskDemand } from "../../dispatcher/types";

const PRIORITY_CONFIG: Record<
  TaskDemand["priority"],
  { cardClass: string; badgeClass: string; label: string }
> = {
  high: {
    cardClass: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    label: "高",
  },
  medium: {
    cardClass: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
    badgeClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    label: "中",
  },
  low: {
    cardClass: "bg-background border-border",
    badgeClass: "bg-muted text-muted-foreground",
    label: "低",
  },
};

interface DraggableTaskProps {
  readonly task: TaskDemand;
}

/**
 * DraggableTask
 *
 * Minimal drag card for a TaskDemand.
 * Uses @lib-dragdrop (Atlaskit pragmatic-drag-and-drop).
 */
export function DraggableTask({ task }: DraggableTaskProps) {
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const setDraggingTask = useDispatcherStore((s) => s.setDraggingTask);
  const draggingTaskId = useDispatcherStore((s) => s.draggingTaskId);
  const isDragging = draggingTaskId === task.id;

  useEffect(() => {
    const el = dragHandleRef.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({
        type: DRAG_TYPE_TASK,
        taskId: task.id,
      }),
      onDragStart: () => setDraggingTask(task.id),
      onDrop: () => setDraggingTask(null),
    });
  }, [task.id, setDraggingTask]);

  const { cardClass, badgeClass, label } = PRIORITY_CONFIG[task.priority];

  return (
    <div
      ref={dragHandleRef}
      className={`flex cursor-grab items-start gap-2 rounded-md border px-3 py-2.5 transition-opacity active:cursor-grabbing ${cardClass} ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-40" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-border/50 bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            {task.workspaceName}
          </span>
          <span className="text-[10px] text-muted-foreground">{task.durationMinutes} 分鐘</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${badgeClass}`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
