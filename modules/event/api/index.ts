/**
 * Module: event
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Event domain.
 *
 * Other modules use this boundary to publish and subscribe to domain events.
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity ──────────────────────────────────────────────────────────────

export { DomainEvent } from "../domain/entities/domain-event.entity";
export type { DomainEventPayload } from "../domain/entities/domain-event.entity";

// ─── Domain ports ─────────────────────────────────────────────────────────────

export type { IEventBusRepository } from "../domain/repositories/ievent-bus.repository";
export type { IEventStoreRepository } from "../domain/repositories/ievent-store.repository";

// ─── Value objects ────────────────────────────────────────────────────────────

export type { EventMetadata } from "../domain/value-objects/event-metadata.vo";

// ─── Use cases ────────────────────────────────────────────────────────────────

export { PublishDomainEventUseCase } from "../application/use-cases/publish-domain-event";
export type { PublishDomainEventDTO } from "../application/use-cases/publish-domain-event";
