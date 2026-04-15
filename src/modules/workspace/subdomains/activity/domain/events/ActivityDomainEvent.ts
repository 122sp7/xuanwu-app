export interface ActivityDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface ActivityRecordedEvent extends ActivityDomainEvent {
  readonly type: "workspace.activity.recorded";
  readonly payload: { readonly activityId: string; readonly workspaceId: string; readonly activityType: string };
}

export type ActivityDomainEventType = ActivityRecordedEvent;
