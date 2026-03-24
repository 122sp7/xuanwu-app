"use client";

import { useDispatcherStore, selectUnassignedTasks, selectMemberLoad } from "../dispatcher/store";
import type { DispatchAssignment, MemberResource, TaskDemand } from "../dispatcher/types";

const PRIORITY_LABEL: Record<TaskDemand["priority"], string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const PRIORITY_CLASS: Record<TaskDemand["priority"], string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  low: "bg-muted text-muted-foreground",
};

interface MemberRowProps {
  member: MemberResource;
  tasks: readonly TaskDemand[];
  assignments: readonly DispatchAssignment[];
  onUnassign: (taskId: string) => void;
}

function MemberRow({ member, tasks, assignments, onUnassign }: MemberRowProps) {
  const load = selectMemberLoad({ tasks: [...tasks], assignments: [...assignments] }, member.id);
  const memberAssignments = assignments.filter((a) => a.memberId === member.id);
  const loadPercent = Math.min(100, Math.round((load / member.capacityMinutes) * 100));

  return (
    <div className="rounded-lg border border-border/60 bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
            {member.avatar}
          </div>
          <span className="text-sm font-medium text-foreground">{member.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {load} / {member.capacityMinutes} 分鐘
        </span>
      </div>

      {/* Load bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${loadPercent}%` }}
        />
      </div>

      {/* Assigned tasks */}
      {memberAssignments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {memberAssignments.map((a) => {
            const task = tasks.find((t) => t.id === a.taskId);
            return (
              <span
                key={a.taskId}
                className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] text-foreground"
              >
                {task?.title ?? a.taskId}
                <button
                  type="button"
                  aria-label={`取消指派 ${task?.title ?? a.taskId}`}
                  onClick={() => onUnassign(a.taskId)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * DispatcherView — 調度台視圖（scaffolding placeholder）
 *
 * Layout: Left panel = unassigned task pool (Demand).
 *         Right panel = member rows (Supply).
 *
 * TODO: Implement drag-and-drop assignment using @lib-dragdrop once the
 *       pre-development scaffolding is in place and data contracts are agreed.
 */
export function DispatcherView() {
  const allTasks = useDispatcherStore((s) => s.tasks);
  const members = useDispatcherStore((s) => s.members);
  const assignments = useDispatcherStore((s) => s.assignments);
  const unassignTask = useDispatcherStore((s) => s.unassignTask);
  const unassignedTasks = selectUnassignedTasks({ tasks: allTasks, members, assignments });

  return (
    <div className="flex h-full min-h-0 gap-4">
      {/* ── Left: Task Pool (25%) ── */}
      <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-muted/10">
        <div className="border-b border-border/40 px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">待分派任務</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {unassignedTasks.length} 個任務等待指派
          </p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {unassignedTasks.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">所有任務已分派完畢 ✓</p>
          ) : (
            unassignedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-2 rounded-md border border-border bg-background px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full border border-border/50 bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {task.workspaceName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {task.durationMinutes} 分鐘
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${PRIORITY_CLASS[task.priority]}`}
                    >
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── Right: Member Timeline (75%) ── */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">成員調度表</h2>
            <p className="text-xs text-muted-foreground">今日人力資源分配</p>
          </div>
          <span className="rounded-full border border-border/50 bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            今日調度
          </span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              tasks={allTasks}
              assignments={assignments}
              onUnassign={unassignTask}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
