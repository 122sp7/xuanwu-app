/**
 * notebooklm/notebook domain/ports — driven port interfaces for the notebook subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { NotebookRepository as INotebookPort } from "../repositories/NotebookRepository";
