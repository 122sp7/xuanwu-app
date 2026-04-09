/**
 * platform domain event language.
 */

export interface PlatformDomainEvent<TPayload = Record<string, unknown>> {
	type: string;
	aggregateType: string;
	aggregateId: string;
	contextId: string;
	occurredAt: string;
	version: number;
	correlationId?: string;
	causationId?: string;
	actorId?: string;
	payload: TPayload;
}

export const PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE = "platform.context_registered" as const;
export const POLICY_CATALOG_PUBLISHED_EVENT_TYPE = "policy.catalog_published" as const;
export const INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE = "integration.contract_registered" as const;
export const SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE = "subscription.agreement_activated" as const;
export const WORKFLOW_TRIGGER_FIRED_EVENT_TYPE = "workflow.trigger_fired" as const;
export const NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE = "notification.dispatch_requested" as const;
export const AUDIT_SIGNAL_RECORDED_EVENT_TYPE = "audit.signal_recorded" as const;
export const OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE = "observability.signal_emitted" as const;