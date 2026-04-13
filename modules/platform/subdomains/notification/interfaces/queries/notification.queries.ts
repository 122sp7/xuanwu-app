/**
 * Notification Queries — delegates to notificationService via the subdomain api/ boundary.
 */

import { notificationService } from "../composition/notification-service";
import type { NotificationEntity } from "../../application/dto/notification.dto";

export async function getNotificationsForRecipient(recipientId: string, maxCount?: number): Promise<NotificationEntity[]> {
  return notificationService.getForRecipient(recipientId, maxCount);
}
