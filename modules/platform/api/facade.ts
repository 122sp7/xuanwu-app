/**
 * platform API facade.
 */

import type {
	ActivateSubscriptionAgreementInput,
	ApplyConfigurationProfileInput,
	EmitObservabilitySignalInput,
	FireWorkflowTriggerInput,
	GetPlatformContextViewInput,
	GetPolicyCatalogViewInput,
	GetSubscriptionEntitlementsInput,
	GetWorkflowPolicyViewInput,
	ListEnabledCapabilitiesInput,
	PlatformCommandResult,
	PlatformContextView,
	PolicyCatalogView,
	PublishPolicyCatalogInput,
	RecordAuditSignalInput,
	RegisterIntegrationContractInput,
	RegisterPlatformContextInput,
	RequestNotificationDispatchInput,
	SubscriptionEntitlementsView,
	WorkflowPolicyView,
} from "./contracts";
import type { PlatformCommandPort, PlatformQueryPort } from "../domain/ports/input";

export interface PlatformFacade {
	registerPlatformContext(input: RegisterPlatformContextInput): Promise<PlatformCommandResult>;
	publishPolicyCatalog(input: PublishPolicyCatalogInput): Promise<PlatformCommandResult>;
	applyConfigurationProfile(input: ApplyConfigurationProfileInput): Promise<PlatformCommandResult>;
	registerIntegrationContract(input: RegisterIntegrationContractInput): Promise<PlatformCommandResult>;
	activateSubscriptionAgreement(input: ActivateSubscriptionAgreementInput): Promise<PlatformCommandResult>;
	fireWorkflowTrigger(input: FireWorkflowTriggerInput): Promise<PlatformCommandResult>;
	requestNotificationDispatch(input: RequestNotificationDispatchInput): Promise<PlatformCommandResult>;
	recordAuditSignal(input: RecordAuditSignalInput): Promise<PlatformCommandResult>;
	emitObservabilitySignal(input: EmitObservabilitySignalInput): Promise<PlatformCommandResult>;
	getPlatformContextView(input: GetPlatformContextViewInput): Promise<PlatformContextView>;
	listEnabledCapabilities(input: ListEnabledCapabilitiesInput): Promise<string[]>;
	getPolicyCatalogView(input: GetPolicyCatalogViewInput): Promise<PolicyCatalogView>;
	getSubscriptionEntitlements(input: GetSubscriptionEntitlementsInput): Promise<SubscriptionEntitlementsView>;
	getWorkflowPolicyView(input: GetWorkflowPolicyViewInput): Promise<WorkflowPolicyView>;
}

export function createPlatformFacade(ports: {
	commandPort: PlatformCommandPort;
	queryPort: PlatformQueryPort;
}): PlatformFacade {
	const { commandPort, queryPort } = ports;

	return {
		registerPlatformContext(input) {
			return commandPort.executeCommand({ name: "registerPlatformContext", payload: input });
		},
		publishPolicyCatalog(input) {
			return commandPort.executeCommand({ name: "publishPolicyCatalog", payload: input });
		},
		applyConfigurationProfile(input) {
			return commandPort.executeCommand({ name: "applyConfigurationProfile", payload: input });
		},
		registerIntegrationContract(input) {
			return commandPort.executeCommand({ name: "registerIntegrationContract", payload: input });
		},
		activateSubscriptionAgreement(input) {
			return commandPort.executeCommand({ name: "activateSubscriptionAgreement", payload: input });
		},
		fireWorkflowTrigger(input) {
			return commandPort.executeCommand({ name: "fireWorkflowTrigger", payload: input });
		},
		requestNotificationDispatch(input) {
			return commandPort.executeCommand({ name: "requestNotificationDispatch", payload: input });
		},
		recordAuditSignal(input) {
			return commandPort.executeCommand({ name: "recordAuditSignal", payload: input });
		},
		emitObservabilitySignal(input) {
			return commandPort.executeCommand({ name: "emitObservabilitySignal", payload: input });
		},
		getPlatformContextView(input) {
			return queryPort.executeQuery({ name: "getPlatformContextView", payload: input });
		},
		listEnabledCapabilities(input) {
			return queryPort.executeQuery({ name: "listEnabledCapabilities", payload: input });
		},
		getPolicyCatalogView(input) {
			return queryPort.executeQuery({ name: "getPolicyCatalogView", payload: input });
		},
		getSubscriptionEntitlements(input) {
			return queryPort.executeQuery({ name: "getSubscriptionEntitlements", payload: input });
		},
		getWorkflowPolicyView(input) {
			return queryPort.executeQuery({ name: "getWorkflowPolicyView", payload: input });
		},
	};
}