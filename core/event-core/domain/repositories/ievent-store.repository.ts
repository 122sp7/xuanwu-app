/**
 * Module: event-core
 * Layer: domain/port
 * Purpose: Source-of-truth persistence contract for domain events.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { DomainEvent } from '../entities/domain-event.entity'

export interface IEventStoreRepository {
  save(event: DomainEvent): Promise<void>
  findById(id: string): Promise<DomainEvent | null>
  findByAggregate(aggregateType: string, aggregateId: string): Promise<DomainEvent[]>
  findUndispatched(limit: number): Promise<DomainEvent[]>
  markDispatched(id: string, dispatchedAt: Date): Promise<void>
}
