/**
 * modules/shared — infrastructure: SimpleEventBus
 *
 * A minimal in-memory pub/sub bus.  Follows Occam's Razor: the simplest
 * implementation that proves the event-driven flow works end-to-end.
 *
 * Usage:
 *   const bus = new SimpleEventBus();
 *   bus.subscribe("content.block-updated", async (event) => { ... });
 *   await bus.publish(someEvent);
 */

import type { DomainEvent } from "../domain/events";

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

export class SimpleEventBus {
  private readonly handlers = new Map<string, EventHandler[]>();

  /**
   * Subscribe a handler to events of the given type.
   * Multiple handlers for the same type are all called in registration order.
   */
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    const existing = this.handlers.get(eventType) ?? [];
    this.handlers.set(eventType, [...existing, handler as EventHandler]);
  }

  /**
   * Publish an event.  All registered handlers for the event's type are
   * invoked sequentially and awaited.
   */
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const relevant = this.handlers.get(event.type) ?? [];
    for (const handler of relevant) {
      await handler(event);
    }
  }

  /** Remove all subscriptions (useful for test teardown). */
  clear(): void {
    this.handlers.clear();
  }
}
