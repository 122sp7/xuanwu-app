/**
 * Workspace notification queries — delegates to the composition service.
 */

import { workspaceNotificationService } from "../composition/notification-preference-service";
import type { WorkspaceNotificationPreferenceDto } from "../../application/dto/notification-preference.dto";

export async function getWorkspaceNotificationPreferences(
  workspaceId: string,
  memberId: string,
): Promise<WorkspaceNotificationPreferenceDto> {
  return workspaceNotificationService.getPreferences(workspaceId, memberId);
}
