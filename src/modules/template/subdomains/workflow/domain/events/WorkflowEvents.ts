/**
 * WorkflowInitiatedEvent — Domain Event
 * Raised when a TemplateWorkflow is successfully created.
 */
export class WorkflowInitiatedEvent {
  readonly type = 'template.workflow_initiated' as const;
  readonly occurredAt = new Date();

  constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
  ) {}
}

/**
 * WorkflowCompletedEvent — Domain Event
 * Raised when a TemplateWorkflow reaches the 'completed' status.
 */
export class WorkflowCompletedEvent {
  readonly type = 'template.workflow_completed' as const;
  readonly occurredAt = new Date();

  constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
    public readonly completedAt: Date,
  ) {}
}
