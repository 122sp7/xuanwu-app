/**
 * Notification Domain Entities — pure TypeScript, zero framework dependencies.
 */

export type NotificationType = "info" | "alert" | "success" | "warning";

export interface NotificationEntity {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: number;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}

// ─── Value Objects ────────────────────────────────────────────────────────────

export interface DispatchNotificationInput {
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}
