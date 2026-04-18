/**
 * @module integration-ai
 * External AI integration contracts.
 */

export interface AiGenerateTextInput {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  metadata?: Record<string, string>;
}

export interface AiGenerateTextResult {
  text: string;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface AiTextClient {
  generateText(input: AiGenerateTextInput): Promise<AiGenerateTextResult>;
}

export class IntegrationAiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntegrationAiConfigurationError";
  }
}

export const createUnconfiguredAiClient = (): AiTextClient => ({
  generateText: async () => {
    throw new IntegrationAiConfigurationError(
      "AI provider is not configured in integration-ai package",
    );
  },
});
