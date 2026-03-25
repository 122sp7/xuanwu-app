/**
 * modules/shared — infrastructure: InMemoryEventStoreRepository
 * Moved from modules/event/infrastructure/repositories/in-memory-event-store.repository.ts.
 *
 * In-memory adapter for the event store — used in local development and tests.
 */
import { EventRecord, IEventStoreRepository } from '../domain/event-record';

export class InMemoryEventStoreRepository implements IEventStoreRepository {
  private readonly events = new Map<string, EventRecord>();

  async save(event: EventRecord): Promise<void> {
    this.events.set(event.id, event);
  }

  async findById(id: string): Promise<EventRecord | null> {
    return this.events.get(id) ?? null;
  }

  async findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]> {
    return [...this.events.values()]
      .filter((e) => e.aggregateType === aggregateType && e.aggregateId === aggregateId)
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
  }

  async findUndispatched(limit: number): Promise<EventRecord[]> {
    return [...this.events.values()]
      .filter((e) => !e.isDispatched)
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
      .slice(0, Math.max(limit, 0));
  }

  async markDispatched(id: string, dispatchedAt: Date): Promise<void> {
    const event = this.events.get(id);
    if (event) event.markDispatched(dispatchedAt);
  }
}
