/**
 * Public API boundary for the notification subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Covers:
 *  - Core notification delivery (dispatch, read, query)
 *  - Workspace notification preferences (fan-out policy, per-member subscriptions)
 */

export * from "../application";
export { notificationService } from "../interfaces/composition/notification-service";

// ── Core notification types ───────────────────────────────────────────────────
export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "../domain/entities/Notification";

// ── Workspace notification types ──────────────────────────────────────────────
export {
  WORKSPACE_NOTIFICATION_EVENT_TYPES,
  createWorkspaceNotificationEventType,
} from "../domain/value-objects/WorkspaceNotificationEventType";
export type { WorkspaceNotificationEventType } from "../domain/value-objects/WorkspaceNotificationEventType";

// ── UI components ─────────────────────────────────────────────────────────────
export { NotificationBell } from "../interfaces/components/NotificationBell";
export { NotificationsPage } from "../interfaces/components/NotificationsPage";
export { SettingsNotificationsRouteScreen } from "../interfaces/components/screens/SettingsNotificationsRouteScreen";
export type { NotificationsPageProps } from "../interfaces/components/NotificationsPage";

// ── Full interfaces surface (actions, queries, components) ────────────────────
export * from "../interfaces";
