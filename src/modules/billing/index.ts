/**
 * Billing Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// entitlement
export { EntitlementGrant } from "./subdomains/entitlement/domain/entities/EntitlementGrant";
export type {
  EntitlementGrantSnapshot,
  CreateEntitlementGrantInput,
} from "./subdomains/entitlement/domain/entities/EntitlementGrant";
export type { EntitlementStatus } from "./subdomains/entitlement/domain/value-objects/EntitlementStatus";
export type { FeatureKey } from "./subdomains/entitlement/domain/value-objects/FeatureKey";
export type { EntitlementGrantRepository } from "./subdomains/entitlement/domain/repositories/EntitlementGrantRepository";
export {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
} from "./subdomains/entitlement/application/use-cases/EntitlementUseCases";
export { FirestoreEntitlementGrantRepository } from "./subdomains/entitlement/adapters/outbound/firestore/FirestoreEntitlementGrantRepository";

// subscription
export { Subscription } from "./subdomains/subscription/domain/entities/Subscription";
export type {
  SubscriptionSnapshot,
  CreateSubscriptionInput,
} from "./subdomains/subscription/domain/entities/Subscription";
export type { SubscriptionStatus } from "./subdomains/subscription/domain/value-objects/SubscriptionStatus";
export type { BillingCycle } from "./subdomains/subscription/domain/value-objects/BillingCycle";
export type { PlanCode } from "./subdomains/subscription/domain/value-objects/PlanCode";
export type { SubscriptionRepository } from "./subdomains/subscription/domain/repositories/SubscriptionRepository";
export {
  ActivateSubscriptionUseCase,
  CancelSubscriptionUseCase,
  RenewSubscriptionUseCase,
} from "./subdomains/subscription/application/use-cases/SubscriptionUseCases";
export { FirestoreSubscriptionRepository } from "./subdomains/subscription/adapters/outbound/firestore/FirestoreSubscriptionRepository";

// usage-metering
export { UsageRecord } from "./subdomains/usage-metering/domain/entities/UsageRecord";
export type {
  UsageRecordSnapshot,
  RecordUsageInput,
  UsageUnit,
  UsageRecordId,
} from "./subdomains/usage-metering/domain/entities/UsageRecord";
export type { UsageRecordRepository, UsageQuery } from "./subdomains/usage-metering/domain/repositories/UsageRecordRepository";
export {
  RecordUsageUseCase,
  QueryUsageUseCase,
  GetUsageSummaryUseCase,
} from "./subdomains/usage-metering/application/use-cases/UsageMeteringUseCases";
export { InMemoryUsageRecordRepository } from "./subdomains/usage-metering/adapters/outbound/memory/InMemoryUsageRecordRepository";
