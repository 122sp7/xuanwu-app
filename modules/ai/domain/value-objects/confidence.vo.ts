export class ConfidenceVO {
  constructor(public readonly value: number) {
    if (value < 0) this.value = 0;
    else if (value > 1) this.value = 1;
    else this.value = value;
  }

  isHigh() {
    return this.value > 0.8;
  }

  toJSON() {
    return this.value;
  }
}