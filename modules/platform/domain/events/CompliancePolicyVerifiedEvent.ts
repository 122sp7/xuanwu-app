/**
 * CompliancePolicyVerifiedEvent
 *
 * Event type: "compliance.policy_verified"
 * Owner:      application layer (compliance)
 *
 * When emitted:
 *   A compliance policy check passed or was updated.
 *
 * Core payload fields:
 *   policyRef, verificationResult, effectivePeriod
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE
 */

// TODO: implement CompliancePolicyVerifiedEvent payload type and factory function
