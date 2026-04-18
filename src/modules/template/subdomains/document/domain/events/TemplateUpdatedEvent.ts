import { TemplateId } from '../value-objects/TemplateId';

/**
 * Domain Event — Emitted when a Template is updated.
 */
export class TemplateUpdatedEvent {
  readonly type = 'template.updated' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    templateId: string;
    changes: Readonly<Record<string, unknown>>;
  }>;

  constructor(
    readonly templateId: TemplateId,
    readonly changes: Readonly<Record<string, unknown>>,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = templateId.toString();
    this.occurredAt = occurredAt;
    this.payload = {
      templateId: this.aggregateId,
      changes,
    };
  }
}
