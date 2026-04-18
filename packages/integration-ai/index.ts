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

export const createGenkitAiClient = (): AiTextClient => ({
  generateText: async (input) => {
    const { GENKIT_DEFAULT_MODEL_ID, generateTextWithGenkit } = await import("./genkit");
    const response = await generateTextWithGenkit(input);

    if (!response.text) {
      throw new IntegrationAiConfigurationError("AI provider returned an empty response");
    }

    return {
      text: response.text,
      model: input.model ?? GENKIT_DEFAULT_MODEL_ID,
      usage: {
        inputTokens: response.usage?.inputTokens ?? undefined,
        outputTokens: response.usage?.outputTokens ?? undefined,
      },
    };
  },
});

export const createUnconfiguredAiClient = (): AiTextClient => ({
  generateText: async () => {
    throw new IntegrationAiConfigurationError(
      "AI provider is not configured in integration-ai package",
    );
  },
});
