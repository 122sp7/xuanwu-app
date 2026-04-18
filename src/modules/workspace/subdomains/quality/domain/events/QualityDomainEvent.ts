export interface QualityReviewStartedEvent {
  readonly type: "workspace.quality.review-started";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly reviewId: string;
    readonly taskId: string;
    readonly workspaceId: string;
    readonly reviewerId: string;
  };
}

export interface QualityReviewPassedEvent {
  readonly type: "workspace.quality.review-passed";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly reviewId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}

export interface QualityReviewFailedEvent {
  readonly type: "workspace.quality.review-failed";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly reviewId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}

export type QualityReviewDomainEventType =
  | QualityReviewStartedEvent
  | QualityReviewPassedEvent
  | QualityReviewFailedEvent;
