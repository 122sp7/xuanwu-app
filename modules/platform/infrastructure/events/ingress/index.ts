/**
 * platform event ingress placeholder module.
 */

export const PLATFORM_EVENT_INGRESS_FUNCTIONS = [
	"ingestIdentitySubjectAuthenticated",
	"ingestAccountProfileAmended",
	"ingestOrganizationMembershipChanged",
	"ingestSubscriptionEntitlementChanged",
	"ingestIntegrationCallbackReceived",
	"ingestWorkflowExecutionCompleted",
] as const;

export type PlatformEventIngressFunction = (typeof PLATFORM_EVENT_INGRESS_FUNCTIONS)[number];
