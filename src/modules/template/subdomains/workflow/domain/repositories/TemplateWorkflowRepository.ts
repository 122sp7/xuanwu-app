import type { TemplateWorkflow } from '../entities/TemplateWorkflow';
import type { WorkflowId } from '../value-objects/WorkflowId';

/** TemplateWorkflowRepository — Domain Port (interface). */
export interface TemplateWorkflowRepository {
  findById(id: WorkflowId): Promise<TemplateWorkflow | null>;
  save(workflow: TemplateWorkflow): Promise<void>;
  delete(id: WorkflowId): Promise<void>;
}
