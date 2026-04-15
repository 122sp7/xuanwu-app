import type { StartIngestionPort } from '../../../application/ports/inbound/StartIngestionPort';

/**
 * IngestionQueueHandler — Inbound Queue Adapter (stub)
 * Triggered by a queue message (QStash, Pub/Sub, etc.) to start or resume an ingestion job.
 */
export class IngestionQueueHandler {
  constructor(private readonly startUseCase: StartIngestionPort) {}

  async handle(message: { sourceUrl: string }) {
    await this.startUseCase.execute({ sourceUrl: message.sourceUrl });
  }
}
