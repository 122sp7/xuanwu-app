/**
 * platform published event placeholder module.
 */

export const PLATFORM_PUBLISHED_EVENT_FUNCTIONS = [
	"buildPublishedEventEnvelope",
	"publishSinglePlatformEvent",
	"publishBatchPlatformEvents",
] as const;

export type PlatformPublishedEventFunction = (typeof PLATFORM_PUBLISHED_EVENT_FUNCTIONS)[number];
