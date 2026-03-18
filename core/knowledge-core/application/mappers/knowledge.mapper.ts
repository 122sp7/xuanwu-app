import { Knowledge } from '../../domain/entities/knowledge.entity';
import { KnowledgeDTO } from '../dto/knowledge.dto';

export class KnowledgeMapper {
  static toDTO(entity: Knowledge): KnowledgeDTO {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      // 轉換邏輯...
    };
  }
}