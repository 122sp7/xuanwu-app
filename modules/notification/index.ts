/**
 * notification module public API
 */
export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "./domain/entities/Notification";
export type { NotificationRepository } from "./domain/repositories/NotificationRepository";
export {
  DispatchNotificationUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "./application/use-cases/notification.use-cases";
export { FirebaseNotificationRepository } from "./infrastructure/firebase/FirebaseNotificationRepository";
export {
  dispatchNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "./interfaces/_actions/notification.actions";
export { getNotificationsForRecipient } from "./interfaces/queries/notification.queries";
