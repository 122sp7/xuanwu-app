/**
 * OnboardingFlowCompletedEvent
 *
 * Event type: "onboarding.flow-completed"
 * Owner:      application layer (onboarding)
 *
 * When emitted:
 *   A new subject completed the primary onboarding flow.
 *
 * Core payload fields:
 *   onboardingId, subjectRef, completedSteps
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: ONBOARDING_FLOW_COMPLETED_EVENT_TYPE
 */

// TODO: implement OnboardingFlowCompletedEvent payload type and factory function
