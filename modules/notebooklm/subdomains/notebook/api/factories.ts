import { PlatformTextGenerationAdapter } from "../infrastructure/platform/PlatformTextGenerationAdapter";

export function makeNotebookRepo() {
  return new PlatformTextGenerationAdapter();
}
