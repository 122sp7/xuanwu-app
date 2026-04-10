/**
 * platform input ports.
 */

import type { PlatformDomainEvent } from "../../events";

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

export interface PlatformCommandPort {
	executeCommand<TCommand extends PlatformCommand>(command: TCommand): Promise<PlatformCommandResult>;
}

export interface PlatformQueryPort {
	executeQuery<TResult, TQuery extends PlatformQuery>(query: TQuery): Promise<TResult>;
}

export interface PlatformEventIngressPort {
	ingestEvent(event: PlatformDomainEvent): Promise<void>;
}
