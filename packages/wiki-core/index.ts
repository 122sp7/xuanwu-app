/**
 * @package wiki-core
 * Enterprise knowledge base domain — entities, value objects, repository ports, and domain services.
 *
 * Zero external dependencies. Adapters and integrations live in modules/wiki/infrastructure/.
 *
 * Usage:
 *   import type { WikiPage, IWikiPageRepository } from "@wiki-core"
 *   import { WikiDocument, Taxonomy, RAGQueryResult, deriveKnowledgeSummary } from "@wiki-core"
 */

// ─── Entities ──────────────────────────────────────────────────────────────────

export type WikiDocumentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WikiDocumentScope = 'organization' | 'workspace' | 'private'

export class WikiDocument {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public status: WikiDocumentStatus,
    public readonly createdAt: Date,
    public readonly organizationId: string,
    public readonly workspaceId: string | null,
    public readonly taxonomy: Taxonomy,
    public scope: WikiDocumentScope,
    public parentPageId: string | null = null,
  ) {}

  publish(): void {
    this.status = 'PUBLISHED'
  }

  archive(): void {
    this.status = 'ARCHIVED'
  }
}

export type WikiPageScope = 'organization' | 'workspace' | 'private'
export type WikiPageStatus = 'draft' | 'published' | 'archived'

export class WikiPage {
  constructor(
    public readonly pageId: string,
    public readonly organizationId: string,
    public readonly workspaceId: string | null,
    public title: string,
    public content: string,
    public readonly scope: WikiPageScope,
    public status: WikiPageStatus,
    public readonly parentPageId: string | null,
    public readonly order: number,
    public isArchived: boolean,
    public readonly createdBy: string,
    public readonly createdAtISO: string,
    public updatedAtISO: string,
  ) {}

  publish(): void {
    if (this.status === 'archived') {
      throw new Error('Cannot publish an archived wiki page — restore it first')
    }
    this.status = 'published'
    this.updatedAtISO = new Date().toISOString()
  }

  archive(): void {
    this.isArchived = true
    this.status = 'archived'
    this.updatedAtISO = new Date().toISOString()
  }

  restore(): void {
    if (!this.isArchived) {
      throw new Error('Cannot restore a wiki page that is not archived')
    }
    this.isArchived = false
    this.status = 'draft'
    this.updatedAtISO = new Date().toISOString()
  }

  updateTitle(title: string): void {
    if (!title.trim()) {
      throw new Error('Wiki page title cannot be empty')
    }
    this.title = title.trim()
    this.updatedAtISO = new Date().toISOString()
  }

  updateContent(content: string): void {
    this.content = content
    this.updatedAtISO = new Date().toISOString()
  }

  get isPublished(): boolean {
    return this.status === 'published' && !this.isArchived
  }
}

export type WorkspaceKnowledgeStatus = 'needs-input' | 'staged' | 'ready'

export interface WorkspaceKnowledgeSummary {
  readonly registeredAssetCount: number
  readonly readyAssetCount: number
  readonly supportedSourceCount: number
  readonly status: WorkspaceKnowledgeStatus
  readonly blockedReasons: readonly string[]
  readonly nextActions: readonly string[]
  readonly visibleSurface: 'workspace-tab-live'
  readonly contractStatus: 'contract-live'
}

// ─── Value Objects ─────────────────────────────────────────────────────────────

export type Visibility = 'PUBLIC' | 'PRIVATE' | 'INTERNAL'

export class AccessControl {
  constructor(
    public readonly ownerId: string,
    public readonly visibility: Visibility = 'INTERNAL',
  ) {}

  canAccess(userId: string): boolean {
    return this.visibility === 'PUBLIC' || this.ownerId === userId
  }
}

