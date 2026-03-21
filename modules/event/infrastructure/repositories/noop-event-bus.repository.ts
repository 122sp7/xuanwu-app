/**
 * Module: event
 * Layer: infrastructure/repository
 * Purpose: No-op event bus adapter used by scaffold/tests before real transport integration.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { DomainEvent } from '../../domain/entities/domain-event.entity'
import { IEventBusRepository } from '../../domain/repositories/ievent-bus.repository'

export class NoopEventBusRepository implements IEventBusRepository {
  async publish(_event: DomainEvent): Promise<void> {
    // Skeleton only: replace with actual transport publisher adapter.
  }
}
