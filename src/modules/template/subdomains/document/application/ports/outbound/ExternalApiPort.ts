/**
 * Outbound port — abstraction over any external API dependency
 * consumed by template use cases.
 */
export interface ExternalApiPort {
  fetchMetadata(resourceId: string): Promise<Record<string, unknown>>;
}
