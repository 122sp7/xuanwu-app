import type { WorkspaceNotificationPreference } from "../entities/WorkspaceNotificationPreference";

/**
 * Port: workspace-scoped notification preference persistence.
 * Implemented in infrastructure/; domain only holds this interface.
 */
export interface WorkspaceNotificationPreferenceRepository {
  findByMember(
    workspaceId: string,
    memberId: string,
  ): Promise<WorkspaceNotificationPreference | undefined>;

  save(preference: WorkspaceNotificationPreference): Promise<void>;

  /** Returns all member IDs subscribed to a specific event type (for fan-out). */
  findSubscribersByEventType(
    workspaceId: string,
    eventType: string,
  ): Promise<string[]>;
}
