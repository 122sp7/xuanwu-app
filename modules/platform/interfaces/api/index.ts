/**
 * platform web driving adapter placeholder module.
 */

export const PLATFORM_ADAPTER_WEB_FUNCTIONS = [
	"mapHttpRequestToPlatformCommand",
	"handlePlatformCommandHttp",
	"handlePlatformQueryHttp",
	"mapPlatformResultToHttpResponse",
] as const;

export type PlatformAdapterWebFunction = (typeof PLATFORM_ADAPTER_WEB_FUNCTIONS)[number];