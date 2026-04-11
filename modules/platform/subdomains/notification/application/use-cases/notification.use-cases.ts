/**
 * Notification Application Use Cases — orchestrate domain intent without framework concerns.
 */

import { commandSuccess, commandFailureFrom } from "@shared-types";
import type { CommandResult } from "@shared-types";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { DispatchNotificationInput, NotificationEntity } from "../../domain/entities/Notification";

export class DispatchNotificationUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(input: DispatchNotificationInput): Promise<CommandResult> {
    try {
      const notification = await this.repo.dispatch(input);
      return commandSuccess(notification.id, 1);
    } catch (err) {
      return commandFailureFrom("DISPATCH_NOTIFICATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
  }
}

export class MarkNotificationReadUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(notificationId: string, recipientId: string): Promise<CommandResult> {
    try {
      await this.repo.markAsRead(notificationId, recipientId);
      return commandSuccess(notificationId, 1);
    } catch (err) {
      return commandFailureFrom("MARK_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
  }
}

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(recipientId: string): Promise<CommandResult> {
    try {
      await this.repo.markAllAsRead(recipientId);
      return commandSuccess(recipientId, 1);
    } catch (err) {
      return commandFailureFrom("MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
  }
}

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
