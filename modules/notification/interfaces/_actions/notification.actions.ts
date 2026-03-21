"use server";

/**
 * Notification Server Actions — thin adapter to use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  DispatchNotificationUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "../../application/use-cases/notification.use-cases";
import { FirebaseNotificationRepository } from "../../infrastructure/firebase/FirebaseNotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";

const notificationRepo = new FirebaseNotificationRepository();

export async function dispatchNotification(
  input: DispatchNotificationInput,
): Promise<CommandResult> {
  try {
    return await new DispatchNotificationUseCase(notificationRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("NOTIFICATION_DISPATCH_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function markNotificationRead(
  notificationId: string,
  recipientId: string,
): Promise<CommandResult> {
  try {
    return await new MarkNotificationReadUseCase(notificationRepo).execute(notificationId, recipientId);
  } catch (err) {
    return commandFailureFrom("NOTIFICATION_MARK_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function markAllNotificationsRead(recipientId: string): Promise<CommandResult> {
  try {
    return await new MarkAllNotificationsReadUseCase(notificationRepo).execute(recipientId);
  } catch (err) {
    return commandFailureFrom("NOTIFICATION_MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
