import { v4 as uuid } from "@lib-uuid";
import { z } from "genkit";

import {
  resolveComplianceExtractionPrompt,
  resolveProcurementExtractionPrompt,
  resolveTaskExtractionPrompt,
} from "../../../prompt-pipeline/api";
import { BUILT_IN_TOOLS } from "../../../../infrastructure/llm/built-in-tools";
import { aiClient, configuredModel } from "../../../../infrastructure/llm/genkit-shared";
import type {
  DistillContentInput,
  DistillationPort,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../../domain/ports/DistillationPort";

// ── Output schemas ────────────────────────────────────────────────────────────

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

const TaskListSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe("Short, action-oriented task title (imperative mood, max 120 chars)"),
      description: z.string().optional().describe("Optional clarifying details about the task"),
      dueDate: z.string().optional().describe("ISO 8601 date string (YYYY-MM-DD) if a due date is mentioned"),
    }),
  ).max(20).describe("Extracted actionable task items"),
});

const ProcurementLineItemsSchema = z.object({
  items: z.array(
    z.object({
      itemNumber: z.string().optional().describe("Line item number or identifier"),
      workCategory: z.string().optional().describe("Work category or subdivision"),
      title: z.string().describe("Work scope description or item title"),
      quantity: z.number().optional().describe("Quantity of work"),
      unit: z.string().optional().describe("Unit of measure"),
      estimatedAmount: z.number().optional().describe("Estimated cost or contract amount"),
      dueDate: z.string().optional().describe("Completion date in ISO 8601 format"),
    }),
  ).max(60).describe("Extracted procurement line items"),
});

const ComplianceObligationsSchema = z.object({
  obligations: z.array(
    z.object({
      obligation: z.string().describe("Description of the compliance obligation"),
      responsibleParty: z.string().optional().describe("Party responsible for the obligation"),
      deadline: z.string().optional().describe("Deadline in ISO 8601 format"),
      evidenceRequired: z.string().optional().describe("Evidence or documentation required"),
      penaltyClause: z.string().optional().describe("Penalty or consequence for non-compliance"),
    }),
  ).max(40).describe("Extracted compliance obligations"),
});

// ── Extraction family helpers ─────────────────────────────────────────────────

type ExtractionFamily = "task-extraction" | "procurement-extraction" | "compliance-extraction";

function resolveExtractionFamily(promptFamily?: string): ExtractionFamily {
  if (promptFamily === "procurement-extraction") return "procurement-extraction";
  if (promptFamily === "compliance-extraction") return "compliance-extraction";
  return "task-extraction";
}

interface BuiltPrompt {
  readonly text: string;
  readonly family: ExtractionFamily;
  readonly recommendedTools: readonly string[];
}

function buildExtractionPrompt(input: TaskExtractionInput): BuiltPrompt {
  const family = resolveExtractionFamily(input.promptContext?.promptFamily);
  const mode = input.promptContext?.jsonReady ? "preview" : "manual";
  const sharedContextFields = {
    filename: input.promptContext?.filename?.trim() || "document.json",
    mimeType: input.promptContext?.mimeType,
    pageCount: input.promptContext?.pageCount,
    contentPreview: input.content.slice(0, 1200),
  };

  let resolvedPrompt;
  if (family === "procurement-extraction") {
    resolvedPrompt = resolveProcurementExtractionPrompt(
      "procurement-line-items",
      {
        ...sharedContextFields,
        maxLineItems: input.maxCandidates,
      },
      mode,
    );
  } else if (family === "compliance-extraction") {
    resolvedPrompt = resolveComplianceExtractionPrompt(
      "contract-obligations",
      sharedContextFields,
      mode,
    );
  } else {
    resolvedPrompt = resolveTaskExtractionPrompt(
      "document-task-candidates",
      {
        ...sharedContextFields,
        workspaceId: input.promptContext?.workspaceId,
        accountId: input.promptContext?.accountId,
        jsonReady: input.promptContext?.jsonReady ?? true,
        maxCandidates: input.maxCandidates,
      },
      mode,
    );
  }

  const text = [
    resolvedPrompt.system,
    "",
    resolvedPrompt.prompt,
    input.promptContext?.sourceGcsUri ? `Original source URI: ${input.promptContext.sourceGcsUri}` : "",
    input.promptContext?.jsonGcsUri ? `Parsed JSON URI: ${input.promptContext.jsonGcsUri}` : "",
    "",
    "Content:",
    input.content.slice(0, 8000),
  ].filter(Boolean).join("\n");

  return { text, family, recommendedTools: resolvedPrompt.recommendedTools };
}

