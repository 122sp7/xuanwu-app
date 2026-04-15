import "server-only";

import { DistillContentUseCase } from "../application/use-cases/distill-content.use-case";
import { ExtractTasksFromContentUseCase } from "../application/use-cases/extract-tasks-from-content.use-case";
import { GenkitDistillationAdapter } from "../infrastructure/llm/GenkitDistillationAdapter";
import type {
  DistillContentInput,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/DistillationPort";

let _distillUseCase: DistillContentUseCase | undefined;
let _taskExtractionUseCase: ExtractTasksFromContentUseCase | undefined;

function getDistillUseCase(): DistillContentUseCase {
  if (_distillUseCase) return _distillUseCase;
  _distillUseCase = new DistillContentUseCase(new GenkitDistillationAdapter());
  return _distillUseCase;
}

function getTaskExtractionUseCase(): ExtractTasksFromContentUseCase {
  if (_taskExtractionUseCase) return _taskExtractionUseCase;
  _taskExtractionUseCase = new ExtractTasksFromContentUseCase(new GenkitDistillationAdapter());
  return _taskExtractionUseCase;
}

export async function distillContent(input: DistillContentInput): Promise<DistillationResult> {
  return getDistillUseCase().execute(input);
}

export async function extractTasksFromContent(
  input: TaskExtractionInput,
): Promise<TaskExtractionOutput> {
  return getTaskExtractionUseCase().execute(input);
}
