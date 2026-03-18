export class Vector {
  constructor(public readonly values: number[]) {
    if (values.length === 0) throw new Error("Vector cannot be empty");
  }
  // 可以加入如 cosineSimilarity(other: Vector) 的方法
}