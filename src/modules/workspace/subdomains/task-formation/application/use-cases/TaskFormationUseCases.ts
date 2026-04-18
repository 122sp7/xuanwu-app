import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskFormationJobRepository } from "../../domain/repositories/TaskFormationJobRepository";
import { TaskFormationJob } from "../../domain/entities/TaskFormationJob";
import type { CreateTaskFormationJobInput, CompleteTaskFormationJobInput } from "../../domain/entities/TaskFormationJob";
import type { TaskCandidateExtractorPort } from "../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractTaskCandidatesDTO, ConfirmCandidatesDTO } from "../dto/TaskFormationDTO";
import type { CreateTaskInput } from "../../../task/domain/entities/Task";

export class CreateTaskFormationJobUseCase {
  constructor(private readonly jobRepo: TaskFormationJobRepository) {}

  async execute(input: CreateTaskFormationJobInput): Promise<CommandResult> {
    try {
      const job = TaskFormationJob.create(uuid(), input);
      await this.jobRepo.save(job.getSnapshot());
      return commandSuccess(job.id, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_FORMATION_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create job.");
    }
  }
}

export class CompleteTaskFormationJobUseCase {
  constructor(private readonly jobRepo: TaskFormationJobRepository) {}

  async execute(jobId: string, input: CompleteTaskFormationJobInput): Promise<CommandResult> {
    try {
      const result = await this.jobRepo.markCompleted(jobId, input);
      if (!result) return commandFailureFrom("TASK_FORMATION_NOT_FOUND", "Job not found.");
      return commandSuccess(jobId, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_FORMATION_COMPLETE_FAILED", err instanceof Error ? err.message : "Failed to complete job.");
    }
  }
}

/**
 * ExtractTaskCandidatesUseCase — creates a job, marks it running, calls the
 * AI extractor port, and persists extracted candidates back to the job.
 *
 * The port is injected (never imported directly) so the use case stays
 * infrastructure-agnostic.
 */
export class ExtractTaskCandidatesUseCase {
  constructor(
    private readonly jobRepo: TaskFormationJobRepository,
    private readonly aiExtractor: TaskCandidateExtractorPort,
  ) {}

  async execute(input: ExtractTaskCandidatesDTO): Promise<CommandResult> {
    try {
      const jobId = uuid();
      const job = TaskFormationJob.create(jobId, {
        workspaceId: input.workspaceId,
        actorId: input.actorId,
        correlationId: uuid(),
        knowledgePageIds: input.sourcePageIds,
      });
      await this.jobRepo.save(job.getSnapshot());

      job.markRunning();
      await this.jobRepo.save(job.getSnapshot());

      const candidates = await this.aiExtractor.extract({
        workspaceId: input.workspaceId,
        sourceType: input.sourceType,
        sourcePageIds: input.sourcePageIds,
        sourceText: input.sourceText,
      });

      job.setCandidates(candidates);
      await this.jobRepo.save(job.getSnapshot());

      return commandSuccess(jobId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TASK_FORMATION_EXTRACT_FAILED",
        err instanceof Error ? err.message : "Failed to extract task candidates.",
      );
    }
  }
}

/** Boundary callback — injected so the use case doesn't depend on task repository directly. */
export interface CreateTaskBoundary {
  createTask(input: CreateTaskInput): Promise<CommandResult>;
}

/**
 * ConfirmCandidatesUseCase — user selects which extracted candidates to
 * promote into real Tasks. Creates Tasks via the injected boundary callback,
 * then records a `candidates-confirmed` domain event on the Job.
 */
export class ConfirmCandidatesUseCase {
  constructor(
    private readonly jobRepo: TaskFormationJobRepository,
    private readonly createTaskBoundary: CreateTaskBoundary,
  ) {}

  async execute(input: ConfirmCandidatesDTO): Promise<CommandResult> {
    try {
      const snapshot = await this.jobRepo.findById(input.jobId);
      if (!snapshot) return commandFailureFrom("TASK_FORMATION_NOT_FOUND", "Job not found.");
      if (snapshot.status !== "succeeded") {
        return commandFailureFrom("TASK_FORMATION_INVALID_STATE", "Job must have succeeded (candidates extracted) before confirming.");
      }

      const job = TaskFormationJob.reconstitute(snapshot);
      const candidates = snapshot.candidates;
      const selected = input.selectedIndices
        .filter((i) => i >= 0 && i < candidates.length)
        .map((i) => candidates[i]!);

      if (selected.length === 0) {
        return commandFailureFrom("TASK_FORMATION_NO_SELECTION", "No valid candidates selected.");
      }

      const results = await Promise.allSettled(
        selected.map((candidate) =>
          this.createTaskBoundary.createTask({
            workspaceId: input.workspaceId,
            title: candidate.title,
            description: candidate.description,
            dueDateISO: candidate.dueDate,
            ...(candidate.sourceBlockId
              ? {
                  sourceReference: {
                    knowledgePageId: candidate.sourceBlockId,
                    knowledgePageTitle: candidate.title,
                    sourceBlockId: candidate.sourceBlockId,
                    sourceSnippet: candidate.sourceSnippet,
                  },
                }
              : {}),
          }),
        ),
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      job.markCandidatesConfirmed(succeeded);
      await this.jobRepo.save(job.getSnapshot());

      return commandSuccess(input.jobId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TASK_FORMATION_CONFIRM_FAILED",
        err instanceof Error ? err.message : "Failed to confirm candidates.",
      );
    }
  }
}
