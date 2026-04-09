/**
 * platform CLI driving adapter placeholder module.
 */

export const PLATFORM_ADAPTER_CLI_FUNCTIONS = [
	"parseCliInputToCommand",
	"runPlatformCliCommand",
	"renderPlatformCliResult",
] as const;

export type PlatformAdapterCliFunction = (typeof PLATFORM_ADAPTER_CLI_FUNCTIONS)[number];