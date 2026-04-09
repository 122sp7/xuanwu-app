/**
 * platform domain service placeholder module.
 */

export const PLATFORM_DOMAIN_SERVICE_FUNCTIONS = [
	"evaluateCapabilityEntitlement",
	"resolvePermissionDecision",
	"composeConfigurationProfile",
	"validateIntegrationCompatibility",
	"decideWorkflowDispatch",
	"decideNotificationRouting",
	"classifyAuditSignal",
	"correlateObservabilitySignal",
] as const;

export type PlatformDomainServiceFunction = (typeof PLATFORM_DOMAIN_SERVICE_FUNCTIONS)[number];