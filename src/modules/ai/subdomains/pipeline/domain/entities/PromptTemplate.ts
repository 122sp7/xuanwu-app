export interface PromptTemplate {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly system?: string;
  readonly userTemplate: string;
  readonly variables: string[];
  readonly model?: string;
  readonly version: number;
  readonly createdAtISO: string;
}

export interface PromptTemplateRepository {
  save(template: PromptTemplate): Promise<void>;
  findById(id: string): Promise<PromptTemplate | null>;
  findByFamily(family: string): Promise<PromptTemplate[]>;
  findLatestByName(name: string): Promise<PromptTemplate | null>;
}

export interface RenderedPrompt {
  readonly system?: string;
  readonly user: string;
  readonly model?: string;
}

export interface PromptRenderPort {
  render(template: PromptTemplate, variables: Record<string, string>): RenderedPrompt;
}
