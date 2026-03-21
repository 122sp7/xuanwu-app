/**
 * @package wiki-service
 * Enterprise knowledge base use-case layer.
 *
 * Depends only on @wiki-core. Zero Firebase / UI / infrastructure dependencies.
 * Infrastructure adapters (Upstash, OpenAI, Firestore) live in modules/wiki/infrastructure/.
 *
 * Usage:
 *   import { CreateWikiPageUseCase, GetRAGAnswerUseCase } from "@wiki-service"
 *   import type { CreateWikiPageDTO, GetRAGAnswerDTO } from "@wiki-service"
 */

import { randomBytes, randomUUID } from 'crypto'
import {
  WikiDocument,
  WikiPage,
  Taxonomy,
  RAGQueryResult,
} from '@wiki-core'
import type {
  WikiDocumentScope,
  WikiPageScope,
  WorkspaceKnowledgeSummary,
  IWikiDocumentRepository,
  IWikiPageRepository,
  IKnowledgeSummaryRepository,
  IKnowledgeSummaryScope,
  IRetrievalRepository,
  IEmbeddingRepository,
  RAGSource,
  SearchFilter,
} from '@wiki-core'

// ─── CreateWikiDocumentUseCase ────────────────────────────────────────────────

function generateDocumentId(): string {
  return 'doc_' + randomBytes(8).toString('hex')
}

export interface CreateWikiDocumentDTO {
  title: string
  content: string
  organizationId: string
  workspaceId: string | null
  taxonomy?: Taxonomy
  scope?: WikiDocumentScope
  createdBy?: string
}

export class CreateWikiDocumentUseCase {
  constructor(
    private readonly repo: IWikiDocumentRepository,
    private readonly embedder?: IEmbeddingRepository,
  ) {}

  async execute(dto: CreateWikiDocumentDTO): Promise<WikiDocument> {
    const id = generateDocumentId()
    const taxonomy = dto.taxonomy ?? new Taxonomy('other', [], 'default')
    const scope = dto.scope ?? 'organization'

    const entity = new WikiDocument(
      id,
      dto.title,
      dto.content,
      'DRAFT',
      new Date(),
      dto.organizationId,
      dto.workspaceId,
      taxonomy,
      scope,
    )

    if (this.embedder && dto.content.trim()) {
      await this.embedder.embed({ text: dto.content, documentId: id })
    }

    await this.repo.save(entity)
    return entity
  }
}

// ─── CreateWikiPageUseCase ────────────────────────────────────────────────────

export interface CreateWikiPageDTO {
  organizationId: string
  workspaceId: string | null
  title: string
  content?: string
  scope: WikiPageScope
  parentPageId?: string | null
  order?: number
  createdBy: string
}

export class CreateWikiPageUseCase {
  constructor(private readonly repo: IWikiPageRepository) {}

  async execute(dto: CreateWikiPageDTO): Promise<WikiPage> {
    if (!dto.title.trim()) {
      throw new Error('Wiki page title cannot be empty')
    }

    const now = new Date().toISOString()
    const page = new WikiPage(
      randomUUID(),
      dto.organizationId,
      dto.workspaceId,
      dto.title.trim(),
      dto.content ?? '',
      dto.scope,
      'draft',
      dto.parentPageId ?? null,
      dto.order ?? 0,
      false,
      dto.createdBy,
      now,
      now,
    )

    await this.repo.save(page)
    return page
  }
}

// ─── ArchiveWikiPageUseCase ───────────────────────────────────────────────────

export interface ArchiveWikiPageDTO {
  pageId: string
}

export class ArchiveWikiPageUseCase {
  constructor(private readonly repo: IWikiPageRepository) {}

  async execute(dto: ArchiveWikiPageDTO): Promise<void> {
    const page = await this.repo.findById(dto.pageId)
    if (!page) {
      throw new Error(`Wiki page not found: ${dto.pageId}`)
    }
    page.archive()
    await this.repo.save(page)
  }
}

// ─── UpdateWikiPageUseCase ────────────────────────────────────────────────────

export interface UpdateWikiPageDTO {
  pageId: string
  title?: string
  content?: string
}

