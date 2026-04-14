/**
 * NotificationDispatchPort — driven port interface for dispatching a notification.
 *
 * The workspace notification subdomain depends on this abstraction; the concrete
 * adapter lives in infrastructure/platform/ and delegates to the platform
 * notification service.
 *
 * NotificationType is defined locally to keep domain/ free of cross-module imports.
 * The infrastructure adapter maps this to the platform notification type.
 */

/** Severity level aligned with platform notification types. */
export type WorkspaceNotificationLevel = "info" | "alert" | "success" | "warning";

export interface WorkspaceNotificationDispatch {
  recipientId: string;
  title: string;
  message: string;
  level: WorkspaceNotificationLevel;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationDispatchPort {
  dispatch(input: WorkspaceNotificationDispatch): Promise<void>;
}
