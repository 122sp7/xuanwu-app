import { Knowledge } from '../entities/knowledge.entity';
export interface IKnowledgeRepository {
  save(entity: Knowledge): Promise<void>;
  findById(id: string): Promise<Knowledge | null>;
  search(vector: number[]): Promise<Knowledge[]>; // 為了 Upstash Vector 預留
}