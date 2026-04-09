/**
 * platform shared utilities placeholder module.
 */

export const PLATFORM_SHARED_UTILITY_FUNCTIONS = [
	"buildCorrelationId",
	"buildCausationId",
	"toIsoTimestamp",
	"assertNever",
] as const;

export type PlatformSharedUtilityFunction = (typeof PLATFORM_SHARED_UTILITY_FUNCTIONS)[number];