/**
 * GenerationId — Value Object
 * Immutable identifier for a GeneratedTemplate aggregate.
 */
export class GenerationId {
  private constructor(private readonly value: string) {}

  static create(value: string): GenerationId {
    if (!value || value.trim().length === 0) {
      throw new Error('GenerationId cannot be empty');
    }
    return new GenerationId(value);
  }

  static generate(): GenerationId {
    return new GenerationId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: GenerationId): boolean {
    return this.value === other.value;
  }
}
