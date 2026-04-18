import { registerGenerationPrompts } from "../../subdomains/generation/prompts/generate-text.prompt";
import { registerRetrievalPrompts } from "../../subdomains/retrieval/prompts/query-expansion.prompt";

let isLoaded = false;

export const loadPromptDefinitions = (): void => {
  if (isLoaded) {
    return;
  }

  registerGenerationPrompts();
  registerRetrievalPrompts();
  isLoaded = true;
};
