import { z } from "@lib-zod";

/**
 * Canonical workspace event types that can trigger a notification.
 * Aligned with discriminants emitted by workspace-workflow domain events.
 */
export const WORKSPACE_NOTIFICATION_EVENT_TYPES = [
  "workspace-flow.task.assigned",
  "workspace-flow.task.status_changed",
  "workspace-flow.task.submitted_to_qa",
  "workspace-flow.task.qa_passed",
  "workspace-flow.task.acceptance_approved",
  "workspace-flow.issue.opened",
  "workspace-flow.issue.fixed",
  "workspace-flow.issue.closed",
  "workspace.lifecycle-transitioned",
  "workspace.audit.critical-detected",
] as const;

export type WorkspaceNotificationEventType =
  (typeof WORKSPACE_NOTIFICATION_EVENT_TYPES)[number];

export const WorkspaceNotificationEventTypeSchema = z
  .enum(WORKSPACE_NOTIFICATION_EVENT_TYPES)
  .brand("WorkspaceNotificationEventType");

export function createWorkspaceNotificationEventType(
  raw: string,
): WorkspaceNotificationEventType {
  return WorkspaceNotificationEventTypeSchema.parse(raw);
}
