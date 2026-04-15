import type { InitiateWorkflowPort } from '../../../application/ports/inbound/InitiateWorkflowPort';

/**
 * WorkflowController — Inbound HTTP Adapter (stub)
 */
export class WorkflowController {
  constructor(private readonly initiateUseCase: InitiateWorkflowPort) {}

  /** POST /api/workflows */
  async handleInitiate(request: { templateId: string }) {
    const result = await this.initiateUseCase.execute({ templateId: request.templateId });
    return { status: 201, body: result };
  }
}
