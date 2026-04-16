import { v4 as uuid } from "uuid";
import type { ScheduleDomainEventType } from "../events/ScheduleDomainEvent";

export type DemandStatus = "draft" | "open" | "in_progress" | "completed";
export type DemandPriority = "low" | "medium" | "high";

export const DEMAND_STATUSES = ["draft", "open", "in_progress", "completed"] as const satisfies readonly DemandStatus[];
export const DEMAND_PRIORITIES = ["low", "medium", "high"] as const satisfies readonly DemandPriority[];

export interface WorkDemandSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
  readonly assignedUserId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateWorkDemandInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
}

export class WorkDemand {
  private readonly _domainEvents: ScheduleDomainEventType[] = [];

  private constructor(private _props: WorkDemandSnapshot) {}

  static create(id: string, input: CreateWorkDemandInput): WorkDemand {
    const now = new Date().toISOString();
    const demand = new WorkDemand({
      id,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      requesterId: input.requesterId,
      title: input.title,
      description: input.description,
      status: "draft",
      priority: input.priority,
      scheduledAt: input.scheduledAt,
      assignedUserId: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    demand._domainEvents.push({
      type: "workspace.schedule.demand-created",
      eventId: uuid(),
      occurredAt: now,
      payload: { demandId: id, workspaceId: input.workspaceId },
    });
    return demand;
  }

  static reconstitute(snapshot: WorkDemandSnapshot): WorkDemand {
    return new WorkDemand({ ...snapshot });
  }

  assign(userId: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, assignedUserId: userId, status: "open", updatedAtISO: now };
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get status(): DemandStatus { return this._props.status; }

  getSnapshot(): Readonly<WorkDemandSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): ScheduleDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
