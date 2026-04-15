import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { WorkspaceNotificationPreference } from "../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";

export interface UpdateNotificationPreferencesCommand {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: WorkspaceNotificationEventType[];
}

export class UpdateNotificationPreferencesUseCase {
  constructor(private readonly repo: WorkspaceNotificationPreferenceRepository) {}

  async execute(command: UpdateNotificationPreferencesCommand): Promise<CommandResult> {
    try {
      const existing = await this.repo.findByMember(command.workspaceId, command.memberId);
      const base = existing ?? WorkspaceNotificationPreference.create(command.workspaceId, command.memberId);
      await this.repo.save(base.withSubscriptions(new Set(command.subscribedEvents)));
      return commandSuccess(`${command.workspaceId}:${command.memberId}`, 1);
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_NOTIFICATION_PREFERENCES_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }
}

export interface WorkspaceEventPayload {
  readonly eventType: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
}

export class NotifyWorkspaceMembersUseCase {
  constructor(
    private readonly preferenceRepo: WorkspaceNotificationPreferenceRepository,
    private readonly notificationRepo: NotificationRepository,
  ) {}

  async execute(event: WorkspaceEventPayload): Promise<void> {
    const subscriberIds = await this.preferenceRepo.findSubscribersByEventType(
      event.workspaceId,
      event.eventType,
    );

    await Promise.allSettled(
      subscriberIds.map((recipientId) =>
        this.notificationRepo.dispatch({
          recipientId,
          title: event.title,
          message: event.message,
          type: "info",
          sourceEventType: event.eventType,
          metadata: event.metadata,
        }),
      ),
    );
  }
}
