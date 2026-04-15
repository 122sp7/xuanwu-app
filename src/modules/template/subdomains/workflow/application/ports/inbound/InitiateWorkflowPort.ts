import type { InitiateWorkflowDTO } from '../../dto/InitiateWorkflowDTO';
import type { WorkflowResponseDTO } from '../../dto/WorkflowResponseDTO';

/** InitiateWorkflowPort — Inbound Port for the InitiateWorkflowUseCase. */
export interface InitiateWorkflowPort {
  execute(input: InitiateWorkflowDTO): Promise<WorkflowResponseDTO>;
}
