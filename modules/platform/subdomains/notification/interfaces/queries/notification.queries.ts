/**
 * Notification Queries — delegates to notificationService via the subdomain api/ boundary.
 */

import { notificationService } from "../../api";
import type { NotificationEntity } from "../../application/dtos/notification.dto";

export async function getNotificationsForRecipient(recipientId: string, maxCount?: number): Promise<NotificationEntity[]> {
  return notificationService.getForRecipient(recipientId, maxCount);
}
