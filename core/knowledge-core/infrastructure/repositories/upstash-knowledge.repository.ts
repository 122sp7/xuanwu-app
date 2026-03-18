import { IKnowledgeRepository } from "../../domain/repositories/iknowledge.repository";
import { vectorIndex } from "../persistence/upstash-vector";

export class UpstashKnowledgeRepository implements IKnowledgeRepository {
  async save(entity: any) {
    // 使用 vectorIndex.upsert()
  }
  // ...實作其餘方法
}