/**
 * platform aggregate placeholder module.
 */

export const PLATFORM_DOMAIN_AGGREGATE_FUNCTIONS = [
	"registerPlatformContext",
	"enablePlatformCapability",
	"disablePlatformCapability",
	"publishPolicyCatalogRevision",
	"registerIntegrationContractAggregate",
	"activateSubscriptionAgreementAggregate",
	"renewSubscriptionAgreementAggregate",
	"cancelSubscriptionAgreementAggregate",
] as const;

export type PlatformDomainAggregateFunction = (typeof PLATFORM_DOMAIN_AGGREGATE_FUNCTIONS)[number];