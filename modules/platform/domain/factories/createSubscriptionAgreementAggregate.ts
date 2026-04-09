/**
 * createSubscriptionAgreementAggregate — Domain Factory
 *
 * Constructs a new SubscriptionAgreement aggregate root from validated input.
 *
 * Responsibility:
 *   - Derive Entitlement[] from planCode (must not deviate from plan definition)
 *   - Set initial billingState to "pending"
 *   - Stamp SubscriptionAgreementActivatedEvent into the aggregate's event queue
 *     once activation conditions are confirmed
 *
 * Used by: ActivateSubscriptionAgreementHandler (application layer)
 *
 * @see domain/aggregates/SubscriptionAgreement.ts
 * @see docs/aggregates.md — 聚合根工廠
 */

// TODO: implement createSubscriptionAgreementAggregate factory function
