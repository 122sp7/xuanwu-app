/**
 * Module: notion/subdomains/authoring
 * Layer: domain/aggregates
 * Purpose: Article aggregate root — lifecycle, publication, and verification of KB articles.
 */

import type { NotionDomainEvent } from "../../../../core/domain/events/NotionDomainEvent";

export type ArticleStatus = "draft" | "published" | "archived";
export type ArticleVerificationState = "verified" | "needs_review" | "unverified";

export interface ArticleSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly status: ArticleStatus;
  readonly version: number;
  readonly verificationState: ArticleVerificationState;
  readonly ownerId: string | null;
  readonly verifiedByUserId: string | null;
  readonly verifiedAtISO: string | null;
  readonly verificationExpiresAtISO: string | null;
  readonly linkedArticleIds: readonly string[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateArticleInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly content: string;
  readonly tags: string[];
  readonly createdByUserId: string;
}

export class Article {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: ArticleSnapshot) {}

  static create(id: string, input: CreateArticleInput): Article {
    const now = new Date().toISOString();
    const article = new Article({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      categoryId: input.categoryId,
      title: input.title,
      content: input.content,
      tags: input.tags,
      status: "draft",
      version: 1,
      verificationState: "unverified",
      ownerId: input.createdByUserId,
      verifiedByUserId: null,
      verifiedAtISO: null,
      verificationExpiresAtISO: null,
      linkedArticleIds: [],
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    article._domainEvents.push({
      type: "notion.authoring.article_created",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { articleId: id, accountId: input.accountId, workspaceId: input.workspaceId, title: input.title },
    });
    return article;
  }

  static reconstitute(snapshot: ArticleSnapshot): Article {
    return new Article({ ...snapshot });
  }

  update(fields: { title?: string; content?: string; categoryId?: string | null; tags?: string[] }): void {
    if (this._props.status === "archived") throw new Error("Cannot update archived article.");
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      title: fields.title ?? this._props.title,
      content: fields.content ?? this._props.content,
      categoryId: fields.categoryId !== undefined ? fields.categoryId : this._props.categoryId,
      tags: fields.tags ?? this._props.tags,
      updatedAtISO: now,
    };
  }

  publish(): void {
    if (this._props.status !== "draft") throw new Error("Only draft articles can be published.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "published", version: this._props.version + 1, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.authoring.article_published",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { articleId: this._props.id, accountId: this._props.accountId, version: this._props.version },
    });
  }

  archive(): void {
    if (this._props.status === "archived") throw new Error("Article is already archived.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.authoring.article_archived",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { articleId: this._props.id, accountId: this._props.accountId },
    });
  }

  verify(byUserId: string, expiresAtISO?: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      verificationState: "verified",
      verifiedByUserId: byUserId,
      verifiedAtISO: now,
      verificationExpiresAtISO: expiresAtISO ?? null,
      updatedAtISO: now,
    };
  }

  requestReview(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, verificationState: "needs_review", updatedAtISO: now };
  }

  getSnapshot(): ArticleSnapshot {
    return { ...this._props };
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
  get status(): ArticleStatus { return this._props.status; }
}
