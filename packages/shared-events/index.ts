/**
 * @shared-events — Cross-module event infrastructure primitives.
 *
 * Provides:
 *   - EventRecord entity and repository port interfaces (event store)
 *   - PublishDomainEventUseCase (write-side orchestration)
 *   - InMemoryEventStoreRepository (dev / test adapter)
 *   - NoopEventBusRepository (test / scaffold adapter)
 *   - QStashEventBusRepository (production transport)
 *   - SimpleEventBus (in-process pub/sub)
 */

import type { DomainEvent } from "@shared-types";

// ── EventRecord ───────────────────────────────────────────────────────────────

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  actorId?: string;
  organizationId?: string;
  workspaceId?: string;
  traceId?: string;
}

export interface EventRecordPayload {
  [key: string]: unknown;
}

export class EventRecord {
  constructor(
    public readonly id: string,
    public readonly eventName: string,
    public readonly aggregateType: string,
    public readonly aggregateId: string,
    public readonly occurredAt: Date,
    public readonly payload: EventRecordPayload,
    public readonly metadata: EventMetadata = {},
    public dispatchedAt: Date | null = null,
  ) {
    if (!eventName.trim()) throw new Error("eventName is required");
    if (!aggregateType.trim()) throw new Error("aggregateType is required");
    if (!aggregateId.trim()) throw new Error("aggregateId is required");
  }

  markDispatched(dispatchedAt: Date = new Date()): void {
    this.dispatchedAt = dispatchedAt;
  }

  get isDispatched(): boolean {
    return this.dispatchedAt !== null;
  }
}

// ── Repository ports ──────────────────────────────────────────────────────────

export interface IEventStoreRepository {
  save(event: EventRecord): Promise<void>;
  findById(id: string): Promise<EventRecord | null>;
  findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>;
  findUndispatched(limit: number): Promise<EventRecord[]>;
  markDispatched(id: string, dispatchedAt: Date): Promise<void>;
}

export interface IEventBusRepository {
  publish(event: EventRecord): Promise<void>;
}

// ── PublishDomainEventUseCase ─────────────────────────────────────────────────

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

// ── InMemoryEventStoreRepository ──────────────────────────────────────────────

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

// ── NoopEventBusRepository ────────────────────────────────────────────────────

export class NoopEventBusRepository implements IEventBusRepository {
  async publish(_event: EventRecord): Promise<void> {
    // Intentional no-op: replace with a real transport adapter when needed.
  }
}

// ── QStashEventBusRepository ──────────────────────────────────────────────────

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashEventBusRepository implements IEventBusRepository {
  constructor(
    private readonly destinationUrl: string = process.env.QSTASH_DESTINATION_URL ?? "",
    private readonly token: string = process.env.QSTASH_TOKEN ?? "",
  ) {}

  async publish(event: EventRecord): Promise<void> {
    if (!this.destinationUrl || !this.token) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[QStashEventBus] QSTASH_DESTINATION_URL or QSTASH_TOKEN not set. " +
            `Skipping publish of event '${event.eventName}' (${event.id}).`,
        );
      }
      return;
    }

    const body = JSON.stringify({
      id: event.id,
      eventName: event.eventName,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload,
      metadata: event.metadata,
    });

    const response = await fetch(
      `${QSTASH_ENDPOINT}${encodeURIComponent(this.destinationUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          "Upstash-Retries": "3",
          "Upstash-Delay": "0s",
        },
        body,
      },
    );

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      throw new Error(
        `QStashEventBus: failed to publish event '${event.eventName}'. ` +
          `HTTP ${response.status}: ${text}`,
      );
    }

    event.markDispatched();
  }
}

// ── SimpleEventBus ────────────────────────────────────────────────────────────

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

export class SimpleEventBus {
  private readonly handlers = new Map<string, EventHandler[]>();

  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    const existing = this.handlers.get(eventType) ?? [];
    this.handlers.set(eventType, [...existing, handler as EventHandler]);
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const relevant = this.handlers.get(event.type) ?? [];
    for (const handler of relevant) {
      await handler(event);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
