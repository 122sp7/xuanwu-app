import type { WorkspaceNotificationPreference } from "../entities/WorkspaceNotificationPreference";

/**
 * Repository port: workspace-scoped notification preference persistence.
 * Implemented in infrastructure/; domain only holds this interface.
 */
export interface WorkspaceNotificationPreferenceRepository {
  /** Find the preference record for a workspace member; returns undefined if not set. */
  findByMember(
    workspaceId: string,
    memberId: string,
  ): Promise<WorkspaceNotificationPreference | undefined>;

  /** Persist (create or update) the preference record for a workspace member. */
  save(preference: WorkspaceNotificationPreference): Promise<void>;

  /**
   * Return all member IDs in a workspace that have opted into a specific event type.
   * Used by the notification fan-out use case.
   */
  findSubscribersByEventType(
    workspaceId: string,
    eventType: string,
  ): Promise<string[]>;
}
