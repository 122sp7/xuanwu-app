export class KnowledgeQueryService {
  constructor(private readonly repo: any) {} // 注入 Repository
  async getQuickSummary(id: string) {
    // 快速查詢邏輯
  }
}