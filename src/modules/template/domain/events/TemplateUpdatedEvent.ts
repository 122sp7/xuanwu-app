import { TemplateId } from '../value-objects/TemplateId';

/**
 * Domain Event — Emitted when a Template is updated.
 */
export class TemplateUpdatedEvent {
  readonly type = 'template.updated' as const;
  readonly occurredAt: Date;

  constructor(
    readonly templateId: TemplateId,
    readonly changes: Readonly<Record<string, unknown>>,
    occurredAt: Date = new Date(),
  ) {
    this.occurredAt = occurredAt;
  }
}
