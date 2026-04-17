export interface NotebookGenerationPort {
  generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
    system?: string;
  }): Promise<{ text: string; model: string; finishReason?: string }>;
}
