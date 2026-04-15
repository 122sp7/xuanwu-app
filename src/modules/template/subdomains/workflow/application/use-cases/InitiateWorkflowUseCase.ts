import type { InitiateWorkflowPort } from '../ports/inbound/InitiateWorkflowPort';
import type { WorkflowRepositoryPort } from '../ports/outbound/WorkflowRepositoryPort';
import type { InitiateWorkflowDTO } from '../dto/InitiateWorkflowDTO';
import type { WorkflowResponseDTO } from '../dto/WorkflowResponseDTO';
import { TemplateWorkflow } from '../../domain/entities/TemplateWorkflow';
import { WorkflowId } from '../../domain/value-objects/WorkflowId';
import { WorkflowDomainService } from '../../domain/services/WorkflowDomainService';

/**
 * InitiateWorkflowUseCase
 * Creates a new TemplateWorkflow in 'pending' status.
 */
export class InitiateWorkflowUseCase implements InitiateWorkflowPort {
  private readonly domainService = new WorkflowDomainService();

  constructor(private readonly repository: WorkflowRepositoryPort) {}

  async execute(input: InitiateWorkflowDTO): Promise<WorkflowResponseDTO> {
    this.domainService.validateInitiateRequest({ templateId: input.templateId });

    const workflow = TemplateWorkflow.initiate({
      id: WorkflowId.generate(),
      templateId: input.templateId,
    });

    await this.repository.save(workflow);

    return {
      workflowId: workflow.id.toString(),
      templateId: workflow.templateId,
      status: workflow.status,
      startedAt: workflow.startedAt.toISOString(),
    };
  }
}
