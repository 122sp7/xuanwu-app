/**
 * platform event mapper placeholder module.
 */

export const PLATFORM_EVENT_MAPPER_FUNCTIONS = [
	"mapExternalEventToPlatformEvent",
	"mapIngressEventToCommand",
	"mapDomainEventToPublishedEvent",
] as const;

export type PlatformEventMapperFunction = (typeof PLATFORM_EVENT_MAPPER_FUNCTIONS)[number];
