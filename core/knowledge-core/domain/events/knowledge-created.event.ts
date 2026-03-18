export class KnowledgeCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}