/**
 * platform event handler placeholder module.
 */

export const PLATFORM_EVENT_HANDLER_FUNCTIONS = [
	"handleIngressIdentitySubjectAuthenticated",
	"handleIngressAccountProfileAmended",
	"handleIngressOrganizationMembershipChanged",
	"handleIngressSubscriptionEntitlementChanged",
	"handleIngressIntegrationCallbackReceived",
	"handleIngressWorkflowExecutionCompleted",
] as const;

export type PlatformEventHandlerFunction = (typeof PLATFORM_EVENT_HANDLER_FUNCTIONS)[number];
