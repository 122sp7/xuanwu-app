/**
 * platform monitoring infrastructure placeholder module.
 */

export const PLATFORM_INFRA_MONITORING_FACTORIES = [
	"createMetricsObservabilitySink",
	"createTracingObservabilitySink",
	"createAnalyticsSink",
] as const;

export type PlatformInfraMonitoringFactory = (typeof PLATFORM_INFRA_MONITORING_FACTORIES)[number];