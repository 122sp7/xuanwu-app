import type { AiGenerationPort } from '../../../application/ports/outbound/AiGenerationPort';

/**
 * AiGenerationAdapter — Outbound AI Adapter (stub)
 * Implements AiGenerationPort by calling an AI provider (Genkit, OpenAI, etc.).
 * Replace the stub body with a real Genkit runFlow call when activated.
 */
export class AiGenerationAdapter implements AiGenerationPort {
  async generate(sourceTemplateId: string, prompt: string): Promise<string> {
    // TODO: Replace with real Genkit / AI SDK call.
    // Example:
    //   const result = await genkitClient.runFlow('generateTemplateContent', {
    //     sourceTemplateId,
    //     prompt,
    //   });
    //   return result.content;
    throw new Error(
      `AiGenerationAdapter.generate not yet implemented. sourceTemplateId=${sourceTemplateId}`,
    );
  }
}
