/**
 * NotificationService — Composition root for notification use cases.
 */

import { FirebaseNotificationRepository } from "./firebase/FirebaseNotificationRepository";
import {
  DispatchNotificationUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "../application/use-cases/notification.use-cases";
import type { DispatchNotificationInput } from "../domain/entities/Notification";
import type { CommandResult } from "@shared-types";

let _notificationRepo: FirebaseNotificationRepository | undefined;

function getNotifRepo(): FirebaseNotificationRepository {
  if (!_notificationRepo) _notificationRepo = new FirebaseNotificationRepository();
  return _notificationRepo;
}

export const notificationService = {
  dispatch: (input: DispatchNotificationInput): Promise<CommandResult> =>
    new DispatchNotificationUseCase(getNotifRepo()).execute(input),

  markAsRead: (notificationId: string, recipientId: string): Promise<CommandResult> =>
    new MarkNotificationReadUseCase(getNotifRepo()).execute(notificationId, recipientId),

  markAllAsRead: (recipientId: string): Promise<CommandResult> =>
    new MarkAllNotificationsReadUseCase(getNotifRepo()).execute(recipientId),

  getForRecipient: (recipientId: string, maxCount?: number) =>
    getNotifRepo().findByRecipient(recipientId, maxCount),

  getUnreadCount: (recipientId: string) => getNotifRepo().getUnreadCount(recipientId),
};
