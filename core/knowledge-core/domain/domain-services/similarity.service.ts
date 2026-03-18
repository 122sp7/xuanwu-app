import { Knowledge } from '../entities/knowledge.entity';

export class SimilarityService {
  /** * 邏輯：計算兩份知識的語義重疊度
   * 注意：這裡不寫 Upstash 實作，只定義業務算法或呼叫介面
   */
  calculateOverlap(a: Knowledge, b: Knowledge): number {
    // 這裡寫純業務邏輯算法
    return 0.85; 
  }
}