import type { GenerateTemplatePort } from '../../application/ports/inbound/GenerateTemplatePort';

/**
 * GenerationQueueHandler — Inbound Queue Adapter (stub)
 * Handles async generation jobs delivered via a message queue (QStash, Pub/Sub, etc.).
 */
export class GenerationQueueHandler {
  constructor(private readonly generateUseCase: GenerateTemplatePort) {}

  async handle(message: { sourceTemplateId: string; prompt: string }) {
    await this.generateUseCase.execute({
      sourceTemplateId: message.sourceTemplateId,
      prompt: message.prompt,
    });
  }
}
