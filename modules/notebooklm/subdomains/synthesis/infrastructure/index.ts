/**
 * Infrastructure layer for notebooklm subdomain 'synthesis'.
 * Contains Firebase adapters and platform-delegating adapters for the RAG pipeline.
 */
export { FirebaseRagRetrievalAdapter } from "./firebase/FirebaseRagRetrievalAdapter";
export { FirebaseKnowledgeContentAdapter } from "./firebase/FirebaseKnowledgeContentAdapter";
export { FirebaseRagQueryFeedbackAdapter } from "./firebase/FirebaseRagQueryFeedbackAdapter";
export { PlatformRagGenerationAdapter } from "./platform/PlatformRagGenerationAdapter";
