export type SourceProcessingTaskStatus = "idle" | "running" | "success" | "error" | "skipped";

export interface SourceProcessingTaskResult {
  readonly status: SourceProcessingTaskStatus;
  readonly detail: string;
}

export interface SourceProcessingExecutionSummary {
  readonly pageCount: number;
  readonly jsonGcsUri: string;
  readonly pageHref: string;
  readonly workflowHref: string;
  readonly taskCount: number;
  readonly parse: SourceProcessingTaskResult;
  readonly rag: SourceProcessingTaskResult;
  readonly page: SourceProcessingTaskResult;
  readonly task: SourceProcessingTaskResult;
}

export function createIdleExecutionSummary(): SourceProcessingExecutionSummary {
  return {
    pageCount: 0,
    jsonGcsUri: "",
    pageHref: "",
    workflowHref: "",
    taskCount: 0,
    parse: { status: "idle", detail: "尚未開始解析" },
    rag: { status: "idle", detail: "尚未決定是否建立 RAG 索引" },
    page: { status: "idle", detail: "尚未決定是否建立 Knowledge Page" },
    task: { status: "idle", detail: "尚未決定是否建立任務" },
  };
}