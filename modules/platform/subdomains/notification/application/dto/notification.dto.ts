/**
 * Application-layer DTO re-exports for the notification subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { NotificationEntity, DispatchNotificationInput } from "../../domain/entities/Notification";
export type { WorkspaceNotificationPreferenceDto } from "../queries/workspace-notification-preferences.queries";
