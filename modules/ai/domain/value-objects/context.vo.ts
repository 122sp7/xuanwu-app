export type ContextItem = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export class ContextVO {
  constructor(public readonly items: ContextItem[]) {}

  add(item: ContextItem): ContextVO {
    return new ContextVO([...this.items, item]);
  }

  toJSON() {
    return this.items;
  }
}