export interface RagPrompt {
  readonly systemInstruction: string;
  readonly formattedContext: string;
  readonly userQuery: string;
}
