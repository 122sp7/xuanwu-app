/**
 * platform shared types placeholder module.
 */

export const PLATFORM_SHARED_TYPE_GROUPS = [
	"CorrelationContextType",
	"ResourceDescriptorType",
	"DispatchOutcomeType",
] as const;

export type PlatformSharedTypeGroup = (typeof PLATFORM_SHARED_TYPE_GROUPS)[number];