// ── Tool selection ────────────────────────────────────────────────────────────

/** Returns Genkit tool instances for the names present in recommendedTools. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function selectTools(recommendedTools: readonly string[]): any[] {
  if (recommendedTools.length === 0) return [];
  const byName = new Map(BUILT_IN_TOOLS.map((t) => [t.descriptor.name, t.instance]));
  return recommendedTools.flatMap((name) => {
    const instance = byName.get(name);
    return instance ? [instance] : [];
  });
}

// ── Distillation prompt ───────────────────────────────────────────────────────

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

// ── Adapter ───────────────────────────────────────────────────────────────────

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

  async extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput> {
    const traceId = uuid();
    const completedAt = new Date().toISOString();

    const builtPrompt = buildExtractionPrompt(input);
    const tools = selectTools(builtPrompt.recommendedTools);

    if (builtPrompt.family === "procurement-extraction") {
      const { output } = await aiClient.generate({
        ...(input.model ? { model: input.model } : {}),
        prompt: builtPrompt.text,
        ...(tools.length > 0 ? { tools } : {}),
        output: { schema: ProcurementLineItemsSchema },
      });

      if (!output) {
        return { tasks: [], model: input.model ?? configuredModel, traceId, completedAt };
      }

      const validated = ProcurementLineItemsSchema.safeParse(output);
      if (!validated.success) {
        return { tasks: [], model: input.model ?? configuredModel, traceId, completedAt };
      }

      return {
        tasks: validated.data.items.map((item) => ({
          title: item.title.trim(),
          ...(item.workCategory?.trim() ? { description: item.workCategory.trim() } : {}),
          ...(item.dueDate?.trim() ? { dueDate: item.dueDate.trim() } : {}),
          metadata: {
            ...(item.itemNumber ? { itemNumber: item.itemNumber } : {}),
            ...(item.workCategory ? { workCategory: item.workCategory } : {}),
            ...(item.quantity != null ? { quantity: item.quantity } : {}),
            ...(item.unit ? { unit: item.unit } : {}),
            ...(item.estimatedAmount != null ? { estimatedAmount: item.estimatedAmount } : {}),
          },
        })),
        model: input.model ?? configuredModel,
        traceId,
        completedAt,
      };
    }

    if (builtPrompt.family === "compliance-extraction") {
      const { output } = await aiClient.generate({
        ...(input.model ? { model: input.model } : {}),
        prompt: builtPrompt.text,
        ...(tools.length > 0 ? { tools } : {}),
        output: { schema: ComplianceObligationsSchema },
      });

      if (!output) {
        return { tasks: [], model: input.model ?? configuredModel, traceId, completedAt };
      }

      const validated = ComplianceObligationsSchema.safeParse(output);
      if (!validated.success) {
        return { tasks: [], model: input.model ?? configuredModel, traceId, completedAt };
      }

      return {
        tasks: validated.data.obligations.map((ob) => ({
          title: ob.obligation.trim(),
          ...(ob.deadline?.trim() ? { dueDate: ob.deadline.trim() } : {}),
          metadata: {
            ...(ob.responsibleParty ? { responsibleParty: ob.responsibleParty } : {}),
            ...(ob.evidenceRequired ? { evidenceRequired: ob.evidenceRequired } : {}),
            ...(ob.penaltyClause ? { penaltyClause: ob.penaltyClause } : {}),
          },
        })),
        model: input.model ?? configuredModel,
        traceId,
        completedAt,
      };
    }

    // Default: task-extraction
    const { output } = await aiClient.generate({
      ...(input.model ? { model: input.model } : {}),
      prompt: builtPrompt.text,
      output: { schema: TaskListSchema },
    });

    if (!output) {
      return { tasks: [], model: input.model ?? configuredModel, traceId, completedAt };
    }

    const validated = TaskListSchema.safeParse(output);
    if (!validated.success) {
      return { tasks: [], model: input.model ?? configuredModel, traceId, completedAt };
    }

    return {
      tasks: validated.data.tasks.map((task) => ({
        title: task.title.trim(),
        ...(task.description?.trim() ? { description: task.description.trim() } : {}),
        ...(task.dueDate?.trim() ? { dueDate: task.dueDate.trim() } : {}),
      })),
      model: input.model ?? configuredModel,
      traceId,
      completedAt,
    };
  }
}

