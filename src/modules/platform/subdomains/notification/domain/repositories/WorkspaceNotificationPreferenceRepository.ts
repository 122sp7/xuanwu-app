import type { WorkspaceNotificationPreference } from "../entities/WorkspaceNotificationPreference";

export interface WorkspaceNotificationPreferenceRepository {
  findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>;
  save(preference: WorkspaceNotificationPreference): Promise<void>;
  findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>;
}
