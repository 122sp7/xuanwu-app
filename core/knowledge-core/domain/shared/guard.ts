export class Guard {
  /**
   * 確保值不為空
   */
  static againstNullOrUndefined(value: any, name: string): void {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${name} is required and cannot be empty.`);
    }
  }

  /**
   * 確保字串長度在範圍內
   */
  static againstInvalidLength(value: string, min: number, max: number, name: string): void {
    if (value.length < min || value.length > max) {
      throw new Error(`${name} must be between ${min} and ${max} characters.`);
    }
  }

  /**
   * 針對 Upstash Vector 的維度檢查
   */
  static againstInvalidVectorDimension(values: number[], expected: number): void {
    if (values.length !== expected) {
      throw new Error(`Vector dimension mismatch. Expected ${expected}, got ${values.length}.`);
    }
  }
}