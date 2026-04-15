export type QualityTaskStatus = "draft" | "in_progress" | "qa" | "acceptance" | "accepted" | "archived" | "cancelled";

export interface QualityTaskLike {
  readonly id: string;
  readonly status: QualityTaskStatus;
}

export interface QualityTaskRepository {
  findById(taskId: string): Promise<QualityTaskLike | null>;
  updateStatus(taskId: string, to: QualityTaskStatus, nowISO: string): Promise<QualityTaskLike | null>;
}