export class UpdateWikiPageUseCase {
  constructor(private readonly repo: IWikiPageRepository) {}

  async execute(dto: UpdateWikiPageDTO): Promise<WikiPage> {
    const page = await this.repo.findById(dto.pageId)
    if (!page) {
      throw new Error(`Wiki page not found: ${dto.pageId}`)
    }
    if (dto.title !== undefined) {
      page.updateTitle(dto.title)
    }
    if (dto.content !== undefined) {
      page.updateContent(dto.content)
    }
    await this.repo.save(page)
    return page
  }
}

// ─── GetWorkspaceKnowledgeSummaryUseCase ──────────────────────────────────────

const EMPTY_SUMMARY: WorkspaceKnowledgeSummary = {
  registeredAssetCount: 0,
  readyAssetCount: 0,
  supportedSourceCount: 0,
  status: 'needs-input',
  blockedReasons: [],
  nextActions: [],
  visibleSurface: 'workspace-tab-live',
  contractStatus: 'contract-live',
}

export class GetWorkspaceKnowledgeSummaryUseCase {
  constructor(private readonly repo: IKnowledgeSummaryRepository) {}

  execute(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary {
    if (!scope.workspaceId.trim()) {
      return EMPTY_SUMMARY
    }
    return this.repo.summarize(scope)
  }
}

// ─── GetRAGAnswerUseCase ──────────────────────────────────────────────────────

const EXCERPT_MAX_CHARS = 300
const CONTEXT_MAX_CHARS = 500

export interface GetRAGAnswerDTO {
  query: string
  organizationId: string
  workspaceId?: string
  topK?: number
}

export class GetRAGAnswerUseCase {
  constructor(
    private readonly embedder: IEmbeddingRepository,
    private readonly retrieval: IRetrievalRepository,
  ) {}

  async execute(dto: GetRAGAnswerDTO): Promise<RAGQueryResult> {
    if (!dto.query.trim()) {
      throw new Error('RAG query cannot be empty')
    }

    const topK = dto.topK ?? 5
    const embedding = await this.embedder.embed({ text: dto.query })
    const hits = await this.retrieval.searchByVector(embedding.values, topK)

    const sources: RAGSource[] = hits.map((hit) => ({
      documentId: hit.entity.id,
      title: hit.entity.title,
      excerpt: hit.entity.content.slice(0, EXCERPT_MAX_CHARS),
      score: hit.score,
      taxonomy: hit.entity.taxonomy.category,
    }))

    const contextParts = hits.map(
      (hit, i) =>
        `[${i + 1}] ${hit.entity.title}\n${hit.entity.content.slice(0, CONTEXT_MAX_CHARS)}`,
    )
    const assembledContext = contextParts.join('\n\n---\n\n')
    const confidence = hits.length > 0 ? Math.min(hits[0].score, 1) : 0

    return new RAGQueryResult({
      answer: assembledContext,
      sources,
      confidence,
    })
  }
}

// ─── SearchWikiDocumentsUseCase ───────────────────────────────────────────────

export interface SearchWikiDocumentsDTO {
  filter: SearchFilter
  queryVector?: number[]
}

function serializeFilter(filter: SearchFilter): string {
  const parts: string[] = []
  if (filter.category) {
    parts.push(`category:${filter.category}`)
  }
  if (filter.tags.length > 0) {
    parts.push(`tags:${filter.tags.join(',')}`)
  }
  if (filter.dateRange) {
    parts.push(
      `dateRange:${filter.dateRange.start.toISOString()}~${filter.dateRange.end.toISOString()}`,
    )
  }
  return parts.join(';')
}

export class SearchWikiDocumentsUseCase {
  constructor(private readonly retrieval: IRetrievalRepository) {}

  async execute(dto: SearchWikiDocumentsDTO): Promise<WikiDocument[]> {
    const filterString = serializeFilter(dto.filter)

    if (dto.queryVector && dto.queryVector.length > 0) {
      return this.retrieval.searchByMetadata(filterString, dto.queryVector)
    }

    return this.retrieval.searchByMetadata(filterString, [])
  }
}
