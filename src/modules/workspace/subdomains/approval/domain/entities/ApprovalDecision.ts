import { v4 as uuid } from "uuid";
import type { ApprovalDomainEventType } from "../events/ApprovalDomainEvent";

export type ApprovalDecisionStatus = "pending" | "approved" | "rejected";

export interface ApprovalDecisionSnapshot {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly approverId: string;
  readonly status: ApprovalDecisionStatus;
  readonly comments: string;
  readonly createdAtISO: string;
  readonly decidedAtISO: string | null;
  readonly updatedAtISO: string;
}

export interface CreateApprovalDecisionInput {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly approverId: string;
  readonly comments?: string;
}

export class ApprovalDecision {
  private readonly _domainEvents: ApprovalDomainEventType[] = [];

  private constructor(private _props: ApprovalDecisionSnapshot) {}

  static create(id: string, input: CreateApprovalDecisionInput): ApprovalDecision {
    const now = new Date().toISOString();
    const decision = new ApprovalDecision({
      id,
      taskId: input.taskId,
      workspaceId: input.workspaceId,
      approverId: input.approverId,
      status: "pending",
      comments: input.comments ?? "",
      createdAtISO: now,
      decidedAtISO: null,
      updatedAtISO: now,
    });
    decision._domainEvents.push({
      type: "workspace.approval.decision-created",
      eventId: uuid(),
      occurredAt: now,
      payload: { decisionId: id, taskId: input.taskId, workspaceId: input.workspaceId, approverId: input.approverId },
    });
    return decision;
  }

  static reconstitute(snapshot: ApprovalDecisionSnapshot): ApprovalDecision {
    return new ApprovalDecision({ ...snapshot });
  }

  approve(comments?: string): void {
    if (this._props.status !== "pending") {
      throw new Error(`Cannot approve a decision that is in '${this._props.status}' state.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: "approved",
      comments: comments ?? this._props.comments,
      decidedAtISO: now,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.approval.decision-approved",
      eventId: uuid(),
      occurredAt: now,
      payload: { decisionId: this._props.id, taskId: this._props.taskId, workspaceId: this._props.workspaceId },
    });
  }

  reject(comments?: string): void {
    if (this._props.status !== "pending") {
      throw new Error(`Cannot reject a decision that is in '${this._props.status}' state.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: "rejected",
      comments: comments ?? this._props.comments,
      decidedAtISO: now,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.approval.decision-rejected",
      eventId: uuid(),
      occurredAt: now,
      payload: { decisionId: this._props.id, taskId: this._props.taskId, workspaceId: this._props.workspaceId },
    });
  }

  get id(): string { return this._props.id; }
  get taskId(): string { return this._props.taskId; }
  get workspaceId(): string { return this._props.workspaceId; }
  get status(): ApprovalDecisionStatus { return this._props.status; }

  getSnapshot(): Readonly<ApprovalDecisionSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): ApprovalDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
