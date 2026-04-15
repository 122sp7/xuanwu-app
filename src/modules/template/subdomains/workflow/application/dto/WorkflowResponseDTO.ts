/** WorkflowResponseDTO — read model returned after a workflow is created or queried. */
export interface WorkflowResponseDTO {
  workflowId: string;
  templateId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
}
