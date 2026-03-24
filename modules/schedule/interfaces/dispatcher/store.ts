"use client";

import { create } from "@lib-zustand";
import type { DispatchAssignment, MemberResource, TaskDemand } from "./types";

// ── Mock data ─────────────────────────────────────────────────────────────────
// TODO: Replace with real data fetching from the schedule/workspace domain once
//       the backend API for cross-workspace task assignment is available.

const MOCK_TASKS: TaskDemand[] = [
  { id: "t1", title: "審核 Q1 報告", workspaceName: "財務工作區", durationMinutes: 60, priority: "high" },
  { id: "t2", title: "更新產品路線圖", workspaceName: "產品工作區", durationMinutes: 90, priority: "medium" },
  { id: "t3", title: "客戶提案簡報", workspaceName: "業務工作區", durationMinutes: 45, priority: "high" },
  { id: "t4", title: "優化資料庫查詢", workspaceName: "技術工作區", durationMinutes: 120, priority: "low" },
  { id: "t5", title: "撰寫測試計畫", workspaceName: "QA 工作區", durationMinutes: 30, priority: "medium" },
];

const MOCK_MEMBERS: MemberResource[] = [
  { id: "m1", name: "Alice Chen", avatar: "AC", capacityMinutes: 480 },
  { id: "m2", name: "Bob Lin", avatar: "BL", capacityMinutes: 480 },
  { id: "m3", name: "Carol Wu", avatar: "CW", capacityMinutes: 240 },
];

// ── Store ─────────────────────────────────────────────────────────────────────

interface DispatcherState {
  readonly tasks: TaskDemand[];
  readonly members: MemberResource[];
  readonly assignments: DispatchAssignment[];
}

interface DispatcherActions {
  assignTask: (taskId: string, memberId: string, startTime: string) => void;
  unassignTask: (taskId: string) => void;
}

export const useDispatcherStore = create<DispatcherState & DispatcherActions>((set) => ({
  tasks: MOCK_TASKS,
  members: MOCK_MEMBERS,
  assignments: [],

  assignTask(taskId, memberId, startTime) {
    set((state) => {
      const filtered = state.assignments.filter((a) => a.taskId !== taskId);
      return { assignments: [...filtered, { taskId, memberId, startTime }] };
    });
  },

  unassignTask(taskId) {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.taskId !== taskId),
    }));
  },
}));

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Tasks that have not yet been assigned to any member. */
export function selectUnassignedTasks(state: DispatcherState): TaskDemand[] {
  const assignedIds = new Set(state.assignments.map((a) => a.taskId));
  return state.tasks.filter((t) => !assignedIds.has(t.id));
}

/** Assignments for a given member. */
export function selectMemberAssignments(
  state: DispatcherState,
  memberId: string,
): DispatchAssignment[] {
  return state.assignments.filter((a) => a.memberId === memberId);
}

/** Total assigned minutes for a given member. */
export function selectMemberLoad(
  state: Pick<DispatcherState, "tasks" | "assignments">,
  memberId: string,
): number {
  return selectMemberAssignments(state, memberId).reduce((acc, a) => {
    const task = state.tasks.find((t) => t.id === a.taskId);
    return acc + (task?.durationMinutes ?? 0);
  }, 0);
}
