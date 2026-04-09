"use server";

/**
 * Notification Server Actions — thin adapters over use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { notificationService } from "../notification-service";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";

export async function dispatchNotification(input: DispatchNotificationInput): Promise<CommandResult> {
  try {
    return await notificationService.dispatch(input);
  } catch (err) {
    return commandFailureFrom("DISPATCH_NOTIFICATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function markNotificationRead(
  notificationId: string,
  recipientId: string,
): Promise<CommandResult> {
  try {
    return await notificationService.markAsRead(notificationId, recipientId);
  } catch (err) {
    return commandFailureFrom("MARK_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function markAllNotificationsRead(recipientId: string): Promise<CommandResult> {
  try {
    return await notificationService.markAllAsRead(recipientId);
  } catch (err) {
    return commandFailureFrom("MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
