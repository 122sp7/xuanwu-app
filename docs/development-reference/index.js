const development = Object.freeze({
  branchStrategy: "docs/development-reference/development/branch-strategy.md",
  codeStyle: "docs/development-reference/development/code-style.md",
  developmentProcess: "docs/development-reference/development/development-process.md",
  modulesImplementationGuide: "docs/development-reference/development/modules-implementation-guide.md",
  readme: "docs/development-reference/development/README.md",
});

const event = Object.freeze({
  developmentGuide: "docs/development-reference/event/development-guide.md",
  userManual: "docs/development-reference/event/user-manual.md",
});

const namespace = Object.freeze({
  developmentGuide: "docs/development-reference/namespace/development-guide.md",
  userManual: "docs/development-reference/namespace/user-manual.md",
});

const reference = Object.freeze({
  ai: Object.freeze({
    customizationsIndex: "docs/development-reference/reference/ai/customizations-index.md",
    handoffMatrix: "docs/development-reference/reference/ai/handoff-matrix.md",
    implementationPlanTemplate: "docs/development-reference/reference/ai/implementation-plan-template.md",
    legacyCustomizationsMigration: "docs/development-reference/reference/ai/legacy-customizations-migration.md",
    planSchema: "docs/development-reference/reference/ai/plan-schema.md",
  }),
  developmentContracts: Object.freeze({
    acceptanceContract: "docs/development-reference/reference/development-contracts/acceptance-contract.md",
    auditContract: "docs/development-reference/reference/development-contracts/audit-contract.md",
    billingContract: "docs/development-reference/reference/development-contracts/billing-contract.md",
    dailyContract: "docs/development-reference/reference/development-contracts/daily-contract.md",
    eventContract: "docs/development-reference/reference/development-contracts/event-contract.md",
    namespaceContract: "docs/development-reference/reference/development-contracts/namespace-contract.md",
    overview: "docs/development-reference/reference/development-contracts/overview.md",
    parserContract: "docs/development-reference/reference/development-contracts/parser-contract.md",
    ragIngestionContract: "docs/development-reference/reference/development-contracts/rag-ingestion-contract.md",
    scheduleContract: "docs/development-reference/reference/development-contracts/schedule-contract.md",
  }),
});

const specification = Object.freeze({
  readme: "docs/development-reference/specification/README.md",
  systemOverview: "docs/development-reference/specification/system-overview.md",
});

const markdown = Object.freeze({
  developmentBranchStrategy: development.branchStrategy,
  developmentCodeStyle: development.codeStyle,
  developmentDevelopmentProcess: development.developmentProcess,
  developmentModulesImplementationGuide: development.modulesImplementationGuide,
  developmentReadme: development.readme,
  eventDevelopmentGuide: event.developmentGuide,
  eventUserManual: event.userManual,
  namespaceDevelopmentGuide: namespace.developmentGuide,
  namespaceUserManual: namespace.userManual,
  referenceAiCustomizationsIndex: reference.ai.customizationsIndex,
  referenceAiHandoffMatrix: reference.ai.handoffMatrix,
  referenceAiImplementationPlanTemplate: reference.ai.implementationPlanTemplate,
  referenceAiLegacyCustomizationsMigration: reference.ai.legacyCustomizationsMigration,
  referenceAiPlanSchema: reference.ai.planSchema,
  developmentContractsAcceptance: reference.developmentContracts.acceptanceContract,
  developmentContractsAudit: reference.developmentContracts.auditContract,
  developmentContractsBilling: reference.developmentContracts.billingContract,
  developmentContractsDaily: reference.developmentContracts.dailyContract,
  developmentContractsEvent: reference.developmentContracts.eventContract,
  developmentContractsNamespace: reference.developmentContracts.namespaceContract,
  developmentContractsOverview: reference.developmentContracts.overview,
  developmentContractsParser: reference.developmentContracts.parserContract,
  developmentContractsRagIngestion: reference.developmentContracts.ragIngestionContract,
  developmentContractsSchedule: reference.developmentContracts.scheduleContract,
  specificationReadme: specification.readme,
  specificationSystemOverview: specification.systemOverview,
});

const assets = Object.freeze({});

module.exports = Object.freeze({
  development,
  event,
  namespace,
  reference,
  specification,
  markdown,
  assets,
});