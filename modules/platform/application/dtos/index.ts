/**
 * platform application contracts and DTOs.
 */

export type PlatformCommandName =
	| "registerPlatformContext"
	| "publishPolicyCatalog"
	| "applyConfigurationProfile"
	| "registerIntegrationContract"
	| "activateSubscriptionAgreement"
	| "fireWorkflowTrigger"
	| "requestNotificationDispatch"
	| "recordAuditSignal"
	| "emitObservabilitySignal";

export type PlatformQueryName =
	| "getPlatformContextView"
	| "listEnabledCapabilities"
	| "getPolicyCatalogView"
	| "getSubscriptionEntitlements"
	| "getWorkflowPolicyView";

export interface PlatformCommand<TName extends PlatformCommandName = PlatformCommandName, TPayload = unknown> {
	name: TName;
	payload: TPayload;
}

export interface PlatformQuery<TName extends PlatformQueryName = PlatformQueryName, TPayload = unknown> {
	name: TName;
	payload: TPayload;
}

export interface PlatformCommandResult {
	ok: boolean;
	code?: string;
	message?: string;
	metadata?: Record<string, unknown>;
}

export interface PlatformContextView {
	contextId: string;
	lifecycleState: string;
	capabilityKeys: string[];
}

export interface PolicyCatalogView {
	contextId: string;
	revision: number;
	permissionRuleCount: number;
	workflowRuleCount: number;
	notificationRuleCount: number;
	auditRuleCount: number;
}

export interface SubscriptionEntitlementsView {
	contextId: string;
	planCode: string;
	entitlements: string[];
	usageLimits: string[];
}

export interface WorkflowPolicyView {
	contextId: string;
	triggerKey: string;
	enabled: boolean;
}

export interface RegisterPlatformContextInput {
	contextId: string;
	subjectScope: string;
}

export interface PublishPolicyCatalogInput {
	contextId: string;
	revision: number;
}

export interface ApplyConfigurationProfileInput {
	contextId: string;
	profileRef: string;
}

export interface RegisterIntegrationContractInput {
	contextId: string;
	integrationContractId: string;
	endpointRef: string;
	protocol: "http" | "webhook" | "queue" | "topic" | "file";
}

export interface ActivateSubscriptionAgreementInput {
	contextId: string;
	subscriptionAgreementId: string;
	planCode: string;
}

export interface FireWorkflowTriggerInput {
	contextId: string;
	triggerKey: string;
	triggeredBy: string;
}

export interface RequestNotificationDispatchInput {
	contextId: string;
	channel: string;
	recipientRef: string;
	templateKey: string;
}

export interface RecordAuditSignalInput {
	contextId: string;
	signalType: string;
	severity: string;
}

export interface EmitObservabilitySignalInput {
	contextId: string;
	signalName: string;
	signalLevel: string;
	sourceRef: string;
}

export interface GetPlatformContextViewInput {
	contextId: string;
}

export interface ListEnabledCapabilitiesInput {
	contextId: string;
}

export interface GetPolicyCatalogViewInput {
	contextId: string;
}

export interface GetSubscriptionEntitlementsInput {
	contextId: string;
}

export interface GetWorkflowPolicyViewInput {
	contextId: string;
	triggerKey: string;
}