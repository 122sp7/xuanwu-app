/**
 * notification module public API
 *
 * Cross-module callers must use `notificationFacade` or the exported types.
 * Internal layers (domain/, application/, infrastructure/) remain private.
 */

export { NotificationFacade, notificationFacade } from "./api";
export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "./api";

export { NotificationBell } from "./interfaces";
