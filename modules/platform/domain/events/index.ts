/**
 * platform domain event language.
 *
 * Single source of truth for all platform event type constants.
 * events/contracts re-exports from here; do not define event types elsewhere.
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

// ─── PlatformContext aggregate events ────────────────────────────────────────
export const PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE = "platform.context-registered" as const;
export const PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE = "platform.capability-enabled" as const;
export const PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE = "platform.capability-disabled" as const;

// ─── PolicyCatalog aggregate events ──────────────────────────────────────────
export const POLICY_CATALOG_PUBLISHED_EVENT_TYPE = "policy.catalog-published" as const;

// ─── Configuration events (PlatformContext orchestration) ────────────────────
export const CONFIG_PROFILE_APPLIED_EVENT_TYPE = "config.profile-applied" as const;

// ─── Permission domain service events ────────────────────────────────────────
export const PERMISSION_DECISION_RECORDED_EVENT_TYPE = "permission.decision-recorded" as const;

// ─── IntegrationContract aggregate events ────────────────────────────────────
export const INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE = "integration.contract-registered" as const;
export const INTEGRATION_DELIVERY_FAILED_EVENT_TYPE = "integration.delivery-failed" as const;

// ─── SubscriptionAgreement aggregate events ───────────────────────────────────
export const SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE = "subscription.agreement-activated" as const;

// ─── Application-layer owned events ──────────────────────────────────────────
export const ONBOARDING_FLOW_COMPLETED_EVENT_TYPE = "onboarding.flow-completed" as const;
export const COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE = "compliance.policy-verified" as const;
export const REFERRAL_REWARD_RECORDED_EVENT_TYPE = "referral.reward-recorded" as const;
export const WORKFLOW_TRIGGER_FIRED_EVENT_TYPE = "workflow.trigger-fired" as const;
export const BACKGROUND_JOB_ENQUEUED_EVENT_TYPE = "background-job.enqueued" as const;
export const CONTENT_ASSET_PUBLISHED_EVENT_TYPE = "content.asset-published" as const;
export const SEARCH_QUERY_EXECUTED_EVENT_TYPE = "search.query-executed" as const;
export const NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE = "notification.dispatch-requested" as const;
export const AUDIT_SIGNAL_RECORDED_EVENT_TYPE = "audit.signal-recorded" as const;
export const OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE = "observability.signal-emitted" as const;
export const ANALYTICS_EVENT_RECORDED_EVENT_TYPE = "analytics.event-recorded" as const;
export const SUPPORT_TICKET_OPENED_EVENT_TYPE = "support.ticket-opened" as const;

// ─── All-events catalogue ─────────────────────────────────────────────────────
export const PLATFORM_DOMAIN_EVENT_TYPES = [
	PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE,
	PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE,
	PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE,
	POLICY_CATALOG_PUBLISHED_EVENT_TYPE,
	CONFIG_PROFILE_APPLIED_EVENT_TYPE,
	PERMISSION_DECISION_RECORDED_EVENT_TYPE,
	INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE,
	INTEGRATION_DELIVERY_FAILED_EVENT_TYPE,
	SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE,
	ONBOARDING_FLOW_COMPLETED_EVENT_TYPE,
	COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE,
	REFERRAL_REWARD_RECORDED_EVENT_TYPE,
	WORKFLOW_TRIGGER_FIRED_EVENT_TYPE,
	BACKGROUND_JOB_ENQUEUED_EVENT_TYPE,
	CONTENT_ASSET_PUBLISHED_EVENT_TYPE,
	SEARCH_QUERY_EXECUTED_EVENT_TYPE,
	NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE,
	AUDIT_SIGNAL_RECORDED_EVENT_TYPE,
	OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE,
	ANALYTICS_EVENT_RECORDED_EVENT_TYPE,
	SUPPORT_TICKET_OPENED_EVENT_TYPE,
] as const;

export type PlatformDomainEventType = (typeof PLATFORM_DOMAIN_EVENT_TYPES)[number];