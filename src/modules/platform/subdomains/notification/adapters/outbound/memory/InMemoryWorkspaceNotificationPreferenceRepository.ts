import type { WorkspaceNotificationPreference } from "../../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationPreferenceRepository } from "../../../domain/repositories/WorkspaceNotificationPreferenceRepository";

export class InMemoryWorkspaceNotificationPreferenceRepository implements WorkspaceNotificationPreferenceRepository {
  private readonly store = new Map<string, WorkspaceNotificationPreference>();

  async findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined> {
    return this.store.get(this.key(workspaceId, memberId));
  }

  async save(preference: WorkspaceNotificationPreference): Promise<void> {
    this.store.set(this.key(preference.workspaceId, preference.memberId), preference);
  }

  async findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]> {
    return [...this.store.values()]
      .filter((pref) => pref.workspaceId === workspaceId && pref.isSubscribedTo(eventType as never))
      .map((pref) => pref.memberId);
  }

  private key(workspaceId: string, memberId: string): string {
    return `${workspaceId}:${memberId}`;
  }
}
