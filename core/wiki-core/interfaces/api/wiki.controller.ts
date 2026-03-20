/**
 * Module: wiki-core
 * Layer: interfaces/api
 * Purpose: HTTP/controller facade delegating all wiki actions to the application layer.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { CreateWikiDocumentDTO, CreateWikiDocumentUseCase } from '../../application/use-cases/create-wiki-document'
import type { CreateWikiPageDTO, CreateWikiPageUseCase } from '../../application/use-cases/create-wiki-page.use-case'
import type { GetRAGAnswerDTO, GetRAGAnswerUseCase } from '../../application/use-cases/get-rag-answer.use-case'
import type { SearchWikiDocumentsDTO, SearchWikiDocumentsUseCase } from '../../application/use-cases/search-wiki-documents.use-case'

export class WikiController {
  constructor(
    private readonly createWikiDocument: CreateWikiDocumentUseCase,
    private readonly createWikiPage: CreateWikiPageUseCase,
    private readonly getRagAnswer: GetRAGAnswerUseCase,
    private readonly searchWikiDocuments: SearchWikiDocumentsUseCase,
  ) {}

  async createDocument(input: CreateWikiDocumentDTO) {
    return this.createWikiDocument.execute(input)
  }

  async createPage(input: CreateWikiPageDTO) {
    return this.createWikiPage.execute(input)
  }

  async ragAnswer(input: GetRAGAnswerDTO) {
    return this.getRagAnswer.execute(input)
  }

  async search(input: SearchWikiDocumentsDTO) {
    return this.searchWikiDocuments.execute(input)
  }
}
