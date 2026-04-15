/**
 * IngestionDomainService — Domain Service (stub)
 *
 * Business rules for ingestion job lifecycle that span multiple
 * aggregate instances or depend on external constraints.
 */
export class IngestionDomainService {
  validateSourceUrl(sourceUrl: string): void {
    if (!sourceUrl || sourceUrl.trim().length === 0) {
      throw new Error('sourceUrl is required to start an ingestion job');
    }
    try {
      new URL(sourceUrl);
    } catch {
      throw new Error(`sourceUrl is not a valid URL: ${sourceUrl}`);
    }
  }
}
