import { v4 as uuid } from "uuid";
import type { ActivityDomainEventType } from "../events/ActivityDomainEvent";

export type ActivityEventType =
  | "task.created" | "task.status_changed" | "task.assigned"
  | "issue.opened" | "issue.resolved"
  | "member.added" | "member.removed"
  | "workspace.created" | "workspace.activated";

export interface ActivityEventSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly activityType: ActivityEventType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly occurredAtISO: string;
}

export interface RecordActivityInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly activityType: ActivityEventType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Record<string, unknown>;
}

export class ActivityEvent {
  private readonly _domainEvents: ActivityDomainEventType[] = [];

  private constructor(private readonly _props: ActivityEventSnapshot) {}

  static record(id: string, input: RecordActivityInput): ActivityEvent {
    const now = new Date().toISOString();
    const entry = new ActivityEvent({
      id,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      activityType: input.activityType,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: input.metadata ?? {},
      occurredAtISO: now,
    });
    entry._domainEvents.push({
      type: "workspace.activity.recorded",
      eventId: uuid(),
      occurredAt: now,
      payload: { activityId: id, workspaceId: input.workspaceId, activityType: input.activityType },
    });
    return entry;
  }

  static reconstitute(snapshot: ActivityEventSnapshot): ActivityEvent {
    return new ActivityEvent({ ...snapshot });
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get activityType(): ActivityEventType { return this._props.activityType; }

  getSnapshot(): Readonly<ActivityEventSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): ActivityDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
