/**
 * IngestionId — Value Object
 * Immutable identifier for an IngestionJob aggregate.
 */
export class IngestionId {
  private constructor(private readonly value: string) {}

  static create(value: string): IngestionId {
    if (!value || value.trim().length === 0) {
      throw new Error('IngestionId cannot be empty');
    }
    return new IngestionId(value);
  }

  static generate(): IngestionId {
    return new IngestionId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: IngestionId): boolean {
    return this.value === other.value;
  }
}
