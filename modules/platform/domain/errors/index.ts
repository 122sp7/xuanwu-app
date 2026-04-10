/**
 * platform shared errors placeholder module.
 */

export const PLATFORM_SHARED_ERROR_FACTORIES = [
	"createEntitlementDeniedError",
	"createPolicyConflictError",
	"createDeliveryNotAllowedError",
] as const;

export type PlatformSharedErrorFactory = (typeof PLATFORM_SHARED_ERROR_FACTORIES)[number];