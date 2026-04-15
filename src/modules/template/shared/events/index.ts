// shared/events — cross-subdomain Published Language events
// These are integration events emitted at the module boundary for other
// bounded contexts to consume. Do NOT mix these with subdomain-local
// domain events (those live in subdomains/*/domain/events/).

export type TemplateModuleEventType =
  | 'template.created'
  | 'template.updated'
  | 'template.deleted'
  | 'template.generation.completed'
  | 'template.ingestion.completed'
  | 'template.workflow.completed';

export interface TemplateModuleEvent<
  T extends TemplateModuleEventType = TemplateModuleEventType,
  P = unknown,
> {
  type: T;
  templateId: string;
  occurredAt: Date;
  payload?: P;
}
