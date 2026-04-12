/**
 * Infrastructure layer for notebooklm subdomain 'synthesis'.
 * Contains Firebase and Genkit adapters for the RAG pipeline.
 */
export { FirebaseRagRetrievalAdapter } from "./firebase/FirebaseRagRetrievalAdapter";
export { FirebaseKnowledgeContentAdapter } from "./firebase/FirebaseKnowledgeContentAdapter";
export { FirebaseRagQueryFeedbackAdapter } from "./firebase/FirebaseRagQueryFeedbackAdapter";
export { GenkitRagGenerationAdapter } from "./genkit/GenkitRagGenerationAdapter";
