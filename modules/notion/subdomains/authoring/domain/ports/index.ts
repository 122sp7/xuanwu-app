/**
 * notion/authoring domain/ports — driven port interfaces for the authoring subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IArticleRepository as IArticlePort } from "../repositories/IArticleRepository";
export type { ICategoryRepository as ICategoryPort } from "../repositories/ICategoryRepository";
