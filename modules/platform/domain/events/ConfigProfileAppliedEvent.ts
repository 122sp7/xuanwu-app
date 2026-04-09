/**
 * ConfigProfileAppliedEvent
 *
 * Event type: "config.profile_applied"
 * Owner:      PlatformContext (orchestration)
 *
 * When emitted:
 *   A configuration profile was successfully applied.
 *
 * Core payload fields:
 *   configurationProfileRef, changedKeys
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: CONFIG_PROFILE_APPLIED_EVENT_TYPE
 */

// TODO: implement ConfigProfileAppliedEvent payload type and factory function
