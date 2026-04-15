import { GenerationId } from '../value-objects/GenerationId';

/**
 * GeneratedTemplate — Aggregate Root
 *
 * Represents the output artefact produced by an AI / rule-based
 * template generation run.
 */
export interface GeneratedTemplateProps {
  id: GenerationId;
  sourceTemplateId: string;
  content: string;
  createdAt: Date;
}

export class GeneratedTemplate {
  private constructor(private readonly props: GeneratedTemplateProps) {}

  static create(
    params: Omit<GeneratedTemplateProps, 'createdAt'>,
  ): GeneratedTemplate {
    return new GeneratedTemplate({ ...params, createdAt: new Date() });
  }

  get id(): GenerationId {
    return this.props.id;
  }

  get sourceTemplateId(): string {
    return this.props.sourceTemplateId;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
