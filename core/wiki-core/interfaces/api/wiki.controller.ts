/**
 * Module: wiki-core
 * Layer: interfaces/api
 * Purpose: HTTP/controller facade delegating all wiki actions to the application layer.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { CreateWikiDocumentUseCase } from '../../application/use-cases/create-wiki-document'

export class WikiController {
  constructor(private readonly createWikiDocument: CreateWikiDocumentUseCase) {}

  async create(input: { title: string; content: string }) {
    return this.createWikiDocument.execute(input)
  }
}
