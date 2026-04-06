/**
 * modules/shared — application: PublishDomainEventUseCase
 * Moved from modules/event/application/use-cases/publish-domain-event.ts.
 *
 * Write-side orchestration for event capture, persistence, and dispatch.
 */
import { EventRecord } from '../domain/event-record';
import type {
  EventRecordPayload,
  EventMetadata,
  IEventBusRepository,
  IEventStoreRepository,
} from '../domain/event-record';

export interface PublishDomainEventDTO {
  id: string;
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  payload: EventRecordPayload;
  metadata?: EventMetadata;
  occurredAt?: Date;
}

export class PublishDomainEventUseCase {
  constructor(
    private readonly eventStore: IEventStoreRepository,
    private readonly eventBus: IEventBusRepository,
  ) {}

  async execute(dto: PublishDomainEventDTO): Promise<EventRecord> {
    const event = new EventRecord(
      dto.id,
      dto.eventName,
      dto.aggregateType,
      dto.aggregateId,
      dto.occurredAt ?? new Date(),
      dto.payload,
      dto.metadata,
    );

    await this.eventStore.save(event);
    await this.eventBus.publish(event);
    event.markDispatched(new Date());
    await this.eventStore.markDispatched(event.id, event.dispatchedAt ?? new Date());

    return event;
  }
}
