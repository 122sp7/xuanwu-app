export class UsageStats {
  constructor(
    public readonly viewCount: number,
    public readonly lastAccessedAt: Date | null
  ) {}
}