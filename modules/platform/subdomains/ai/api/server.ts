/**
 * AI subdomain — server-only API.
 *
 * Composition root + functions that depend on server-only packages (genkit).
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */

import { GenerateAiTextUseCase } from "../application/use-cases/generate-ai-text.use-case";
import { GenkitAiTextGenerationAdapter } from "../infrastructure/genkit/GenkitAiTextGenerationAdapter";
import type { GenerateAiTextInput, GenerateAiTextOutput } from "../domain/ports/AiTextGenerationPort";

let _useCase: GenerateAiTextUseCase | undefined;

function getUseCase(): GenerateAiTextUseCase {
	if (_useCase) return _useCase;
	_useCase = new GenerateAiTextUseCase(new GenkitAiTextGenerationAdapter());
	return _useCase;
}

export async function generateAiText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput> {
	return getUseCase().execute(input);
}

export async function summarize(text: string, model?: string): Promise<string> {
	const result = await generateAiText({
		prompt: text,
		model,
		system: "You are a concise summarizer. Return only the summary text.",
	});
	return result.text;
}
