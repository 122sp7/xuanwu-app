import { notificationService } from "@/modules/platform/subdomains/notification/interfaces/composition/notification-service";
import type { NotificationDispatchPort, WorkspaceNotificationDispatch } from "../../domain/ports/NotificationDispatchPort";

export class PlatformNotificationDispatchAdapter
  implements NotificationDispatchPort
{
  async dispatch(input: WorkspaceNotificationDispatch): Promise<void> {
    await notificationService.dispatch({
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.level,
      sourceEventType: input.sourceEventType,
      metadata: input.metadata,
    });
  }
}
