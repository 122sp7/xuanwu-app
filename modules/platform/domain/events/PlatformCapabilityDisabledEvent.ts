/**
 * PlatformCapabilityDisabledEvent
 *
 * Event type: "platform.capability-disabled"
 * Owner:      PlatformContext
 *
 * When emitted:
 *   A capability was disabled in a platform scope.
 *
 * Core payload fields:
 *   capabilityKey, reason
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE
 */

// TODO: implement PlatformCapabilityDisabledEvent payload type and factory function
