import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { WorkspaceNotificationPreferenceDto } from "../dto/notification-preference.dto";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../../domain/value-objects/WorkspaceNotificationEventType";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";

/**
 * GetWorkspaceNotificationPreferencesQuery
 *
 * Pure read — returns the member's current preference DTO.
 * Falls back to the default (all events enabled) when no record exists.
 */
export class GetWorkspaceNotificationPreferencesQuery {
  constructor(
    private readonly repo: WorkspaceNotificationPreferenceRepository,
  ) {}

  async execute(
    workspaceId: string,
    memberId: string,
  ): Promise<WorkspaceNotificationPreferenceDto> {
    const entity = await this.repo.findByMember(workspaceId, memberId);

    if (!entity) {
      return {
        workspaceId,
        memberId,
        subscribedEvents: [
          ...WORKSPACE_NOTIFICATION_EVENT_TYPES,
        ] as WorkspaceNotificationEventType[],
        updatedAtISO: new Date().toISOString(),
      };
    }

    return {
      workspaceId: entity.workspaceId,
      memberId: entity.memberId,
      subscribedEvents: [...entity.subscribedEvents],
      updatedAtISO: entity.updatedAtISO,
    };
  }
}
