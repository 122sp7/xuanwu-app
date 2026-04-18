import { TemplateId } from '../value-objects/TemplateId';

/**
 * Domain Event — Emitted when a Template is created.
 */
export class TemplateCreatedEvent {
  readonly type = 'template.created' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    templateId: string;
    name: string;
  }>;

  constructor(
    readonly templateId: TemplateId,
    readonly name: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = templateId.toString();
    this.occurredAt = occurredAt;
    this.payload = {
      templateId: this.aggregateId,
      name,
    };
  }
}
