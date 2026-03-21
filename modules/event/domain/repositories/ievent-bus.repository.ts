/**
 * Module: event
 * Layer: domain/port
 * Purpose: Dispatch contract for publishing domain events to transport channels.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { DomainEvent } from '../entities/domain-event.entity'

export interface IEventBusRepository {
  publish(event: DomainEvent): Promise<void>
}
