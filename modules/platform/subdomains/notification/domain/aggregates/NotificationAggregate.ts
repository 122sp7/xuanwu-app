import type {
  NotificationDomainEventType,
  NotificationDispatchedEvent,
  NotificationReadEvent,
} from "../events/NotificationDomainEvent";
import { createNotificationId } from "../value-objects";
import type { NotificationId } from "../value-objects";
import type {
  NotificationEntity,
  DispatchNotificationInput,
} from "../entities/Notification";

export interface NotificationAggregateSnapshot {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationEntity["type"];
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType: string | undefined;
  readonly metadata: Record<string, unknown> | undefined;
}

export class NotificationAggregate {
  private readonly _domainEvents: NotificationDomainEventType[] = [];

  private constructor(private _props: NotificationAggregateSnapshot) {}

  static create(id: string, input: DispatchNotificationInput): NotificationAggregate {
    createNotificationId(id);
    const aggregate = new NotificationAggregate({
      id,
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: Date.now(),
      sourceEventType: input.sourceEventType,
      metadata: input.metadata,
    });
    aggregate.recordEvent<NotificationDispatchedEvent>({
      type: "platform.notification.dispatched",
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        notificationId: id,
        recipientId: input.recipientId,
        notificationType: input.type,
      },
    });
    return aggregate;
  }

  static reconstitute(snapshot: NotificationAggregateSnapshot): NotificationAggregate {
    return new NotificationAggregate({ ...snapshot });
  }

  markRead(): void {
    if (this._props.read) return;
    const now = new Date().toISOString();
    this._props = { ...this._props, read: true };
    this.recordEvent<NotificationReadEvent>({
      type: "platform.notification.read",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        notificationId: this._props.id,
        recipientId: this._props.recipientId,
      },
    });
  }

  get id(): NotificationId {
    return createNotificationId(this._props.id);
  }

  get recipientId(): string {
    return this._props.recipientId;
  }

  get read(): boolean {
    return this._props.read;
  }

  getSnapshot(): Readonly<NotificationAggregateSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotificationDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private recordEvent<TEvent extends NotificationDomainEventType>(event: TEvent): void {
    this._domainEvents.push(event);
  }
}
