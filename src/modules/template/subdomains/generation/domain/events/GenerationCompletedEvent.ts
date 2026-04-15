/**
 * GenerationCompletedEvent — Domain Event
 * Emitted when AI/rule-based template generation completes successfully.
 */
export class GenerationCompletedEvent {
  readonly type = 'template.generation.completed' as const;
  readonly occurredAt = new Date();

  constructor(
    public readonly generationId: string,
    public readonly sourceTemplateId: string,
    public readonly contentLength: number,
  ) {}
}
