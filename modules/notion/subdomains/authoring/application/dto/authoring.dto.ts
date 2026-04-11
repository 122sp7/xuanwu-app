/**
 * Application-layer DTO re-exports for the authoring subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../domain/aggregates/Article";
export type { CategorySnapshot } from "../../domain/aggregates/Category";
