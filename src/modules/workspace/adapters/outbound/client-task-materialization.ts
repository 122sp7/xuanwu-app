import { commandFailureFrom, commandSuccess, type CommandResult } from "../../../shared";
import { createClientTaskUseCases } from "./firebase-composition";
import type { ExtractedTaskCandidate } from "../../subdomains/task-formation/domain/value-objects/TaskCandidate";

interface MaterializeTaskCandidatesClientInput {
  readonly workspaceId: string;
  readonly candidates: readonly ExtractedTaskCandidate[];
}

export async function materializeTaskCandidatesClient(
  input: MaterializeTaskCandidatesClientInput,
): Promise<CommandResult & { readonly createdCount: number }> {
  const { createTask } = createClientTaskUseCases();
  const results = await Promise.allSettled(
    input.candidates.map((candidate) =>
      createTask.execute({
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
      })),
  );

  const failed = results.find((result) => result.status === "rejected");
  if (failed) {
    return {
      ...commandFailureFrom(
        "TASK_CREATE_FAILED",
        failed.reason instanceof Error ? failed.reason.message : "Failed to create tasks.",
      ),
      createdCount: results.filter((result) => result.status === "fulfilled").length,
    };
  }

  const commandFailures = results
    .filter((result): result is PromiseFulfilledResult<CommandResult> => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((result) => !result.success);
  if (commandFailures.length > 0) {
    return {
      ...commandFailureFrom(
        "TASK_CREATE_FAILED",
        commandFailures[0]?.error.message ?? "Failed to create tasks.",
      ),
      createdCount: results.length - commandFailures.length,
    };
  }

  return {
    ...commandSuccess("task-materialization", Date.now()),
    createdCount: results.length,
  };
}
