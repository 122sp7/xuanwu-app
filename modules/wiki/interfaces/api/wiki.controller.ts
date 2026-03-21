/**
 * Module: wiki
 * Layer: interfaces/api
 * Purpose: HTTP/controller facade delegating all wiki actions to the application layer.
 *          Wires all seven use cases — keep this in sync when new use cases are added.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type {
  CreateWikiDocumentUseCase,
  CreateWikiDocumentDTO,
} from '../../application/use-cases/create-wiki-document'
import type {
  CreateWikiPageUseCase,
  CreateWikiPageDTO,
} from '../../application/use-cases/create-wiki-page.use-case'
import type {
  ArchiveWikiPageUseCase,
  ArchiveWikiPageDTO,
} from '../../application/use-cases/archive-wiki-page.use-case'
import type {
  UpdateWikiPageUseCase,
  UpdateWikiPageDTO,
} from '../../application/use-cases/update-wiki-page.use-case'
import type { GetWorkspaceKnowledgeSummaryUseCase } from '../../application/use-cases/get-workspace-knowledge-summary.use-case'
import type { IKnowledgeSummaryScope } from '../../domain/repositories/iknowledge-summary.repository'
import type {
  GetRAGAnswerUseCase,
  GetRAGAnswerDTO,
} from '../../application/use-cases/get-rag-answer.use-case'
import type {
  SearchWikiDocumentsUseCase,
  SearchWikiDocumentsDTO,
} from '../../application/use-cases/search-wiki-documents.use-case'

export class WikiController {
  constructor(
    private readonly createWikiDocument: CreateWikiDocumentUseCase,
    private readonly createWikiPage: CreateWikiPageUseCase,
    private readonly archiveWikiPage: ArchiveWikiPageUseCase,
    private readonly updateWikiPage: UpdateWikiPageUseCase,
    private readonly getWorkspaceKnowledgeSummary: GetWorkspaceKnowledgeSummaryUseCase,
    private readonly getRagAnswer: GetRAGAnswerUseCase,
    private readonly searchWikiDocuments: SearchWikiDocumentsUseCase,
  ) {}

  async createDocument(input: CreateWikiDocumentDTO) {
    return this.createWikiDocument.execute(input)
  }

  async createPage(input: CreateWikiPageDTO) {
    return this.createWikiPage.execute(input)
  }

  async archivePage(input: ArchiveWikiPageDTO) {
    return this.archiveWikiPage.execute(input)
  }

  async updatePage(input: UpdateWikiPageDTO) {
    return this.updateWikiPage.execute(input)
  }

  getKnowledgeSummary(scope: IKnowledgeSummaryScope) {
    return this.getWorkspaceKnowledgeSummary.execute(scope)
  }

  async ragAnswer(input: GetRAGAnswerDTO) {
    return this.getRagAnswer.execute(input)
  }

  async search(input: SearchWikiDocumentsDTO) {
    return this.searchWikiDocuments.execute(input)
  }
}
