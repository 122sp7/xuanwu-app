import { v4 as uuid } from "uuid";
import type { TaskFormationJobStatus } from "../value-objects/TaskFormationJobStatus";
import type { TaskFormationDomainEventType } from "../events/TaskFormationDomainEvent";
import type { ExtractedTaskCandidate } from "../value-objects/TaskCandidate";

export interface TaskFormationJobSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: TaskFormationJobStatus;
  readonly startedAtISO: string | null;
  readonly completedAtISO: string | null;
  readonly errorCode: string | null;
  readonly errorMessage: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaskFormationJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}

export interface CompleteTaskFormationJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}

export class TaskFormationJob {
  private readonly _domainEvents: TaskFormationDomainEventType[] = [];

  private constructor(private _props: TaskFormationJobSnapshot) {}

  static create(id: string, input: CreateTaskFormationJobInput): TaskFormationJob {
    const now = new Date().toISOString();
    const job = new TaskFormationJob({
      id,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      correlationId: input.correlationId,
      knowledgePageIds: input.knowledgePageIds,
      candidates: [],
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
      type: "workspace.task-formation.job-created",
      eventId: uuid(),
      occurredAt: now,
      payload: { jobId: id, workspaceId: input.workspaceId, correlationId: input.correlationId },
    });
    return job;
  }

  static reconstitute(snapshot: TaskFormationJobSnapshot): TaskFormationJob {
    return new TaskFormationJob({ ...snapshot });
  }

  markRunning(): void {
    if (this._props.status !== "queued") throw new Error("Job must be queued to start running.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "running", startedAtISO: now, updatedAtISO: now };
  }

  markCompleted(input: CompleteTaskFormationJobInput): void {
    const now = new Date().toISOString();
    const finalStatus: TaskFormationJobStatus =
      input.failedItems > 0 && input.succeededItems > 0
        ? "partially_succeeded"
        : input.failedItems === 0
          ? "succeeded"
          : "failed";
    this._props = { ...this._props, ...input, status: finalStatus, completedAtISO: now, updatedAtISO: now };
  }

  markFailed(errorCode: string, errorMessage: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "failed", errorCode, errorMessage, completedAtISO: now, updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.task-formation.job-failed",
      eventId: uuid(),
      occurredAt: now,
      payload: { jobId: this._props.id, workspaceId: this._props.workspaceId, errorCode },
    });
  }

  setCandidates(candidates: ExtractedTaskCandidate[]): void {
    if (this._props.status !== "running") throw new Error("Job must be running to set candidates.");
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      candidates: [...candidates],
      succeededItems: candidates.length,
      processedItems: this._props.totalItems,
      status: "succeeded",
      completedAtISO: now,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.task-formation.candidates-extracted",
      eventId: uuid(),
      occurredAt: now,
      payload: { jobId: this._props.id, workspaceId: this._props.workspaceId, candidateCount: candidates.length },
    });
  }

  markCandidatesConfirmed(confirmedCount: number): void {
    if (this._props.status !== "succeeded") throw new Error("Job must have succeeded (candidates extracted) to confirm.");
    const now = new Date().toISOString();
    this._props = { ...this._props, updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.task-formation.candidates-confirmed",
      eventId: uuid(),
      occurredAt: now,
      payload: { jobId: this._props.id, workspaceId: this._props.workspaceId, confirmedCount },
    });
  }

  get id(): string { return this._props.id; }
  get status(): TaskFormationJobStatus { return this._props.status; }

  getSnapshot(): Readonly<TaskFormationJobSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): TaskFormationDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
