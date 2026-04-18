import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";

const NotebooklmSynthesisInputSchema = z.object({
  question: z.string().min(1),
  contextChunks: z.array(z.string()).min(1),
  maxCitations: z.number().int().min(0).max(10).default(3),
});

const NotebooklmSynthesisOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(z.string()),
});

export type NotebooklmSynthesisInput = z.infer<typeof NotebooklmSynthesisInputSchema>;
export type NotebooklmSynthesisOutput = z.infer<typeof NotebooklmSynthesisOutputSchema>;

const buildSynthesisPrompt = (input: NotebooklmSynthesisInput): string =>
  [
    "Use the provided context to answer the question.",
    `Question: ${input.question}`,
    "Context:",
    ...input.contextChunks.map((chunk, index) => `[${index + 1}] ${chunk}`),
    `Return up to ${input.maxCitations} citation identifiers in the output.citations array.`,
  ].join("\n\n");

export const synthesisFlow = ai.defineFlow(
  {
    name: "notebooklm.synthesis",
    inputSchema: NotebooklmSynthesisInputSchema,
    outputSchema: NotebooklmSynthesisOutputSchema,
  },
  async (input) => {
    const response = await ai.generate({
      prompt: buildSynthesisPrompt(input),
      output: {
        format: "json",
        schema: NotebooklmSynthesisOutputSchema,
      },
    });

    return NotebooklmSynthesisOutputSchema.parse(response.output);
  },
);
