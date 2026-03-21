/**
 * Module: event
 * Layer: application/use-case
 * Purpose: Write-side orchestration for event capture, persistence, and dispatch.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { DomainEvent, DomainEventPayload } from '../../domain/entities/domain-event.entity'
import { IEventBusRepository } from '../../domain/repositories/ievent-bus.repository'
import { IEventStoreRepository } from '../../domain/repositories/ievent-store.repository'
import { EventMetadata } from '../../domain/value-objects/event-metadata.vo'

export interface PublishDomainEventDTO {
  id: string
  eventName: string
  aggregateType: string
  aggregateId: string
  payload: DomainEventPayload
  metadata?: EventMetadata
  occurredAt?: Date
}

export class PublishDomainEventUseCase {
  constructor(
    private readonly eventStore: IEventStoreRepository,
    private readonly eventBus: IEventBusRepository,
  ) {}

  async execute(dto: PublishDomainEventDTO): Promise<DomainEvent> {
    const event = new DomainEvent(
      dto.id,
      dto.eventName,
      dto.aggregateType,
      dto.aggregateId,
      dto.occurredAt ?? new Date(),
      dto.payload,
      dto.metadata,
    )

    await this.eventStore.save(event)

    // Skeleton only: production path should include retries/backoff/outbox strategy.
    await this.eventBus.publish(event)
    event.markDispatched(new Date())
    await this.eventStore.markDispatched(event.id, event.dispatchedAt ?? new Date())

    return event
  }
}
