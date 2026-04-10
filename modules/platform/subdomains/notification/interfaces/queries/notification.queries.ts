/**
 * Notification Queries — direct repo reads for client-side data.
 */

import { FirebaseNotificationRepository } from "../firebase/FirebaseNotificationRepository";
import type { NotificationEntity } from "../../domain/entities/Notification";

const notificationRepo = new FirebaseNotificationRepository();

export async function getNotificationsForRecipient(recipientId: string, maxCount?: number): Promise<NotificationEntity[]> {
  return notificationRepo.findByRecipient(recipientId, maxCount);
}
