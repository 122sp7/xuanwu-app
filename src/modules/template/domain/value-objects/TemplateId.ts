/**
 * TemplateId — Value Object
 * Immutable identifier for a Template aggregate.
 */
export class TemplateId {
  private constructor(private readonly value: string) {}

  static create(value: string): TemplateId {
    if (!value || value.trim().length === 0) {
      throw new Error('TemplateId cannot be empty');
    }
    return new TemplateId(value);
  }

  static generate(): TemplateId {
    return new TemplateId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: TemplateId): boolean {
    return this.value === other.value;
  }
}
