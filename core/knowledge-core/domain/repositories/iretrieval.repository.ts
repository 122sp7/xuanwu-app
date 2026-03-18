import { Knowledge } from '../entities/knowledge.entity';

export interface IRetrievalRepository {
  // 語義搜索：傳入向量，回傳實體與信心評分
  searchByVector(vector: number[], topK: number): Promise<{ entity: Knowledge, score: number }[]>;
  
  // 混合過濾：向量 + 分類標籤 (Upstash 特色)
  searchByMetadata(filter: string, vector: number[]): Promise<Knowledge[]>;
}