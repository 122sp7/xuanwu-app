export class ContentStatus {
  private readonly VALID_STATUS = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
  constructor(public readonly value: string) {
    if (!this.VALID_STATUS.includes(value)) throw new Error("Invalid status");
  }
  get isSearchable(): boolean { return this.value === 'PUBLISHED'; }
}