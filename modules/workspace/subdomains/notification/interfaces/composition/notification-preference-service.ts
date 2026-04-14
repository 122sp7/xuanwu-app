/**
 * Composition root for the workspace notification subdomain.
 * Wires infrastructure adapters into use cases and queries.
 *
 * All use-case and query instances are created lazily (singleton per server runtime).
 */

import { FirebaseWorkspaceNotificationPreferenceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceNotificationPreferenceRepository";
import { PlatformNotificationDispatchAdapter } from "../../infrastructure/platform/PlatformNotificationDispatchAdapter";
import { UpdateNotificationPreferencesUseCase } from "../../application/use-cases/update-notification-preferences.use-case";
import { NotifyWorkspaceMembersUseCase } from "../../application/use-cases/notify-workspace-members.use-case";
import { GetWorkspaceNotificationPreferencesQuery } from "../../application/queries/get-notification-preferences.queries";
import type { UpdateNotificationPreferencesCommand } from "../../application/use-cases/update-notification-preferences.use-case";
import type { WorkspaceEventPayload } from "../../application/use-cases/notify-workspace-members.use-case";
import type { WorkspaceNotificationPreferenceDto } from "../../application/dto/notification-preference.dto";
import type { CommandResult } from "@shared-types";

let _preferenceRepo: FirebaseWorkspaceNotificationPreferenceRepository | undefined;
let _dispatchAdapter: PlatformNotificationDispatchAdapter | undefined;

function getPreferenceRepo(): FirebaseWorkspaceNotificationPreferenceRepository {
  if (!_preferenceRepo) _preferenceRepo = new FirebaseWorkspaceNotificationPreferenceRepository();
  return _preferenceRepo;
}

function getDispatchAdapter(): PlatformNotificationDispatchAdapter {
  if (!_dispatchAdapter) _dispatchAdapter = new PlatformNotificationDispatchAdapter();
  return _dispatchAdapter;
}

export const workspaceNotificationService = {
  updatePreferences: (
    command: UpdateNotificationPreferencesCommand,
  ): Promise<CommandResult> =>
    new UpdateNotificationPreferencesUseCase(getPreferenceRepo()).execute(command),

  notifyMembers: (event: WorkspaceEventPayload): Promise<void> =>
    new NotifyWorkspaceMembersUseCase(
      getPreferenceRepo(),
      getDispatchAdapter(),
    ).execute(event),

  getPreferences: (
    workspaceId: string,
    memberId: string,
  ): Promise<WorkspaceNotificationPreferenceDto> =>
    new GetWorkspaceNotificationPreferencesQuery(getPreferenceRepo()).execute(
      workspaceId,
      memberId,
    ),
};
