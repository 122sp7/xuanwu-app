"use server";

/**
 * Workspace notification server actions — thin wrappers over use cases.
 */

import { commandFailureFrom, commandSuccess } from "@shared-types";
import type { CommandResult } from "@shared-types";
import { workspaceNotificationService } from "../composition/notification-preference-service";
import type { UpdateNotificationPreferencesCommand } from "../../application/use-cases/update-notification-preferences.use-case";
import type { WorkspaceEventPayload } from "../../application/use-cases/notify-workspace-members.use-case";

export async function updateWorkspaceNotificationPreferences(
  command: UpdateNotificationPreferencesCommand,
): Promise<CommandResult> {
  try {
    return await workspaceNotificationService.updatePreferences(command);
  } catch (err) {
    return commandFailureFrom(
      "UPDATE_NOTIFICATION_PREFERENCES_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

/**
 * Notify workspace members for a given workspace event.
 * Fire-and-forget: always returns success; individual delivery failures are swallowed.
 */
export async function notifyWorkspaceMembers(
  event: WorkspaceEventPayload,
): Promise<CommandResult> {
  try {
    await workspaceNotificationService.notifyMembers(event);
    return commandSuccess(event.workspaceId, 0);
  } catch (err) {
    return commandFailureFrom(
      "NOTIFY_WORKSPACE_MEMBERS_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
