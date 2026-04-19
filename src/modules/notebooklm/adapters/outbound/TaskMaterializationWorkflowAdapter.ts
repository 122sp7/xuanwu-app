/**
 * TaskMaterializationWorkflowAdapter — synchronous Server Action bridge for task handoff.
 *
 * ADR: Task bridge → synchronous Server Action callback (option A, not QStash).
 *
 * This adapter receives an injected `WorkspaceTaskFormationCallback` from the
 * composition root (source-processing-actions.ts). When `sourceText` is provided
 * in the input it delegates to workspace's full extract-and-confirm pipeline via
 * the callback. Pre-extracted `candidates` (legacy path) are counted as-is.
 *
 * ESLint: No @integration-firebase import — delegates only via injected callback.
 */

import type {
  TaskMaterializationWorkflowPort,
  MaterializeTasksInput,
  MaterializeTasksResult,
} from "../../orchestration/TaskMaterializationWorkflowPort";

/**
 * Injected workspace task-formation capability.
 * The composition root provides this callback using workspace's internal use cases;
 * the adapter stays decoupled from workspace internals.
 */
export interface WorkspaceTaskFormationCallback {
  run(input: {
    sourceText: string;
    workspaceId: string;
    actorId: string;
    knowledgePageId: string;
  }): Promise<{ taskCount: number; error?: string }>;
}

export class TaskMaterializationWorkflowAdapter implements TaskMaterializationWorkflowPort {
  constructor(private readonly workspaceTaskFormation: WorkspaceTaskFormationCallback) {}

  async materializeTasks(input: MaterializeTasksInput): Promise<MaterializeTasksResult> {
    const sourceText = input.sourceText?.trim() ?? "";

    // Primary path: AI extraction via workspace Genkit flow
    if (sourceText) {
      const result = await this.workspaceTaskFormation.run({
        sourceText,
        workspaceId: input.workspaceId,
        actorId: input.actorId ?? input.requestedByUserId ?? "system",
        knowledgePageId: input.knowledgePageId,
      });

      if (result.error) {
        return { ok: false, taskCount: 0, error: result.error };
      }

      return { ok: true, taskCount: result.taskCount };
    }

    // Legacy path: pre-extracted candidates provided directly
    if (input.candidates.length > 0) {
      return { ok: true, taskCount: input.candidates.length };
    }

    return { ok: true, taskCount: 0 };
  }
}
