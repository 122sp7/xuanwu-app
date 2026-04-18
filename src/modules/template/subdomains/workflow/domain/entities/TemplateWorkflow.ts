import { WorkflowId } from '../value-objects/WorkflowId';
import {
  WorkflowCompletedEvent,
  WorkflowInitiatedEvent,
} from '../events/WorkflowEvents';

/**
 * TemplateWorkflow — Aggregate Root
 * Represents a lifecycle workflow bound to a Template aggregate
 * (e.g. pending → active → completed).
 */
export type WorkflowStatus =
  | 'pending'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface TemplateWorkflowProps {
  id: WorkflowId;
  templateId: string;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
}

export class TemplateWorkflow {
  private readonly domainEvents: Array<WorkflowInitiatedEvent | WorkflowCompletedEvent> = [];

  private constructor(private props: TemplateWorkflowProps) {}

  static initiate(
    params: Pick<TemplateWorkflowProps, 'id' | 'templateId'>,
  ): TemplateWorkflow {
    const workflow = new TemplateWorkflow({
      ...params,
      status: 'pending',
      startedAt: new Date(),
    });
    workflow.domainEvents.push(
      new WorkflowInitiatedEvent(params.id.toString(), params.templateId),
    );
    return workflow;
  }

  get id(): WorkflowId {
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
    this.ensureTransition(['pending', 'paused'], 'active');
    this.props.status = 'active';
  }

  pause(): void {
    this.ensureTransition(['active'], 'paused');
    this.props.status = 'paused';
  }

  complete(): void {
    this.ensureTransition(['active'], 'completed');
    const completedAt = new Date();
    this.props.status = 'completed';
    this.props.completedAt = completedAt;
    this.domainEvents.push(
      new WorkflowCompletedEvent(
        this.props.id.toString(),
        this.props.templateId,
        completedAt.toISOString(),
      ),
    );
  }

  cancel(): void {
    this.ensureTransition(['pending', 'active', 'paused'], 'cancelled');
    this.props.status = 'cancelled';
    this.props.completedAt = new Date();
  }

  pullDomainEvents(): Array<WorkflowInitiatedEvent | WorkflowCompletedEvent> {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  private ensureTransition(
    allowedFrom: readonly WorkflowStatus[],
    target: WorkflowStatus,
  ): void {
    if (!allowedFrom.includes(this.props.status)) {
      throw new Error(
        `Invalid workflow transition: ${this.props.status} -> ${target}`,
      );
    }
  }
}
