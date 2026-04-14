import { commandSuccess, commandFailureFrom } from "@shared-types";
import type { CommandResult } from "@shared-types";
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import { WorkspaceNotificationPreference } from "../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";

export interface UpdateNotificationPreferencesCommand {
  readonly workspaceId: string;
  readonly memberId: string;
  /** The complete desired set of subscribed event types. */
  readonly subscribedEvents: WorkspaceNotificationEventType[];
}

/**
 * UpdateNotificationPreferencesUseCase
 *
 * Creates or replaces a workspace member's notification preference record.
 * Emits workspace.notification.preference-updated via the returned event list.
 */
export class UpdateNotificationPreferencesUseCase {
  constructor(
    private readonly repo: WorkspaceNotificationPreferenceRepository,
  ) {}

  async execute(
    command: UpdateNotificationPreferencesCommand,
  ): Promise<CommandResult> {
    try {
      const existing = await this.repo.findByMember(
        command.workspaceId,
        command.memberId,
      );

      const base =
        existing ??
        WorkspaceNotificationPreference.create(
          command.workspaceId,
          command.memberId,
        );

      const updated = base.withSubscriptions(
        new Set(command.subscribedEvents),
      );

      await this.repo.save(updated);

      return commandSuccess(
        `${command.workspaceId}:${command.memberId}`,
        1,
      );
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_NOTIFICATION_PREFERENCES_FAILED",
        err instanceof Error ? err.message : "Unexpected error",
      );
    }
  }
}
