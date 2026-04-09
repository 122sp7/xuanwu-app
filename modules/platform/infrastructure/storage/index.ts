/**
 * platform storage infrastructure placeholder module.
 */

export const PLATFORM_INFRA_STORAGE_FACTORIES = [
	"createStorageAuditSignalStore",
	"createStorageDeliveryHistoryRepository",
	"createStorageContentRepository",
] as const;

export type PlatformInfraStorageFactory = (typeof PLATFORM_INFRA_STORAGE_FACTORIES)[number];