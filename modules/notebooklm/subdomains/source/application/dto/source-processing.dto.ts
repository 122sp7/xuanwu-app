export type SourceProcessingTaskStatus = "idle" | "running" | "success" | "error" | "skipped";

export interface SourceProcessingTaskResult {
  readonly status: SourceProcessingTaskStatus;
  readonly detail: string;
}

export interface SourceProcessingExecutionSummary {
  readonly pageCount: number;
  readonly jsonGcsUri: string;
  readonly pageHref: string;
  readonly parse: SourceProcessingTaskResult;
  readonly rag: SourceProcessingTaskResult;
  readonly page: SourceProcessingTaskResult;
}

export function createIdleExecutionSummary(): SourceProcessingExecutionSummary {
  return {
    pageCount: 0,
    jsonGcsUri: "",
    pageHref: "",
    parse: { status: "idle", detail: "尚未開始解析" },
    rag: { status: "idle", detail: "尚未決定是否建立 RAG 索引" },
    page: { status: "idle", detail: "尚未決定是否建立 Knowledge Page" },
  };
}