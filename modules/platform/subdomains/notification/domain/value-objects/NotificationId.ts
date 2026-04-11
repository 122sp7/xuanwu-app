import { z } from "@lib-zod";

export const NotificationIdSchema = z.string().min(1).brand("NotificationId");
export type NotificationId = z.infer<typeof NotificationIdSchema>;

export function createNotificationId(raw: string): NotificationId {
  return NotificationIdSchema.parse(raw);
}
