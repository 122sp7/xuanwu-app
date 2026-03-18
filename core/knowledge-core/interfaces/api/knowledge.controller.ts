/**
 * Module: knowledge-core
 * Layer: interfaces/api
 * Purpose: HTTP/controller facade delegating all business actions to application layer.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { CreateKnowledgeUseCase } from '../../application/use-cases/create-knowledge'

export class KnowledgeController {
  constructor(private readonly createKnowledge: CreateKnowledgeUseCase) {}

  async create(input: { title: string; content: string }) {
    return this.createKnowledge.execute(input)
  }
}
