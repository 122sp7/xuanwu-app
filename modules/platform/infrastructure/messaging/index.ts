/**
 * platform messaging infrastructure placeholder module.
 */

export const PLATFORM_INFRA_MESSAGING_FACTORIES = [
	"createMessagingDomainEventPublisher",
	"createMessagingWorkflowDispatcher",
	"createMessagingJobQueuePort",
] as const;

export type PlatformInfraMessagingFactory = (typeof PLATFORM_INFRA_MESSAGING_FACTORIES)[number];