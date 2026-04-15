// workflow subdomain — application stub
// Add use-cases, DTOs, and ports for template lifecycle workflows here.

export { InitiateWorkflowUseCase } from './use-cases/InitiateWorkflowUseCase';

export type { InitiateWorkflowDTO } from './dto/InitiateWorkflowDTO';
export type { WorkflowResponseDTO } from './dto/WorkflowResponseDTO';

export type { InitiateWorkflowPort } from './ports/inbound/InitiateWorkflowPort';
export type { WorkflowRepositoryPort } from './ports/outbound/WorkflowRepositoryPort';
