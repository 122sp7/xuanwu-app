import { googleAI } from "@genkit-ai/google-genai";
import { v4 as uuid } from "@lib-uuid";
import { genkit, z } from "genkit";

import type {
  DistillContentInput,
  DistillationPort,
  DistillationResult,
} from "../../domain/ports/DistillationPort";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

const envModel = process.env.GENKIT_MODEL?.trim();
const configuredModel = envModel && envModel.length > 0 ? envModel : DEFAULT_MODEL;
const hasApiKey =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

const DistillationOutputSchema = z.object({
  overview: z.string(),
  distilledItems: z.array(
    z.object({
      title: z.string(),
      summary: z.string(),
      sourceTitle: z.string().nullable().optional(),
    }),
  ).max(10),
});

const aiClient = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: configuredModel,
});

function buildDistillationPrompt(input: DistillContentInput): string {
  const objective = input.objective?.trim() || "Distill the content into reusable knowledge points.";
  const serializedSources = input.sources
    .map((source, index) => {
      const sourceTitle = source.title?.trim() || `Source ${index + 1}`;
      return [`## ${sourceTitle}`, source.text.trim()].join("\n");
    })
    .join("\n\n");

  return [
    "You are a distillation assistant.",
    "Return a concise overview and a short list of distilled knowledge points.",
    "Each distilled item should be clear, reusable, and grounded in the provided content.",
    `Objective: ${objective}`,
    "",
    serializedSources,
  ].join("\n");
}

export class GenkitDistillationAdapter implements DistillationPort {
  async distill(input: DistillContentInput): Promise<DistillationResult> {
    const traceId = uuid();
    const completedAt = new Date().toISOString();

    const { output } = await aiClient.generate({
      ...(input.model ? { model: input.model } : {}),
      prompt: buildDistillationPrompt(input),
      output: {
        schema: DistillationOutputSchema,
      },
    });

    if (!output) {
      throw new Error("AI distillation returned no structured output.");
    }

    return {
      overview: output.overview.trim(),
      distilledItems: output.distilledItems.map((item) => ({
        title: item.title.trim(),
        summary: item.summary.trim(),
        ...(item.sourceTitle?.trim() ? { sourceTitle: item.sourceTitle.trim() } : {}),
      })),
      model: input.model ?? configuredModel,
      traceId,
      completedAt,
    };
  }
}
