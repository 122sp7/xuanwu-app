/**
 * TemplateName — Value Object
 * Validated template name with domain invariants.
 */
export class TemplateName {
  private static readonly MAX_LENGTH = 120;

  private constructor(private readonly value: string) {}

  static create(value: string): TemplateName {
    const trimmed = (value ?? '').trim();
    if (trimmed.length === 0) {
      throw new Error('TemplateName cannot be empty');
    }
    if (trimmed.length > TemplateName.MAX_LENGTH) {
      throw new Error(
        `TemplateName cannot exceed ${TemplateName.MAX_LENGTH} characters`,
      );
    }
    return new TemplateName(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: TemplateName): boolean {
    return this.value === other.value;
  }
}
