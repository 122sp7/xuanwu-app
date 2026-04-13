/**
 * SubscriptionEntitlementsView — Read Model DTO
 *
 * A read-only projection of the current subscription entitlements for a platform scope.
 *
 * Fields:
 *   contextId        — owning platform scope identifier
 *   planCode         — active plan code
 *   entitlements     — list of entitled capability keys
 *   usageLimits      — list of active usage limit descriptors
 *   billingState     — current billing state of the agreement
 *   validUntil       — ISO 8601 timestamp of agreement expiry (null if open-ended)
 *
 * Produced by: GetSubscriptionEntitlementsHandler
 *
 * @see application/handlers/GetSubscriptionEntitlementsHandler.ts
 * @see ports/output/index.ts — SubscriptionAgreementRepository, UsageMeterRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement SubscriptionEntitlementsView DTO interface
