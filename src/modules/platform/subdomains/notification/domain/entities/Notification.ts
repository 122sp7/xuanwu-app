export type NotificationType = "info" | "alert" | "success" | "warning";

export interface NotificationEntity {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface DispatchNotificationInput {
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}
