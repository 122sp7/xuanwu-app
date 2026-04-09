/**
 * IntegrationDeliveryFailedEvent
 *
 * Event type: "integration.delivery_failed"
 * Owner:      IntegrationContract
 *
 * When emitted:
 *   An external delivery attempt failed.
 *
 * Core payload fields:
 *   integrationContractId, deliveryAttempt, failureCode
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: INTEGRATION_DELIVERY_FAILED_EVENT_TYPE
 */

// TODO: implement IntegrationDeliveryFailedEvent payload type and factory function
