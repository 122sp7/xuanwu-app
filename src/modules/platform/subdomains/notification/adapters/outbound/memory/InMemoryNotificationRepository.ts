import { v4 as uuid } from "@lib-uuid";
import type { DispatchNotificationInput, NotificationEntity } from "../../../domain/entities/Notification";
import type { NotificationRepository } from "../../../domain/repositories/NotificationRepository";

export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly store = new Map<string, NotificationEntity>();

  async dispatch(input: DispatchNotificationInput): Promise<NotificationEntity> {
    const entity: NotificationEntity = {
      id: uuid(),
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: Date.now(),
      sourceEventType: input.sourceEventType,
      metadata: input.metadata,
    };
    this.store.set(entity.id, entity);
    return entity;
  }

  async markAsRead(notificationId: string, recipientId: string): Promise<void> {
    const existing = this.store.get(notificationId);
    if (!existing || existing.recipientId != recipientId) return;
    this.store.set(notificationId, { ...existing, read: true });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    for (const [id, notification] of this.store.entries()) {
      if (notification.recipientId === recipientId && !notification.read) {
        this.store.set(id, { ...notification, read: true });
      }
    }
  }

  async findByRecipient(recipientId: string, limit = 50): Promise<NotificationEntity[]> {
    return [...this.store.values()]
      .filter((entity) => entity.recipientId === recipientId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return [...this.store.values()].filter((entity) => entity.recipientId === recipientId && !entity.read).length;
  }
}
