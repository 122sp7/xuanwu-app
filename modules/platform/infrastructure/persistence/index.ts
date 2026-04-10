/**
 * platform persistence driven adapter placeholder module.
 */

export const PLATFORM_ADAPTER_PERSISTENCE_FUNCTIONS = [
	"mapAggregateToPersistenceRecord",
	"mapPersistenceRecordToAggregate",
	"persistPlatformAggregate",
	"loadPlatformAggregate",
] as const;

export type PlatformAdapterPersistenceFunction = (typeof PLATFORM_ADAPTER_PERSISTENCE_FUNCTIONS)[number];