export type ContentStatusValue = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export class ContentStatus {
  private static readonly VALID: ContentStatusValue[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

  constructor(public readonly value: ContentStatusValue) {
    if (!ContentStatus.VALID.includes(value)) {
      throw new Error('Invalid status')
    }
  }

  get isSearchable(): boolean {
    return this.value === 'PUBLISHED'
  }
}

export interface EmbeddingProps {
  values: number[]
  model: string
  dimensions: number
}

export class Embedding {
  public readonly values: number[]
  public readonly model: string
  public readonly dimensions: number

  constructor(props: EmbeddingProps) {
    if (props.values.length === 0) {
      throw new Error('Embedding values cannot be empty')
    }
    if (props.values.length !== props.dimensions) {
      throw new Error(
        `Embedding dimensions mismatch: declared ${props.dimensions} but got ${props.values.length}`,
      )
    }
    if (!props.model.trim()) {
      throw new Error('Embedding model identifier is required')
    }
    this.values = [...props.values]
    this.model = props.model
    this.dimensions = props.dimensions
  }

  isCompatibleWith(other: Embedding): boolean {
    return this.model === other.model && this.dimensions === other.dimensions
  }
}

export interface RAGSource {
  readonly documentId: string
  readonly title: string
  readonly excerpt: string
  readonly score: number
  readonly taxonomy: string
}

export interface RAGQueryResultProps {
  readonly answer: string
  readonly sources: readonly RAGSource[]
  readonly confidence: number
  readonly queryLatencyMs?: number
}

const HIGH_CONFIDENCE_THRESHOLD = 0.7

export class RAGQueryResult {
  constructor(public readonly props: RAGQueryResultProps) {
    if (props.confidence < 0 || props.confidence > 1) {
      throw new Error('RAGQueryResult confidence must be between 0 and 1')
    }
  }

  get hasHighConfidence(): boolean {
    return this.props.confidence >= HIGH_CONFIDENCE_THRESHOLD
  }

  toJSON(): RAGQueryResultProps {
    return { ...this.props }
  }
}

export interface DateRange {
  start: Date
  end: Date
}

export class SearchFilter {
  constructor(
    public readonly category?: string,
    public readonly tags: string[] = [],
    public readonly dateRange?: DateRange,
  ) {}
}

export class Taxonomy {
  public readonly tags: string[]

  constructor(
    public readonly category: string,
    tags: string[],
    public readonly namespace: string = 'default',
  ) {
    this.tags = [...new Set(tags.map((t) => t.toLowerCase().trim()))]
  }

  equals(other: Taxonomy): boolean {
    return (
      this.category === other.category &&
      this.namespace === other.namespace &&
      this.tags.slice().sort().join(',') === other.tags.slice().sort().join(',')
    )
  }
}

export class UsageStats {
  constructor(
    public readonly viewCount: number,
    public readonly lastAccessedAt: Date | null,
  ) {}
}

export class Vector {
  constructor(public readonly values: number[]) {
    if (values.length === 0) {
      throw new Error('Vector cannot be empty')
    }
  }
}

export interface WikiDocumentSummaryProps {
  id: string
  title: string
  status: WikiDocumentStatus
}

export class WikiDocumentSummary {
  constructor(public readonly props: WikiDocumentSummaryProps) {}

  toJSON(): WikiDocumentSummaryProps {
    return { ...this.props }
  }
}

// ─── Repository Ports ──────────────────────────────────────────────────────────

export interface IWikiDocumentRepository {
  save(entity: WikiDocument): Promise<void>
  findById(id: string): Promise<WikiDocument | null>
  findByOrganization(organizationId: string): Promise<WikiDocument[]>
  findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiDocument[]>
  search(vector: number[]): Promise<WikiDocument[]>
}

export interface IWikiPageRepository {
  save(page: WikiPage): Promise<void>
  findById(pageId: string): Promise<WikiPage | null>
  findByOrganization(organizationId: string, scope?: WikiPageScope): Promise<WikiPage[]>
  findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiPage[]>
  findChildren(parentPageId: string): Promise<WikiPage[]>
  findArchived(organizationId: string): Promise<WikiPage[]>
  delete(pageId: string): Promise<void>
}

export interface IKnowledgeSummaryScope {
  readonly workspaceId: string
}

export interface IKnowledgeSummaryRepository {
  summarize(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary
}

export interface RetrievalHit {
  entity: WikiDocument
  score: number
}

export interface IRetrievalRepository {
  searchByVector(vector: number[], topK: number): Promise<RetrievalHit[]>
  searchByMetadata(filter: string, vector: number[]): Promise<WikiDocument[]>
}

export interface EmbedTextDTO {
  text: string
  documentId?: string
}

export interface IEmbeddingRepository {
  embed(dto: EmbedTextDTO): Promise<Embedding>
  embedBatch(dtos: EmbedTextDTO[]): Promise<Embedding[]>
}

// ─── Domain Services ───────────────────────────────────────────────────────────

export interface KnowledgeSummaryCopy {
  readonly noAssetsBlockedReason: string
  readonly stagedAction: string
  readonly readyAction: string
  readonly defaultAction: string
}

export interface KnowledgeWorkspaceSnapshot {
  readonly registeredAssetCount: number
  readonly readyAssetCount: number
  readonly supportedSourceCount: number
  readonly parserBlockedReasons: readonly string[]
  readonly parserNextActions: readonly string[]
}

export function deriveKnowledgeSummary(
  workspace: KnowledgeWorkspaceSnapshot,
  copy: KnowledgeSummaryCopy,
): WorkspaceKnowledgeSummary {
  const blockedReasons: string[] = []
  const nextActionSet = new Set<string>()

  for (const reason of workspace.parserBlockedReasons) {
    blockedReasons.push(reason)
  }

  for (const action of workspace.parserNextActions) {
    nextActionSet.add(action)
  }

  if (workspace.registeredAssetCount === 0) {
    blockedReasons.unshift(copy.noAssetsBlockedReason)
  }

  const status =
    workspace.readyAssetCount === 0
      ? 'needs-input'
      : blockedReasons.length > 0
        ? 'staged'
        : 'ready'

  if (status === 'staged') {
    nextActionSet.add(copy.stagedAction)
  }

  if (status === 'ready') {
    nextActionSet.add(copy.readyAction)
  }

  if (nextActionSet.size === 0) {
    nextActionSet.add(copy.defaultAction)
  }

  return {
    registeredAssetCount: workspace.registeredAssetCount,
    readyAssetCount: workspace.readyAssetCount,
    supportedSourceCount: workspace.supportedSourceCount,
    status,
    blockedReasons,
    nextActions: Array.from(nextActionSet),
    visibleSurface: 'workspace-tab-live',
    contractStatus: 'contract-live',
  }
}
