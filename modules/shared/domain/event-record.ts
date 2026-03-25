/**
 * modules/shared — domain: event store primitives
 * Moved from modules/event/domain/* during event module decomposition.
 *
 * NOTE: `EventRecord` is the rich event-store entity (id, eventName, payload, etc.).
 * It is distinct from the lightweight `DomainEvent` bus-message interface
 * already in modules/shared/domain/events.ts.
 */

// ── Metadata value object ─────────────────────────────────────────────────────

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  actorId?: string;
  organizationId?: string;
  workspaceId?: string;
  traceId?: string;
}

// ── Payload ───────────────────────────────────────────────────────────────────

export interface EventRecordPayload {
  [key: string]: unknown;
}

// ── Entity ────────────────────────────────────────────────────────────────────

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
    if (!eventName.trim()) throw new Error('eventName is required');
    if (!aggregateType.trim()) throw new Error('aggregateType is required');
    if (!aggregateId.trim()) throw new Error('aggregateId is required');
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
