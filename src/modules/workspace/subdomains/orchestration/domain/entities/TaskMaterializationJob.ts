import { v4 as uuid } from "uuid";
import type { JobDomainEventType } from "../events/JobDomainEvent";

export type JobStatus = "queued" | "running" | "partially_succeeded" | "succeeded" | "failed" | "cancelled";

export const JOB_STATUSES = ["queued", "running", "partially_succeeded", "succeeded", "failed", "cancelled"] as const satisfies readonly JobStatus[];

export interface TaskMaterializationJobSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: JobStatus;
  readonly startedAtISO: string | null;
  readonly completedAtISO: string | null;
  readonly errorCode: string | null;
  readonly errorMessage: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}

export interface CompleteJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}

export class TaskMaterializationJob {
  private readonly _domainEvents: JobDomainEventType[] = [];

  private constructor(private _props: TaskMaterializationJobSnapshot) {}

  static create(id: string, input: CreateJobInput): TaskMaterializationJob {
    const now = new Date().toISOString();
    const job = new TaskMaterializationJob({
      id,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      correlationId: input.correlationId,
      knowledgePageIds: input.knowledgePageIds,
      totalItems: input.knowledgePageIds.length,
      processedItems: 0,
      succeededItems: 0,
      failedItems: 0,
      status: "queued",
      startedAtISO: null,
      completedAtISO: null,
      errorCode: null,
      errorMessage: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    job._domainEvents.push({
      type: "workspace.orchestration.job-created",
      eventId: uuid(),
      occurredAt: now,
      payload: { jobId: id, workspaceId: input.workspaceId, correlationId: input.correlationId },
    });
    return job;
  }

  static reconstitute(snapshot: TaskMaterializationJobSnapshot): TaskMaterializationJob {
    return new TaskMaterializationJob({ ...snapshot });
  }

  markRunning(): void {
    if (this._props.status !== "queued") throw new Error("Job must be queued to start running.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "running", startedAtISO: now, updatedAtISO: now };
  }

  markCompleted(input: CompleteJobInput): void {
    const now = new Date().toISOString();
    const finalStatus: JobStatus = input.failedItems > 0 && input.succeededItems > 0
      ? "partially_succeeded"
      : input.failedItems === 0 ? "succeeded" : "failed";
    this._props = { ...this._props, ...input, status: finalStatus, completedAtISO: now, updatedAtISO: now };
  }

  markFailed(errorCode: string, errorMessage: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "failed", errorCode, errorMessage, completedAtISO: now, updatedAtISO: now };
  }

  get id(): string { return this._props.id; }
  get status(): JobStatus { return this._props.status; }

  getSnapshot(): Readonly<TaskMaterializationJobSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): JobDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
