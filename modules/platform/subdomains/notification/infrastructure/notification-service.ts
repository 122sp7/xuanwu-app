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

const notificationRepo = new FirebaseNotificationRepository();

export const notificationService = {
  dispatch: (input: DispatchNotificationInput): Promise<CommandResult> =>
    new DispatchNotificationUseCase(notificationRepo).execute(input),

  markAsRead: (notificationId: string, recipientId: string): Promise<CommandResult> =>
    new MarkNotificationReadUseCase(notificationRepo).execute(notificationId, recipientId),

  markAllAsRead: (recipientId: string): Promise<CommandResult> =>
    new MarkAllNotificationsReadUseCase(notificationRepo).execute(recipientId),

  getForRecipient: (recipientId: string, maxCount?: number) =>
    notificationRepo.findByRecipient(recipientId, maxCount),

  getUnreadCount: (recipientId: string) => notificationRepo.getUnreadCount(recipientId),
};
