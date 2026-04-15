import "server-only";

import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

import type {
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
} from "../../domain/ports/TaskExtractionPort";

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

const TaskListSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe("Short, action-oriented task title (imperative mood, max 120 chars)"),
      description: z.string().optional().describe("Optional clarifying details about the task"),
      dueDate: z.string().optional().describe("ISO 8601 date string (YYYY-MM-DD) if a due date is mentioned"),
    }),
  ).describe("Extracted actionable task items"),
});

export class GenkitTaskExtractionAdapter implements TaskExtractionPort {
  async extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput> {
    const max = input.maxCandidates ?? 20;
    const prompt = [
      "You are a task extraction assistant.",
      `Read the following content and extract up to ${max} clearly actionable tasks.`,
      "Only include tasks that have a concrete action — skip vague or informational statements.",
      "Return the tasks as structured JSON.",
      "",
      "Content:",
      input.content.slice(0, 8000),
    ].join("\n");

    const { output } = await aiClient.generate({
      prompt,
      output: {
        schema: TaskListSchema,
      },
    });

    if (!output) {
      return { tasks: [] };
    }

    const validated = TaskListSchema.safeParse(output);
    if (!validated.success) {
      return { tasks: [] };
    }

    return {
      tasks: validated.data.tasks.map((task) => ({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      })),
    };
  }
}
