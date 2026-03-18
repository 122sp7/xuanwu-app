export class Taxonomy {
  constructor(
    public readonly category: string,
    public readonly tags: string[],
    public readonly namespace: string = 'default'
  ) {
    // 邏輯封裝：自動清理標籤
    this.tags = [...new Set(tags.map(t => t.toLowerCase().trim()))];
  }

  // 方便 Copilot 生成比對邏輯
  equals(other: Taxonomy): boolean {
    return this.category === other.category && 
           this.namespace === other.namespace &&
           this.tags.sort().join() === other.tags.sort().join();
  }
}