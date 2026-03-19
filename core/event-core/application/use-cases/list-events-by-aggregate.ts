/**
 * Module: event-core
 * Layer: application/use-case
 * Purpose: Read-side orchestration for aggregate event timeline retrieval.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { DomainEvent } from '../../domain/entities/domain-event.entity'
import { IEventStoreRepository } from '../../domain/repositories/ievent-store.repository'

export interface ListEventsByAggregateDTO {
  aggregateType: string
  aggregateId: string
}

export class ListEventsByAggregateUseCase {
  constructor(private readonly eventStore: IEventStoreRepository) {}

  async execute(dto: ListEventsByAggregateDTO): Promise<DomainEvent[]> {
    return this.eventStore.findByAggregate(dto.aggregateType, dto.aggregateId)
  }
}
