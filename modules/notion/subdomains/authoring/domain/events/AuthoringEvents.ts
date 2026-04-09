/**
 * Module: notion/subdomains/authoring
 * Layer: domain/events
 * Purpose: Published event discriminated-union types for authoring subdomain.
 */

export interface AuthoringArticleCreatedEvent {
  readonly type: "notion.authoring.article_created";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}

export interface AuthoringArticlePublishedEvent {
  readonly type: "notion.authoring.article_published";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
    readonly version: number;
  };
}

export interface AuthoringArticleArchivedEvent {
  readonly type: "notion.authoring.article_archived";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
  };
}
