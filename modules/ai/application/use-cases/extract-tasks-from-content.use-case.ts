import type {
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
} from "../../domain/ports/DistillationPort";

const EMPTY_RESULT: TaskExtractionOutput = {
  tasks: [],
  model: "task-extraction-empty",
  traceId: "task-extraction-empty",
  completedAt: "1970-01-01T00:00:00.000Z",
};

export class ExtractTasksFromContentUseCase {
  constructor(private readonly taskExtractionPort: TaskExtractionPort) {}

  async execute(input: TaskExtractionInput): Promise<TaskExtractionOutput> {
    const content = input.content.trim();

    if (content.length === 0) {
      return EMPTY_RESULT;
    }

    return this.taskExtractionPort.extractTasks({
      ...input,
      content,
      ...(input.model?.trim() ? { model: input.model.trim() } : {}),
    });
  }
}
