/**
 * platform domain factory placeholder module.
 */

export const PLATFORM_DOMAIN_FACTORY_FUNCTIONS = [
	"createPlatformContextAggregate",
	"createPolicyCatalogAggregate",
	"createIntegrationContractAggregate",
	"createSubscriptionAgreementAggregate",
] as const;

export type PlatformDomainFactoryFunction = (typeof PLATFORM_DOMAIN_FACTORY_FUNCTIONS)[number];