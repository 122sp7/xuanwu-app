import type { QualityReviewSnapshot } from "../entities/QualityReview";

export interface QualityReviewRepository {
  findById(reviewId: string): Promise<QualityReviewSnapshot | null>;
  findByTaskId(taskId: string): Promise<QualityReviewSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<QualityReviewSnapshot[]>;
  save(review: QualityReviewSnapshot): Promise<void>;
  delete(reviewId: string): Promise<void>;
}
