import { v4 as uuidv4 } from 'uuid';

/**
 * WorkflowId — Value Object
 */
export class WorkflowId {
  private constructor(private readonly value: string) {}

  static create(raw: string): WorkflowId {
    if (!raw || raw.trim() === '') throw new Error('WorkflowId cannot be empty.');
    return new WorkflowId(raw);
  }

  static generate(): WorkflowId {
    return new WorkflowId(uuidv4());
  }

  toString(): string {
    return this.value;
  }

  equals(other: WorkflowId): boolean {
    return this.value === other.value;
  }
}
