/**
 * WorkflowDomainService
 * Business rules that do not belong to a single TemplateWorkflow instance.
 */
export class WorkflowDomainService {
  /**
   * Validates that a templateId is provided before initiating a workflow.
   */
  validateInitiateRequest(params: { templateId: string }): void {
    if (!params.templateId || params.templateId.trim() === '') {
      throw new Error('templateId is required to initiate a workflow.');
    }
  }
}
