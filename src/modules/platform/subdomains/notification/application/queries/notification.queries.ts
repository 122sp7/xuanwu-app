import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { NotificationEntity } from "../../domain/entities/Notification";

export class GetNotificationsForRecipientUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(recipientId: string, limit?: number): Promise<NotificationEntity[]> {
    return this.repo.findByRecipient(recipientId, limit);
  }
}

export class GetUnreadCountUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(recipientId: string): Promise<number> {
    return this.repo.getUnreadCount(recipientId);
  }
}
