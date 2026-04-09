/**
 * platform external driven adapter placeholder module.
 */

export const PLATFORM_ADAPTER_EXTERNAL_FUNCTIONS = [
	"buildExternalDeliveryRequest",
	"dispatchExternalDelivery",
	"mapExternalResponseToDispatchOutcome",
] as const;

export type PlatformAdapterExternalFunction = (typeof PLATFORM_ADAPTER_EXTERNAL_FUNCTIONS)[number];