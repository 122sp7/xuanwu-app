/**
 * Module: event
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for event store contract in local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { DomainEvent } from '../../domain/entities/domain-event.entity'
import { IEventStoreRepository } from '../../domain/repositories/ievent-store.repository'

export class InMemoryEventStoreRepository implements IEventStoreRepository {
  private readonly events = new Map<string, DomainEvent>()

  async save(event: DomainEvent): Promise<void> {
    this.events.set(event.id, event)
  }

  async findById(id: string): Promise<DomainEvent | null> {
    return this.events.get(id) ?? null
  }

  async findByAggregate(aggregateType: string, aggregateId: string): Promise<DomainEvent[]> {
    return [...this.events.values()]
      .filter((event) => event.aggregateType === aggregateType && event.aggregateId === aggregateId)
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
  }

  async findUndispatched(limit: number): Promise<DomainEvent[]> {
    return [...this.events.values()]
      .filter((event) => !event.isDispatched)
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
      .slice(0, Math.max(limit, 0))
  }

  async markDispatched(id: string, dispatchedAt: Date): Promise<void> {
    const event = this.events.get(id)
    if (!event) {
      return
    }

    event.markDispatched(dispatchedAt)
  }
}
