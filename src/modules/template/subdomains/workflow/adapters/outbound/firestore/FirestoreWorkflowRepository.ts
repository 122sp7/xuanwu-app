import type { TemplateWorkflowRepository } from '../../../domain/repositories/TemplateWorkflowRepository';
import type { WorkflowId } from '../../../domain/value-objects/WorkflowId';
import { TemplateWorkflow } from '../../../domain/entities/TemplateWorkflow';

interface FirestoreLike {
  get(path: string): Promise<Record<string, unknown> | null>;
  set(path: string, data: Record<string, unknown>): Promise<void>;
  delete(path: string): Promise<void>;
}

const COLLECTION = 'template_workflows';

/**
 * FirestoreWorkflowRepository — Outbound Firestore Adapter
 */
export class FirestoreWorkflowRepository implements TemplateWorkflowRepository {
  constructor(private readonly db: FirestoreLike) {}

  async findById(id: WorkflowId): Promise<TemplateWorkflow | null> {
    const data = await this.db.get(`${COLLECTION}/${id.toString()}`);
    if (!data) return null;
    return TemplateWorkflow.initiate({
      id,
      templateId: data['templateId'] as string,
    });
  }

  async save(workflow: TemplateWorkflow): Promise<void> {
    await this.db.set(`${COLLECTION}/${workflow.id.toString()}`, {
      id: workflow.id.toString(),
      templateId: workflow.templateId,
      status: workflow.status,
      startedAt: workflow.startedAt.toISOString(),
      completedAt: workflow.completedAt?.toISOString() ?? null,
    });
  }

  async delete(id: WorkflowId): Promise<void> {
    await this.db.delete(`${COLLECTION}/${id.toString()}`);
  }
}
