/**
 * GeneratedTemplate — Aggregate Root (stub)
 *
 * Represents the output artefact produced by an AI / rule-based
 * template generation run.
 * Expand this aggregate when the generation subdomain is activated.
 */
export interface GeneratedTemplateProps {
  id: string;
  sourceTemplateId: string;
  content: string;
  generatedAt: Date;
}

export class GeneratedTemplate {
  private constructor(private readonly props: GeneratedTemplateProps) {}

  static create(
    params: Omit<GeneratedTemplateProps, 'generatedAt'>,
  ): GeneratedTemplate {
    return new GeneratedTemplate({ ...params, generatedAt: new Date() });
  }

  get id(): string {
    return this.props.id;
  }

  get sourceTemplateId(): string {
    return this.props.sourceTemplateId;
  }

  get content(): string {
    return this.props.content;
  }

  get generatedAt(): Date {
    return this.props.generatedAt;
  }
}
