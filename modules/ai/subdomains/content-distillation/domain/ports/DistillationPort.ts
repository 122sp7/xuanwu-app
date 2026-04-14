export interface DistillationSource {
  readonly title?: string | null;
  readonly text: string;
}

export interface DistillContentInput {
  readonly sources: readonly DistillationSource[];
  readonly objective?: string;
  readonly model?: string;
}

export interface DistillationItem {
  readonly title: string;
  readonly summary: string;
  readonly sourceTitle?: string | null;
}

export interface DistillationResult {
  readonly overview: string;
  readonly distilledItems: readonly DistillationItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}

export interface DistillationPort {
  distill(input: DistillContentInput): Promise<DistillationResult>;
}
