/**
 * platform shared value-object derivation inventory.
 */

export const PLATFORM_SHARED_VALUE_OBJECT_TYPES = [
	"PlatformContextId",
	"PolicyCatalogId",
	"IntegrationContractId",
	"SubscriptionAgreementId",
	"PlatformLifecycleState",
	"ContractState",
	"BillingState",
	"EffectivePeriod",
	"EndpointRef",
	"SecretReference",
] as const;

export type PlatformSharedValueObjectType = (typeof PLATFORM_SHARED_VALUE_OBJECT_TYPES)[number];

export const PLATFORM_SHARED_VALUE_OBJECT_FACTORIES = [
	"createPlatformContextId",
	"createPolicyCatalogId",
	"createIntegrationContractId",
	"createSubscriptionAgreementId",
	"createPlatformLifecycleState",
	"createContractState",
	"createBillingState",
	"createEffectivePeriod",
	"createEndpointRef",
	"createSecretReference",
] as const;

export type PlatformSharedValueObjectFactory = (typeof PLATFORM_SHARED_VALUE_OBJECT_FACTORIES)[number];