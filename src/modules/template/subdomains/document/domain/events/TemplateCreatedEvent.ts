import { TemplateId } from '../value-objects/TemplateId';

/**
 * Domain Event — Emitted when a Template is created.
 */
export class TemplateCreatedEvent {
  readonly type = 'template.created' as const;
  readonly occurredAt: Date;

  constructor(
    readonly templateId: TemplateId,
    readonly name: string,
    occurredAt: Date = new Date(),
  ) {
    this.occurredAt = occurredAt;
  }
}
