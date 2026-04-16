/**
 * Public API boundary for the notification subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Explicit exports only — no wildcard re-exports of application/ or interfaces/
 * (ADR 1403/1404/5203).
 *
 * Covers:
 *  - Core notification delivery (dispatch, read, query)
 *  - Workspace notification preferences (fan-out policy, per-member subscriptions)
 */

// ── Application DTOs (cross-module stable surface) ────────────────────────────
export type {
  UpdateNotificationPreferencesCommand,
  WorkspaceEventPayload,
} from "../application/use-cases/workspace-notification-preferences.use-case";
export type { WorkspaceNotificationPreferenceDto } from "../application/queries/workspace-notification-preferences.queries";

// ── Service facade ────────────────────────────────────────────────────────────
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

// ── Server actions ─────────────────────────────────────────────────────────────
export { dispatchNotification, markNotificationRead, markAllNotificationsRead } from "../interfaces/_actions/notification.actions";
export { updateWorkspaceNotificationPreferences, notifyWorkspaceMembers } from "../interfaces/_actions/workspace-notification.actions";

// ── Queries ───────────────────────────────────────────────────────────────────
export { getNotificationsForRecipient } from "../interfaces/queries/notification.queries";
export { getWorkspaceNotificationPreferences } from "../interfaces/queries/workspace-notification.queries";

// ── UI components ─────────────────────────────────────────────────────────────
export { NotificationBell } from "../interfaces/components/NotificationBell";
export { NotificationsPage } from "../interfaces/components/NotificationsPage";
export { SettingsNotificationsRouteScreen } from "../interfaces/components/screens/SettingsNotificationsRouteScreen";
export type { NotificationsPageProps } from "../interfaces/components/NotificationsPage";
export { WorkspaceNotificationPreferencesPanel } from "../interfaces/components/WorkspaceNotificationPreferencesPanel";
