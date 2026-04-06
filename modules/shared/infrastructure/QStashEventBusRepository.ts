/**
 * modules/shared — infrastructure: QStashEventBusRepository
 *
 * Publishes domain events to Upstash QStash using the REST API over native fetch.
 * No extra npm dependency required — uses the standard Web Fetch API available
 * in Node 18+ and Next.js edge/server runtimes.
 *
 * Required environment variables (set in .env.local or hosting config):
 *   QSTASH_URL    — target URL QStash will deliver to  (e.g. https://your-app.com/api/events/ingest)
 *   QSTASH_TOKEN  — Upstash QStash token  (starts with "qstash_")
 *
 * When env vars are absent the adapter logs a warning and silently skips publishing
 * (preserves NoopEventBus behaviour so the app does not crash in local dev without
 * QStash configured).
 */

import type { EventRecord, IEventBusRepository } from "../domain/event-record";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashEventBusRepository implements IEventBusRepository {
  constructor(
    private readonly destinationUrl: string = process.env.QSTASH_DESTINATION_URL ?? "",
    private readonly token: string = process.env.QSTASH_TOKEN ?? "",
  ) {}

  async publish(event: EventRecord): Promise<void> {
    if (!this.destinationUrl || !this.token) {
      // Not yet configured — degrade gracefully (same as Noop).
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

    const response = await fetch(`${QSTASH_ENDPOINT}${encodeURIComponent(this.destinationUrl)}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "Upstash-Retries": "3",
        "Upstash-Delay": "0s",
      },
      body,
    });

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
