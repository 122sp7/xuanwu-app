/**
 * platform domain value-object derivation inventory.
 */

export const PLATFORM_DOMAIN_VALUE_OBJECT_TYPES = [
	"PlatformCapability",
	"SubjectScope",
	"PolicyRule",
	"ConfigurationProfileRef",
	"Entitlement",
	"UsageLimit",
	"SignalSubscription",
	"DeliveryPolicy",
	"NotificationRoute",
	"ObservabilitySignal",
	"PermissionDecision",
	"AuditClassification",
	"PlanConstraint",
	"DeliveryAllowance",
	"BillingState",
	"ContractState",
	"EffectivePeriod",
	"EndpointRef",
	"IntegrationContractId",
	"PlatformContextId",
	"PlatformLifecycleState",
	"PolicyCatalogId",
	"SecretReference",
	"SubscriptionAgreementId",
] as const;

export type PlatformDomainValueObjectType = (typeof PLATFORM_DOMAIN_VALUE_OBJECT_TYPES)[number];

export const PLATFORM_DOMAIN_VALUE_OBJECT_FACTORY_FUNCTIONS = [
	"createPlatformCapability",
	"createSubjectScope",
	"createPolicyRule",
	"createConfigurationProfileRef",
	"createEntitlement",
	"createUsageLimit",
	"createSignalSubscription",
	"createDeliveryPolicy",
	"createNotificationRoute",
	"createObservabilitySignal",
	"createPermissionDecision",
	"createAuditClassification",
	"createPlanConstraint",
	"createDeliveryAllowance",
] as const;

export type PlatformDomainValueObjectFactoryFunction =
	(typeof PLATFORM_DOMAIN_VALUE_OBJECT_FACTORY_FUNCTIONS)[number];