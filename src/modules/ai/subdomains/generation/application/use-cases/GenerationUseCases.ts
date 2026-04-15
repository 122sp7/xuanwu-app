import type {
  TextGenerationPort,
  GenerateTextInput,
  GenerateTextOutput,
  ContentDistillationPort,
  DistillContentInput,
  DistillationOutput,
  TaskExtractionPort,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../../domain/ports/GenerationPorts";

export class GenerateTextUseCase {
  constructor(private readonly port: TextGenerationPort) {}

  async execute(input: GenerateTextInput): Promise<{ ok: true; data: GenerateTextOutput } | { ok: false; error: { code: string; message: string } }> {
    try {
      const result = await this.port.generateText(input);
      return { ok: true, data: result };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Text generation failed";
      return { ok: false, error: { code: "TEXT_GENERATION_FAILED", message: msg } };
    }
  }
}

export class DistillContentUseCase {
  constructor(private readonly port: ContentDistillationPort) {}

  async execute(input: DistillContentInput): Promise<{ ok: true; data: DistillationOutput } | { ok: false; error: { code: string; message: string } }> {
    try {
      const result = await this.port.distill(input);
      return { ok: true, data: result };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Distillation failed";
      return { ok: false, error: { code: "DISTILLATION_FAILED", message: msg } };
    }
  }
}

export class ExtractTasksUseCase {
  constructor(private readonly port: TaskExtractionPort) {}

  async execute(input: TaskExtractionInput): Promise<{ ok: true; data: TaskExtractionOutput } | { ok: false; error: { code: string; message: string } }> {
    try {
      const result = await this.port.extractTasks(input);
      return { ok: true, data: result };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Task extraction failed";
      return { ok: false, error: { code: "TASK_EXTRACTION_FAILED", message: msg } };
    }
  }
}
