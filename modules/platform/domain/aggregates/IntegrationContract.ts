/**
 * IntegrationContract — Aggregate Root
 *
 * Manages the endpoint, communication protocol, authentication reference, and
 * delivery policy required when the platform interacts with an external system.
 * Defines the business-facing integration language but does not execute external calls directly.
 *
 * Key attributes:
 *   integrationContractId — IntegrationContractId
 *   contextId             — PlatformContextId (owning platform scope)
 *   endpointRef           — EndpointRef (external endpoint reference)
 *   protocol              — IntegrationProtocol (http | webhook | queue | topic | file)
 *   authenticationRef     — SecretReference (authentication reference)
 *   subscribedSignals     — SignalSubscription[] (signals the external system needs)
 *   deliveryPolicy        — DeliveryPolicy (retry / timeout / idempotency strategy)
 *   contractState         — ContractState (draft | active | paused | revoked)
 *
 * Invariants:
 *   - An active contract must have endpoint and authentication reference
 *   - Async delivery must define a retry/timeout policy
 *   - Subscribed signals must correspond to events in the platform published language
 *
 * Emits:
 *   integration.contract_registered
 *   integration.delivery_failed
 *
 * @see docs/aggregates.md — 聚合根：IntegrationContract
 * @see docs/domain-events.md
 */

// TODO: implement IntegrationContract aggregate root class
