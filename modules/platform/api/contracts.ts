/**
 * platform API contracts boundary.
 *
 * Keep the source of truth in application/domain and re-export here for API consumers.
 */

export * from "../application/dtos";
export type {
	PlatformContextView,
	PolicyCatalogView,
	SubscriptionEntitlementsView,
	WorkflowPolicyView,
} from "../ports/output";
export * from "../domain/events";
