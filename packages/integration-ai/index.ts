/**
 * @module integration-ai
 * AI 服務整合層：Genkit singleton factory、flow 執行合約、共用 AI 型別。
 *
 * Context7 基線：/genkit-ai/genkit
 * - flow/tool 必須有 inputSchema 與 outputSchema（Zod）。
 * - 結果在返回 application layer 前必須驗證（outputSchema.parse）。
 * - 環境憑證只來自 env vars（GOOGLE_GENAI_API_KEY / GOOGLE_API_KEY）。
 */

// ─── Shared contract types ────────────────────────────────────────────────────

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

// ─── Error types ─────────────────────────────────────────────────────────────

export class IntegrationAiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntegrationAiConfigurationError";
  }
}

export class IntegrationAiFlowError extends Error {
  constructor(
    message: string,
    public readonly flowName: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "IntegrationAiFlowError";
  }
}

// ─── Unconfigured fallback ────────────────────────────────────────────────────

/** Development / test stub that throws on use when no provider is configured. */
export const createUnconfiguredAiClient = (): AiTextClient => ({
  generateText: async () => {
    throw new IntegrationAiConfigurationError(
      "AI provider is not configured. Set GOOGLE_GENAI_API_KEY and ensure integration-ai genkit.ts is initialised.",
    );
  },
});
