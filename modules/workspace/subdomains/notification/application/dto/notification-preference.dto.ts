/**
 * Application-layer DTOs for the workspace notification subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */

import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";

export type { WorkspaceNotificationEventType };
export { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../../domain/value-objects/WorkspaceNotificationEventType";

export interface WorkspaceNotificationPreferenceDto {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: WorkspaceNotificationEventType[];
  readonly updatedAtISO: string;
}
