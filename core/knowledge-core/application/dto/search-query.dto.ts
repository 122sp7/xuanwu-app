export interface SearchQueryDTO {
  query: string;       // 原始文字
  category?: string;   // 過濾條件
  topK?: number;       // 取前幾筆
  minScore?: number;   // 最低相關性門檻
}