/** ai/infrastructure — shared AI adapters and Genkit singletons. */

export { GenkitAiTextGenerationAdapter } from "./generation/genkit/GenkitAiTextGenerationAdapter";
export { aiClient, configuredModel, hasApiKey } from "./llm/genkit-shared";
export { BUILT_IN_TOOLS } from "./llm/built-in-tools";
