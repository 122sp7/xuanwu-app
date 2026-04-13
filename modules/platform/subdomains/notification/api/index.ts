/**
 * Public API boundary for the notification subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export { notificationService } from "../interfaces/composition/notification-service";
export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "../domain/entities/Notification";
export { NotificationBell } from "../interfaces/components/NotificationBell";
export { NotificationsPage } from "../interfaces/components/NotificationsPage";
export type { NotificationsPageProps } from "../interfaces/components/NotificationsPage";
export * from "../interfaces";
