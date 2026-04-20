import { v4 as uuid } from "uuid";
import type { TaskStatus } from "../value-objects/TaskStatus";
import { canTransitionTaskStatus } from "../value-objects/TaskStatus";
import type { TaskDomainEventType } from "../events/TaskDomainEvent";

export interface SourceReference {
  readonly knowledgePageId: string;
  readonly knowledgePageTitle: string;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}

export interface TaskSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId: string | null;
  readonly dueDateISO: string | null;
  readonly acceptedAtISO: string | null;
  readonly archivedAtISO: string | null;
  readonly sourceReference: SourceReference | null;
  readonly unitPrice: number | null;
  readonly contractQuantity: number | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
  readonly unitPrice?: number;
  readonly contractQuantity?: number;
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string | null;
  readonly dueDateISO?: string | null;
  readonly unitPrice?: number | null;
  readonly contractQuantity?: number | null;
}

export class Task {
  private readonly _domainEvents: TaskDomainEventType[] = [];

  private constructor(private _props: TaskSnapshot) {}

  static create(id: string, input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task = new Task({
      id,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: "draft",
      assigneeId: input.assigneeId ?? null,
      dueDateISO: input.dueDateISO ?? null,
      acceptedAtISO: null,
      archivedAtISO: null,
      sourceReference: input.sourceReference ?? null,
      unitPrice: input.unitPrice ?? null,
      contractQuantity: input.contractQuantity ?? null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    task._domainEvents.push({
      type: "workspace.task.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { taskId: id, workspaceId: input.workspaceId, title: input.title },
    });
    return task;
  }

  static reconstitute(snapshot: TaskSnapshot): Task {
    return new Task({ ...snapshot });
  }

  update(input: UpdateTaskInput): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot update an archived task.");
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      title: input.title ?? this._props.title,
      description: input.description ?? this._props.description,
      assigneeId: input.assigneeId === undefined ? this._props.assigneeId : input.assigneeId,
      dueDateISO: input.dueDateISO === undefined ? this._props.dueDateISO : input.dueDateISO,
      unitPrice: input.unitPrice === undefined ? this._props.unitPrice : input.unitPrice,
      contractQuantity: input.contractQuantity === undefined ? this._props.contractQuantity : input.contractQuantity,
      updatedAtISO: now,
    };
  }

  transition(to: TaskStatus): void {
    if (!canTransitionTaskStatus(this._props.status, to)) {
      throw new Error(
        `Cannot transition task from '${this._props.status}' to '${to}'.`,
      );
    }
    const now = new Date().toISOString();
    const prev = this._props.status;
    this._props = {
      ...this._props,
      status: to,
      acceptedAtISO: to === "accepted" ? now : this._props.acceptedAtISO,
      archivedAtISO: to === "archived" ? now : this._props.archivedAtISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.task.status-changed",
      eventId: uuid(),
      occurredAt: now,
      payload: { taskId: this._props.id, workspaceId: this._props.workspaceId, from: prev, to },
    });
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get title(): string { return this._props.title; }
  get description(): string { return this._props.description; }
  get status(): TaskStatus { return this._props.status; }
  get assigneeId(): string | null { return this._props.assigneeId; }

  getSnapshot(): Readonly<TaskSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): TaskDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
