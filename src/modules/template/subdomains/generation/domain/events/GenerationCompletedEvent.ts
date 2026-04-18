/**
 * GenerationCompletedEvent — Domain Event
 * Emitted when AI/rule-based template generation completes successfully.
 */
export class GenerationCompletedEvent {
  readonly type = 'template.generation.completed' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    generationId: string;
    sourceTemplateId: string;
    contentLength: number;
  }>;

  constructor(
    public readonly generationId: string,
    public readonly sourceTemplateId: string,
    public readonly contentLength: number,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = generationId;
    this.occurredAt = occurredAt;
    this.payload = {
      generationId,
      sourceTemplateId,
      contentLength,
    };
  }
}
