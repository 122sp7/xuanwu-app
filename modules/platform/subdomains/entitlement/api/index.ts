/**
 * Public API boundary for the entitlement subdomain.
 * Cross-module consumers must import through this entry point.
 */
export * from "../application";
export { entitlementService } from "../infrastructure";
export type {
  EntitlementGrantSnapshot,
  CreateEntitlementGrantInput,
} from "../domain/aggregates/EntitlementGrant";
export type { EntitlementGrantDomainEventType } from "../domain/events/EntitlementGrantDomainEvent";
export type { EntitlementGrantRepository } from "../domain/repositories/EntitlementGrantRepository";
export type { EntitlementStatus } from "../domain/value-objects/EntitlementStatus";
export type { FeatureKey } from "../domain/value-objects/FeatureKey";
