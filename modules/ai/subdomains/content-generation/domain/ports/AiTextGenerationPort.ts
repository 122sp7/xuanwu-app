export interface GenerateAiTextInput {
  readonly prompt: string;
  readonly system?: string;
  readonly model?: string;
}

export interface GenerateAiTextOutput {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}

export interface AiTextGenerationPort {
  generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
}
