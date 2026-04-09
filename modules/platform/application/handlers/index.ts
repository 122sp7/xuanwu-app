/**
 * platform handler placeholder module.
 */

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