export class EmbeddingVO {
  constructor(public readonly vector: number[]) {}

  toJSON() {
    return this.vector;
  }
}