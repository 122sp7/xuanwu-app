/**
 * notion/authoring domain/ports — driven port interfaces for the authoring subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { ArticleRepository as IArticlePort } from "../repositories/ArticleRepository";
export type { CategoryRepository as ICategoryPort } from "../repositories/CategoryRepository";
