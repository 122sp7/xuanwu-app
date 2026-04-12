import { PlatformTextGenerationAdapter } from "../../../infrastructure/notebook/platform/PlatformTextGenerationAdapter";

export function makeNotebookRepo() {
  return new PlatformTextGenerationAdapter();
}
