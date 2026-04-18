import { v4 as uuid } from "uuid";
import type { IssueStatus } from "../value-objects/IssueStatus";
import { canTransitionIssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
import type { IssueDomainEventType } from "../events/IssueDomainEvent";

export interface IssueSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo: string | null;
  readonly resolvedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface OpenIssueInput {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}

export class Issue {
  private readonly _domainEvents: IssueDomainEventType[] = [];

  private constructor(private _props: IssueSnapshot) {}

  static open(id: string, input: OpenIssueInput): Issue {
    const now = new Date().toISOString();
    const issue = new Issue({
      id,
      workspaceId: input.workspaceId,
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: "open",
      createdBy: input.createdBy,
      assignedTo: input.assignedTo ?? null,
      resolvedAtISO: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    issue._domainEvents.push({
      type: "workspace.issue.opened",
      eventId: uuid(),
      occurredAt: now,
      payload: { issueId: id, taskId: input.taskId, stage: input.stage, createdBy: input.createdBy },
    });
    return issue;
  }

  static reconstitute(snapshot: IssueSnapshot): Issue {
    return new Issue({ ...snapshot });
  }

  transition(to: IssueStatus): void {
    if (!canTransitionIssueStatus(this._props.status, to)) {
      throw new Error(`Cannot transition issue from '${this._props.status}' to '${to}'.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: to,
      resolvedAtISO: to === "resolved" ? now : this._props.resolvedAtISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.issue.status-changed",
      eventId: uuid(),
      occurredAt: now,
      payload: { issueId: this._props.id, taskId: this._props.taskId, to },
    });
    if (to === "resolved") {
      this._domainEvents.push({
        type: "workspace.issue.resolved",
        eventId: uuid(),
        occurredAt: now,
        payload: {
          issueId: this._props.id,
          taskId: this._props.taskId,
          stage: this._props.stage,
          resolvedAtISO: now,
        },
      });
    }
  }

  close(): void {
    if (!canTransitionIssueStatus(this._props.status, "closed")) {
      throw new Error(`Cannot close issue from '${this._props.status}'.`);
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "closed", updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.issue.closed",
      eventId: uuid(),
      occurredAt: now,
      payload: { issueId: this._props.id, taskId: this._props.taskId },
    });
  }

  get id(): string { return this._props.id; }
  get taskId(): string { return this._props.taskId; }
  get status(): IssueStatus { return this._props.status; }

  getSnapshot(): Readonly<IssueSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): IssueDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
