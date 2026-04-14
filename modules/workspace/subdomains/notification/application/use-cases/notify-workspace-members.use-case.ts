import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { NotificationDispatchPort } from "../../domain/ports/NotificationDispatchPort";

export interface WorkspaceEventPayload {
  /** The workspace-workflow or workspace event discriminant. */
  readonly eventType: string;
  readonly workspaceId: string;
  /** Human-readable title for the generated notification. */
  readonly title: string;
  /** Human-readable message body. */
  readonly message: string;
  /** Additional context forwarded as notification metadata. */
  readonly metadata?: Record<string, unknown>;
}

/**
 * NotifyWorkspaceMembersUseCase
 *
 * Fan-out: given a workspace event payload, find all workspace members subscribed
 * to that event type and dispatch a platform notification for each.
 *
 * Deliberately does not return CommandResult — notification delivery is
 * fire-and-forget from the caller's perspective (failures are swallowed per
 * subscriber and logged, not surfaced as command failures).
 */
export class NotifyWorkspaceMembersUseCase {
  constructor(
    private readonly preferenceRepo: WorkspaceNotificationPreferenceRepository,
    private readonly dispatchPort: NotificationDispatchPort,
  ) {}

  async execute(event: WorkspaceEventPayload): Promise<void> {
    const subscriberIds = await this.preferenceRepo.findSubscribersByEventType(
      event.workspaceId,
      event.eventType,
    );

    await Promise.allSettled(
      subscriberIds.map((recipientId) =>
        this.dispatchPort.dispatch({
          recipientId,
          title: event.title,
          message: event.message,
          level: "info",
          sourceEventType: event.eventType,
          metadata: event.metadata,
        }),
      ),
    );
  }
}
