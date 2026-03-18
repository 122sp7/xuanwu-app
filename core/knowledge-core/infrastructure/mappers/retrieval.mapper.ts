import { Knowledge } from '../../domain/entities/knowledge.entity';
import { Taxonomy } from '../../domain/value-objects/taxonomy.vo';

export class RetrievalMapper {
  static toVectorRecord(entity: Knowledge, taxonomy: Taxonomy, vector: number[]) {
    return {
      id: entity.id,
      vector: vector,
      metadata: {
        title: entity.title,
        category: taxonomy.category,
        tags: taxonomy.tags,
        text_content: entity.content.substring(0, 1000), // 存儲部分文本供回顯
        status: entity.status
      }
    };
  }
}