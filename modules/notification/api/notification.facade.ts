/**
 * Module: notification
 * Layer: api/facade
 * Purpose: Public programmatic entry-point for cross-module notification dispatch.
 *
 * Other modules MUST use `notificationFacade` — never reach into domain/,
 * application/, or infrastructure/ directly.
 */

import { type CommandResult } from "@shared-types";
import {
  DispatchNotificationUseCase,
  MarkAllNotificationsReadUseCase,
  MarkNotificationReadUseCase,
} from "../application/use-cases/notification.use-cases";
import type { DispatchNotificationInput, NotificationEntity } from "../domain/entities/Notification";
import { FirebaseNotificationRepository } from "../infrastructure/firebase/FirebaseNotificationRepository";
import type { NotificationRepository } from "../domain/repositories/NotificationRepository";

export class NotificationFacade {
  private readonly repo: NotificationRepository;

  constructor(repo: NotificationRepository = new FirebaseNotificationRepository()) {
    this.repo = repo;
  }

  /** Dispatch a new notification to a recipient. */
  async dispatch(input: DispatchNotificationInput): Promise<CommandResult> {
    return new DispatchNotificationUseCase(this.repo).execute(input);
  }

  /** Mark a single notification as read. */
  async markAsRead(notificationId: string, recipientId: string): Promise<CommandResult> {
    return new MarkNotificationReadUseCase(this.repo).execute(notificationId, recipientId);
  }

  /** Mark all notifications for a recipient as read. */
  async markAllAsRead(recipientId: string): Promise<CommandResult> {
    return new MarkAllNotificationsReadUseCase(this.repo).execute(recipientId);
  }

  /** Retrieve recent notifications for a recipient. */
  async getForRecipient(recipientId: string, limit = 50): Promise<NotificationEntity[]> {
    const normalised = recipientId.trim();
    if (!normalised) return [];
    return this.repo.findByRecipient(normalised, limit);
  }

  /** Return unread notification count for a recipient. */
  async getUnreadCount(recipientId: string): Promise<number> {
    const normalised = recipientId.trim();
    if (!normalised) return 0;
    return this.repo.getUnreadCount(normalised);
  }
}

export const notificationFacade = new NotificationFacade();
