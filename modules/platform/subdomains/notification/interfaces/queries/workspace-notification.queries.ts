import { notificationService } from "../composition/notification-service";
import type { WorkspaceNotificationPreferenceDto } from "../../application/queries/workspace-notification-preferences.queries";

export async function getWorkspaceNotificationPreferences(
  workspaceId: string,
  memberId: string,
): Promise<WorkspaceNotificationPreferenceDto> {
  return notificationService.getWorkspacePreferences(workspaceId, memberId);
}
