/**
 * KnowledgeArtifact — canonical ubiquitous-language aggregate for the notion
 * bounded context.
 *
 * A KnowledgeArtifact is the top-level knowledge unit authored, versioned, and
 * published within a workspace. It acts as the canonical container; subordinate
 * building blocks (Page, Block) represent implementation details.
 *
 * "KnowledgeArtifact" is the strategic term per
 * docs/structure/domain/ubiquitous-language.md.
 */
import { v4 as uuid } from "uuid";

export type KnowledgeArtifactStatus = "draft" | "published" | "archived";
export type KnowledgeArtifactType = "article" | "wiki" | "guide" | "reference" | "other";

export interface KnowledgeArtifactSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly organizationId: string;
  readonly title: string;
  readonly type: KnowledgeArtifactType;
  readonly status: KnowledgeArtifactStatus;
  readonly authorId: string;
  /** Root page ID linking this artifact to the page subdomain. */
  readonly rootPageId?: string;
  readonly tags: readonly string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly publishedAtISO?: string;
  readonly archivedAtISO?: string;
}

export interface CreateKnowledgeArtifactInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly organizationId: string;
  readonly title: string;
  readonly type?: KnowledgeArtifactType;
  readonly authorId: string;
  readonly tags?: string[];
}

export class KnowledgeArtifact {
  private _domainEvents: Array<{
    type: string;
    eventId: string;
    occurredAt: string;
    payload: Record<string, unknown>;
  }> = [];

  private constructor(private _props: KnowledgeArtifactSnapshot) {}

  static create(input: CreateKnowledgeArtifactInput): KnowledgeArtifact {
    if (!input.title.trim()) throw new Error("KnowledgeArtifact title cannot be empty");
    const now = new Date().toISOString();
    const artifact = new KnowledgeArtifact({
      id: uuid(),
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      organizationId: input.organizationId,
      title: input.title.trim(),
      type: input.type ?? "article",
      status: "draft",
      authorId: input.authorId,
      tags: input.tags ?? [],
      createdAtISO: now,
      updatedAtISO: now,
    });
    artifact._domainEvents.push({
      type: "notion.knowledge.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { artifactId: artifact._props.id, workspaceId: input.workspaceId },
    });
    return artifact;
  }

  static reconstitute(snapshot: KnowledgeArtifactSnapshot): KnowledgeArtifact {
    return new KnowledgeArtifact(snapshot);
  }

  publish(): void {
    if (this._props.status === "archived") throw new Error("Cannot publish an archived artifact");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "published", publishedAtISO: now, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.published",
      eventId: uuid(),
      occurredAt: now,
      payload: { artifactId: this._props.id, workspaceId: this._props.workspaceId },
    });
  }

  archive(): void {
    if (this._props.status === "archived") throw new Error("Artifact already archived");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", archivedAtISO: now, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.archived",
      eventId: uuid(),
      occurredAt: now,
      payload: { artifactId: this._props.id },
    });
  }

  linkRootPage(pageId: string): void {
    this._props = { ...this._props, rootPageId: pageId, updatedAtISO: new Date().toISOString() };
  }

  rename(title: string): void {
    if (!title.trim()) throw new Error("KnowledgeArtifact title cannot be empty");
    this._props = { ...this._props, title: title.trim(), updatedAtISO: new Date().toISOString() };
  }

  get id(): string { return this._props.id; }
  get title(): string { return this._props.title; }
  get status(): KnowledgeArtifactStatus { return this._props.status; }
  get workspaceId(): string { return this._props.workspaceId; }
  get authorId(): string { return this._props.authorId; }
  get type(): KnowledgeArtifactType { return this._props.type; }

  getSnapshot(): Readonly<KnowledgeArtifactSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
