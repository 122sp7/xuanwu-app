import type { QualityReviewRepository } from "../../../domain/repositories/QualityReviewRepository";
import type { QualityReviewSnapshot } from "../../../domain/entities/QualityReview";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreQualityReviewRepository implements QualityReviewRepository {
  private readonly collection = "quality_reviews";

  constructor(private readonly db: FirestoreLike) {}

  async findById(reviewId: string): Promise<QualityReviewSnapshot | null> {
    const doc = await this.db.get(this.collection, reviewId);
    return doc ? (doc as unknown as QualityReviewSnapshot) : null;
  }

  async findByTaskId(taskId: string): Promise<QualityReviewSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "taskId", op: "==", value: taskId },
    ]);
    return docs as unknown as QualityReviewSnapshot[];
  }

  async findByWorkspaceId(workspaceId: string): Promise<QualityReviewSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return docs as unknown as QualityReviewSnapshot[];
  }

  async save(review: QualityReviewSnapshot): Promise<void> {
    await this.db.set(this.collection, review.id, review as unknown as Record<string, unknown>);
  }

  async delete(reviewId: string): Promise<void> {
    await this.db.delete(this.collection, reviewId);
  }
}
