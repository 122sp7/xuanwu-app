import { z } from "@lib-zod";

export const WORKSPACE_LIFECYCLE_STATES = [
  "preparatory",
  "active",
  "stopped",
] as const;

export const WorkspaceLifecycleStateSchema = z.enum(WORKSPACE_LIFECYCLE_STATES);

export type WorkspaceLifecycleState = z.infer<typeof WorkspaceLifecycleStateSchema>;
export type WorkspaceLifecycleStateInput = z.input<typeof WorkspaceLifecycleStateSchema>;

const WORKSPACE_LIFECYCLE_NEXT: Readonly<
  Record<WorkspaceLifecycleState, WorkspaceLifecycleState | null>
> = {
  preparatory: "active",
  active: "stopped",
  stopped: null,
};

export function createWorkspaceLifecycleState(
  value: WorkspaceLifecycleStateInput,
): WorkspaceLifecycleState {
  return WorkspaceLifecycleStateSchema.parse(value);
}

export function canTransitionWorkspaceLifecycleState(
  from: WorkspaceLifecycleState,
  to: WorkspaceLifecycleState,
): boolean {
  return WORKSPACE_LIFECYCLE_NEXT[from] === to;
}

export function isTerminalWorkspaceLifecycleState(
  state: WorkspaceLifecycleState,
): boolean {
  return WORKSPACE_LIFECYCLE_NEXT[state] === null;
}