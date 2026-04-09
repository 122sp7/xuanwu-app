/**
 * SignalSubscriptionEntity — Entity
 *
 * Represents one event type that an IntegrationContract subscribes to receive.
 * Has its own identity (subscriptionId) within the contract.
 *
 * Key attributes:
 *   subscriptionId — unique within its contract
 *   eventType      — PlatformDomainEventType (the event to subscribe to)
 *   filterPredicate — optional payload filter expression
 *   deliveryConfig  — per-subscription delivery overrides (timeout, retry)
 *
 * Invariants:
 *   - eventType must be a recognised PlatformDomainEventType constant
 *   - Only one subscription per eventType per contract is allowed
 *
 * Owned by: IntegrationContract aggregate
 * @see domain/aggregates/IntegrationContract.ts
 * @see domain/events/index.ts — PlatformDomainEventType
 * @see docs/aggregates.md — 子實體與值物件
 */

// TODO: implement SignalSubscriptionEntity interface / class
