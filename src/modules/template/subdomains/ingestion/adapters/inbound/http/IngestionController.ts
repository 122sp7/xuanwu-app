import type { StartIngestionPort } from '../../../application/ports/inbound/StartIngestionPort';

/**
 * IngestionController — Inbound HTTP Adapter (stub)
 */
export class IngestionController {
  constructor(private readonly startUseCase: StartIngestionPort) {}

  /** POST /api/ingestion */
  async handleStart(request: { sourceUrl: string }) {
    const result = await this.startUseCase.execute({ sourceUrl: request.sourceUrl });
    return { status: 202, body: result };
  }
}
