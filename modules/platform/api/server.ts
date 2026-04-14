/**
 * platform — server-only API barrel.
 *
 * Exports that depend on server-only packages (genkit, Firebase Admin, etc.).
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */

import {
  CompositeEventBusRepository,
  InMemoryEventStoreRepository,
  InProcessEventBusRepository,
  QStashEventBusRepository,
  type IEventBusRepository,
  type IEventStoreRepository,
} from "@shared-events";

export interface PlatformEventInfrastructure {
  readonly eventStore: IEventStoreRepository;
  readonly eventBus: IEventBusRepository;
}

/**
 * Creates the canonical server-side event infrastructure owned by platform.
 * Downstream modules should consume this instead of creating local stub buses.
 */
export function createPlatformEventInfrastructure(): PlatformEventInfrastructure {
  const delegates: IEventBusRepository[] = [new InProcessEventBusRepository()];

  if (process.env.QSTASH_TOKEN && process.env.QSTASH_DESTINATION_URL) {
    delegates.push(new QStashEventBusRepository());
  }

  return {
    eventStore: new InMemoryEventStoreRepository(),
    eventBus: new CompositeEventBusRepository(delegates),
  };
}

export { generateAiText, summarize } from "../subdomains/ai/api/server";
