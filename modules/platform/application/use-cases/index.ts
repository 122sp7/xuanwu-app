/**
 * platform application use-cases barrel.
 *
 * Each file follows the kebab-case convention: verb-noun.use-cases.ts
 *
 * Commands:
 *   register-platform-context
 *   publish-policy-catalog
 *   apply-configuration-profile
 *   register-integration-contract
 *   activate-subscription-agreement
 *   fire-workflow-trigger
 *   request-notification-dispatch
 *   record-audit-signal
 *   emit-observability-signal
 *
 * Queries:
 *   get-platform-context-view
 *   list-enabled-capabilities
 *   get-policy-catalog-view
 *   get-subscription-entitlements
 *   get-workflow-policy-view
 */

export { RegisterPlatformContextUseCase } from "./register-platform-context.use-cases";
export { PublishPolicyCatalogUseCase } from "./publish-policy-catalog.use-cases";
export { ApplyConfigurationProfileUseCase } from "./apply-configuration-profile.use-cases";
export { RegisterIntegrationContractUseCase } from "./register-integration-contract.use-cases";
export { ActivateSubscriptionAgreementUseCase } from "./activate-subscription-agreement.use-cases";
export { FireWorkflowTriggerUseCase } from "./fire-workflow-trigger.use-cases";
export { RequestNotificationDispatchUseCase } from "./request-notification-dispatch.use-cases";
export { RecordAuditSignalUseCase } from "./record-audit-signal.use-cases";
export { EmitObservabilitySignalUseCase } from "./emit-observability-signal.use-cases";
export { GetPlatformContextViewUseCase } from "./get-platform-context-view.use-cases";
export { ListEnabledCapabilitiesUseCase } from "./list-enabled-capabilities.use-cases";
export { GetPolicyCatalogViewUseCase } from "./get-policy-catalog-view.use-cases";
export { GetSubscriptionEntitlementsUseCase } from "./get-subscription-entitlements.use-cases";
export { GetWorkflowPolicyViewUseCase } from "./get-workflow-policy-view.use-cases";
