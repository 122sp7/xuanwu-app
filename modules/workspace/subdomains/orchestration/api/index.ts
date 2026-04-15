// ── Domain types ──────────────────────────────────────────────────────────────

export type { TaskMaterializationBatchJob } from "../domain/entities/TaskMaterializationBatchJob";
export type { TaskMaterializationBatchJobStatus } from "../domain/value-objects/TaskMaterializationBatchJobStatus";
export { TASK_MATERIALIZATION_BATCH_JOB_STATUSES } from "../domain/value-objects/TaskMaterializationBatchJobStatus";
export type { TaskMaterializationBatchJobRepository } from "../domain/repositories/TaskMaterializationBatchJobRepository";

// ── Application DTOs ──────────────────────────────────────────────────────────

export type { SubmitTaskMaterializationBatchJobDto } from "../application/dto/submit-task-materialization-batch-job.dto";
export type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
} from "../application/dto/extract-task-candidates-from-knowledge.dto";

// ── Summary projections ───────────────────────────────────────────────────────

export type { TaskMaterializationBatchJobSummary } from "../interfaces/contracts/workspace-flow-orchestration.contract";
export { toTaskMaterializationBatchJobSummary } from "../interfaces/contracts/workspace-flow-orchestration.contract";

// ── Factories ─────────────────────────────────────────────────────────────────

export { makeTaskMaterializationBatchJobRepo } from "./factories";

// ── Process managers ──────────────────────────────────────────────────────────

export { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";

// ── Read queries ──────────────────────────────────────────────────────────────

export {
  getWorkspaceFlowTaskMaterializationBatchJobs,
  getWorkspaceFlowTaskMaterializationBatchJob,
} from "../interfaces/queries/workspace-flow-orchestration.queries";

// ── Server actions ────────────────────────────────────────────────────────────

export {
  wfSubmitTaskMaterializationBatchJob,
  wfExtractTaskCandidatesFromKnowledge,
  wfGetTaskMaterializationBatchJob,
  wfListTaskMaterializationBatchJobs,
} from "../interfaces/_actions/workspace-flow-orchestration.actions";

// ── UI components ─────────────────────────────────────────────────────────────

export { WorkspaceFlowTab } from "../interfaces/components/WorkspaceFlowTab";

// ── Event listeners ───────────────────────────────────────────────────────────

export {
  createKnowledgeToWorkflowListener,
  registerKnowledgeToWorkflowListener,
} from "../interfaces/listeners";

export type { KnowledgePageApprovedHandler } from "../interfaces/listeners";
