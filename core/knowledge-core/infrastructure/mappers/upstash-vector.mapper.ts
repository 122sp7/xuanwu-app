import { Knowledge } from '../../domain/entities/knowledge.entity';

export class UpstashVectorMapper {
  /** * 將領域實體轉換為 Upstash Vector 要求的格式
   * 讓 Copilot 知道如何將 metadata 平坦化 (Flatten)
   */
  static toUpsert(entity: Knowledge, vector: number[]) {
    return {
      id: entity.id,
      vector: vector,
      metadata: {
        title: entity.title,
        status: entity.status,
        createdAt: entity.createdAt.getTime(),
        // 這裡可以過濾掉不必要的 content，節省存儲空間
      }
    };
  }
}