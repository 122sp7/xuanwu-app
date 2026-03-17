import type { NotificationEntity } from "../../domain/entities/Notification";
import { FirebaseNotificationRepository } from "../../infrastructure/firebase/FirebaseNotificationRepository";

const notificationRepo = new FirebaseNotificationRepository();

export async function getNotificationsForRecipient(
  recipientId: string,
  limit = 50,
): Promise<NotificationEntity[]> {
  const normalizedRecipientId = recipientId.trim();
  if (!normalizedRecipientId) {
    return [];
  }

  return notificationRepo.findByRecipient(normalizedRecipientId, limit);
}
