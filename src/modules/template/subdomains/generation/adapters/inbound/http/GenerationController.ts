import type { GenerateTemplatePort } from '../../../application/ports/inbound/GenerateTemplatePort';

/**
 * GenerationController — Inbound HTTP Adapter (stub)
 * Translates HTTP requests into GenerateTemplateUseCase calls.
 * Framework-agnostic stub — wire to Next.js route handler or tRPC when activated.
 */
export class GenerationController {
  constructor(private readonly generateUseCase: GenerateTemplatePort) {}

  /**
   * POST /api/templates/:sourceId/generate
   */
  async handleGenerate(request: {
    sourceTemplateId: string;
    prompt: string;
  }) {
    const result = await this.generateUseCase.execute({
      sourceTemplateId: request.sourceTemplateId,
      prompt: request.prompt,
    });
    return { status: 201, body: result };
  }
}
