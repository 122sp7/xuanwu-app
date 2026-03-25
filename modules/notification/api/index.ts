/**
 * Module: notification
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Notification domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "../domain/entities/Notification";

// ─── Server Actions (cross-domain dispatch) ───────────────────────────────────

export { dispatchNotification } from "../interfaces/_actions/notification.actions";
export {
  markNotificationRead,
  markAllNotificationsRead,
} from "../interfaces/_actions/notification.actions";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getNotificationsForRecipient } from "../interfaces/queries/notification.queries";
