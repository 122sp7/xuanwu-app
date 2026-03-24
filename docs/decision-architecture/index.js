const adr = Object.freeze({
  adr001RagUploadStorageAndDocumentLifecycle: "docs/decision-architecture/adr/ADR-001-rag-upload-storage-and-document-lifecycle.md",
  adr002RagUploadStorageAndNaming: "docs/decision-architecture/adr/ADR-002-rag-upload-storage-and-naming.md",
  adr003RagFirestoreDataModelAndLifecycle: "docs/decision-architecture/adr/ADR-003-rag-firestore-data-model-and-lifecycle.md",
  adr004RagQueryRetrievalAndEnterpriseEnhancements: "docs/decision-architecture/adr/ADR-004-rag-query-retrieval-and-enterprise-enhancements.md",
  adr005RagIngestionExecutionContract: "docs/decision-architecture/adr/ADR-005-rag-ingestion-execution-contract.md",
  adr006RagQueryExecutionContract: "docs/decision-architecture/adr/ADR-006-rag-query-execution-contract.md",
  adr007RagOptionalEnhancementsRollout: "docs/decision-architecture/adr/ADR-007-rag-optional-enhancements-rollout.md",
  adr008RagObservabilitySloAndAcceptance: "docs/decision-architecture/adr/ADR-008-rag-observability-slo-and-acceptance.md",
  adr009RagFirestoreIndexMatrix: "docs/decision-architecture/adr/ADR-009-rag-firestore-index-matrix.md",
  adr010RagUploadAndWorkerEventContract: "docs/decision-architecture/adr/ADR-010-rag-upload-and-worker-event-contract.md",
  adr011RagGenkitFlowContract: "docs/decision-architecture/adr/ADR-011-rag-genkit-flow-contract.md",
  adr012FunctionsPythonDirectoryPlacement: "docs/decision-architecture/adr/ADR-012-functions-python-directory-placement.md",
});

const architecture = Object.freeze({
  aiKnowledgePlatformArchitecture: "docs/decision-architecture/architecture/ai-knowledge-platform-architecture.md",
  daily: "docs/decision-architecture/architecture/daily.md",
  event: "docs/decision-architecture/architecture/event.md",
  namespace: "docs/decision-architecture/architecture/namespace.md",
  schedule: "docs/decision-architecture/architecture/schedule.md",
});

const design = Object.freeze({
  coreLogic: "docs/decision-architecture/design/core-logic.mermaid",
  erdModel: "docs/decision-architecture/design/erd-model.mermaid",
  projectDerivation: "docs/decision-architecture/design/project-derivation.mermaid",
  ragEnterpriseE2e: "docs/decision-architecture/design/rag-enterprise-e2e.mermaid",
  stateMachine: "docs/decision-architecture/design/state-machine.mermaid",
});

const markdown = Object.freeze({
  ...adr,
  ...architecture,
});

const assets = Object.freeze({
  ...design,
});

module.exports = Object.freeze({
  adr,
  architecture,
  design,
  markdown,
  assets,
});