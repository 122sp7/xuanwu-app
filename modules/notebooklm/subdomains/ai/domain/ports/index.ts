/**
 * notebooklm/ai domain/ports — driven port interfaces for the ai subdomain.
 *
 * These re-export the repository contracts from domain/repositories/ and
 * the existing IVectorStore port from domain/ports/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IRagGenerationRepository as IRagGenerationPort } from "../repositories/IRagGenerationRepository";
export type { IRagQueryFeedbackRepository as IRagQueryFeedbackPort } from "../repositories/IRagQueryFeedbackRepository";
export type { IRagRetrievalRepository as IRagRetrievalPort } from "../repositories/IRagRetrievalRepository";
export type { IKnowledgeContentRepository as IKnowledgeContentPort } from "../repositories/IKnowledgeContentRepository";
export type { IVectorStore } from "./IVectorStore";
