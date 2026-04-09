/**
 * platform query models placeholder module.
 */

export const PLATFORM_APPLICATION_QUERIES = [
	"GetPlatformContextView",
	"ListEnabledCapabilities",
	"GetPolicyCatalogView",
	"GetSubscriptionEntitlements",
	"GetWorkflowPolicyView",
] as const;

export type PlatformApplicationQuery = (typeof PLATFORM_APPLICATION_QUERIES)[number];