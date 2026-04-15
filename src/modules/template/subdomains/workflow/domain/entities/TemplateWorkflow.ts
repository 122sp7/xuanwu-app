/**
 * TemplateWorkflow — Aggregate Root (stub)
 *
 * Represents a lifecycle workflow bound to a Template aggregate
 * (e.g. draft → review → approved → published).
 * Expand this aggregate when the workflow subdomain is activated.
 */
export type WorkflowStatus =
  | 'pending'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface TemplateWorkflowProps {
  id: string;
  templateId: string;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
}

export class TemplateWorkflow {
  private constructor(private props: TemplateWorkflowProps) {}

  static initiate(
    params: Pick<TemplateWorkflowProps, 'id' | 'templateId'>,
  ): TemplateWorkflow {
    return new TemplateWorkflow({
      ...params,
      status: 'pending',
      startedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get templateId(): string {
    return this.props.templateId;
  }

  get status(): WorkflowStatus {
    return this.props.status;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  activate(): void {
    this.props.status = 'active';
  }

  pause(): void {
    this.props.status = 'paused';
  }

  complete(): void {
    this.props.status = 'completed';
    this.props.completedAt = new Date();
  }

  cancel(): void {
    this.props.status = 'cancelled';
    this.props.completedAt = new Date();
  }
}
