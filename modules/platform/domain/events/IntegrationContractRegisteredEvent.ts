/**
 * IntegrationContractRegisteredEvent
 *
 * Event type: "integration.contract_registered"
 * Owner:      IntegrationContract
 *
 * When emitted:
 *   An integration contract became active or was updated.
 *
 * Core payload fields:
 *   integrationContractId, protocol, endpointRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE
 */

// TODO: implement IntegrationContractRegisteredEvent payload type and factory function
