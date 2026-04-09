/**
 * platform command models placeholder module.
 */

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