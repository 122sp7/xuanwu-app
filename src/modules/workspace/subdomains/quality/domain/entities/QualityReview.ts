import { v4 as uuid } from "uuid";
import type { QualityReviewDomainEventType } from "../events/QualityDomainEvent";

export type QualityReviewStatus = "in_review" | "passed" | "failed";

export interface QualityReviewSnapshot {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly reviewerId: string;
  readonly status: QualityReviewStatus;
  readonly notes: string;
  readonly startedAtISO: string;
  readonly completedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface StartQualityReviewInput {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly reviewerId: string;
  readonly notes?: string;
}

export class QualityReview {
  private readonly _domainEvents: QualityReviewDomainEventType[] = [];

  private constructor(private _props: QualityReviewSnapshot) {}

  static start(id: string, input: StartQualityReviewInput): QualityReview {
    const now = new Date().toISOString();
    const review = new QualityReview({
      id,
      taskId: input.taskId,
      workspaceId: input.workspaceId,
      reviewerId: input.reviewerId,
      status: "in_review",
      notes: input.notes ?? "",
      startedAtISO: now,
      completedAtISO: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    review._domainEvents.push({
      type: "workspace.quality.review-started",
      eventId: uuid(),
      occurredAt: now,
      payload: { reviewId: id, taskId: input.taskId, workspaceId: input.workspaceId, reviewerId: input.reviewerId },
    });
    return review;
  }

  static reconstitute(snapshot: QualityReviewSnapshot): QualityReview {
    return new QualityReview({ ...snapshot });
  }

  pass(notes?: string): void {
    if (this._props.status !== "in_review") {
      throw new Error(`Cannot pass a review that is in '${this._props.status}' state.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: "passed",
      notes: notes ?? this._props.notes,
      completedAtISO: now,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.quality.review-passed",
      eventId: uuid(),
      occurredAt: now,
      payload: { reviewId: this._props.id, taskId: this._props.taskId, workspaceId: this._props.workspaceId },
    });
  }

  fail(notes?: string): void {
    if (this._props.status !== "in_review") {
      throw new Error(`Cannot fail a review that is in '${this._props.status}' state.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: "failed",
      notes: notes ?? this._props.notes,
      completedAtISO: now,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.quality.review-failed",
      eventId: uuid(),
      occurredAt: now,
      payload: { reviewId: this._props.id, taskId: this._props.taskId, workspaceId: this._props.workspaceId },
    });
  }

  get id(): string { return this._props.id; }
  get taskId(): string { return this._props.taskId; }
  get workspaceId(): string { return this._props.workspaceId; }
  get status(): QualityReviewStatus { return this._props.status; }

  getSnapshot(): Readonly<QualityReviewSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): QualityReviewDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
