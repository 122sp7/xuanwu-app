const diagrams = Object.freeze({
  agentArchitectureCommanderSubagents: "docs/diagrams-events-explanations/diagrams/agent-architecture-commander-subagents.mermaid",
  aiKnowledgePlatformArchitecture: "docs/diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png",
  apiDataFlow: "docs/diagrams-events-explanations/diagrams/api-data-flow.mermaid",
  authStateMachine: "docs/diagrams-events-explanations/diagrams/auth-state-machine.mermaid",
  coreLogic: "docs/diagrams-events-explanations/diagrams/core-logic.mermaid",
  erdModel: "docs/diagrams-events-explanations/diagrams/erd-model.mermaid",
  eventBusMessageFlow: "docs/diagrams-events-explanations/diagrams/event-bus-message-flow.mermaid",
  firestoreCollectionPathStructure: "docs/diagrams-events-explanations/diagrams/firestore-collection-path-structure.mermaid",
  kbIngestionPipelineStateMachine: "docs/diagrams-events-explanations/diagrams/kb-ingestion-pipeline-state-machine.mermaid",
  nextjsAppRouterStructure: "docs/diagrams-events-explanations/diagrams/nextjs-app-router-structure.mermaid",
  projectDerivation: "docs/diagrams-events-explanations/diagrams/project-derivation.mermaid",
  ragEnterpriseE2e: "docs/diagrams-events-explanations/diagrams/rag-enterprise-e2e.mermaid",
  readme: "docs/diagrams-events-explanations/diagrams/README.md",
  securityRulesDecisionFlow: "docs/diagrams-events-explanations/diagrams/security-rules-decision-flow.mermaid",
  stateMachine: "docs/diagrams-events-explanations/diagrams/state-machine.mermaid",
  systemArchitectureOverviewCombined: "docs/diagrams-events-explanations/diagrams/system-architecture-overview-combined.mermaid",
  systemMultiWorkspaceHierarchy: "docs/diagrams-events-explanations/diagrams/system-multi-workspace-hierarchy.mermaid",
  workspaceInteractionFlow: "docs/diagrams-events-explanations/diagrams/workspace-interaction-flow.mermaid",
  workspaceInternalDataModel: "docs/diagrams-events-explanations/diagrams/workspace-internal-data-model.mermaid",
});

const explanation = Object.freeze({
  agenticDeliveryModel: "docs/diagrams-events-explanations/explanation/agentic-delivery-model.md",
  developmentContractGovernance: "docs/diagrams-events-explanations/explanation/development-contract-governance.md",
});

const markdown = Object.freeze({
  diagramsReadme: diagrams.readme,
  explanationAgenticDeliveryModel: explanation.agenticDeliveryModel,
  explanationDevelopmentContractGovernance: explanation.developmentContractGovernance,
});

const assets = Object.freeze({
  agentArchitectureCommanderSubagents: diagrams.agentArchitectureCommanderSubagents,
  aiKnowledgePlatformArchitecture: diagrams.aiKnowledgePlatformArchitecture,
  apiDataFlow: diagrams.apiDataFlow,
  authStateMachine: diagrams.authStateMachine,
  coreLogic: diagrams.coreLogic,
  erdModel: diagrams.erdModel,
  eventBusMessageFlow: diagrams.eventBusMessageFlow,
  firestoreCollectionPathStructure: diagrams.firestoreCollectionPathStructure,
  kbIngestionPipelineStateMachine: diagrams.kbIngestionPipelineStateMachine,
  nextjsAppRouterStructure: diagrams.nextjsAppRouterStructure,
  projectDerivation: diagrams.projectDerivation,
  ragEnterpriseE2e: diagrams.ragEnterpriseE2e,
  securityRulesDecisionFlow: diagrams.securityRulesDecisionFlow,
  stateMachine: diagrams.stateMachine,
  systemArchitectureOverviewCombined: diagrams.systemArchitectureOverviewCombined,
  systemMultiWorkspaceHierarchy: diagrams.systemMultiWorkspaceHierarchy,
  workspaceInteractionFlow: diagrams.workspaceInteractionFlow,
  workspaceInternalDataModel: diagrams.workspaceInternalDataModel,
});

module.exports = Object.freeze({
  diagrams,
  explanation,
  markdown,
  assets,
});