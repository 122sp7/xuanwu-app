/**
 * Dispatcher View — Domain Types
 *
 * Minimal models for the "Demand vs Supply" dispatcher view.
 * Occam's Razor: only fields required to render and interact with the UI.
 */

/** A task submitted by a workspace, waiting to be assigned. */
export interface TaskDemand {
  readonly id: string;
  readonly title: string;
  readonly workspaceName: string;
  readonly durationMinutes: number;
  readonly priority: "low" | "medium" | "high";
}

/** A member with available capacity for the current day. */
export interface MemberResource {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly capacityMinutes: number;
}

/** An assignment of a task to a member at a given time. */
export interface DispatchAssignment {
  readonly taskId: string;
  readonly memberId: string;
  readonly startTime: string; // Time string in HH:mm format (e.g. "09:00")
}
