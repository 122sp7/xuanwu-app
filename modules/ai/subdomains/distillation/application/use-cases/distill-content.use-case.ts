import type { DistillContentInput, DistillationPort, DistillationResult } from "../../domain/ports/DistillationPort";

const EMPTY_RESULT: DistillationResult = {
  overview: "No content available to distill.",
  distilledItems: [],
  model: "distillation-empty",
  traceId: "distillation-empty",
  completedAt: "1970-01-01T00:00:00.000Z",
};

export class DistillContentUseCase {
  constructor(private readonly distillationPort: DistillationPort) {}

  async execute(input: DistillContentInput): Promise<DistillationResult> {
    const sources = input.sources
      .map((source) => ({
        title: source.title?.trim() || undefined,
        text: source.text.trim(),
      }))
      .filter((source) => source.text.length > 0);

    if (sources.length === 0) {
      return EMPTY_RESULT;
    }

    return this.distillationPort.distill({
      sources,
      ...(input.objective?.trim() ? { objective: input.objective.trim() } : {}),
      ...(input.model?.trim() ? { model: input.model.trim() } : {}),
    });
  }
}
