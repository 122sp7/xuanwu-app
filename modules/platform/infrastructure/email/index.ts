/**
 * platform email infrastructure placeholder module.
 */

export const PLATFORM_INFRA_EMAIL_FACTORIES = [
	"createEmailNotificationGateway",
] as const;

export type PlatformInfraEmailFactory = (typeof PLATFORM_INFRA_EMAIL_FACTORIES)[number];