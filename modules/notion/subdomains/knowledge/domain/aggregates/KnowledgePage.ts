/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: KnowledgePage aggregate root — proper DDD class with private constructor,
 *          static factory methods, business methods, and domain events.
 */

import { v4 as uuid } from "@lib-uuid";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export interface KnowledgePageSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: "active" | "archived";
  readonly approvalState?: "pending" | "approved";
  readonly approvedAtISO?: string;
  readonly approvedByUserId?: string;
  readonly verificationState?: "verified" | "needs_review";
  readonly ownerId?: string;
  readonly verifiedByUserId?: string;
  readonly verifiedAtISO?: string;
  readonly verificationExpiresAtISO?: string;
  readonly iconUrl?: string;
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId: string | null;
  readonly createdByUserId: string;
  readonly order: number;
}

export class KnowledgePage {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: KnowledgePageSnapshot) {}

  static create(id: string, input: CreateKnowledgePageInput): KnowledgePage {
    const now = new Date().toISOString();
    const slug = KnowledgePage.slugify(input.title);
    const page = new KnowledgePage({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      title: input.title,
      slug,
      parentPageId: input.parentPageId,
      order: input.order,
      blockIds: [],
      status: "active",
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    page._domainEvents.push({
      type: "notion.knowledge.page-created",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        pageId: id,
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        title: input.title,
        createdByUserId: input.createdByUserId,
      },
    });
    return page;
  }

  static reconstitute(snapshot: KnowledgePageSnapshot): KnowledgePage {
    return new KnowledgePage({ ...snapshot });
  }

  rename(newTitle: string): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot rename an archived page.");
    }
    const previousTitle = this._props.title;
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      title: newTitle,
      slug: KnowledgePage.slugify(newTitle),
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page-renamed",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, previousTitle, newTitle },
    });
  }

  move(targetParentId: string | null): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot move an archived page.");
    }
    if (targetParentId === this._props.id) {
      throw new Error("A page cannot be its own parent.");
    }
    const previousParentPageId = this._props.parentPageId;
    const now = new Date().toISOString();
    this._props = { ...this._props, parentPageId: targetParentId, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page-moved",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        pageId: this._props.id,
        accountId: this._props.accountId,
        previousParentPageId,
        newParentPageId: targetParentId,
      },
    });
  }

  archive(): void {
    if (this._props.status === "archived") {
      throw new Error("Page is already archived.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page-archived",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId },
    });
  }

  approve(byUserId: string, atISO: string): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot approve an archived page.");
    }
    if (this._props.approvalState === "approved") {
      throw new Error("Page is already approved.");
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      approvalState: "approved",
      approvedByUserId: byUserId,
      approvedAtISO: atISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page-approved",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        pageId: this._props.id,
        accountId: this._props.accountId,
        workspaceId: this._props.workspaceId,
        actorId: byUserId,
        extractedTasks: [],
        extractedInvoices: [],
        causationId: uuid(),
        correlationId: uuid(),
      },
    });
  }

  verify(byUserId: string, expiresAtISO?: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      verificationState: "verified",
      verifiedByUserId: byUserId,
      verifiedAtISO: now,
      verificationExpiresAtISO: expiresAtISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page-verified",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        pageId: this._props.id,
        accountId: this._props.accountId,
        verifiedByUserId: byUserId,
        verificationExpiresAtISO: expiresAtISO,
      },
    });
  }

  requestReview(byUserId: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, verificationState: "needs_review", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page-review-requested",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, requestedByUserId: byUserId },
    });
  }

  assignOwner(ownerId: string): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, ownerId, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.page-owner-assigned",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, ownerId },
    });
  }

  updateIcon(iconUrl: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      iconUrl: iconUrl || undefined,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page-icon-updated",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, iconUrl },
    });
  }

  updateCover(coverUrl: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      coverUrl: coverUrl || undefined,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "notion.knowledge.page-cover-updated",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: this._props.id, accountId: this._props.accountId, coverUrl },
    });
  }

  reorderBlocks(blockIds: ReadonlyArray<string>): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, blockIds, updatedAtISO: now };
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
  get workspaceId(): string | undefined { return this._props.workspaceId; }
  get title(): string { return this._props.title; }
  get slug(): string { return this._props.slug; }
  get parentPageId(): string | null { return this._props.parentPageId; }
  get order(): number { return this._props.order; }
  get blockIds(): readonly string[] { return this._props.blockIds; }
  get status(): "active" | "archived" { return this._props.status; }
  get approvalState(): "pending" | "approved" | undefined { return this._props.approvalState; }
  get approvedAtISO(): string | undefined { return this._props.approvedAtISO; }
  get approvedByUserId(): string | undefined { return this._props.approvedByUserId; }
  get verificationState(): "verified" | "needs_review" | undefined { return this._props.verificationState; }
  get ownerId(): string | undefined { return this._props.ownerId; }
  get verifiedByUserId(): string | undefined { return this._props.verifiedByUserId; }
  get verifiedAtISO(): string | undefined { return this._props.verifiedAtISO; }
  get verificationExpiresAtISO(): string | undefined { return this._props.verificationExpiresAtISO; }
  get iconUrl(): string | undefined { return this._props.iconUrl; }
  get coverUrl(): string | undefined { return this._props.coverUrl; }
  get createdByUserId(): string { return this._props.createdByUserId; }
  get createdAtISO(): string { return this._props.createdAtISO; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<KnowledgePageSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private static slugify(title: string): string {
    return (
      title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100) || "page"
    );
  }
}

/** Tree node for hierarchical views */
export interface KnowledgePageTreeNode extends KnowledgePageSnapshot {
  readonly children: readonly KnowledgePageTreeNode[];
}
