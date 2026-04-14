import "server-only";

import { DistillContentUseCase } from "../application/use-cases/distill-content.use-case";
import { GenkitDistillationAdapter } from "../infrastructure/llm/GenkitDistillationAdapter";
import type { DistillContentInput, DistillationResult } from "../domain/ports/DistillationPort";

let _useCase: DistillContentUseCase | undefined;

function getUseCase(): DistillContentUseCase {
  if (_useCase) return _useCase;
  _useCase = new DistillContentUseCase(new GenkitDistillationAdapter());
  return _useCase;
}

export async function distillContent(input: DistillContentInput): Promise<DistillationResult> {
  return getUseCase().execute(input);
}
