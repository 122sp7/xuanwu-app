"use server";

import { commandFailureFrom, commandSuccess } from "@shared-types";
import type { CommandResult } from "@shared-types";
import { notificationService } from "../composition/notification-service";
import type { UpdateNotificationPreferencesCommand, WorkspaceEventPayload } from "../../application/use-cases/workspace-notification-preferences.use-case";

export async function updateWorkspaceNotificationPreferences(
  command: UpdateNotificationPreferencesCommand,
): Promise<CommandResult> {
  try {
    return await notificationService.updateWorkspacePreferences(command);
  } catch (err) {
    return commandFailureFrom(
      "UPDATE_NOTIFICATION_PREFERENCES_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

/**
 * Fire-and-forget: always returns success; per-subscriber delivery failures are swallowed.
 */
export async function notifyWorkspaceMembers(
  event: WorkspaceEventPayload,
): Promise<CommandResult> {
  try {
    await notificationService.notifyWorkspaceMembers(event);
    return commandSuccess(event.workspaceId, 0);
  } catch (err) {
    return commandFailureFrom(
      "NOTIFY_WORKSPACE_MEMBERS_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
