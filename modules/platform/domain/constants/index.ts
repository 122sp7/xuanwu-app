/**
 * platform shared constants placeholder module.
 */

export const PLATFORM_SHARED_CONSTANT_GROUPS = [
	"PlatformLifecycleConstants",
	"PlatformEventTypeConstants",
	"PlatformErrorCodeConstants",
] as const;

export type PlatformSharedConstantGroup = (typeof PLATFORM_SHARED_CONSTANT_GROUPS)[number];