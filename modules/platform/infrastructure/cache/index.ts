/**
 * platform cache infrastructure placeholder module.
 */

export const PLATFORM_INFRA_CACHE_FACTORIES = [
	"createCachedPlatformContextViewRepository",
	"createCachedPolicyCatalogViewRepository",
	"createCachedUsageMeterRepository",
] as const;

export type PlatformInfraCacheFactory = (typeof PLATFORM_INFRA_CACHE_FACTORIES)[number];