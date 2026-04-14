/**
 * NotificationService — Composition root for notification use cases.
 *
 * Relocated from infrastructure/ to interfaces/composition/ to fix
 * the infrastructure → application dependency direction violation (HX-1-001).
 */

import { FirebaseNotificationRepository } from "../../infrastructure/firebase/FirebaseNotificationRepository";
import { FirebaseWorkspaceNotificationPreferenceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceNotificationPreferenceRepository";
import {
  DispatchNotificationUseCase,
  GetNotificationsForRecipientUseCase,
  GetUnreadCountUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "../../application/use-cases/notification.use-cases";
import {
  UpdateNotificationPreferencesUseCase,
  NotifyWorkspaceMembersUseCase,
} from "../../application/use-cases/workspace-notification-preferences.use-case";
import { GetWorkspaceNotificationPreferencesQuery } from "../../application/queries/workspace-notification-preferences.queries";
import type { DispatchNotificationInput, NotificationEntity } from "../../domain/entities/Notification";
import type { UpdateNotificationPreferencesCommand, WorkspaceEventPayload } from "../../application/use-cases/workspace-notification-preferences.use-case";
import type { WorkspaceNotificationPreferenceDto } from "../../application/queries/workspace-notification-preferences.queries";
import type { CommandResult } from "@shared-types";

let _notificationRepo: FirebaseNotificationRepository | undefined;
let _preferenceRepo: FirebaseWorkspaceNotificationPreferenceRepository | undefined;

function getNotifRepo(): FirebaseNotificationRepository {
  if (!_notificationRepo) _notificationRepo = new FirebaseNotificationRepository();
  return _notificationRepo;
}

function getPrefRepo(): FirebaseWorkspaceNotificationPreferenceRepository {
  if (!_preferenceRepo) _preferenceRepo = new FirebaseWorkspaceNotificationPreferenceRepository();
  return _preferenceRepo;
}

export const notificationService = {
  // ── Core notification delivery ────────────────────────────────────────────
  dispatch: (input: DispatchNotificationInput): Promise<CommandResult> =>
    new DispatchNotificationUseCase(getNotifRepo()).execute(input),

  markAsRead: (notificationId: string, recipientId: string): Promise<CommandResult> =>
    new MarkNotificationReadUseCase(getNotifRepo()).execute(notificationId, recipientId),

  markAllAsRead: (recipientId: string): Promise<CommandResult> =>
    new MarkAllNotificationsReadUseCase(getNotifRepo()).execute(recipientId),

  getForRecipient: (recipientId: string, maxCount?: number): Promise<NotificationEntity[]> =>
    new GetNotificationsForRecipientUseCase(getNotifRepo()).execute(recipientId, maxCount),

  getUnreadCount: (recipientId: string): Promise<number> =>
    new GetUnreadCountUseCase(getNotifRepo()).execute(recipientId),

  // ── Workspace notification preferences ───────────────────────────────────
  updateWorkspacePreferences: (command: UpdateNotificationPreferencesCommand): Promise<CommandResult> =>
    new UpdateNotificationPreferencesUseCase(getPrefRepo()).execute(command),

  notifyWorkspaceMembers: (event: WorkspaceEventPayload): Promise<void> =>
    new NotifyWorkspaceMembersUseCase(getPrefRepo(), getNotifRepo()).execute(event),

  getWorkspacePreferences: (workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreferenceDto> =>
    new GetWorkspaceNotificationPreferencesQuery(getPrefRepo()).execute(workspaceId, memberId),
};
