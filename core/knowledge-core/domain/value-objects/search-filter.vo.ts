export class SearchFilter {
  constructor(
    public readonly category?: string,
    public readonly tags: string[] = [],
    public readonly dateRange?: { start: Date; end: Date }
  ) {}

  // 生成 Upstash 格式的 Filter 字串
  toUpstashFilter(): string {
    // e.g., "category = 'Technical' AND tags HAS 'typescript'"
    return ""; 
  }
}