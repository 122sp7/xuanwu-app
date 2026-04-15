import type { ExternalApiPort } from '../../../application/ports/outbound/ExternalApiPort';

/**
 * External API adapter — concrete implementation of ExternalApiPort.
 */
export class TemplateApiClient implements ExternalApiPort {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async fetchMetadata(resourceId: string): Promise<Record<string, unknown>> {
    const res = await this.fetchFn(
      `${this.baseUrl}/resources/${encodeURIComponent(resourceId)}`,
    );
    if (!res.ok) {
      throw new Error(`External API error: ${res.status}`);
    }
    return (await res.json()) as Record<string, unknown>;
  }
}
