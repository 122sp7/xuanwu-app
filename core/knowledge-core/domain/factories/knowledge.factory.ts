import { Knowledge } from '../entities/knowledge.entity';
import { v4 as uuid } from 'uuid';

export class KnowledgeFactory {
  static create(title: string, content: string): Knowledge {
    return new Knowledge(uuid(), title, content, 'DRAFT', new Date());
  }
}