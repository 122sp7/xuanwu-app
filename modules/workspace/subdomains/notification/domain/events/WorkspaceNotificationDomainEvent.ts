/**
 * Domain events for the workspace notification subdomain.
 * Discriminants follow the kebab-case module.action convention.
 */

export interface WorkspaceNotificationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface WorkspaceNotificationPreferenceUpdatedEvent
  extends WorkspaceNotificationDomainEvent {
  readonly type: "workspace.notification.preference-updated";
  readonly payload: {
    readonly workspaceId: string;
    readonly memberId: string;
    readonly subscribedEventCount: number;
  };
}

export type WorkspaceNotificationDomainEventType =
  WorkspaceNotificationPreferenceUpdatedEvent;
