const diagrams = Object.freeze({
  agentArchitectureCommanderSubagents: "docs/diagrams-events-explanations/diagrams/agent-architecture-commander-subagents.mermaid",
  aiKnowledgePlatformArchitecture: "docs/diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png",
  apiDataFlow: "docs/diagrams-events-explanations/diagrams/api-data-flow.mermaid",
  authStateMachine: "docs/diagrams-events-explanations/diagrams/auth-state-machine.mermaid",
  eventBusMessageFlow: "docs/diagrams-events-explanations/diagrams/event-bus-message-flow.mermaid",
  firestoreCollectionPathStructure: "docs/diagrams-events-explanations/diagrams/firestore-collection-path-structure.mermaid",
  kbIngestionPipelineStateMachine: "docs/diagrams-events-explanations/diagrams/kb-ingestion-pipeline-state-machine.mermaid",
  nextjsAppRouterStructure: "docs/diagrams-events-explanations/diagrams/nextjs-app-router-structure.mermaid",
  readme: "docs/diagrams-events-explanations/diagrams/README.md",
  securityRulesDecisionFlow: "docs/diagrams-events-explanations/diagrams/security-rules-decision-flow.mermaid",
  systemArchitectureOverviewCombined: "docs/diagrams-events-explanations/diagrams/system-architecture-overview-combined.mermaid",
  systemMultiWorkspaceHierarchy: "docs/diagrams-events-explanations/diagrams/system-multi-workspace-hierarchy.mermaid",
  workspaceInteractionFlow: "docs/diagrams-events-explanations/diagrams/workspace-interaction-flow.mermaid",
  workspaceInternalDataModel: "docs/diagrams-events-explanations/diagrams/workspace-internal-data-model.mermaid",
});

const event = Object.freeze({
  developmentGuide: "docs/diagrams-events-explanations/event/development-guide.md",
  userManual: "docs/diagrams-events-explanations/event/user-manual.md",
});

const explanation = Object.freeze({
  developmentContractGovernance: "docs/diagrams-events-explanations/explanation/development-contract-governance.md",
  ai: Object.freeze({
    agenticDeliveryModel: "docs/diagrams-events-explanations/explanation/ai/agentic-delivery-model.md",
  }),
});

const markdown = Object.freeze({
  diagramsReadme: diagrams.readme,
  eventDevelopmentGuide: event.developmentGuide,
  eventUserManual: event.userManual,
  explanationDevelopmentContractGovernance: explanation.developmentContractGovernance,
  explanationAiAgenticDeliveryModel: explanation.ai.agenticDeliveryModel,
});

const assets = Object.freeze({
  agentArchitectureCommanderSubagents: diagrams.agentArchitectureCommanderSubagents,
  aiKnowledgePlatformArchitecture: diagrams.aiKnowledgePlatformArchitecture,
  apiDataFlow: diagrams.apiDataFlow,
  authStateMachine: diagrams.authStateMachine,
  eventBusMessageFlow: diagrams.eventBusMessageFlow,
  firestoreCollectionPathStructure: diagrams.firestoreCollectionPathStructure,
  kbIngestionPipelineStateMachine: diagrams.kbIngestionPipelineStateMachine,
  nextjsAppRouterStructure: diagrams.nextjsAppRouterStructure,
  securityRulesDecisionFlow: diagrams.securityRulesDecisionFlow,
  systemArchitectureOverviewCombined: diagrams.systemArchitectureOverviewCombined,
  systemMultiWorkspaceHierarchy: diagrams.systemMultiWorkspaceHierarchy,
  workspaceInteractionFlow: diagrams.workspaceInteractionFlow,
  workspaceInternalDataModel: diagrams.workspaceInternalDataModel,
});

module.exports = Object.freeze({
  diagrams,
  event,
  explanation,
  markdown,
  assets,
});