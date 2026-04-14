import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

import type {
  AiTextGenerationPort,
  GenerateAiTextInput,
  GenerateAiTextOutput,
} from "../../../subdomains/generation/domain/ports/AiTextGenerationPort";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

const envModel = process.env.GENKIT_MODEL?.trim();
const configuredModel = envModel && envModel.length > 0 ? envModel : DEFAULT_MODEL;
const hasApiKey =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

const aiClient = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: configuredModel,
});

export class GenkitAiTextGenerationAdapter implements AiTextGenerationPort {
  async generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput> {
    const response = await aiClient.generate({
      prompt: input.prompt,
      ...(input.system ? { system: input.system } : {}),
      ...(input.model ? { model: input.model } : {}),
    });

    return {
      text: response.text,
      model: input.model ?? configuredModel,
      ...(response.finishReason ? { finishReason: String(response.finishReason) } : {}),
    };
  }
}
