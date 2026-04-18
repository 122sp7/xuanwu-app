import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { QualityReviewRepository } from "../../domain/repositories/QualityReviewRepository";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import { QualityReview } from "../../domain/entities/QualityReview";
import type { StartQualityReviewInput } from "../../domain/entities/QualityReview";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";

export class StartQualityReviewUseCase {
  constructor(
    private readonly reviewRepo: QualityReviewRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(input: StartQualityReviewInput): Promise<CommandResult> {
    try {
      const task = await this.taskRepo.findById(input.taskId);
      if (!task) return commandFailureFrom("QA_TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTaskStatus(task.status, "qa")) {
        return commandFailureFrom("QA_INVALID_TRANSITION", `Cannot submit from '${task.status}' to QA.`);
      }
      await this.taskRepo.updateStatus(input.taskId, "qa", new Date().toISOString());
      const review = QualityReview.start(uuid(), input);
      await this.reviewRepo.save(review.getSnapshot());
      return commandSuccess(review.id, Date.now());
    } catch (err) {
      return commandFailureFrom("QA_START_FAILED", err instanceof Error ? err.message : "Failed to start QA review.");
    }
  }
}

export class PassQualityReviewUseCase {
  constructor(
    private readonly reviewRepo: QualityReviewRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(reviewId: string, notes?: string): Promise<CommandResult> {
    try {
      const snapshot = await this.reviewRepo.findById(reviewId);
      if (!snapshot) return commandFailureFrom("QA_REVIEW_NOT_FOUND", "Quality review not found.");
      const task = await this.taskRepo.findById(snapshot.taskId);
      if (!task) return commandFailureFrom("QA_TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTaskStatus(task.status, "acceptance")) {
        return commandFailureFrom("QA_INVALID_TRANSITION", `Cannot pass QA from '${task.status}'.`);
      }
      const review = QualityReview.reconstitute(snapshot);
      review.pass(notes);
      await this.reviewRepo.save(review.getSnapshot());
      await this.taskRepo.updateStatus(snapshot.taskId, "acceptance", new Date().toISOString());
      return commandSuccess(reviewId, Date.now());
    } catch (err) {
      return commandFailureFrom("QA_PASS_FAILED", err instanceof Error ? err.message : "Failed to pass QA review.");
    }
  }
}

export class FailQualityReviewUseCase {
  constructor(
    private readonly reviewRepo: QualityReviewRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(reviewId: string, notes?: string): Promise<CommandResult> {
    try {
      const snapshot = await this.reviewRepo.findById(reviewId);
      if (!snapshot) return commandFailureFrom("QA_REVIEW_NOT_FOUND", "Quality review not found.");
      const review = QualityReview.reconstitute(snapshot);
      review.fail(notes);
      await this.reviewRepo.save(review.getSnapshot());
      await this.taskRepo.updateStatus(snapshot.taskId, "in_progress", new Date().toISOString());
      return commandSuccess(reviewId, Date.now());
    } catch (err) {
      return commandFailureFrom("QA_FAIL_FAILED", err instanceof Error ? err.message : "Failed to fail QA review.");
    }
  }
}

export class ListQualityReviewsUseCase {
  constructor(private readonly reviewRepo: QualityReviewRepository) {}

  async execute(workspaceId: string): Promise<import("../../domain/entities/QualityReview").QualityReviewSnapshot[]> {
    return this.reviewRepo.findByWorkspaceId(workspaceId);
  }
}
