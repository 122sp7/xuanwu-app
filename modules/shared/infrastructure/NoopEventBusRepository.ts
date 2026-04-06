/**
 * modules/shared — infrastructure: NoopEventBusRepository
 * Moved from modules/event/infrastructure/repositories/noop-event-bus.repository.ts.
 *
 * No-op event bus adapter used in tests and scaffold before a real transport is wired.
 */
import type { EventRecord, IEventBusRepository } from '../domain/event-record';

export class NoopEventBusRepository implements IEventBusRepository {
  async publish(_event: EventRecord): Promise<void> {
    // Intentional no-op: replace with a real transport adapter when needed.
  }
}
