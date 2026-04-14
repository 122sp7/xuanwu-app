# Directory Structure

```
.github/
  agents/
    ai-genkit-lead.agent.md (42 lines)
    app-router.agent.md (48 lines)
    architecture-enforcer.agent.md (77 lines)
    chunk-strategist.agent.md (35 lines)
    commands.md (54 lines)
    doc-ingest.agent.md (36 lines)
    domain-architect.agent.md (68 lines)
    domain-enforcer.agent.md (85 lines)
    domain-lead.agent.md (46 lines)
    e2e-qa.agent.md (46 lines)
    embedding-writer.agent.md (35 lines)
    firebase-guardian.agent.md (81 lines)
    firestore-schema.agent.md (33 lines)
    frontend-lead.agent.md (37 lines)
    genkit-flow.agent.md (42 lines)
    genkit-orchestrator.agent.md (83 lines)
    hexagonal-convergence-enforcer.agent.md (112 lines)
    hexagonal-ddd-architect.agent.md (51 lines)
    kb-architect.agent.md (44 lines)
    knowledge-base.md (55 lines)
    lint-rule-enforcer.agent.md (38 lines)
    prompt-engineer.agent.md (38 lines)
    quality-lead.agent.md (52 lines)
    rag-lead.agent.md (41 lines)
    schema-migration.agent.md (33 lines)
    security-rules.agent.md (37 lines)
    server-action-writer.agent.md (33 lines)
    shadcn-composer.agent.md (40 lines)
    state-management.agent.md (58 lines)
    test-scenario-writer.agent.md (33 lines)
    ts-interface-writer.agent.md (39 lines)
    zod-validator.agent.md (57 lines)
  instructions/
    architecture-core.instructions.md (137 lines)
    architecture-runtime.instructions.md (40 lines)
    architecture.instructions.md (211 lines)
    bounded-context-rules.instructions.md (34 lines)
    ci-cd.instructions.md (20 lines)
    cloud-functions.instructions.md (29 lines)
    docs-authority-and-language.instructions.md (40 lines)
    domain-layer-rules.instructions.md (38 lines)
    domain-modeling.instructions.md (124 lines)
    embedding-pipeline.instructions.md (23 lines)
    event-driven-state.instructions.md (107 lines)
    firestore-schema.instructions.md (20 lines)
    genkit-flow.instructions.md (111 lines)
    hexagonal-rules.instructions.md (44 lines)
    hosting-deploy.instructions.md (14 lines)
    lint-format.instructions.md (20 lines)
    nextjs-app-router.instructions.md (19 lines)
    nextjs-parallel-routes.instructions.md (17 lines)
    nextjs-server-actions.instructions.md (18 lines)
    playwright-mcp-testing.instructions.md (98 lines)
    process-framework.instructions.md (49 lines)
    prompt-engineering.instructions.md (30 lines)
    rag-architecture.instructions.md (19 lines)
    security-rules.instructions.md (20 lines)
    shadcn-ui.instructions.md (16 lines)
    state-management.instructions.md (166 lines)
    subdomain-rules.instructions.md (87 lines)
    tailwind-design-system.instructions.md (16 lines)
    testing-e2e.instructions.md (16 lines)
    testing-unit.instructions.md (16 lines)
  prompts/
    analyze-repo.prompt.md (35 lines)
    chunk-docs.prompt.md (26 lines)
    debug-error.prompt.md (25 lines)
    domain-modeling.prompt.md (68 lines)
    embedding-docs.prompt.md (19 lines)
    enforce-hexagonal-ddd-convergence.prompt.md (215 lines)
    feature-design.prompt.md (99 lines)
    firebase-adapter.prompt.md (62 lines)
    generate-aggregate.prompt.md (50 lines)
    generate-domain-event.prompt.md (58 lines)
    generate-value-object.prompt.md (101 lines)
    implement-feature.prompt.md (27 lines)
    implement-firestore-schema.prompt.md (18 lines)
    implement-genkit-flow.prompt.md (19 lines)
    implement-security-rules.prompt.md (18 lines)
    implement-server-action.prompt.md (20 lines)
    implement-state-machine.prompt.md (101 lines)
    implement-ui-component.prompt.md (21 lines)
    implement-zustand-store.prompt.md (71 lines)
    ingest-docs.prompt.md (20 lines)
    plan-api.prompt.md (19 lines)
    plan-feature.prompt.md (14 lines)
    plan-module.prompt.md (19 lines)
    playwright-mcp-inspect.prompt.md (163 lines)
    playwright-mcp-test.prompt.md (127 lines)
    refactor-api.prompt.md (17 lines)
    refactor-module.prompt.md (18 lines)
    review-architecture.prompt.md (18 lines)
    review-code.prompt.md (18 lines)
    review-performance.prompt.md (19 lines)
    review-security.prompt.md (13 lines)
    serena-hexagonal-ddd-refactor.prompt.md (215 lines)
    use-case-generation.prompt.md (63 lines)
    write-docs.prompt.md (18 lines)
    write-e2e-tests.prompt.md (20 lines)
    write-tests.prompt.md (18 lines)
  copilot-instructions.md (70 lines)
app/
  _providers/
    index.tsx (16 lines)
  (public)/
    page.tsx (30 lines)
  (shell)/
    _providers/
      AppProvider.tsx (29 lines)
    _shell/
      index.ts (7 lines)
      shell-quick-create.ts (22 lines)
      ShellAppRail.tsx (87 lines)
      ShellContextNavSection.tsx (21 lines)
      ShellDashboardSidebar.tsx (58 lines)
      ShellRootLayout.tsx (56 lines)
      ShellSidebarBody.tsx (54 lines)
      ShellSidebarHeader.tsx (21 lines)
      ShellSidebarNavData.tsx (51 lines)
    (account)/
      [accountId]/
        [[...slug]]/
          page.tsx (44 lines)
        dev-tools/
          dev-tools-badges.tsx (5 lines)
          dev-tools-helpers.ts (59 lines)
          dev-tools-parsed-docs-section.tsx (21 lines)
          page.tsx (87 lines)
          use-dev-tools-doc-list.ts (70 lines)
    layout.tsx (8 lines)
  globals.css (47 lines)
  layout.tsx (11 lines)
docs/
  contexts/
    ai/
      AGENT.md (95 lines)
      bounded-contexts.md (61 lines)
      context-map.md (50 lines)
      README.md (73 lines)
      subdomains.md (91 lines)
      ubiquitous-language.md (49 lines)
    analytics/
      AGENT.md (11 lines)
      bounded-contexts.md (11 lines)
      context-map.md (16 lines)
      README.md (16 lines)
      subdomains.md (17 lines)
      ubiquitous-language.md (15 lines)
    billing/
      AGENT.md (11 lines)
      bounded-contexts.md (11 lines)
      context-map.md (14 lines)
      README.md (16 lines)
      subdomains.md (18 lines)
      ubiquitous-language.md (15 lines)
    iam/
      AGENT.md (11 lines)
      bounded-contexts.md (11 lines)
      context-map.md (15 lines)
      README.md (16 lines)
      subdomains.md (27 lines)
      ubiquitous-language.md (17 lines)
    notebooklm/
      AGENT.md (92 lines)
      bounded-contexts.md (83 lines)
      context-map.md (79 lines)
      README.md (113 lines)
      subdomains.md (66 lines)
      ubiquitous-language.md (94 lines)
    notion/
      AGENT.md (103 lines)
      bounded-contexts.md (83 lines)
      context-map.md (80 lines)
      README.md (117 lines)
      subdomains.md (75 lines)
      ubiquitous-language.md (94 lines)
    platform/
      AGENT.md (107 lines)
      bounded-contexts.md (84 lines)
      context-map.md (80 lines)
      README.md (139 lines)
      subdomains.md (84 lines)
      ubiquitous-language.md (138 lines)
    workspace/
      AGENT.md (94 lines)
      bounded-contexts.md (83 lines)
      context-map.md (79 lines)
      README.md (120 lines)
      subdomains.md (71 lines)
      ubiquitous-language.md (120 lines)
    _template.md (144 lines)
  decisions/
    0001-hexagonal-architecture.md (80 lines)
    0002-bounded-contexts.md (81 lines)
    0003-context-map.md (79 lines)
    0004-ubiquitous-language.md (79 lines)
    0005-anti-corruption-layer.md (80 lines)
    0006-domain-event-discriminant-format.md (117 lines)
    0007-infrastructure-in-api-layer.md (72 lines)
    0008-repository-interface-placement.md (83 lines)
    0009-anemic-aggregates.md (81 lines)
    0010-aggregate-domain-event-emission.md (114 lines)
    0011-use-case-bundling.md (129 lines)
    0012-source-to-task-orchestration.md (73 lines)
    0014-main-domain-resplit.md (46 lines)
    1100-layer-violation.md (83 lines)
    1101-layer-violation-crypto-in-domain.md (95 lines)
    1102-layer-violation-ports-in-application.md (125 lines)
    1103-layer-violation-firebase-sdk-in-api-layer.md (87 lines)
    1104-layer-violation-globalthis-crypto-in-application-layer.md (78 lines)
    1200-boundary-violation.md (105 lines)
    1201-boundary-violation-business-logic-in-infrastructure.md (119 lines)
    1300-cyclic-dependency.md (117 lines)
    1400-dependency-leakage.md (61 lines)
    1401-dependency-leakage-infrastructure-api-in-platform-api.md (119 lines)
    1402-dependency-leakage-use-case-classes-in-platform-api.md (124 lines)
    1403-dependency-leakage-subdomain-api-exports-interfaces-wildcard.md (79 lines)
    1404-dependency-leakage-subdomain-api-exports-application-wildcard.md (88 lines)
    2100-tight-coupling.md (68 lines)
    2101-tight-coupling-crypto-runtime.md (98 lines)
    2200-hidden-coupling.md (59 lines)
    2201-hidden-coupling-workspace-aggregate-no-domain-events.md (162 lines)
    2300-temporal-coupling.md (63 lines)
    3100-low-cohesion.md (86 lines)
    3101-low-cohesion-platform-application-layer.md (105 lines)
    3200-duplication.md (95 lines)
    3201-duplication-event-discriminant-format.md (110 lines)
    3202-duplication-source-dto-reimplements-domain-service.md (68 lines)
    3203-duplication-shell-quick-create-orphaned-platform-copy.md (143 lines)
    4100-change-amplification.md (68 lines)
    4101-change-amplification-uuid-strategy.md (93 lines)
    4200-inconsistency.md (78 lines)
    4201-inconsistency-dto-vs-dtos.md (110 lines)
    4202-inconsistency-uuid-v7-in-workspace-domain-events.md (109 lines)
    4203-inconsistency-uuid-v7-application-infrastructure-layers.md (126 lines)
    4300-semantic-drift.md (75 lines)
    4301-semantic-drift-application-subdirectory-names.md (109 lines)
    4302-semantic-drift-notion-notebooklm-event-discriminant-format.md (75 lines)
    4303-semantic-drift-workspace-event-discriminants-use-underscore.md (117 lines)
    5100-accidental-complexity.md (87 lines)
    5101-accidental-complexity-platform-domain-stubs.md (140 lines)
    5200-cognitive-load.md (103 lines)
    5201-cognitive-load-workspace-workflow-application.md (147 lines)
    5202-cognitive-load-workspace-dto-mixes-types-and-factory-functions.md (153 lines)
    5203-cognitive-load-subdomain-api-unscoped-wildcard-exports.md (104 lines)
    README.md (153 lines)
    SMELL-INDEX.md (121 lines)
  deliveries/
    AGENT.md (8 lines)
    README.md (10 lines)
    upload-parse-to-task-flow.md (77 lines)
  feature/
    AGENT.md (8 lines)
    notebooklm-source-processing-task-flow.md (86 lines)
    README.md (10 lines)
  architecture-overview.md (137 lines)
  bounded-context-subdomain-template.md (206 lines)
  bounded-contexts.md (270 lines)
  context-map.md (121 lines)
  hard-rules-consolidated.md (455 lines)
  integration-guidelines.md (112 lines)
  module-graph.system-wide.md (131 lines)
  project-delivery-milestones.md (109 lines)
  README.md (126 lines)
  semantic-model.md (312 lines)
  strategic-patterns.md (81 lines)
  subdomains.md (269 lines)
  ubiquitous-language.md (166 lines)
modules/
  ai/
    api/
      index.ts (6 lines)
      server.ts (7 lines)
    application/
      index.ts (1 lines)
    docs/
      README.md (82 lines)
    domain/
      index.ts (1 lines)
    infrastructure/
      generation/
        genkit/
          GenkitAiTextGenerationAdapter.ts (12 lines)
      index.ts (1 lines)
    interfaces/
      index.ts (1 lines)
    subdomains/
      content-distillation/
        api/
          index.ts (15 lines)
          server.ts (7 lines)
        application/
          use-cases/
            distill-content.use-case.ts (7 lines)
          index.ts (0 lines)
        domain/
          ports/
            DistillationPort.ts (30 lines)
          index.ts (0 lines)
        infrastructure/
          llm/
            GenkitDistillationAdapter.ts (15 lines)
        README.md (22 lines)
      content-generation/
        api/
          index.ts (17 lines)
          server.ts (17 lines)
        application/
          use-cases/
            generate-ai-text.use-case.ts (11 lines)
          index.ts (0 lines)
        domain/
          ports/
            AiTextGenerationPort.ts (17 lines)
          index.ts (0 lines)
        README.md (22 lines)
      context-assembly/
        api/
          index.ts (1 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        README.md (22 lines)
      evaluation-policy/
        api/
          index.ts (1 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        README.md (22 lines)
      memory-context/
        api/
          index.ts (1 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        README.md (22 lines)
      model-observability/
        api/
          index.ts (1 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        README.md (22 lines)
      prompt-pipeline/
        api/
          index.ts (6 lines)
        application/
          index.ts (42 lines)
          prompt-pipeline.test.ts (6 lines)
        domain/
          index.ts (68 lines)
        README.md (37 lines)
      safety-guardrail/
        api/
          index.ts (1 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        README.md (22 lines)
      subdomains.instructions.md (313 lines)
    AGENT.md (33 lines)
    ai.instructions.md (30 lines)
    index.ts (6 lines)
    README.md (73 lines)
  analytics/
    api/
      index.ts (4 lines)
    application/
      index.ts (1 lines)
    docs/
      README.md (0 lines)
    domain/
      index.ts (1 lines)
    infrastructure/
      index.ts (1 lines)
    interfaces/
      index.ts (1 lines)
    subdomains/
      event-contracts/
        README.md (0 lines)
      event-ingestion/
        README.md (0 lines)
      event-projection/
        README.md (0 lines)
      insights/
        README.md (0 lines)
      metrics/
        README.md (0 lines)
      realtime-insights/
        README.md (0 lines)
      subdomains.instructions.md (26 lines)
    AGENT.md (17 lines)
    analytics.instructions.md (11 lines)
    index.ts (0 lines)
    README.md (12 lines)
  billing/
    api/
      index.ts (3 lines)
    application/
      index.ts (1 lines)
    docs/
      README.md (0 lines)
    domain/
      index.ts (1 lines)
    infrastructure/
      index.ts (1 lines)
    interfaces/
      index.ts (1 lines)
    subdomains/
      entitlement/
        api/
          index.ts (4 lines)
        application/
          dto/
            entitlement.dto.ts (9 lines)
            index.ts (0 lines)
          use-cases/
            entitlement.use-cases.ts (43 lines)
            index.ts (0 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            EntitlementGrant.ts (49 lines)
            index.ts (0 lines)
          events/
            EntitlementGrantDomainEvent.ts (46 lines)
            index.ts (0 lines)
          repositories/
            EntitlementGrantRepository.ts (25 lines)
            index.ts (0 lines)
          value-objects/
            EntitlementId.ts (5 lines)
            EntitlementStatus.ts (7 lines)
            FeatureKey.ts (5 lines)
            index.ts (0 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseEntitlementGrantRepository.ts (38 lines)
          index.ts (5 lines)
        interfaces/
          composition/
            entitlement-service.ts (18 lines)
        README.md (14 lines)
      subscription/
        api/
          index.ts (3 lines)
        application/
          dto/
            index.ts (0 lines)
            subscription.dto.ts (11 lines)
          use-cases/
            index.ts (0 lines)
            subscription.use-cases.ts (43 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            index.ts (0 lines)
            Subscription.ts (55 lines)
          events/
            index.ts (0 lines)
            SubscriptionDomainEvent.ts (49 lines)
          repositories/
            index.ts (0 lines)
            SubscriptionRepository.ts (18 lines)
          value-objects/
            BillingCycle.ts (5 lines)
            index.ts (0 lines)
            PlanCode.ts (7 lines)
            SubscriptionId.ts (5 lines)
            SubscriptionStatus.ts (7 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseSubscriptionRepository.ts (37 lines)
          index.ts (5 lines)
        interfaces/
          composition/
            subscription-service.ts (18 lines)
        README.md (13 lines)
      subdomains.instructions.md (27 lines)
    AGENT.md (17 lines)
    billing.instructions.md (11 lines)
    index.ts (0 lines)
    README.md (10 lines)
  iam/
    api/
      index.ts (8 lines)
    application/
      index.ts (1 lines)
    docs/
      README.md (3 lines)
    domain/
      value-objects/
        PermissionDecision.ts (28 lines)
      index.ts (1 lines)
    infrastructure/
      index.ts (1 lines)
    interfaces/
      index.ts (1 lines)
    subdomains/
      access-control/
        api/
          index.ts (4 lines)
        application/
          dto/
            access-control.dto.ts (12 lines)
            index.ts (0 lines)
          services/
            shell-account-access.ts (25 lines)
          use-cases/
            access-control.use-cases.ts (56 lines)
            index.ts (0 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            AccessPolicy.ts (49 lines)
            index.ts (0 lines)
          events/
            AccessPolicyDomainEvent.ts (36 lines)
            index.ts (0 lines)
          repositories/
            AccessPolicyRepository.ts (26 lines)
            index.ts (0 lines)
          value-objects/
            index.ts (0 lines)
            PolicyEffect.ts (3 lines)
            ResourceRef.ts (9 lines)
            SubjectRef.ts (5 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseAccessPolicyRepository.ts (39 lines)
          index.ts (5 lines)
        interfaces/
          composition/
            access-control-service.ts (19 lines)
        README.md (13 lines)
      authentication/
        api/
          index.ts (4 lines)
      authorization/
        api/
          index.ts (4 lines)
      federation/
        api/
          index.ts (4 lines)
      identity/
        api/
          index.ts (4 lines)
        application/
          use-cases/
            identity.use-cases.ts (24 lines)
            token-refresh.use-cases.ts (9 lines)
          identity-error-message.ts (8 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            index.ts (0 lines)
            UserIdentity.ts (60 lines)
          entities/
            Identity.ts (25 lines)
            TokenRefreshSignal.ts (13 lines)
          events/
            IdentityDomainEvent.ts (62 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
          repositories/
            IdentityRepository.ts (19 lines)
            TokenRefreshRepository.ts (9 lines)
          value-objects/
            DisplayName.ts (5 lines)
            Email.ts (7 lines)
            IdentityStatus.ts (5 lines)
            index.ts (0 lines)
            UserId.ts (7 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseIdentityRepository.ts (32 lines)
            FirebaseTokenRefreshRepository.ts (11 lines)
          index.ts (5 lines)
        interfaces/
          _actions/
            identity.actions.ts (22 lines)
          components/
            ShellGuard.tsx (23 lines)
          composition/
            identity-service.ts (56 lines)
          contexts/
            auth-context.ts (28 lines)
          hooks/
            useTokenRefreshListener.tsx (9 lines)
          providers/
            auth-provider.tsx (45 lines)
          index.ts (0 lines)
        README.md (0 lines)
      security-policy/
        api/
          index.ts (4 lines)
        README.md (3 lines)
      session/
        api/
          index.ts (4 lines)
      tenant/
        api/
          index.ts (4 lines)
      subdomains.instructions.md (29 lines)
    AGENT.md (24 lines)
    iam.instructions.md (12 lines)
    index.ts (0 lines)
    README.md (20 lines)
  notebooklm/
    api/
      index.ts (32 lines)
      server.ts (11 lines)
      ui.ts (9 lines)
    application/
      dto/
        index.ts (0 lines)
      use-cases/
        index.ts (0 lines)
    docs/
      README.md (31 lines)
    domain/
      events/
        index.ts (0 lines)
        NotebookLmDomainEvent.ts (13 lines)
      published-language/
        index.ts (35 lines)
    infrastructure/
      conversation/
        firebase/
          FirebaseThreadRepository.ts (24 lines)
      notebook/
        ai/
          AiTextGenerationAdapter.ts (16 lines)
      source/
        adapters/
          NotionKnowledgePageGatewayAdapter.ts (64 lines)
          TaskMaterializationWorkflowAdapter.ts (30 lines)
        firebase/
          FirebaseDocumentStatusAdapter.ts (25 lines)
          FirebaseParsedDocumentAdapter.ts (21 lines)
          FirebaseRagDocumentAdapter.ts (46 lines)
          FirebaseSourceDocumentCommandAdapter.ts (18 lines)
          FirebaseSourceFileAdapter.ts (39 lines)
          FirebaseWikiLibraryAdapter.ts (88 lines)
        memory/
          InMemoryWikiLibraryAdapter.ts (29 lines)
        platform/
          PlatformSourceDocumentWatchAdapter.ts (19 lines)
          PlatformSourcePipelineAdapter.ts (21 lines)
          PlatformSourceStorageAdapter.ts (22 lines)
      synthesis/
        ai/
          AiRagGenerationAdapter.ts (26 lines)
        firebase/
          FirebaseKnowledgeContentAdapter.ts (60 lines)
          FirebaseRagQueryFeedbackAdapter.ts (35 lines)
          FirebaseRagRetrievalAdapter.ts (62 lines)
        index.ts (4 lines)
    interfaces/
      conversation/
        _actions/
          chat.actions.ts (13 lines)
          thread.actions.ts (6 lines)
        components/
          ConversationPanel.tsx (35 lines)
        composition/
          adapters.ts (3 lines)
          use-cases.ts (22 lines)
        hooks/
          useAiChatThread.ts (43 lines)
        helpers.ts (21 lines)
      notebook/
        _actions/
          generate-notebook-response.actions.ts (10 lines)
        composition/
          adapters.ts (3 lines)
      source/
        _actions/
          source-file.actions.ts (43 lines)
          source-pipeline.actions.ts (20 lines)
          source-processing.actions.ts (68 lines)
        components/
          file-processing-dialog.body.tsx (23 lines)
          file-processing-dialog.parts.tsx (32 lines)
          file-processing-dialog.surface.tsx (14 lines)
          file-processing-dialog.utils.ts (20 lines)
          FileProcessingDialog.tsx (37 lines)
          LibrariesPanel.tsx (26 lines)
          LibraryTablePanel.tsx (37 lines)
          SourceDocumentsPanel.tsx (27 lines)
          WorkspaceFilesTab.tsx (31 lines)
        composition/
          adapters.ts (56 lines)
          use-cases.ts (62 lines)
          wiki-library-facade.ts (43 lines)
          workspace-files.facade.ts (25 lines)
        contracts/
          source-command-result.ts (16 lines)
        hooks/
          useSourceDocumentsSnapshot.ts (34 lines)
        queries/
          source-file.queries.ts (23 lines)
      synthesis/
        _actions/
          rag-query.actions.ts (17 lines)
        components/
          RagQueryPanel.tsx (41 lines)
    subdomains/
      conversation/
        api/
          index.ts (15 lines)
          server.ts (8 lines)
          ui.ts (11 lines)
        application/
          dto/
            conversation.dto.ts (4 lines)
          use-cases/
            load-thread.use-case.ts (16 lines)
            save-thread.use-case.ts (16 lines)
        domain/
          entities/
            message.ts (14 lines)
            thread.ts (13 lines)
          events/
            ConversationEvents.ts (33 lines)
          ports/
            index.ts (6 lines)
          repositories/
            ThreadRepository.ts (13 lines)
          index.ts (3 lines)
        README.md (28 lines)
      notebook/
        api/
          index.ts (0 lines)
          server.ts (6 lines)
        application/
          dto/
            notebook.dto.ts (4 lines)
          use-cases/
            generate-notebook-response.use-case.ts (11 lines)
          index.ts (0 lines)
        domain/
          entities/
            AgentGeneration.ts (17 lines)
          events/
            NotebookEvents.ts (23 lines)
          ports/
            index.ts (6 lines)
          repositories/
            NotebookRepository.ts (10 lines)
          index.ts (3 lines)
        README.md (13 lines)
      source/
        api/
          index.ts (28 lines)
          server.ts (7 lines)
          ui.ts (4 lines)
        application/
          dto/
            rag-document.dto.ts (73 lines)
            source-file.dto.ts (71 lines)
            source-live-document.dto.ts (50 lines)
            source-pipeline.dto.ts (20 lines)
            source-processing.dto.ts (20 lines)
            source.dto.ts (14 lines)
          queries/
            source-file.queries.ts (15 lines)
          use-cases/
            create-knowledge-draft-from-source.use-case.ts (34 lines)
            create-tasks-from-source.use-case.ts (20 lines)
            delete-source-document.use-case.ts (28 lines)
            process-source-document-workflow.use-case.ts (50 lines)
            register-rag-document.use-case.ts (29 lines)
            rename-source-document.use-case.ts (29 lines)
            source-pipeline.use-cases.ts (24 lines)
            upload-complete-source-file.use-case.ts (44 lines)
            upload-init-source-file.use-case.ts (40 lines)
            wiki-library.helpers.ts (19 lines)
            wiki-library.use-cases.ts (72 lines)
          utils/
            slug-utils.ts (16 lines)
          index.ts (0 lines)
        domain/
          entities/
            RagDocument.ts (51 lines)
            SourceFile.ts (34 lines)
            SourceFileVersion.ts (19 lines)
            SourceRetentionPolicy.ts (14 lines)
            WikiLibrary.ts (60 lines)
          events/
            SourceEvents.ts (47 lines)
          ports/
            index.ts (6 lines)
            KnowledgePageGatewayPort.ts (49 lines)
            ParsedDocumentPort.ts (14 lines)
            SourceDocumentPort.ts (16 lines)
            SourceDocumentWatchPort.ts (31 lines)
            SourcePipelinePort.ts (36 lines)
            SourceStoragePort.ts (25 lines)
            TaskMaterializationWorkflowPort.ts (50 lines)
          repositories/
            RagDocumentRepository.ts (31 lines)
            SourceFileRepository.ts (28 lines)
            WikiLibraryRepository.ts (25 lines)
          services/
            complete-upload-source-file.service.ts (16 lines)
            resolve-source-organization-id.service.ts (14 lines)
          index.ts (3 lines)
        README.md (35 lines)
      synthesis/
        api/
          index.ts (24 lines)
          server.ts (33 lines)
          ui.ts (4 lines)
        application/
          use-cases/
            answer-rag-query.use-case.ts (34 lines)
            submit-rag-feedback.use-case.ts (17 lines)
          index.ts (4 lines)
        domain/
          entities/
            generation.entities.ts (47 lines)
            GroundingEvidence.ts (24 lines)
            QualityFeedback.ts (31 lines)
            rag-feedback.entities.ts (29 lines)
            rag-query.entities.ts (43 lines)
            retrieval.entities.ts (46 lines)
            RetrievedChunk.ts (34 lines)
            SynthesisResult.ts (45 lines)
          events/
            EvaluationEvents.ts (18 lines)
            GroundingEvents.ts (16 lines)
            RetrievalEvents.ts (26 lines)
            SynthesisEvents.ts (26 lines)
            SynthesisPipelineDomainEvent.ts (63 lines)
          ports/
            ChunkRetrievalPort.ts (24 lines)
            FeedbackPort.ts (17 lines)
            GenerationPort.ts (15 lines)
            VectorStore.ts (69 lines)
          repositories/
            KnowledgeContentRepository.ts (90 lines)
            RagGenerationRepository.ts (15 lines)
            RagQueryFeedbackRepository.ts (15 lines)
            RagRetrievalRepository.ts (25 lines)
          services/
            CitationBuilder.ts (27 lines)
            RagCitationBuilder.ts (10 lines)
            RagPromptBuilder.ts (14 lines)
            RagScoringService.ts (24 lines)
          value-objects/
            index.ts (0 lines)
            OrganizationScope.ts (6 lines)
            RagPrompt.ts (5 lines)
            RelevanceScore.ts (5 lines)
            TopK.ts (5 lines)
          index.ts (13 lines)
        README.md (37 lines)
      subdomains.instructions.md (32 lines)
    AGENT.md (122 lines)
    index.ts (4 lines)
    notebooklm.instructions.md (0 lines)
    README.md (91 lines)
  notion/
    api/
      index.ts (35 lines)
      server.ts (0 lines)
      ui.ts (6 lines)
    application/
      dto/
        index.ts (1 lines)
      use-cases/
        index.ts (1 lines)
    docs/
      README.md (31 lines)
    domain/
      events/
        index.ts (0 lines)
        NotionDomainEvent.ts (17 lines)
      published-language/
        index.ts (45 lines)
    infrastructure/
      authoring/
        firebase/
          FirebaseArticleRepository.ts (34 lines)
          FirebaseCategoryRepository.ts (26 lines)
          index.ts (1 lines)
        index.ts (0 lines)
      collaboration/
        firebase/
          FirebaseCommentRepository.ts (38 lines)
          FirebasePermissionRepository.ts (26 lines)
          FirebaseVersionRepository.ts (26 lines)
          index.ts (0 lines)
        index.ts (0 lines)
      knowledge/
        ai/
          index.ts (0 lines)
          SharedAiKnowledgeSummaryAdapter.ts (21 lines)
        firebase/
          FirebaseBacklinkIndexRepository.ts (29 lines)
          FirebaseContentBlockRepository.ts (38 lines)
          FirebaseKnowledgeCollectionRepository.ts (29 lines)
          FirebaseKnowledgePageRepository.ts (38 lines)
          index.ts (0 lines)
        index.ts (0 lines)
      knowledge-database/
        firebase/
          FirebaseAutomationRepository.ts (35 lines)
          FirebaseDatabaseRecordRepository.ts (39 lines)
          FirebaseDatabaseRepository.ts (38 lines)
          FirebaseViewRepository.ts (34 lines)
          index.ts (0 lines)
        index.ts (0 lines)
      relations/
        firebase/
          FirebaseRelationRepository.ts (28 lines)
          index.ts (0 lines)
        index.ts (0 lines)
      taxonomy/
        firebase/
          FirebaseTaxonomyRepository.ts (28 lines)
          index.ts (0 lines)
        index.ts (0 lines)
    interfaces/
      authoring/
        _actions/
          article.actions.ts (45 lines)
          category.actions.ts (29 lines)
          index.ts (2 lines)
        components/
          ArticleDetailPanel.tsx (60 lines)
          ArticleDialog.tsx (49 lines)
          CategoryTreePanel.tsx (22 lines)
          index.ts (1 lines)
          KnowledgeBaseArticlesPanel.tsx (29 lines)
        composition/
          repositories.ts (6 lines)
          use-cases.ts (35 lines)
        queries/
          index.ts (24 lines)
        store/
          index.ts (1 lines)
      collaboration/
        _actions/
          comment.actions.ts (29 lines)
          index.ts (0 lines)
          permission.actions.ts (14 lines)
          version.actions.ts (14 lines)
        components/
          CommentPanel.tsx (25 lines)
          index.ts (0 lines)
          VersionHistoryPanel.tsx (18 lines)
        composition/
          repositories.ts (9 lines)
          use-cases.ts (33 lines)
        queries/
          index.ts (20 lines)
        store/
          index.ts (1 lines)
      knowledge/
        _actions/
          index.ts (0 lines)
          knowledge-block.actions.ts (14 lines)
          knowledge-collection.actions.ts (30 lines)
          knowledge-page.actions.ts (43 lines)
        components/
          BlockEditorPanel.tsx (12 lines)
          KnowledgeDetailPanel.tsx (60 lines)
          KnowledgePageHeaderWidgets.tsx (36 lines)
          KnowledgePagesPanel.tsx (27 lines)
          PageDialog.tsx (27 lines)
          PageEditorPanel.tsx (18 lines)
          PageTreePanel.tsx (18 lines)
        composition/
          capabilities.ts (3 lines)
          repositories.ts (9 lines)
          use-cases.ts (49 lines)
        queries/
          index.ts (36 lines)
        store/
          block-editor.store.ts (49 lines)
      knowledge-database/
        _actions/
          index.ts (0 lines)
          knowledge-database.actions.ts (74 lines)
        components/
          DatabaseAddFieldDialog.tsx (25 lines)
          DatabaseAutomationPanel.tsx (22 lines)
          DatabaseBoardPanel.tsx (31 lines)
          DatabaseCalendarPanel.tsx (25 lines)
          DatabaseDetailPanel.tsx (61 lines)
          DatabaseDialog.tsx (34 lines)
          DatabaseFormPanel.tsx (44 lines)
          DatabaseFormsPanel.tsx (29 lines)
          DatabaseGalleryPanel.tsx (30 lines)
          DatabaseListPanel.tsx (33 lines)
          DatabaseTablePanel.tsx (35 lines)
          index.ts (0 lines)
          KnowledgeDatabasesPanel.tsx (25 lines)
        composition/
          repositories.ts (12 lines)
          use-cases.ts (53 lines)
        queries/
          index.ts (23 lines)
        store/
          index.ts (1 lines)
      relations/
        composition/
          repositories.ts (3 lines)
          use-cases.ts (17 lines)
      taxonomy/
        composition/
          repositories.ts (3 lines)
          use-cases.ts (19 lines)
    subdomains/
      authoring/
        api/
          index.ts (18 lines)
          server.ts (6 lines)
          ui.ts (4 lines)
        application/
          dto/
            ArticleDto.ts (7 lines)
            authoring.dto.ts (4 lines)
            CategoryDto.ts (7 lines)
            index.ts (0 lines)
          use-cases/
            index.ts (0 lines)
            manage-article-lifecycle.use-cases.ts (35 lines)
            manage-article-publication.use-cases.ts (17 lines)
            manage-category.use-cases.ts (35 lines)
            verify-article.use-cases.ts (21 lines)
        domain/
          aggregates/
            Article.ts (68 lines)
            Category.ts (51 lines)
            index.ts (0 lines)
          events/
            AuthoringEvents.ts (38 lines)
            index.ts (2 lines)
            NotionDomainEvent.ts (14 lines)
          ports/
            index.ts (6 lines)
          repositories/
            ArticleRepository.ts (33 lines)
            CategoryRepository.ts (19 lines)
            index.ts (1 lines)
          services/
            index.ts (1 lines)
          value-objects/
            index.ts (2 lines)
          index.ts (0 lines)
        README.md (29 lines)
      collaboration/
        api/
          index.ts (16 lines)
          server.ts (6 lines)
        application/
          dto/
            collaboration.dto.ts (4 lines)
            CollaborationDto.ts (29 lines)
            index.ts (0 lines)
          use-cases/
            index.ts (0 lines)
            manage-comment.use-cases.ts (37 lines)
            manage-permission.use-cases.ts (22 lines)
            manage-version.use-cases.ts (22 lines)
        domain/
          aggregates/
            Comment.ts (34 lines)
            index.ts (0 lines)
            Permission.ts (28 lines)
            Version.ts (23 lines)
          events/
            CollaborationEvents.ts (68 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
          repositories/
            CommentRepository.ts (61 lines)
            index.ts (0 lines)
            PermissionRepository.ts (32 lines)
            VersionRepository.ts (30 lines)
          services/
            index.ts (5 lines)
          value-objects/
            index.ts (5 lines)
          index.ts (0 lines)
        README.md (29 lines)
      knowledge/
        api/
          index.ts (26 lines)
          server.ts (24 lines)
          ui.ts (4 lines)
        application/
          dto/
            ContentBlockDto.ts (20 lines)
            index.ts (0 lines)
            knowledge.dto.ts (36 lines)
            KnowledgeCollectionDto.ts (23 lines)
            KnowledgePageDto.ts (21 lines)
            KnowledgePageLifecycleDto.ts (17 lines)
          queries/
            backlink.queries.ts (21 lines)
            content-block.queries.ts (38 lines)
            knowledge-collection.queries.ts (15 lines)
            knowledge-page.queries.ts (28 lines)
            knowledge-summary.queries.ts (19 lines)
            knowledge-version.queries.ts (11 lines)
          use-cases/
            index.ts (0 lines)
            manage-knowledge-collection.use-cases.ts (40 lines)
            manage-knowledge-page-appearance.use-cases.ts (25 lines)
            manage-knowledge-page.use-cases.ts (47 lines)
            review-knowledge-page.use-cases.ts (47 lines)
        domain/
          aggregates/
            BacklinkIndex.ts (32 lines)
            ContentBlock.ts (66 lines)
            index.ts (0 lines)
            KnowledgeCollection.ts (90 lines)
            KnowledgePage.ts (107 lines)
          events/
            index.ts (0 lines)
            KnowledgeBlockEvents.ts (47 lines)
            KnowledgeCollectionEvents.ts (47 lines)
            KnowledgePageEvents.ts (150 lines)
            NotionDomainEvent.ts (14 lines)
          ports/
            index.ts (6 lines)
            KnowledgeDistillationPort.ts (30 lines)
            KnowledgeSummaryPort.ts (22 lines)
          repositories/
            BacklinkIndexRepository.ts (31 lines)
            ContentBlockRepository.ts (21 lines)
            index.ts (0 lines)
            KnowledgeCollectionRepository.ts (19 lines)
            KnowledgePageRepository.ts (31 lines)
          services/
            BacklinkExtractorService.ts (24 lines)
            index.ts (0 lines)
          value-objects/
            ApprovalState.ts (3 lines)
            BlockContent.ts (88 lines)
            BlockId.ts (7 lines)
            CollectionId.ts (7 lines)
            index.ts (0 lines)
            PageId.ts (7 lines)
            PageStatus.ts (3 lines)
            VerificationState.ts (3 lines)
          index.ts (0 lines)
        README.md (29 lines)
      knowledge-database/
        api/
          index.ts (21 lines)
          server.ts (6 lines)
          ui.ts (4 lines)
        application/
          dto/
            DatabaseDto.ts (43 lines)
            index.ts (0 lines)
            knowledge-database.dto.ts (4 lines)
          queries/
            automation.queries.ts (8 lines)
            database.queries.ts (13 lines)
            record.queries.ts (9 lines)
            view.queries.ts (9 lines)
          use-cases/
            index.ts (0 lines)
            manage-automation.use-cases.ts (24 lines)
            manage-database.use-cases.ts (29 lines)
            manage-record.use-cases.ts (25 lines)
            manage-view.use-cases.ts (25 lines)
        domain/
          aggregates/
            Database.ts (45 lines)
            DatabaseAutomation.ts (44 lines)
            DatabaseRecord.ts (23 lines)
            index.ts (0 lines)
            View.ts (41 lines)
          events/
            DatabaseEvents.ts (93 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
          repositories/
            AutomationRepository.ts (47 lines)
            DatabaseRecordRepository.ts (34 lines)
            DatabaseRepository.ts (49 lines)
            index.ts (0 lines)
            ViewRepository.ts (38 lines)
          services/
            index.ts (5 lines)
          value-objects/
            index.ts (5 lines)
          index.ts (0 lines)
        README.md (29 lines)
      relations/
        api/
          index.ts (19 lines)
          server.ts (6 lines)
        application/
          dto/
            RelationDto.ts (24 lines)
          use-cases/
            manage-relation.use-cases.ts (27 lines)
          index.ts (0 lines)
        domain/
          entities/
            Relation.ts (29 lines)
          events/
            RelationEvents.ts (26 lines)
          repositories/
            RelationRepository.ts (21 lines)
          index.ts (0 lines)
        README.md (29 lines)
      taxonomy/
        api/
          index.ts (16 lines)
          server.ts (6 lines)
        application/
          dto/
            TaxonomyDto.ts (24 lines)
          use-cases/
            manage-taxonomy.use-cases.ts (27 lines)
          index.ts (0 lines)
        domain/
          entities/
            TaxonomyNode.ts (27 lines)
          events/
            TaxonomyEvents.ts (25 lines)
          repositories/
            TaxonomyRepository.ts (21 lines)
          index.ts (0 lines)
        README.md (29 lines)
      subdomains.instructions.md (33 lines)
    AGENT.md (162 lines)
    index.ts (4 lines)
    notion.instructions.md (0 lines)
    README.md (135 lines)
  platform/
    api/
      api.instructions.md (23 lines)
      contracts.ts (218 lines)
      facade.ts (78 lines)
      index.ts (22 lines)
      infrastructure-api.ts (87 lines)
      infrastructure.ts (10 lines)
      platform-service.ts (46 lines)
      server.ts (27 lines)
      service-api.ts (51 lines)
      ui.ts (24 lines)
    application/
      dto/
        index.ts (113 lines)
        PlatformCommandResult.dto.ts (23 lines)
        PlatformContextView.dto.ts (23 lines)
        PolicyCatalogView.dto.ts (23 lines)
        SubscriptionEntitlementsView.dto.ts (21 lines)
        WorkflowPolicyView.dto.ts (20 lines)
      event-handlers/
        handleIngressAccountProfileAmended.ts (26 lines)
        handleIngressIdentitySubjectAuthenticated.ts (26 lines)
        handleIngressIntegrationCallbackReceived.ts (26 lines)
        handleIngressOrganizationMembershipChanged.ts (26 lines)
        handleIngressSubscriptionEntitlementChanged.ts (26 lines)
        handleIngressWorkflowExecutionCompleted.ts (26 lines)
        index.ts (5 lines)
      event-mappers/
        index.ts (5 lines)
        mapDomainEventToPublishedEvent.ts (18 lines)
        mapExternalEventToPlatformEvent.ts (16 lines)
        mapIngressEventToCommand.ts (19 lines)
      handlers/
        index.ts (3 lines)
        PlatformCommandDispatcher.ts (59 lines)
        PlatformQueryDispatcher.ts (36 lines)
      queries/
        get-platform-context-view.queries.ts (15 lines)
        get-policy-catalog-view.queries.ts (15 lines)
        get-subscription-entitlements.queries.ts (15 lines)
        get-workflow-policy-view.queries.ts (15 lines)
        index.ts (0 lines)
        list-enabled-capabilities.queries.ts (15 lines)
      services/
        build-causation-id.ts (14 lines)
        build-correlation-id.ts (11 lines)
        index.ts (6 lines)
      use-cases/
        activate-subscription-agreement.use-cases.ts (17 lines)
        apply-configuration-profile.use-cases.ts (17 lines)
        emit-observability-signal.use-cases.ts (17 lines)
        fire-workflow-trigger.use-cases.ts (17 lines)
        index.ts (23 lines)
        publish-policy-catalog.use-cases.ts (17 lines)
        record-audit-signal.use-cases.ts (17 lines)
        register-integration-contract.use-cases.ts (17 lines)
        register-platform-context.use-cases.ts (17 lines)
        request-notification-dispatch.use-cases.ts (17 lines)
      application.instructions.md (22 lines)
      index.ts (3 lines)
    docs/
      docs.instructions.md (20 lines)
      README.md (31 lines)
    domain/
      aggregates/
        index.ts (5 lines)
        IntegrationContract.ts (31 lines)
        PlatformContext.ts (39 lines)
        PolicyCatalog.ts (30 lines)
        SubscriptionAgreement.ts (30 lines)
      constants/
        index.ts (5 lines)
        PlatformErrorCodeConstants.ts (20 lines)
        PlatformEventTypeConstants.ts (15 lines)
        PlatformLifecycleConstants.ts (21 lines)
      entities/
        DispatchContextEntity.ts (25 lines)
        index.ts (5 lines)
        PolicyRuleEntity.ts (25 lines)
        SignalSubscriptionEntity.ts (23 lines)
      errors/
        createDeliveryNotAllowedError.ts (18 lines)
        createEntitlementDeniedError.ts (17 lines)
        createPolicyConflictError.ts (17 lines)
        index.ts (5 lines)
      events/
        contracts/
          index.ts (3 lines)
        published/
          index.ts (10 lines)
        DESIGN.md (257 lines)
        index.ts (37 lines)
      factories/
        createIntegrationContractAggregate.ts (18 lines)
        createPlatformContextAggregate.ts (20 lines)
        createPolicyCatalogAggregate.ts (18 lines)
        createSubscriptionAgreementAggregate.ts (18 lines)
        index.ts (5 lines)
      ports/
        input/
          index.ts (58 lines)
          PlatformCommandPort.ts (21 lines)
          PlatformEventIngressPort.ts (21 lines)
          PlatformQueryPort.ts (21 lines)
        output/
          AccountRepository.ts (21 lines)
          AnalyticsSink.ts (21 lines)
          AuditSignalStore.ts (21 lines)
          CompliancePolicyStore.ts (21 lines)
          ConfigurationProfileStore.ts (21 lines)
          ContentRepository.ts (21 lines)
          DeliveryHistoryRepository.ts (21 lines)
          DomainEventPublisher.ts (21 lines)
          ExternalSystemGateway.ts (21 lines)
          index.ts (204 lines)
          IntegrationContractRepository.ts (22 lines)
          JobQueuePort.ts (21 lines)
          NotificationGateway.ts (21 lines)
          ObservabilitySink.ts (21 lines)
          OnboardingRepository.ts (21 lines)
          PlatformContextRepository.ts (22 lines)
          PlatformContextViewRepository.ts (21 lines)
          PolicyCatalogRepository.ts (22 lines)
          PolicyCatalogViewRepository.ts (21 lines)
          ReferralRepository.ts (21 lines)
          SearchIndexPort.ts (21 lines)
          SecretReferenceResolver.ts (21 lines)
          SubjectDirectory.ts (21 lines)
          SubscriptionAgreementRepository.ts (22 lines)
          SupportRepository.ts (21 lines)
          UsageMeterRepository.ts (21 lines)
          WorkflowDispatcherPort.ts (21 lines)
          WorkflowPolicyRepository.ts (21 lines)
        index.ts (3 lines)
      services/
        assert-never.ts (18 lines)
        AuditClassificationService.ts (14 lines)
        CapabilityEntitlementPolicy.ts (16 lines)
        ConfigurationCompositionService.ts (13 lines)
        index.ts (6 lines)
        IntegrationCompatibilityService.ts (13 lines)
        NotificationRoutingPolicy.ts (14 lines)
        ObservabilityCorrelationService.ts (14 lines)
        PermissionResolutionService.ts (17 lines)
        to-iso-timestamp.ts (10 lines)
        WorkflowDispatchPolicy.ts (14 lines)
      types/
        CorrelationContext.ts (23 lines)
        DispatchOutcome.ts (23 lines)
        index.ts (5 lines)
        ResourceDescriptor.ts (17 lines)
      value-objects/
        AuditClassification.ts (12 lines)
        BillingState.ts (11 lines)
        ConfigurationProfileRef.ts (11 lines)
        ContractState.ts (11 lines)
        DeliveryAllowance.ts (13 lines)
        DeliveryPolicy.ts (13 lines)
        EffectivePeriod.ts (14 lines)
        EndpointRef.ts (11 lines)
        Entitlement.ts (28 lines)
        index.ts (8 lines)
        IntegrationContractId.ts (9 lines)
        NotificationRoute.ts (12 lines)
        ObservabilitySignal.ts (11 lines)
        PermissionDecision.ts (32 lines)
        PlanConstraint.ts (30 lines)
        PlatformCapability.ts (11 lines)
        PlatformContextId.ts (10 lines)
        PlatformLifecycleState.ts (17 lines)
        PolicyCatalogId.ts (9 lines)
        PolicyRule.ts (14 lines)
        SecretReference.ts (15 lines)
        SignalSubscription.ts (12 lines)
        SubjectScope.ts (11 lines)
        SubscriptionAgreementId.ts (9 lines)
        UsageLimit.ts (11 lines)
      domain-modeling.instructions.md (19 lines)
      index.ts (3 lines)
    infrastructure/
      cache/
        CachedPlatformContextViewRepository.ts (16 lines)
        CachedPolicyCatalogViewRepository.ts (16 lines)
        CachedUsageMeterRepository.ts (16 lines)
        index.ts (3 lines)
      db/
        EnvSecretReferenceResolver.ts (12 lines)
        FirebaseConfigurationProfileStore.ts (16 lines)
        FirebaseIntegrationContractRepository.ts (18 lines)
        FirebasePlatformContextRepository.ts (18 lines)
        FirebasePolicyCatalogRepository.ts (18 lines)
        FirebaseSubscriptionAgreementRepository.ts (18 lines)
        FirebaseWorkflowPolicyRepository.ts (20 lines)
        index.ts (3 lines)
      email/
        index.ts (3 lines)
        SmtpNotificationGateway.ts (14 lines)
      events/
        ingress/
          index.ts (5 lines)
          ingestAccountProfileAmended.ts (23 lines)
          ingestIdentitySubjectAuthenticated.ts (23 lines)
          ingestIntegrationCallbackReceived.ts (23 lines)
          ingestOrganizationMembershipChanged.ts (23 lines)
          ingestSubscriptionEntitlementChanged.ts (23 lines)
          ingestWorkflowExecutionCompleted.ts (23 lines)
        routing/
          index.ts (5 lines)
          resolveEventHandler.ts (15 lines)
          routeDomainEvent.ts (17 lines)
          routeIngressEvent.ts (21 lines)
      external/
        buildExternalDeliveryRequest.ts (16 lines)
        dispatchExternalDelivery.ts (17 lines)
        index.ts (5 lines)
        mapExternalResponseToDispatchOutcome.ts (16 lines)
      messaging/
        index.ts (3 lines)
        QStashDomainEventPublisher.ts (15 lines)
        QStashJobQueuePort.ts (15 lines)
        QStashWorkflowDispatcher.ts (15 lines)
      monitoring/
        FirebaseObservabilitySink.ts (13 lines)
        index.ts (3 lines)
      persistence/
        index.ts (5 lines)
        mapIntegrationContractToPersistenceRecord.ts (19 lines)
        mapPlatformContextToPersistenceRecord.ts (19 lines)
        mapPolicyCatalogToPersistenceRecord.ts (19 lines)
        mapSubscriptionAgreementToPersistenceRecord.ts (19 lines)
      storage/
        FirebaseStorageAuditSignalStore.ts (16 lines)
        index.ts (3 lines)
      index.ts (3 lines)
      infrastructure.instructions.md (23 lines)
    interfaces/
      api/
        handlePlatformCommandHttp.ts (20 lines)
        handlePlatformQueryHttp.ts (19 lines)
        index.ts (5 lines)
        mapHttpRequestToPlatformCommand.ts (17 lines)
        mapPlatformResultToHttpResponse.ts (19 lines)
      cli/
        index.ts (5 lines)
        parseCliInputToCommand.ts (17 lines)
        renderPlatformCliResult.ts (16 lines)
        runPlatformCliCommand.ts (18 lines)
      web/
        hooks/
          useAccountRouteContext.ts (18 lines)
        providers/
          ShellAppContext.ts (67 lines)
        shell/
          breadcrumbs/
            ShellAppBreadcrumbs.tsx (6 lines)
          header/
            components/
              ShellHeaderControls.tsx (11 lines)
              ShellNotificationButton.tsx (7 lines)
              ShellThemeToggle.tsx (8 lines)
              ShellTranslationSwitcher.tsx (27 lines)
              ShellUserAvatar.tsx (9 lines)
          search/
            ShellGlobalSearchDialog.tsx (26 lines)
        index.ts (1 lines)
      index.ts (0 lines)
      interfaces.instructions.md (24 lines)
    subdomains/
      account/
        api/
          index.ts (8 lines)
          legacy-account-profile.bridge.ts (14 lines)
        application/
          dto/
            account.dto.ts (4 lines)
          services/
            resolve-active-account.ts (25 lines)
          use-cases/
            account-policy.use-cases.ts (34 lines)
            account.use-cases.ts (52 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            Account.ts (75 lines)
            index.ts (0 lines)
          entities/
            Account.ts (88 lines)
            AccountPolicy.ts (47 lines)
          events/
            AccountDomainEvent.ts (76 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
            TokenRefreshPort.ts (19 lines)
          repositories/
            AccountPolicyRepository.ts (21 lines)
            AccountQueryRepository.ts (32 lines)
            AccountRepository.ts (34 lines)
          value-objects/
            AccountId.ts (5 lines)
            AccountStatus.ts (7 lines)
            AccountType.ts (5 lines)
            index.ts (0 lines)
            WalletAmount.ts (5 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseAccountPolicyRepository.ts (39 lines)
            FirebaseAccountQueryRepository.ts (48 lines)
            FirebaseAccountRepository.ts (65 lines)
          identity-token-refresh.adapter.ts (31 lines)
          index.ts (5 lines)
        interfaces/
          _actions/
            account-policy.actions.ts (21 lines)
            account.actions.ts (39 lines)
          components/
            HeaderUserAvatar.tsx (25 lines)
            NavUser.tsx (9 lines)
          composition/
            account-service.ts (42 lines)
          queries/
            account.queries.ts (48 lines)
          index.ts (0 lines)
        README.md (28 lines)
      account-profile/
        api/
          index.ts (36 lines)
        application/
          dto/
            account-profile.dto.ts (4 lines)
          use-cases/
            get-account-profile.use-case.ts (38 lines)
            update-account-profile.use-case.ts (26 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            AccountProfileAggregate.ts (45 lines)
            index.ts (0 lines)
          entities/
            AccountProfile.ts (17 lines)
          events/
            AccountProfileDomainEvent.ts (16 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
          repositories/
            AccountProfileCommandRepository.ts (16 lines)
            AccountProfileQueryRepository.ts (17 lines)
          value-objects/
            index.ts (0 lines)
            ProfileDisplayName.ts (5 lines)
            ProfileId.ts (5 lines)
          index.ts (0 lines)
        infrastructure/
          create-legacy-account-profile-application.adapter.ts (79 lines)
          index.ts (5 lines)
        interfaces/
          _actions/
            account-profile.actions.ts (8 lines)
          composition/
            account-profile-service.ts (62 lines)
          queries/
            account-profile.queries.ts (17 lines)
          index.ts (0 lines)
        README.md (13 lines)
      background-job/
        api/
          index.ts (4 lines)
        application/
          use-cases/
            background-job.use-cases.ts (67 lines)
          index.ts (0 lines)
        domain/
          entities/
            BackgroundJob.ts (66 lines)
            JobChunk.ts (21 lines)
            JobDocument.ts (18 lines)
          events/
            BackgroundJobDomainEvent.ts (44 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
          repositories/
            BackgroundJobRepository.ts (50 lines)
          index.ts (0 lines)
        infrastructure/
          index.ts (5 lines)
          InMemoryBackgroundJobRepository.ts (31 lines)
        interfaces/
          composition/
            background-job-service.ts (52 lines)
        README.md (28 lines)
      notification/
        api/
          index.ts (16 lines)
        application/
          dto/
            notification.dto.ts (4 lines)
          queries/
            notification.queries.ts (12 lines)
            workspace-notification-preferences.queries.ts (16 lines)
          use-cases/
            notification.use-cases.ts (24 lines)
            workspace-notification-preferences.use-case.ts (41 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            index.ts (0 lines)
            NotificationAggregate.ts (46 lines)
          entities/
            Notification.ts (26 lines)
            WorkspaceNotificationPreference.ts (40 lines)
          events/
            index.ts (0 lines)
            NotificationDomainEvent.ts (37 lines)
          ports/
            index.ts (6 lines)
          repositories/
            NotificationRepository.ts (19 lines)
            WorkspaceNotificationPreferenceRepository.ts (33 lines)
          value-objects/
            index.ts (0 lines)
            NotificationId.ts (5 lines)
            WorkspaceNotificationEventType.ts (13 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseNotificationRepository.ts (39 lines)
            FirebaseWorkspaceNotificationPreferenceRepository.ts (39 lines)
          index.ts (5 lines)
        interfaces/
          _actions/
            notification.actions.ts (16 lines)
            workspace-notification.actions.ts (15 lines)
          components/
            screens/
              SettingsNotificationsRouteScreen.tsx (5 lines)
            NotificationBell.tsx (34 lines)
            NotificationsPage.tsx (34 lines)
            WorkspaceNotificationPreferencesPanel.tsx (28 lines)
          composition/
            notification-service.ts (33 lines)
          queries/
            notification.queries.ts (8 lines)
            workspace-notification.queries.ts (7 lines)
          index.ts (0 lines)
        README.md (28 lines)
      observability/
        api/
          index.ts (4 lines)
        README.md (13 lines)
      organization/
        api/
          index.ts (14 lines)
        application/
          dto/
            organization.dto.ts (4 lines)
          use-cases/
            organization-lifecycle.use-cases.ts (29 lines)
            organization-member.use-cases.ts (25 lines)
            organization-partner.use-cases.ts (20 lines)
            organization-policy.use-cases.ts (21 lines)
            organization-team.use-cases.ts (31 lines)
          index.ts (0 lines)
        domain/
          aggregates/
            index.ts (0 lines)
            Organization.ts (111 lines)
          entities/
            Organization.ts (132 lines)
          events/
            index.ts (0 lines)
            OrganizationDomainEvent.ts (97 lines)
          ports/
            index.ts (0 lines)
            OrganizationTeamPort.ts (24 lines)
          repositories/
            OrganizationRepository.ts (67 lines)
            OrgPolicyRepository.ts (17 lines)
          value-objects/
            index.ts (0 lines)
            MemberRole.ts (7 lines)
            OrganizationId.ts (5 lines)
            OrganizationStatus.ts (7 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseOrganizationRepository.ts (96 lines)
            FirebaseOrgPolicyRepository.ts (33 lines)
            organization-mappers.ts (15 lines)
          index.ts (5 lines)
        interfaces/
          _actions/
            organization-policy.actions.ts (13 lines)
            organization.actions.ts (63 lines)
          components/
            screens/
              OrganizationMembersRouteScreen.tsx (5 lines)
              OrganizationOverviewRouteScreen.tsx (20 lines)
              OrganizationPermissionsRouteScreen.tsx (5 lines)
              OrganizationTeamsRouteScreen.tsx (5 lines)
            AccountSwitcher.tsx (36 lines)
            CreateOrganizationDialog.tsx (42 lines)
            MembersPage.tsx (46 lines)
            PermissionsPage.tsx (48 lines)
            TeamsPage.tsx (42 lines)
          composition/
            organization-service.ts (81 lines)
          queries/
            organization.queries.ts (12 lines)
          index.ts (0 lines)
        README.md (28 lines)
      platform-config/
        api/
          index.ts (4 lines)
        application/
          services/
            shell-navigation-catalog.ts (81 lines)
          index.ts (1 lines)
        README.md (13 lines)
      search/
        api/
          index.ts (4 lines)
        application/
          services/
            shell-command-catalog.ts (7 lines)
          index.ts (1 lines)
        README.md (13 lines)
      team/
        api/
          index.ts (9 lines)
        application/
          use-cases/
            team.use-cases.ts (28 lines)
        domain/
          aggregates/
            index.ts (0 lines)
            OrganizationTeam.ts (77 lines)
          entities/
            Team.ts (20 lines)
          events/
            index.ts (0 lines)
            OrganizationTeamDomainEvent.ts (33 lines)
          ports/
            index.ts (6 lines)
          repositories/
            TeamRepository.ts (22 lines)
          value-objects/
            index.ts (0 lines)
            TeamId.ts (8 lines)
            TeamType.ts (9 lines)
          index.ts (3 lines)
        infrastructure/
          firebase/
            FirebaseTeamRepository.ts (38 lines)
          team-composition.ts (13 lines)
        interfaces/
          _actions/
            team.actions.ts (24 lines)
          index.ts (0 lines)
        README.md (13 lines)
      subdomains.instructions.md (22 lines)
    AGENT.md (49 lines)
    index.ts (4 lines)
    platform.instructions.md (42 lines)
    README.md (104 lines)
  workspace/
    api/
      runtime/
        factories.ts (20 lines)
      api.instructions.md (23 lines)
      contracts.ts (8 lines)
      facade.ts (8 lines)
      index.ts (18 lines)
      ui.ts (37 lines)
    application/
      dto/
        wiki-content-tree.dto.ts (0 lines)
        workspace-interfaces.dto.ts (12 lines)
        workspace-member-view.dto.ts (0 lines)
      queries/
        wiki-content-tree.queries.ts (29 lines)
        workspace.queries.ts (45 lines)
      services/
        WorkspaceCommandApplicationService.ts (75 lines)
        WorkspaceQueryApplicationService.ts (46 lines)
      use-cases/
        workspace-capabilities.use-cases.ts (17 lines)
        workspace-location.use-cases.ts (21 lines)
        workspace.use-cases.ts (11 lines)
      application.instructions.md (21 lines)
    docs/
      docs.instructions.md (20 lines)
      README.md (31 lines)
    domain/
      aggregates/
        Workspace.test.ts (3 lines)
        Workspace.ts (116 lines)
      entities/
        WikiContentTree.ts (41 lines)
        WorkspaceAccess.ts (11 lines)
        WorkspaceCapability.ts (15 lines)
        WorkspaceLocation.ts (10 lines)
        WorkspaceMemberView.ts (25 lines)
        WorkspaceProfile.ts (20 lines)
      events/
        workspace.events.ts (56 lines)
      factories/
        WorkspaceFactory.ts (11 lines)
      ports/
        input/
          WorkspaceCommandPort.ts (47 lines)
          WorkspaceQueryPort.ts (36 lines)
        output/
          WikiWorkspaceRepository.ts (14 lines)
          WorkspaceAccessRepository.ts (13 lines)
          WorkspaceCapabilityRepository.ts (9 lines)
          WorkspaceDomainEventPublisher.ts (18 lines)
          WorkspaceLocationRepository.ts (11 lines)
          WorkspaceQueryRepository.ts (22 lines)
          WorkspaceRepository.ts (24 lines)
        index.ts (10 lines)
      value-objects/
        Address.ts (8 lines)
        index.ts (0 lines)
        workspace-value-objects.test.ts (9 lines)
        WorkspaceLifecycleState.ts (17 lines)
        WorkspaceName.ts (8 lines)
        WorkspaceVisibility.ts (10 lines)
      domain-modeling.instructions.md (19 lines)
    infrastructure/
      events/
        SharedWorkspaceDomainEventPublisher.ts (23 lines)
      firebase/
        FirebaseWikiWorkspaceRepository.ts (8 lines)
        FirebaseWorkspaceQueryRepository.ts (58 lines)
        FirebaseWorkspaceRepository.ts (69 lines)
      infrastructure.instructions.md (22 lines)
    interfaces/
      actions/
        workspace.command.ts (53 lines)
      contracts/
        index.ts (5 lines)
        wiki-content.contract.ts (0 lines)
        workspace-member.contract.ts (0 lines)
        workspace.contract.ts (0 lines)
      facades/
        index.ts (5 lines)
        workspace-file.facade.ts (96 lines)
        workspace-member.facade.ts (4 lines)
        workspace.facade.ts (30 lines)
      queries/
        wiki-content-tree.query.ts (9 lines)
        workspace-member.query.ts (4 lines)
        workspace.query.ts (20 lines)
      runtime/
        index.ts (0 lines)
        workspace-runtime.ts (31 lines)
        workspace-session-context.ts (12 lines)
      web/
        components/
          cards/
            WorkspaceContextCard.tsx (17 lines)
            WorkspaceInformationCard.tsx (19 lines)
            WorkspaceOverviewSummaryCard.tsx (23 lines)
            WorkspaceProductSpineCard.tsx (19 lines)
            WorkspaceQuickstartCard.tsx (15 lines)
          dialogs/
            CreateWorkspaceDialog.tsx (25 lines)
            CustomizeNavigationDialog.tsx (75 lines)
            NavCheckRow.tsx (45 lines)
            WorkspaceSettingsDialog.tsx (40 lines)
            WorkspaceSettingsInformationFields.tsx (14 lines)
          layout/
            workspace-detail-helpers.ts (11 lines)
            WorkspaceQuickAccessRow.tsx (24 lines)
            WorkspaceSectionContent.tsx (28 lines)
            WorkspaceSidebarSection.tsx (63 lines)
          navigation/
            workspace-quick-access.tsx (23 lines)
          rails/
            CreateWorkspaceDialogRail.tsx (42 lines)
          screens/
            AccountDashboardRouteScreen.tsx (10 lines)
            AccountDashboardScreen.tsx (57 lines)
            OrganizationWorkspacesRouteScreen.tsx (5 lines)
            OrganizationWorkspacesScreen.tsx (27 lines)
            WorkspaceDetailRouteScreen.tsx (20 lines)
            WorkspaceDetailScreen.tsx (47 lines)
            WorkspaceHubScreen.tsx (33 lines)
          tabs/
            workspace-file-tab.utils.ts (5 lines)
            WorkspaceCrossModuleTabSurface.tsx (33 lines)
            WorkspaceDailyTab.tsx (8 lines)
            WorkspaceDetailTabContent.tsx (44 lines)
            WorkspaceFilesFilterPanel.tsx (16 lines)
            WorkspaceFilesManagementTab.tsx (67 lines)
            WorkspaceFilesSummaryCard.tsx (26 lines)
            WorkspaceFileVersionHistory.tsx (13 lines)
            WorkspaceManagedFileCard.tsx (38 lines)
            WorkspaceMemberCard.tsx (27 lines)
            WorkspaceMemberInviteDialog.tsx (31 lines)
            WorkspaceMembersTab.tsx (21 lines)
            WorkspaceOverviewKnowledgePanels.tsx (10 lines)
            WorkspaceOverviewSettingsTab.tsx (20 lines)
            WorkspaceOverviewTab.tsx (38 lines)
        hooks/
          useRecentWorkspaces.ts (25 lines)
          useWorkspaceDetail.ts (21 lines)
          useWorkspaceHub.ts (19 lines)
          useWorkspaceOrchestrationContext.ts (28 lines)
          useWorkspaceSettingsSave.ts (33 lines)
        navigation/
          nav-preferences-data.ts (67 lines)
          use-sidebar-locale.ts (13 lines)
          workspace-context-links.ts (25 lines)
          workspace-nav-items.ts (22 lines)
          workspace-tabs.ts (30 lines)
        providers/
          WorkspaceContextProvider.tsx (77 lines)
        state/
          workspace-session.ts (1 lines)
          workspace-settings.ts (28 lines)
        utils/
          workspace-map.ts (8 lines)
        view-models/
          workspace-grants.ts (3 lines)
          workspace-supporting-records.ts (35 lines)
        index.ts (7 lines)
      interfaces.instructions.md (24 lines)
    subdomains/
      audit/
        api/
          index.ts (3 lines)
        application/
          dto/
            audit.dto.ts (4 lines)
          queries/
            list-audit-logs.queries.ts (12 lines)
          use-cases/
            record-audit-entry.use-case.ts (11 lines)
        domain/
          aggregates/
            AuditEntry.ts (92 lines)
            index.ts (0 lines)
          entities/
            AuditLog.ts (18 lines)
          events/
            AuditDomainEvent.ts (32 lines)
            index.ts (0 lines)
          ports/
            index.ts (6 lines)
          repositories/
            AuditRepository.ts (12 lines)
          services/
            AuditRecordingService.ts (22 lines)
            index.ts (0 lines)
          value-objects/
            ActorId.ts (19 lines)
            AuditAction.ts (9 lines)
            AuditSeverity.ts (15 lines)
            index.ts (0 lines)
          index.ts (3 lines)
          schema.ts (14 lines)
        infrastructure/
          firebase/
            FirebaseAuditRepository.ts (20 lines)
        interfaces/
          components/
            screens/
              OrganizationAuditRouteScreen.tsx (19 lines)
            AuditStream.tsx (26 lines)
            WorkspaceAuditTab.tsx (20 lines)
          composition/
            audit-service.ts (21 lines)
          queries/
            audit.queries.ts (0 lines)
        README.md (28 lines)
      feed/
        api/
          factories.ts (6 lines)
          index.ts (0 lines)
          workspace-feed.facade.ts (81 lines)
        application/
          dto/
            workspace-feed.dto.ts (18 lines)
          queries/
            workspace-feed-post.queries.ts (22 lines)
          use-cases/
            workspace-feed-interaction.use-cases.ts (19 lines)
            workspace-feed-post.use-cases.ts (27 lines)
            workspace-feed.use-cases.ts (0 lines)
        domain/
          entities/
            workspace-feed-post.entity.ts (52 lines)
          events/
            workspace-feed.events.ts (49 lines)
          ports/
            index.ts (6 lines)
          repositories/
            workspace-feed.repositories.ts (37 lines)
          index.ts (0 lines)
        infrastructure/
          firebase/
            FirebaseWorkspaceFeedInteractionRepository.ts (26 lines)
            FirebaseWorkspaceFeedPostRepository.ts (51 lines)
          index.ts (0 lines)
        interfaces/
          _actions/
            workspace-feed.actions.ts (39 lines)
          components/
            screens/
              OrganizationDailyRouteScreen.tsx (5 lines)
            WorkspaceFeedAccountView.tsx (19 lines)
            WorkspaceFeedWorkspaceView.tsx (31 lines)
          queries/
            workspace-feed.queries.ts (20 lines)
        README.md (28 lines)
      lifecycle/
        api/
          index.ts (9 lines)
        application/
          services/
            WorkspaceLifecycleApplicationService.ts (42 lines)
          use-cases/
            create-workspace.use-case.ts (49 lines)
            delete-workspace.use-case.ts (22 lines)
            update-workspace-settings.use-case.ts (53 lines)
          index.ts (5 lines)
        domain/
          ports/
            index.ts (7 lines)
          index.ts (11 lines)
        infrastructure/
          index.ts (7 lines)
        README.md (34 lines)
      membership/
        api/
          index.ts (9 lines)
        application/
          queries/
            workspace-member.queries.ts (17 lines)
          index.ts (5 lines)
        domain/
          ports/
            index.ts (6 lines)
          index.ts (11 lines)
        infrastructure/
          index.ts (9 lines)
        README.md (38 lines)
      scheduling/
        api/
          factories.ts (3 lines)
          index.ts (5 lines)
          schema.ts (11 lines)
        application/
          dto/
            work-demand.dto.ts (28 lines)
          use-cases/
            work-demand.use-cases.ts (31 lines)
        domain/
          repository.ts (21 lines)
          types.ts (58 lines)
        infrastructure/
          firebase/
            FirebaseDemandRepository.ts (22 lines)
        interfaces/
          _actions/
            work-demand.actions.ts (16 lines)
          components/
            CalendarWidget.tsx (29 lines)
            CreateDemandForm.tsx (47 lines)
          queries/
            work-demand.queries.ts (12 lines)
          screens/
            OrganizationScheduleRouteScreen.tsx (5 lines)
          AccountSchedulingView.tsx (36 lines)
          WorkspaceSchedulingTab.tsx (34 lines)
        README.md (28 lines)
      sharing/
        api/
          index.ts (9 lines)
        application/
          services/
            WorkspaceSharingApplicationService.ts (26 lines)
          use-cases/
            grant-individual-access.use-case.ts (22 lines)
            grant-team-access.use-case.ts (21 lines)
          index.ts (5 lines)
        domain/
          ports/
            index.ts (6 lines)
          index.ts (10 lines)
        infrastructure/
          index.ts (6 lines)
        README.md (38 lines)
      workspace-workflow/
        api/
          contracts.ts (26 lines)
          factories.ts (12 lines)
          index.ts (44 lines)
          listeners.ts (50 lines)
          workspace-flow-invoice.facade.ts (77 lines)
          workspace-flow-issue.facade.ts (70 lines)
          workspace-flow-task-batch-job.facade.ts (31 lines)
          workspace-flow-task.facade.ts (75 lines)
          workspace-flow.facade.ts (110 lines)
        application/
          dto/
            add-invoice-item.dto.ts (14 lines)
            create-task.dto.ts (16 lines)
            extract-task-candidates-from-knowledge.dto.ts (27 lines)
            invoice-query.dto.ts (19 lines)
            issue-query.dto.ts (19 lines)
            materialize-from-knowledge.dto.ts (38 lines)
            open-issue.dto.ts (19 lines)
            pagination.dto.ts (26 lines)
            remove-invoice-item.dto.ts (12 lines)
            resolve-issue.dto.ts (12 lines)
            submit-task-materialization-batch-job.dto.ts (12 lines)
            task-query.dto.ts (23 lines)
            update-invoice-item.dto.ts (14 lines)
            update-task.dto.ts (14 lines)
            workflow.dto.ts (4 lines)
          ports/
            InvoiceService.ts (36 lines)
            IssueService.ts (31 lines)
            TaskService.ts (33 lines)
          process-managers/
            knowledge-to-workflow-materializer.ts (61 lines)
            README.md (28 lines)
          use-cases/
            add-invoice-item.use-case.ts (19 lines)
            approve-invoice.use-case.ts (18 lines)
            approve-task-acceptance.use-case.ts (20 lines)
            archive-task.use-case.ts (23 lines)
            assign-task.use-case.ts (20 lines)
            close-invoice.use-case.ts (18 lines)
            close-issue.use-case.ts (18 lines)
            create-invoice.use-case.ts (17 lines)
            create-task.use-case.ts (18 lines)
            extract-task-candidates-from-knowledge.use-case.ts (23 lines)
            fail-issue-retest.use-case.ts (18 lines)
            fix-issue.use-case.ts (18 lines)
            materialize-tasks-from-knowledge.use-case.ts (22 lines)
            open-issue.use-case.ts (18 lines)
            pass-issue-retest.use-case.ts (18 lines)
            pass-task-qa.use-case.ts (20 lines)
            pay-invoice.use-case.ts (18 lines)
            reject-invoice.use-case.ts (18 lines)
            remove-invoice-item.use-case.ts (18 lines)
            resolve-issue.use-case.ts (18 lines)
            review-invoice.use-case.ts (18 lines)
            start-issue.use-case.ts (18 lines)
            submit-invoice.use-case.ts (19 lines)
            submit-issue-retest.use-case.ts (18 lines)
            submit-task-materialization-batch-job.use-case.ts (16 lines)
            submit-task-to-qa.use-case.ts (18 lines)
            update-invoice-item.use-case.ts (18 lines)
            update-task.use-case.ts (17 lines)
        domain/
          entities/
            Invoice.ts (43 lines)
            InvoiceItem.ts (27 lines)
            Issue.ts (47 lines)
            Task.ts (55 lines)
            TaskMaterializationBatchJob.ts (39 lines)
          events/
            InvoiceEvent.ts (104 lines)
            IssueEvent.ts (86 lines)
            TaskEvent.ts (78 lines)
          ports/
            index.ts (13 lines)
            TaskCandidateExtractionAiPort.ts (27 lines)
          repositories/
            InvoiceRepository.ts (56 lines)
            IssueRepository.ts (43 lines)
            TaskMaterializationBatchJobRepository.ts (33 lines)
            TaskRepository.ts (39 lines)
          services/
            invoice-guards.ts (28 lines)
            invoice-transition-policy.ts (26 lines)
            issue-transition-policy.ts (26 lines)
            task-guards.ts (30 lines)
            task-transition-policy.ts (26 lines)
            TaskCandidateRuleExtractor.ts (22 lines)
          value-objects/
            InvoiceId.ts (14 lines)
            InvoiceItemId.ts (14 lines)
            InvoiceStatus.ts (37 lines)
            IssueId.ts (14 lines)
            IssueStage.ts (16 lines)
            IssueStatus.ts (37 lines)
            SourceReference.ts (44 lines)
            TaskCandidate.ts (29 lines)
            TaskId.ts (14 lines)
            TaskMaterializationBatchJobStatus.ts (8 lines)
            TaskStatus.ts (42 lines)
            UserId.ts (14 lines)
          index.ts (3 lines)
        infrastructure/
          firebase/
            invoice-item.converter.ts (18 lines)
            invoice.converter.ts (20 lines)
            issue.converter.ts (20 lines)
            sourceReference.converter.ts (14 lines)
            task-materialization-batch-job.converter.ts (16 lines)
            task.converter.ts (20 lines)
            workspace-flow.collections.ts (18 lines)
          repositories/
            FirebaseInvoiceItemRepository.ts (25 lines)
            FirebaseInvoiceRepository.ts (55 lines)
            FirebaseIssueRepository.ts (36 lines)
            FirebaseTaskMaterializationBatchJobRepository.ts (35 lines)
            FirebaseTaskRepository.ts (34 lines)
        interfaces/
          _actions/
            workspace-flow-invoice.actions.ts (35 lines)
            workspace-flow-issue.actions.ts (30 lines)
            workspace-flow-task-batch-job.actions.ts (33 lines)
            workspace-flow-task.actions.ts (28 lines)
            workspace-flow.actions.ts (11 lines)
          components/
            AssignTaskDialog.tsx (30 lines)
            CreateTaskDialog.tsx (31 lines)
            EditTaskDialog.tsx (26 lines)
            InvoiceRow.tsx (34 lines)
            IssueRow.tsx (29 lines)
            OpenIssueDialog.tsx (34 lines)
            TaskRow.tsx (56 lines)
            WorkspaceFlowTab.tsx (75 lines)
          contracts/
            workspace-flow.contract.ts (71 lines)
          queries/
            workspace-flow.queries.ts (69 lines)
        README.md (28 lines)
      subdomains.instructions.md (24 lines)
    AGENT.md (47 lines)
    index.ts (4 lines)
    README.md (93 lines)
    workspace.instructions.md (39 lines)
packages/
  api-contracts/
    index.ts (3 lines)
  integration-firebase/
    admin.ts (3 lines)
    analytics.ts (24 lines)
    appcheck.ts (29 lines)
    auth.ts (13 lines)
    client.ts (5 lines)
    database.ts (40 lines)
    firestore.ts (27 lines)
    functions.ts (19 lines)
    index.ts (5 lines)
    messaging.ts (20 lines)
    performance.ts (17 lines)
    remote-config.ts (26 lines)
    storage.ts (28 lines)
  integration-http/
    index.ts (5 lines)
  lib-date-fns/
    index.ts (32 lines)
  lib-dragdrop/
    index.ts (33 lines)
  lib-react-markdown/
    index.ts (13 lines)
  lib-remark-gfm/
    index.ts (7 lines)
  lib-superjson/
    index.ts (12 lines)
  lib-tanstack/
    index.ts (12 lines)
  lib-uuid/
    index.ts (26 lines)
  lib-vis/
    data.ts (11 lines)
    graph3d.ts (16 lines)
    index.ts (16 lines)
    network.ts (16 lines)
    timeline.ts (19 lines)
  lib-xstate/
    index.ts (31 lines)
  lib-zod/
    index.ts (35 lines)
  lib-zustand/
    index.ts (35 lines)
  shared-constants/
    index.ts (0 lines)
  shared-events/
    index.ts (139 lines)
  shared-hooks/
    index.ts (6 lines)
  shared-types/
    index.ts (107 lines)
  shared-utils/
    index.test.ts (3 lines)
    index.ts (8 lines)
  shared-validators/
    index.ts (15 lines)
  ui-shadcn/
    hooks/
      use-mobile.ts (3 lines)
      use-toast.ts (58 lines)
    ui/
      accordion.tsx (26 lines)
      alert-dialog.tsx (18 lines)
      alert.tsx (5 lines)
      aspect-ratio.tsx (5 lines)
      avatar.tsx (5 lines)
      badge.tsx (14 lines)
      breadcrumb.tsx (8 lines)
      button.tsx (6 lines)
      calendar.tsx (12 lines)
      card.tsx (3 lines)
      carousel.tsx (49 lines)
      chart.tsx (25 lines)
      checkbox.tsx (9 lines)
      collapsible.tsx (9 lines)
      command.tsx (17 lines)
      context-menu.tsx (24 lines)
      dialog.tsx (23 lines)
      drawer.tsx (26 lines)
      dropdown-menu.tsx (27 lines)
      hover-card.tsx (7 lines)
      input-group.tsx (10 lines)
      input-otp.tsx (7 lines)
      input.tsx (5 lines)
      kbd.tsx (3 lines)
      label.tsx (8 lines)
      menubar.tsx (19 lines)
      navigation-menu.tsx (13 lines)
      pagination.tsx (31 lines)
      popover.tsx (13 lines)
      progress.tsx (3 lines)
      radio-group.tsx (13 lines)
      scroll-area.tsx (15 lines)
      select.tsx (43 lines)
      separator.tsx (10 lines)
      sheet.tsx (21 lines)
      sidebar.tsx (56 lines)
      skeleton.tsx (3 lines)
      slider.tsx (13 lines)
      sonner.tsx (3 lines)
      spinner.tsx (6 lines)
      switch.tsx (13 lines)
      table.tsx (3 lines)
      tabs.tsx (21 lines)
      textarea.tsx (3 lines)
      toggle-group.tsx (21 lines)
      toggle.tsx (4 lines)
      tooltip.tsx (10 lines)
    index.ts (11 lines)
    utils.ts (4 lines)
  ui-vis/
    index.ts (4 lines)
    network.tsx (105 lines)
    react-graph-vis.d.ts (17 lines)
    timeline.tsx (96 lines)
py_fn/
  .serena/
    .gitkeep (0 lines)
  docs/
    .gitkeep (0 lines)
  src/
    app/
      bootstrap/
        __init__.py (7 lines)
      config/
        .gitkeep (0 lines)
      container/
        .gitkeep (0 lines)
        runtime_dependencies.py (41 lines)
      settings/
        .gitkeep (0 lines)
      __init__.py (5 lines)
    application/
      dto/
        __init__.py (3 lines)
        .gitkeep (0 lines)
        rag.py (11 lines)
      mappers/
        .gitkeep (0 lines)
      ports/
        input/
          .gitkeep (0 lines)
        output/
          .gitkeep (0 lines)
          gateways.py (3 lines)
      services/
        .gitkeep (0 lines)
        document_pipeline.py (1 lines)
      use_cases/
        __init__.py (3 lines)
        rag_ingestion.py (30 lines)
        rag_query.py (46 lines)
      __init__.py (1 lines)
    core/
      constants/
        .gitkeep (0 lines)
      exceptions/
        .gitkeep (0 lines)
      security/
        .gitkeep (0 lines)
      types/
        .gitkeep (0 lines)
      utils/
        .gitkeep (0 lines)
      __init__.py (1 lines)
      config.py (56 lines)
    domain/
      aggregate/
        __init__.py (1 lines)
        .gitkeep (0 lines)
      entities/
        __init__.py (1 lines)
        .gitkeep (0 lines)
      events/
        __init__.py (1 lines)
        .gitkeep (0 lines)
      exceptions/
        __init__.py (1 lines)
        .gitkeep (0 lines)
      repositories/
        __init__.py (3 lines)
        .gitkeep (0 lines)
        rag.py (61 lines)
      services/
        __init__.py (3 lines)
        .gitkeep (0 lines)
        rag_ingestion_text.py (41 lines)
        rag_result_filter.py (55 lines)
      value_objects/
        __init__.py (3 lines)
        .gitkeep (0 lines)
        rag.py (62 lines)
      __init__.py (1 lines)
    infrastructure/
      audit/
        qstash.py (3 lines)
      cache/
        rag_query_cache.py (8 lines)
      config/
        .gitkeep (0 lines)
      external/
        documentai/
          __init__.py (1 lines)
          client.py (73 lines)
        openai/
          __init__.py (3 lines)
          client.py (16 lines)
          embeddings.py (36 lines)
          llm.py (18 lines)
          rag_query.py (3 lines)
        upstash/
          __init__.py (1 lines)
          _base.py (18 lines)
          clients.py (13 lines)
          qstash_client.py (33 lines)
          rag_query.py (3 lines)
          redis_client.py (41 lines)
          search_client.py (73 lines)
          vector_client.py (40 lines)
        __init__.py (1 lines)
      logging/
        .gitkeep (0 lines)
      persistence/
        firestore/
          __init__.py (1 lines)
          document_repository.py (89 lines)
        storage/
          __init__.py (1 lines)
          client.py (68 lines)
        __init__.py (1 lines)
      repositories/
        .gitkeep (0 lines)
      __init__.py (1 lines)
    interface/
      controllers/
        .gitkeep (0 lines)
      handlers/
        __init__.py (3 lines)
        _https_helpers.py (40 lines)
        https.py (12 lines)
        parse_document.py (59 lines)
        rag_query_handler.py (31 lines)
        rag_reindex_handler.py (37 lines)
        storage.py (100 lines)
      middleware/
        .gitkeep (0 lines)
      routes/
        .gitkeep (0 lines)
      schemas/
        .gitkeep (0 lines)
      __init__.py (1 lines)
  tests/
    conftest.py (1 lines)
    test_domain_repository_gateways.py (47 lines)
    test_parse_document_handler.py (44 lines)
  .gitignore (6 lines)
  main.py (43 lines)
  README.md (265 lines)
  requirements-dev.txt (2 lines)
  requirements.txt (23 lines)
AGENTS.md (263 lines)
apphosting.yaml (64 lines)
CLAUDE.md (152 lines)
components.json (25 lines)
eslint.config.mjs (51 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (437 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next.config.ts (1 lines)
package.json (111 lines)
postcss.config.mjs (0 lines)
repomix-markdown.config.json (109 lines)
repomix-notebooklm.config.json (101 lines)
repomix-notion.config.json (101 lines)
repomix.config.json (127 lines)
storage.rules (9 lines)
tailwind.config.ts (2 lines)
tsconfig.json (66 lines)
vitest.config.ts (3 lines)
```