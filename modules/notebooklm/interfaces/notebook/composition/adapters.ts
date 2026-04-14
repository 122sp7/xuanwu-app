import { AiTextGenerationAdapter } from "../../../infrastructure/notebook/ai/AiTextGenerationAdapter";

export function makeNotebookRepo() {
  return new AiTextGenerationAdapter();
}
