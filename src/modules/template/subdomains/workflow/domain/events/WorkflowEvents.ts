/**
 * WorkflowInitiatedEvent — Domain Event
 * Raised when a TemplateWorkflow is successfully created.
 */
export class WorkflowInitiatedEvent {
  readonly type = 'template.workflow.initiated' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    workflowId: string;
    templateId: string;
  }>;

  constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = workflowId;
    this.occurredAt = occurredAt;
    this.payload = {
      workflowId,
      templateId,
    };
  }
}

/**
 * WorkflowCompletedEvent — Domain Event
 * Raised when a TemplateWorkflow reaches the 'completed' status.
 */
export class WorkflowCompletedEvent {
  readonly type = 'template.workflow.completed' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    workflowId: string;
    templateId: string;
    completedAt: string;
  }>;

  constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
    public readonly completedAt: string = new Date().toISOString(),
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = workflowId;
    this.occurredAt = occurredAt;
    this.payload = {
      workflowId,
      templateId,
      completedAt,
    };
  }
}
