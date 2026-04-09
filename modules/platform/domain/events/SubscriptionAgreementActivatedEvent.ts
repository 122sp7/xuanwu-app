/**
 * SubscriptionAgreementActivatedEvent
 *
 * Event type: "subscription.agreement_activated"
 * Owner:      SubscriptionAgreement
 *
 * When emitted:
 *   A subscription agreement entered active state.
 *
 * Core payload fields:
 *   subscriptionAgreementId, planCode, validUntil
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE
 */

// TODO: implement SubscriptionAgreementActivatedEvent payload type and factory function
