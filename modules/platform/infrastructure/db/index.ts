/**
 * platform database infrastructure placeholder module.
 */

export const PLATFORM_INFRA_DB_FACTORIES = [
	"createDbPlatformContextRepository",
	"createDbPolicyCatalogRepository",
	"createDbIntegrationContractRepository",
	"createDbSubscriptionAgreementRepository",
] as const;

export type PlatformInfraDbFactory = (typeof PLATFORM_INFRA_DB_FACTORIES)[number];