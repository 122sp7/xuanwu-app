/**
 * platform event routing placeholder module.
 */

export const PLATFORM_EVENT_ROUTING_FUNCTIONS = [
	"routeIngressEvent",
	"routeDomainEvent",
	"resolveEventHandler",
] as const;

export type PlatformEventRoutingFunction = (typeof PLATFORM_EVENT_ROUTING_FUNCTIONS)[number];
