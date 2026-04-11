/**
 * platform application use-cases barrel.
 *
 * Consolidates commands, queries, handlers, and shared utilities
 * previously split across separate commands/, queries/, handlers/, utils/ directories.
 */

// ── Commands ──────────────────────────────────────────────────────────────────

export const PLATFORM_APPLICATION_COMMANDS = [
	"RegisterPlatformContext",
	"PublishPolicyCatalog",
	"ApplyConfigurationProfile",
	"RegisterIntegrationContract",
	"ActivateSubscriptionAgreement",
	"FireWorkflowTrigger",
	"RequestNotificationDispatch",
	"RecordAuditSignal",
	"EmitObservabilitySignal",
] as const;

export type PlatformApplicationCommand = (typeof PLATFORM_APPLICATION_COMMANDS)[number];

// ── Queries ───────────────────────────────────────────────────────────────────

export const PLATFORM_APPLICATION_QUERIES = [
	"GetPlatformContextView",
	"ListEnabledCapabilities",
	"GetPolicyCatalogView",
	"GetSubscriptionEntitlements",
	"GetWorkflowPolicyView",
] as const;

export type PlatformApplicationQuery = (typeof PLATFORM_APPLICATION_QUERIES)[number];

// ── Handlers ──────────────────────────────────────────────────────────────────

export const PLATFORM_APPLICATION_HANDLERS = [
	"RegisterPlatformContextHandler.execute",
	"PublishPolicyCatalogHandler.execute",
	"ApplyConfigurationProfileHandler.execute",
	"RegisterIntegrationContractHandler.execute",
	"ActivateSubscriptionAgreementHandler.execute",
	"FireWorkflowTriggerHandler.execute",
	"RequestNotificationDispatchHandler.execute",
	"RecordAuditSignalHandler.execute",
	"EmitObservabilitySignalHandler.execute",
	"GetPlatformContextViewHandler.execute",
	"ListEnabledCapabilitiesHandler.execute",
	"GetPolicyCatalogViewHandler.execute",
	"GetSubscriptionEntitlementsHandler.execute",
	"GetWorkflowPolicyViewHandler.execute",
] as const;

export type PlatformApplicationHandler = (typeof PLATFORM_APPLICATION_HANDLERS)[number];

// ── Shared utilities ──────────────────────────────────────────────────────────

export const PLATFORM_SHARED_UTILITY_FUNCTIONS = [
	"buildCorrelationId",
	"buildCausationId",
	"toIsoTimestamp",
	"assertNever",
] as const;

export type PlatformSharedUtilityFunction =
	(typeof PLATFORM_SHARED_UTILITY_FUNCTIONS)[number];
