export class PromptVO {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Prompt is empty");
    }
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}