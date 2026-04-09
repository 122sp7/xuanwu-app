/**
 * platform entity placeholder module.
 */

export const PLATFORM_DOMAIN_ENTITY_FUNCTIONS = [
	"definePolicyRuleEntity",
	"defineSignalSubscriptionEntity",
	"defineDispatchContextEntity",
] as const;

export type PlatformDomainEntityFunction = (typeof PLATFORM_DOMAIN_ENTITY_FUNCTIONS)[number];