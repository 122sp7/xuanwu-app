/**
 * Notification Queries — direct repo reads for client-side data.
 */

import { FirebaseNotificationRepository } from "../../infrastructure/firebase/FirebaseNotificationRepository";
import type { NotificationEntity } from "../../domain/entities/Notification";

let _notificationRepo: FirebaseNotificationRepository | undefined;

function getNotificationRepo(): FirebaseNotificationRepository {
  if (!_notificationRepo) _notificationRepo = new FirebaseNotificationRepository();
  return _notificationRepo;
}

export async function getNotificationsForRecipient(recipientId: string, maxCount?: number): Promise<NotificationEntity[]> {
  return getNotificationRepo().findByRecipient(recipientId, maxCount);
}
