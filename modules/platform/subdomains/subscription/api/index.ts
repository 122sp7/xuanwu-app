/**
 * Public API boundary for the subscription subdomain.
 */
export * from "../application";
export { subscriptionService } from "../infrastructure";
export type { SubscriptionSnapshot, CreateSubscriptionInput } from "../domain/aggregates/Subscription";
export type { SubscriptionDomainEventType } from "../domain/events/SubscriptionDomainEvent";
export type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";
export type { SubscriptionId } from "../domain/value-objects/SubscriptionId";
export type { PlanCode } from "../domain/value-objects/PlanCode";
export type { SubscriptionStatus } from "../domain/value-objects/SubscriptionStatus";
export type { BillingCycle } from "../domain/value-objects/BillingCycle";
