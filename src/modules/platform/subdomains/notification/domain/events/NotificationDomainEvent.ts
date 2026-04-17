import type { NotificationType } from "../entities/Notification";

export interface NotificationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface NotificationDispatchedEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.dispatched";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
    readonly notificationType: NotificationType;
  };
}

export interface NotificationReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.read";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
  };
}

export interface AllNotificationsReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.all_read";
  readonly payload: {
    readonly recipientId: string;
  };
}

export type NotificationDomainEventType =
  | NotificationDispatchedEvent
  | NotificationReadEvent
  | AllNotificationsReadEvent;
