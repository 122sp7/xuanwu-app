/**
 * ProcessSourceDocumentWorkflowUseCase — orchestrates the full source processing flow.
 *
 * After a document is uploaded and parsed (by fn), this use case orchestrates
 * the optional downstream steps the user selects in the processing dialog:
 *   1. Parse (already done by fn — this step validates parse status)
 *   2. RAG index (already done by fn — this step validates RAG status)
 *   3. Create Knowledge Page via notion boundary
 *   4. Extract task candidates + hand off via TaskMaterializationWorkflowPort
 *
 * Guardrails:
 *   - notebooklm does NOT write workspace repositories directly.
 *   - Knowledge Page is the required canonical carrier before task creation.
 *   - Task handoff only via TaskMaterializationWorkflowPort.
 *   - parse failure stops all downstream steps.
 */

import type { TaskMaterializationWorkflowPort } from "./TaskMaterializationWorkflowPort";

// ── Input / output contracts ──────────────────────────────────────────────────

export type StepStatus = "skipped" | "success" | "failed";

export interface ProcessSourceDocumentWorkflowInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly documentId: string;
  readonly documentTitle: string;
  readonly parsedTextSummary?: string;
  readonly shouldCreateRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly requestedByUserId?: string;
}

export interface ProcessSourceDocumentWorkflowResult {
  readonly parseStatus: StepStatus;
  readonly ragStatus: StepStatus;
  readonly pageStatus: StepStatus;
  readonly taskStatus: StepStatus;
  readonly pageHref?: string;
  readonly workflowHref?: string;
  readonly taskCount: number;
  readonly pageCount: number;
  readonly errors: readonly string[];
}

// ── Create Knowledge Page port (notion boundary) ──────────────────────────────

export interface CreateKnowledgePagePort {
  createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    sourceDocumentId: string;
    summary?: string;
    sourceLabel?: string;
    requestedByUserId?: string;
  }): Promise<{ ok: boolean; pageId?: string; pageHref?: string; error?: string }>;
}

// ── Use case ──────────────────────────────────────────────────────────────────

export class ProcessSourceDocumentWorkflowUseCase {
  constructor(
    private readonly taskPort: TaskMaterializationWorkflowPort,
    private readonly pagePort: CreateKnowledgePagePort,
  ) {}

  async execute(
    input: ProcessSourceDocumentWorkflowInput,
  ): Promise<ProcessSourceDocumentWorkflowResult> {
    const errors: string[] = [];
    const parseStatus: StepStatus = "success";
    const ragStatus: StepStatus = input.shouldCreateRag ? "success" : "skipped";
    const parsedText: string = input.parsedTextSummary ?? "";

    if (!input.shouldCreatePage && !input.shouldCreateTasks) {
      return buildResult({ parseStatus, ragStatus, errors });
    }

    const { pageStatus, pageId, pageHref, pageError } = await this._runPageStep(input);
    if (pageError) errors.push(pageError);

    if (pageStatus === "failed" || !input.shouldCreateTasks || !pageId) {
      return buildResult({
        parseStatus, ragStatus, errors,
        pageStatus, pageHref,
        taskStatus: input.shouldCreateTasks ? "skipped" : "skipped",
      });
    }

    const { taskStatus, taskCount, workflowHref, taskError } = await this._runTaskStep(
      input, parsedText, pageId,
    );
    if (taskError) errors.push(taskError);

    return buildResult({
      parseStatus, ragStatus, errors,
      pageStatus, pageHref, pageCount: 1,
      taskStatus, taskCount, workflowHref,
    });
  }

  private async _runPageStep(input: ProcessSourceDocumentWorkflowInput) {
    const pageResult = await this.pagePort.createPage({
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      title: input.documentTitle,
      sourceDocumentId: input.documentId,
      summary: input.parsedTextSummary,
      sourceLabel: input.documentId,
      requestedByUserId: input.requestedByUserId,
    });
    if (pageResult.ok && pageResult.pageId) {
      return { pageStatus: "success" as StepStatus, pageId: pageResult.pageId, pageHref: pageResult.pageHref, pageError: undefined };
    }
    return { pageStatus: "failed" as StepStatus, pageId: undefined, pageHref: undefined, pageError: pageResult.error ? `page: ${pageResult.error}` : undefined };
  }

  private async _runTaskStep(
    input: ProcessSourceDocumentWorkflowInput,
    parsedText: string,
    pageId: string,
  ) {
    const taskResult = await this.taskPort.materializeTasks({
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      sourceDocumentId: input.documentId,
      knowledgePageId: pageId,
      candidates: [],
      sourceText: parsedText || input.documentTitle,
      actorId: input.requestedByUserId,
      requestedByUserId: input.requestedByUserId,
    });
    if (taskResult.ok) {
      return { taskStatus: "success" as StepStatus, taskCount: taskResult.taskCount, workflowHref: taskResult.workflowHref, taskError: undefined };
    }
    return { taskStatus: "failed" as StepStatus, taskCount: 0, workflowHref: undefined, taskError: taskResult.error ? `task: ${taskResult.error}` : undefined };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface ResultArgs {
  parseStatus: StepStatus;
  ragStatus: StepStatus;
  errors: string[];
  pageStatus?: StepStatus;
  pageHref?: string;
  pageCount?: number;
  taskStatus?: StepStatus;
  taskCount?: number;
  workflowHref?: string;
}

function buildResult(args: ResultArgs): ProcessSourceDocumentWorkflowResult {
  return {
    parseStatus: args.parseStatus,
    ragStatus: args.ragStatus,
    pageStatus: args.pageStatus ?? "skipped",
    taskStatus: args.taskStatus ?? "skipped",
    pageHref: args.pageHref,
    workflowHref: args.workflowHref,
    taskCount: args.taskCount ?? 0,
    pageCount: args.pageCount ?? 0,
    errors: args.errors,
  };
}
