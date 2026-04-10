import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
  QStashEventBusRepository,
} from "@shared-events";
import type {
  WorkspaceDomainEventPublisher,
  WorkspaceEventPublishMetadata,
} from "../../ports/output/WorkspaceDomainEventPublisher";
import type { WorkspaceDomainEvent } from "../../domain/events/workspace.events";

function toEventPayload(event: WorkspaceDomainEvent) {
  const {
    eventId: _eventId,
    type: _type,
    aggregateId: _aggregateId,
    occurredAt: _occurredAt,
    ...payload
  } = event;

  return payload as Record<string, unknown>;
}

export class SharedWorkspaceDomainEventPublisher
  implements WorkspaceDomainEventPublisher
{
  private readonly publishDomainEventUseCase: PublishDomainEventUseCase;

  constructor() {
    const eventBus = process.env.QSTASH_TOKEN
      ? new QStashEventBusRepository()
      : new NoopEventBusRepository();

    this.publishDomainEventUseCase = new PublishDomainEventUseCase(
      new InMemoryEventStoreRepository(),
      eventBus,
    );
  }

  async publish(
    event: WorkspaceDomainEvent,
    metadata?: WorkspaceEventPublishMetadata,
  ): Promise<void> {
    try {
      await this.publishDomainEventUseCase.execute({
        id: event.eventId,
        eventName: event.type,
        aggregateType: "Workspace",
        aggregateId: event.aggregateId,
        occurredAt: new Date(event.occurredAt),
        payload: toEventPayload(event),
        metadata,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[workspace.events] Failed to publish workspace domain event:", error);
      }
    }
  }
}
