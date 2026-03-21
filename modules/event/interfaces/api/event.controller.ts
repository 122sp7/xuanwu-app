/**
 * Module: event
 * Layer: interfaces/api
 * Purpose: Transport/controller facade delegating all actions to application use-cases.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import {
  ListEventsByAggregateDTO,
  ListEventsByAggregateUseCase,
} from '../../application/use-cases/list-events-by-aggregate'
import {
  PublishDomainEventDTO,
  PublishDomainEventUseCase,
} from '../../application/use-cases/publish-domain-event'

export class EventController {
  constructor(
    private readonly publishDomainEvent: PublishDomainEventUseCase,
    private readonly listEventsByAggregate: ListEventsByAggregateUseCase,
  ) {}

  async publish(input: PublishDomainEventDTO) {
    return this.publishDomainEvent.execute(input)
  }

  async listByAggregate(input: ListEventsByAggregateDTO) {
    return this.listEventsByAggregate.execute(input)
  }
}
