import type {
  AiTextGenerationPort,
  GenerateAiTextInput,
  GenerateAiTextOutput,
} from "../../domain/ports/AiTextGenerationPort";

export class GenerateAiTextUseCase {
  constructor(private readonly generationPort: AiTextGenerationPort) {}

  execute(input: GenerateAiTextInput): Promise<GenerateAiTextOutput> {
    return this.generationPort.generateText(input);
  }
}
