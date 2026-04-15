/**
 * background-job domain/ports — driven port interfaces for the background-job subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { BackgroundJobRepository } from "../repositories/BackgroundJobRepository";
