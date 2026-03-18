/**
 * Module: event-core
 * Layer: domain/entity
 * Purpose: Canonical domain event entity for capture, storage, and dispatch.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { EventMetadata } from '../value-objects/event-metadata.vo'

export interface DomainEventPayload {
  [key: string]: unknown
}

export class DomainEvent {
  constructor(
    public readonly id: string,
    public readonly eventName: string,
    public readonly aggregateType: string,
    public readonly aggregateId: string,
    public readonly occurredAt: Date,
    public readonly payload: DomainEventPayload,
    public readonly metadata: EventMetadata = {},
    public dispatchedAt: Date | null = null,
  ) {
    if (!eventName.trim()) {
      throw new Error('eventName is required')
    }

    if (!aggregateType.trim()) {
      throw new Error('aggregateType is required')
    }

    if (!aggregateId.trim()) {
      throw new Error('aggregateId is required')
    }
  }

  markDispatched(dispatchedAt: Date = new Date()): void {
    this.dispatchedAt = dispatchedAt
  }

  get isDispatched(): boolean {
    return this.dispatchedAt !== null
  }
}
