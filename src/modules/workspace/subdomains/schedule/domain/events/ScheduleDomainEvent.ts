export interface ScheduleDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface DemandCreatedEvent extends ScheduleDomainEvent {
  readonly type: "workspace.schedule.demand-created";
  readonly payload: { readonly demandId: string; readonly workspaceId: string };
}

export type ScheduleDomainEventType = DemandCreatedEvent;
