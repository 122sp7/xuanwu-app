/**
 * AiGenerationPort — Outbound Port
 * Abstract contract for AI-powered content generation.
 * Infrastructure adapters (Genkit, OpenAI, mock) implement this interface.
 */
export interface AiGenerationPort {
  generate(sourceTemplateId: string, prompt: string): Promise<string>;
}
