/**
 * PlatformContextRegisteredEvent
 *
 * Event type: "platform.context-registered"
 * Owner:      PlatformContext
 *
 * When emitted:
 *   Platform scope creation is complete.
 *
 * Core payload fields:
 *   subjectScope, lifecycleState
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE
 */

// TODO: implement PlatformContextRegisteredEvent payload type and factory function
