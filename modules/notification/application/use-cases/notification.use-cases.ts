/**
 * Notification Use Cases — pure business workflows.
 * notification-hub = sole side-effect outlet. All notification dispatch routes through here.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@/shared/types";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";

export class DispatchNotificationUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(input: DispatchNotificationInput): Promise<CommandResult> {
    try {
      const notification = await this.notificationRepo.dispatch(input);
      return commandSuccess(notification.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "NOTIFICATION_DISPATCH_FAILED",
        err instanceof Error ? err.message : "Failed to dispatch notification",
      );
    }
  }
}

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(notificationId: string, recipientId: string): Promise<CommandResult> {
    try {
      await this.notificationRepo.markAsRead(notificationId, recipientId);
      return commandSuccess(notificationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "NOTIFICATION_MARK_READ_FAILED",
        err instanceof Error ? err.message : "Failed to mark notification as read",
      );
    }
  }
}

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(recipientId: string): Promise<CommandResult> {
    try {
      await this.notificationRepo.markAllAsRead(recipientId);
      return commandSuccess(recipientId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "NOTIFICATION_MARK_ALL_READ_FAILED",
        err instanceof Error ? err.message : "Failed to mark all notifications as read",
      );
    }
  }
}
