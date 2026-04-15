import { TemplateId } from '../value-objects/TemplateId';
import { TemplateName } from '../value-objects/TemplateName';

/**
 * Template — Aggregate Root
 * Encapsulates business invariants for a template.
 */
export interface TemplateProps {
  id: TemplateId;
  name: TemplateName;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Template {
  private constructor(private props: TemplateProps) {}

  static create(params: {
    id?: TemplateId;
    name: TemplateName;
    description?: string;
  }): Template {
    const now = new Date();
    return new Template({
      id: params.id ?? TemplateId.generate(),
      name: params.name,
      description: params.description,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: TemplateProps): Template {
    return new Template(props);
  }

  get id(): TemplateId {
    return this.props.id;
  }

  get name(): TemplateName {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: TemplateName): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  changeDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }
}
