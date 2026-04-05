/**
 * Module: notification
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Notification domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Facade ───────────────────────────────────────────────────────────────────

export { NotificationFacade, notificationFacade } from "./notification.facade";

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "../domain/entities/Notification";

// ─── UI components ────────────────────────────────────────────────────────────

export { NotificationBell } from "../interfaces/components/NotificationBell";
