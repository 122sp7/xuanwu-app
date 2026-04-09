/**
 * PlatformCapabilityEnabledEvent
 *
 * Event type: "platform.capability_enabled"
 * Owner:      PlatformContext
 *
 * When emitted:
 *   A capability was enabled in a platform scope.
 *
 * Core payload fields:
 *   capabilityKey, entitlementRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE
 */

// TODO: implement PlatformCapabilityEnabledEvent payload type and factory function
