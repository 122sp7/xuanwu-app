/**
 * TaskMaterializationWorkflowAdapter — stub implementation of the task handoff port.
 *
 * This adapter bridges notebooklm's task candidate handoff to the workspace
 * task flow. Currently returns a stub response. Replace with a real workspace
 * Server Action call when the workspace task domain is ready.
 *
 * ESLint: @integration-firebase is NOT imported here — this adapter delegates
 * via a published language boundary, not direct Firestore access.
 */

import type {
  TaskMaterializationWorkflowPort,
  MaterializeTasksInput,
  MaterializeTasksResult,
} from "../../orchestration/TaskMaterializationWorkflowPort";

export class TaskMaterializationWorkflowAdapter implements TaskMaterializationWorkflowPort {
  async materializeTasks(input: MaterializeTasksInput): Promise<MaterializeTasksResult> {
    // TODO: replace with real workspace Server Action call when workspace
    // task materialization domain is implemented.
    return {
      ok: true,
      taskCount: input.candidates.length,
      workflowHref: undefined,
    };
  }
}
