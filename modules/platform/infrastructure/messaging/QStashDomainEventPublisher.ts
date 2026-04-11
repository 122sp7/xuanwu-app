/**
 * QStashDomainEventPublisher — Messaging Adapter (Driven Adapter)
 *
 * Implements: DomainEventPublisher
 * Publishes platform domain events via Upstash QStash.
 */

import type { DomainEventPublisher } from "../../domain/ports/output";
import type { PlatformDomainEvent } from "../../domain/events";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashDomainEventPublisher implements DomainEventPublisher {
	constructor(
		private readonly destinationUrl: string = process.env.QSTASH_DESTINATION_URL ?? "",
		private readonly token: string = process.env.QSTASH_TOKEN ?? "",
	) {}

	async publish(events: PlatformDomainEvent[]): Promise<void> {
		if (events.length === 0) return;

		if (!this.destinationUrl || !this.token) {
			if (process.env.NODE_ENV !== "production") {
				for (const event of events) {
					console.warn(
						`[QStashDomainEventPublisher] QSTASH_DESTINATION_URL or QSTASH_TOKEN not set. ` +
							`Skipping publish of event '${event.type}' (${event.aggregateId}).`,
					);
				}
			}
			return;
		}

		for (const event of events) {
			const body = JSON.stringify(event);
			const dedupeId = `${event.aggregateType}:${event.aggregateId}:${event.occurredAt}`;
			const response = await fetch(
				`${QSTASH_ENDPOINT}${encodeURIComponent(this.destinationUrl)}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${this.token}`,
						"Content-Type": "application/json",
						"Upstash-Retries": "3",
						"Upstash-Deduplication-Id": dedupeId,
					},
					body,
				},
			);
			if (!response.ok) {
				const text = await response.text().catch(() => response.statusText);
				throw new Error(
					`QStashDomainEventPublisher: failed to publish '${event.type}'. ` +
						`HTTP ${response.status}: ${text}`,
				);
			}
		}
	}
}
