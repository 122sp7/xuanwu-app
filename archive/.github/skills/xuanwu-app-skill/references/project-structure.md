# Directory Structure

```
.agents/
  skills (1 lines)
.claude/
  settings.json (5 lines)
.github/
  agents/
    app/
      README.md (19 lines)
    modules/
      README.md (19 lines)
    ai-genkit-lead.agent.md (46 lines)
    app-router.agent.md (57 lines)
    billing-architect.agent.md (46 lines)
    chunk-strategist.agent.md (42 lines)
    cicd-deploy.agent.md (44 lines)
    doc-ingest.agent.md (43 lines)
    domain-architect.agent.md (85 lines)
    domain-lead.agent.md (55 lines)
    e2e-qa.agent.md (55 lines)
    embedding-writer.agent.md (42 lines)
    firestore-schema.agent.md (42 lines)
    frontend-lead.agent.md (46 lines)
    genkit-flow.agent.md (47 lines)
    kb-architect.agent.md (53 lines)
    lint-rule-enforcer.agent.md (47 lines)
    mddd-architect.agent.md (60 lines)
    parallel-routes.agent.md (59 lines)
    prompt-engineer.agent.md (47 lines)
    quality-lead.agent.md (61 lines)
    rag-lead.agent.md (47 lines)
    README.md (77 lines)
    repo-architect.agent.md (46 lines)
    schema-migration.agent.md (42 lines)
    security-rules.agent.md (46 lines)
    serena-strategist.agent.md (54 lines)
    server-action-writer.agent.md (42 lines)
    shadcn-composer.agent.md (49 lines)
    support-architect.agent.md (54 lines)
    test-scenario-writer.agent.md (42 lines)
    tool-caller.agent.md (55 lines)
    ts-interface-writer.agent.md (48 lines)
  instructions/
    app/
      app-router-parallel-routes.instructions.md (34 lines)
    modules/
      modules-api-surface.instructions.md (32 lines)
      modules-index-entry.instructions.md (28 lines)
      modules-infrastructure-adapters.instructions.md (30 lines)
      modules-interfaces-api-consumption.instructions.md (30 lines)
    architecture-api-boundary.instructions.md (36 lines)
    architecture-mddd.instructions.md (36 lines)
    architecture-modules.instructions.md (38 lines)
    architecture-monorepo.instructions.md (34 lines)
    bounded-context-rules.instructions.md (70 lines)
    branching-strategy.instructions.md (20 lines)
    ci-cd.instructions.md (21 lines)
    cloud-functions.instructions.md (30 lines)
    commit-convention.instructions.md (20 lines)
    domain-modeling.instructions.md (123 lines)
    embedding-pipeline.instructions.md (24 lines)
    event-driven-state.instructions.md (106 lines)
    firebase-architecture.instructions.md (27 lines)
    firestore-schema.instructions.md (21 lines)
    genkit-flow.instructions.md (17 lines)
    hosting-deploy.instructions.md (15 lines)
    lint-format.instructions.md (21 lines)
    nextjs-app-router.instructions.md (20 lines)
    nextjs-parallel-routes.instructions.md (18 lines)
    nextjs-server-actions.instructions.md (19 lines)
    prompt-engineering.instructions.md (31 lines)
    rag-architecture.instructions.md (18 lines)
    README.md (87 lines)
    security-rules.instructions.md (21 lines)
    shadcn-ui.instructions.md (17 lines)
    tailwind-design-system.instructions.md (17 lines)
    testing-e2e.instructions.md (17 lines)
    testing-unit.instructions.md (17 lines)
    ubiquitous-language.instructions.md (49 lines)
  prompts/
    app/
      create-parallel-route-slice.prompt.md (40 lines)
    modules/
      create-module-api-surface.prompt.md (39 lines)
    analyze-repo.prompt.md (37 lines)
    chunk-docs.prompt.md (27 lines)
    debug-error.prompt.md (26 lines)
    embedding-docs.prompt.md (20 lines)
    generate-aggregate.prompt.md (52 lines)
    generate-domain-event.prompt.md (60 lines)
    implement-feature.prompt.md (29 lines)
    implement-firestore-schema.prompt.md (19 lines)
    implement-genkit-flow.prompt.md (20 lines)
    implement-security-rules.prompt.md (19 lines)
    implement-server-action.prompt.md (21 lines)
    implement-ui-component.prompt.md (22 lines)
    ingest-docs.prompt.md (21 lines)
    plan-api.prompt.md (20 lines)
    plan-feature.prompt.md (16 lines)
    plan-module.prompt.md (20 lines)
    README.md (55 lines)
    refactor-api.prompt.md (19 lines)
    refactor-module.prompt.md (20 lines)
    review-architecture.prompt.md (15 lines)
    review-code.prompt.md (19 lines)
    review-performance.prompt.md (20 lines)
    review-security.prompt.md (14 lines)
    write-docs.prompt.md (19 lines)
    write-e2e-tests.prompt.md (21 lines)
    write-tests.prompt.md (19 lines)
  rules/
    _sections.md (56 lines)
    _template.md (28 lines)
    api-contracts.md (34 lines)
    api-module-surface.md (42 lines)
    architecture-dependency-direction.md (54 lines)
    architecture-hexagonal-ports.md (82 lines)
    architecture-module-boundaries.md (50 lines)
    architecture-module-structure.md (70 lines)
    architecture-package-boundaries.md (46 lines)
    ci-git-workflow.md (32 lines)
    ci-type-check-first.md (33 lines)
    culture-accountability.md (19 lines)
    culture-leverage-ai.md (18 lines)
    data-dto-boundaries.md (55 lines)
    data-firebase-collections.md (45 lines)
    data-repository-pattern.md (62 lines)
    patterns-dependency-injection.md (62 lines)
    patterns-domain-events.md (46 lines)
    patterns-domain-services.md (63 lines)
    patterns-use-case.md (51 lines)
    performance-avoid-quadratic.md (47 lines)
    quality-code-comments.md (44 lines)
    quality-code-review.md (37 lines)
    quality-error-handling.md (55 lines)
    quality-imports.md (51 lines)
    quality-pr-creation.md (37 lines)
    quality-simplicity.md (44 lines)
    README.md (38 lines)
    reference-file-locations.md (30 lines)
    reference-local-dev.md (53 lines)
    testing-coverage.md (38 lines)
    testing-mocking.md (60 lines)
  copilot-instructions.md (78 lines)
  README.md (263 lines)
  terminology-glossary.md (119 lines)
agents/
  agents (1 lines)
  commands.md (52 lines)
  hooks (1 lines)
  instructions (1 lines)
  knowledge-base.md (228 lines)
  prompts (1 lines)
  README.md (70 lines)
  rules (1 lines)
  skills (1 lines)
app/
  (public)/
    page.tsx (41 lines)
  (shell)/
    _components/
      account-switcher.tsx (35 lines)
      app-breadcrumbs.tsx (7 lines)
      app-rail.tsx (112 lines)
      customize-navigation-dialog.tsx (141 lines)
      dashboard-sidebar.tsx (132 lines)
      global-search-dialog.tsx (24 lines)
      header-controls.tsx (31 lines)
      header-user-avatar.tsx (29 lines)
      nav-user.tsx (9 lines)
      shell-guard.tsx (23 lines)
      translation-switcher.tsx (27 lines)
    ai-chat/
      _actions.ts (10 lines)
      page.tsx (33 lines)
    dashboard/
      page.tsx (6 lines)
    dev-tools/
      page.tsx (154 lines)
    organization/
      audit/
        page.tsx (18 lines)
      content/
        page.tsx (8 lines)
      daily/
        page.tsx (5 lines)
      members/
        page.tsx (15 lines)
      permissions/
        page.tsx (17 lines)
      schedule/
        dispatcher/
          page.tsx (7 lines)
        page.tsx (5 lines)
      teams/
        page.tsx (15 lines)
      workspaces/
        page.tsx (17 lines)
      _utils.ts (8 lines)
      page.tsx (27 lines)
    settings/
      general/
        page.tsx (6 lines)
      notifications/
        page.tsx (6 lines)
      profile/
        page.tsx (6 lines)
      page.tsx (6 lines)
    wiki/
      block-editor/
        page.tsx (3 lines)
      documents/
        page.tsx (5 lines)
      libraries/
        page.tsx (5 lines)
      namespaces/
        page.tsx (3 lines)
      pages/
        page.tsx (5 lines)
      pages-dnd/
        page.tsx (5 lines)
      rag-query/
        page.tsx (6 lines)
      rag-reindex/
        page.tsx (4 lines)
      page.tsx (13 lines)
    workspace/
      [workspaceId]/
        page.tsx (4 lines)
      page.tsx (9 lines)
    layout.tsx (52 lines)
  providers/
    app-context.ts (75 lines)
    app-provider.tsx (59 lines)
    auth-context.ts (31 lines)
    auth-provider.tsx (48 lines)
    dev-demo-auth.ts (18 lines)
    providers.tsx (16 lines)
  globals.css (13 lines)
  layout.tsx (11 lines)
docs/
  architecture/
    adr/
      ADR-001-content-to-workflow-boundary.md (158 lines)
      ADR-002-ubiquitous-language-bounded-context-remediation.md (185 lines)
      README.md (26 lines)
    ai-domain.md (273 lines)
    bounded-contexts.md (401 lines)
    context-map.md (197 lines)
    domain-events.md (234 lines)
    domain-implementation-target.md (134 lines)
    domain-model.md (546 lines)
    domain-services.md (277 lines)
    infrastructure-strategy.md (269 lines)
    module-boundary.md (292 lines)
    read-model.md (312 lines)
    README.md (55 lines)
    repository-pattern.md (360 lines)
    ubiquitous-language.md (289 lines)
    use-cases.md (319 lines)
    workspace-ui-gap-analysis.md (155 lines)
  development/
    code-style.md (368 lines)
    development-process.md (281 lines)
    modules-implementation-guide.md (165 lines)
    README.md (0 lines)
  diagrams/
    agent-architecture-commander-subagents.mermaid (38 lines)
    architecture.mermaid (228 lines)
    domain-id-api-boundary-template-v2.mermaid (88 lines)
    domain-id-api-boundary-template.mermaid (83 lines)
    erd-model.mermaid (155 lines)
    event-bus-message-flow.mermaid (39 lines)
    onboarding-flow.mermaid (57 lines)
    rag-enterprise-e2e.mermaid (80 lines)
    README.md (38 lines)
    security-rules-decision-flow.mermaid (45 lines)
    state-machine.mermaid (67 lines)
    workspace-interaction-flow.mermaid (99 lines)
    xuanwu_architecture.mermaid (111 lines)
  guides/
    explanation/
      architecture-domain.md (925 lines)
      architecture.md (942 lines)
      README.md (16 lines)
    how-to/
      ui-ux/
        component-patterns.md (362 lines)
        information-architecture.md (244 lines)
        ux-principles.md (228 lines)
        wireframes.md (337 lines)
      user-manual/
        admin-guide.md (263 lines)
      README.md (17 lines)
  reference/
    specification/
      system-overview.md (189 lines)
    README.md (16 lines)
  templates/
    explanation.template.md (23 lines)
    how-to.template.md (24 lines)
    reference.template.md (21 lines)
    tutorial.template.md (25 lines)
  tutorials/
    README.md (17 lines)
  README.md (28 lines)
  SOURCE-OF-TRUTH.md (25 lines)
modules/
  account/
    api/
      index.ts (12 lines)
    application/
      use-cases/
        account-policy.use-cases.ts (40 lines)
        account.use-cases.ts (60 lines)
    domain/
      entities/
        Account.ts (87 lines)
        AccountPolicy.ts (49 lines)
      repositories/
        AccountPolicyRepository.ts (22 lines)
        AccountQueryRepository.ts (90 lines)
        AccountRepository.ts (36 lines)
    infrastructure/
      firebase/
        FirebaseAccountPolicyRepository.ts (39 lines)
        FirebaseAccountQueryRepository.ts (60 lines)
        FirebaseAccountRepository.ts (68 lines)
    interfaces/
      _actions/
        account-policy.actions.ts (25 lines)
        account.actions.ts (49 lines)
      queries/
        account.queries.ts (59 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (7 lines)
  agent/
    api/
      index.ts (3 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (3 lines)
        generate-agent-response.use-case.ts (11 lines)
      index.ts (0 lines)
    domain/
      entities/
        AgentGeneration.ts (17 lines)
        message.ts (14 lines)
        RagQuery.ts (3 lines)
        thread.ts (12 lines)
      repositories/
        AgentRepository.ts (10 lines)
        RagGenerationRepository.ts (3 lines)
        RagRetrievalRepository.ts (3 lines)
      index.ts (0 lines)
    infrastructure/
      firebase/
        FirebaseRagRetrievalRepository.ts (3 lines)
        index.ts (0 lines)
      genkit/
        client.ts (14 lines)
        GenkitAgentRepository.ts (10 lines)
        index.ts (3 lines)
      index.ts (0 lines)
    interfaces/
      _actions/
        agent.actions.ts (16 lines)
      index.ts (0 lines)
    .gitkeep (0 lines)
    index.ts (0 lines)
  asset/
    api/
      index.ts (48 lines)
    application/
      dto/
        file.dto.ts (62 lines)
        rag-document.dto.ts (52 lines)
      use-cases/
        list-workspace-files.use-case.ts (8 lines)
        register-uploaded-rag-document.use-case.ts (32 lines)
        upload-complete-file.use-case.ts (30 lines)
        upload-init-file.use-case.ts (29 lines)
        wiki-libraries.use-case.ts (66 lines)
      index.ts (0 lines)
    domain/
      entities/
        AuditRecord.ts (18 lines)
        File.ts (26 lines)
        FileVersion.ts (13 lines)
        PermissionSnapshot.ts (12 lines)
        RetentionPolicy.ts (8 lines)
        wiki-library.types.ts (62 lines)
      ports/
        ActorContextPort.ts (11 lines)
        OrganizationPolicyPort.ts (18 lines)
        WorkspaceGrantPort.ts (16 lines)
      repositories/
        FileRepository.ts (20 lines)
        RagDocumentRepository.ts (115 lines)
        WikiLibraryRepository.ts (29 lines)
      services/
        complete-upload-file.ts (8 lines)
        resolve-file-organization-id.ts (4 lines)
      index.ts (0 lines)
    infrastructure/
      firebase/
        FirebaseFileRepository.ts (69 lines)
        FirebaseRagDocumentRepository.ts (56 lines)
      repositories/
        in-memory-wiki-library.repository.ts (32 lines)
      index.ts (0 lines)
    interfaces/
      _actions/
        file.actions.ts (33 lines)
      components/
        AssetDocumentsView.tsx (56 lines)
        LibrariesView.tsx (24 lines)
        LibraryTableView.tsx (44 lines)
        WorkspaceFilesTab.tsx (28 lines)
      contracts/
        file-command-result.ts (16 lines)
      hooks/
        useDocumentsSnapshot.ts (57 lines)
      queries/
        file.queries.ts (14 lines)
      index.ts (0 lines)
    index.ts (0 lines)
    README.md (902 lines)
  content/
    api/
      content-api.ts (62 lines)
      content-facade.ts (101 lines)
      events.ts (12 lines)
      index.ts (36 lines)
    application/
      dto/
        content.dto.ts (50 lines)
      use-cases/
        content-block.use-cases.ts (36 lines)
        content-page.use-cases.ts (76 lines)
        content-version.use-cases.ts (24 lines)
        wiki-pages.use-case.ts (60 lines)
      block-service.ts (38 lines)
    domain/
      entities/
        block.ts (34 lines)
        content-block.entity.ts (35 lines)
        content-page.entity.ts (77 lines)
        content-version.entity.ts (31 lines)
        page.ts (24 lines)
        wiki-page.types.ts (45 lines)
      events/
        content.events.ts (127 lines)
      repositories/
        content.repositories.ts (71 lines)
        WikiPageRepository.ts (19 lines)
      value-objects/
        block-content.ts (40 lines)
      index.ts (4 lines)
    infrastructure/
      firebase/
        FirebaseContentBlockRepository.ts (53 lines)
        FirebaseContentPageRepository.ts (64 lines)
      repositories/
        firebase-wiki-page.repository.ts (24 lines)
        in-memory-wiki-page.repository.ts (16 lines)
      index.ts (4 lines)
      InMemoryContentRepository.ts (70 lines)
    interfaces/
      _actions/
        content.actions.ts (68 lines)
      components/
        BlockEditorView.tsx (40 lines)
        PagesDnDView.tsx (31 lines)
        PagesView.tsx (35 lines)
      queries/
        content.queries.ts (36 lines)
      store/
        block-editor.store.ts (28 lines)
      index.ts (4 lines)
    index.ts (26 lines)
  identity/
    api/
      index.ts (33 lines)
    application/
      use-cases/
        identity.use-cases.ts (40 lines)
        token-refresh.use-cases.ts (25 lines)
      identity-error-message.ts (23 lines)
    domain/
      entities/
        Identity.ts (25 lines)
        TokenRefreshSignal.ts (17 lines)
      repositories/
        IdentityRepository.ts (51 lines)
        TokenRefreshRepository.ts (35 lines)
    infrastructure/
      firebase/
        FirebaseIdentityRepository.ts (51 lines)
        FirebaseTokenRefreshRepository.ts (23 lines)
    interfaces/
      _actions/
        identity.actions.ts (29 lines)
      hooks/
        useTokenRefreshListener.tsx (28 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (6 lines)
  knowledge/
    api/
      index.ts (7 lines)
      knowledge-api.ts (5 lines)
      knowledge-ingestion-api.ts (30 lines)
    application/
      use-cases/
        advance-ingestion-stage.use-case.ts (22 lines)
        register-ingestion-document.use-case.ts (23 lines)
      link-extractor.service.ts (5 lines)
    domain/
      entities/
        graph-node.ts (5 lines)
        IngestionChunk.ts (11 lines)
        IngestionDocument.ts (10 lines)
        IngestionJob.ts (24 lines)
        link.ts (5 lines)
      repositories/
        GraphRepository.ts (5 lines)
        IngestionJobRepository.ts (29 lines)
    infrastructure/
      InMemoryGraphRepository.ts (5 lines)
      InMemoryIngestionJobRepository.ts (20 lines)
    .gitkeep (0 lines)
  knowledge-graph/
    api/
      index.ts (3 lines)
      knowledge-graph-api.ts (44 lines)
    application/
      use-cases/
        auto-link.use-case.ts (49 lines)
      link-extractor.service.ts (44 lines)
    domain/
      entities/
        graph-node.ts (27 lines)
        link.ts (37 lines)
        view-config.ts (43 lines)
      repositories/
        GraphRepository.ts (54 lines)
    infrastructure/
      InMemoryGraphRepository.ts (26 lines)
    .gitkeep (0 lines)
    Graph-ERD.mermaid (40 lines)
    Graph-Flow.mermaid (63 lines)
    Graph-Sequence.mermaid (62 lines)
    Graph-Tree.mermaid (142 lines)
    Graph-UI.mermaid (102 lines)
    README.md (71 lines)
  notification/
    api/
      index.ts (14 lines)
    application/
      use-cases/
        notification.use-cases.ts (22 lines)
    domain/
      entities/
        Notification.ts (28 lines)
      repositories/
        NotificationRepository.ts (15 lines)
    infrastructure/
      firebase/
        FirebaseNotificationRepository.ts (40 lines)
    interfaces/
      _actions/
        notification.actions.ts (23 lines)
      queries/
        notification.queries.ts (7 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (3 lines)
  organization/
    api/
      index.ts (46 lines)
    application/
      use-cases/
        organization-policy.use-cases.ts (29 lines)
        organization.use-cases.ts (103 lines)
    domain/
      entities/
        Organization.ts (143 lines)
      repositories/
        OrganizationRepository.ts (91 lines)
    infrastructure/
      firebase/
        FirebaseOrganizationRepository.ts (155 lines)
    interfaces/
      _actions/
        organization.actions.ts (118 lines)
      queries/
        organization.queries.ts (34 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (11 lines)
  retrieval/
    api/
      index.ts (35 lines)
      server.ts (8 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (17 lines)
        submit-rag-feedback.use-case.ts (27 lines)
        wiki-rag.use-case.ts (38 lines)
    domain/
      entities/
        RagQuery.ts (54 lines)
        RagQueryFeedback.ts (60 lines)
        WikiRagTypes.ts (58 lines)
      ports/
        vector-store.ts (81 lines)
      repositories/
        RagGenerationRepository.ts (28 lines)
        RagQueryFeedbackRepository.ts (26 lines)
        RagRetrievalRepository.ts (15 lines)
        WikiContentRepository.ts (41 lines)
    infrastructure/
      firebase/
        FirebaseRagQueryFeedbackRepository.ts (43 lines)
        FirebaseRagRetrievalRepository.ts (34 lines)
        FirebaseWikiContentRepository.ts (44 lines)
      genkit/
        client.ts (4 lines)
        GenkitRagGenerationRepository.ts (14 lines)
    interfaces/
      components/
        RagQueryView.tsx (29 lines)
        RagView.tsx (70 lines)
    index.ts (9 lines)
  shared/
    api/
      index.ts (8 lines)
    application/
      publish-domain-event.ts (29 lines)
    domain/
      events/
        content-page-created.event.ts (49 lines)
        content-updated.event.ts (35 lines)
      event-record.ts (66 lines)
      events.ts (24 lines)
      slug-utils.ts (17 lines)
      types.ts (53 lines)
    infrastructure/
      InMemoryEventStoreRepository.ts (19 lines)
      NoopEventBusRepository.ts (14 lines)
      SimpleEventBus.ts (32 lines)
    index.ts (7 lines)
  workspace/
    api/
      index.ts (24 lines)
    application/
      use-cases/
        wiki-content-tree.use-case.ts (23 lines)
        workspace-member.use-cases.ts (8 lines)
        workspace.use-cases.ts (70 lines)
    domain/
      entities/
        WikiContentTree.ts (45 lines)
        Workspace.ts (85 lines)
        WorkspaceMember.ts (25 lines)
      repositories/
        WikiWorkspaceRepository.ts (14 lines)
        WorkspaceQueryRepository.ts (22 lines)
        WorkspaceRepository.ts (57 lines)
    infrastructure/
      firebase/
        FirebaseWikiWorkspaceRepository.ts (8 lines)
        FirebaseWorkspaceQueryRepository.ts (38 lines)
        FirebaseWorkspaceRepository.ts (74 lines)
    interfaces/
      _actions/
        workspace.actions.ts (56 lines)
      components/
        WorkspaceDailyTab.tsx (8 lines)
        WorkspaceDetailScreen.tsx (104 lines)
        WorkspaceHubScreen.tsx (53 lines)
        WorkspaceMembersTab.tsx (26 lines)
        WorkspaceWikiTab.tsx (11 lines)
        WorkspaceWikiView.tsx (27 lines)
      hooks/
        useWorkspaceHub.ts (19 lines)
      queries/
        workspace-member.queries.ts (5 lines)
        workspace.queries.ts (21 lines)
      workspace-tabs.ts (24 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (3 lines)
  workspace-audit/
    api/
      index.ts (12 lines)
    application/
      use-cases/
        audit.use-cases.ts (12 lines)
      .gitkeep (0 lines)
    domain/
      entities/
        AuditLog.ts (11 lines)
      repositories/
        AuditRepository.ts (9 lines)
      .gitkeep (0 lines)
      schema.ts (61 lines)
    infrastructure/
      firebase/
        FirebaseAuditRepository.ts (25 lines)
      .gitkeep (0 lines)
    interfaces/
      components/
        AuditStream.tsx (51 lines)
        WorkspaceAuditTab.tsx (20 lines)
      queries/
        audit.queries.ts (15 lines)
      .gitkeep (0 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (0 lines)
    index.ts (1 lines)
    README.md (27 lines)
  workspace-feed/
    api/
      index.ts (1 lines)
      workspace-feed.facade.ts (81 lines)
    application/
      dto/
        workspace-feed.dto.ts (13 lines)
      use-cases/
        workspace-feed.use-cases.ts (58 lines)
    domain/
      entities/
        workspace-feed-post.entity.ts (52 lines)
      events/
        workspace-feed.events.ts (49 lines)
      repositories/
        workspace-feed.repositories.ts (37 lines)
      index.ts (0 lines)
    infrastructure/
      firebase/
        FirebaseWorkspaceFeedInteractionRepository.ts (37 lines)
        FirebaseWorkspaceFeedPostRepository.ts (67 lines)
      index.ts (0 lines)
    interfaces/
      _actions/
        workspace-feed.actions.ts (39 lines)
      components/
        WorkspaceFeedAccountView.tsx (18 lines)
        WorkspaceFeedWorkspaceView.tsx (31 lines)
      queries/
        workspace-feed.queries.ts (20 lines)
      index.ts (0 lines)
    index.ts (10 lines)
  workspace-flow/
    api/
      contracts.ts (26 lines)
      index.ts (38 lines)
      listeners.ts (41 lines)
      workspace-flow.facade.ts (167 lines)
    application/
      dto/
        add-invoice-item.dto.ts (14 lines)
        create-task.dto.ts (16 lines)
        invoice-query.dto.ts (19 lines)
        issue-query.dto.ts (19 lines)
        materialize-from-content.dto.ts (38 lines)
        open-issue.dto.ts (19 lines)
        pagination.dto.ts (26 lines)
        remove-invoice-item.dto.ts (12 lines)
        resolve-issue.dto.ts (12 lines)
        task-query.dto.ts (23 lines)
        update-invoice-item.dto.ts (14 lines)
        update-task.dto.ts (14 lines)
      ports/
        InvoiceService.ts (30 lines)
        IssueService.ts (25 lines)
        TaskService.ts (27 lines)
      process-managers/
        content-to-workflow-materializer.ts (54 lines)
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
        fail-issue-retest.use-case.ts (18 lines)
        fix-issue.use-case.ts (18 lines)
        materialize-tasks-from-content.use-case.ts (28 lines)
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
        submit-task-to-qa.use-case.ts (18 lines)
        update-invoice-item.use-case.ts (18 lines)
        update-task.use-case.ts (17 lines)
    domain/
      entities/
        Invoice.ts (43 lines)
        InvoiceItem.ts (27 lines)
        Issue.ts (47 lines)
        Task.ts (55 lines)
      events/
        InvoiceEvent.ts (104 lines)
        IssueEvent.ts (86 lines)
        TaskEvent.ts (78 lines)
      repositories/
        InvoiceRepository.ts (56 lines)
        IssueRepository.ts (43 lines)
        TaskRepository.ts (39 lines)
      services/
        invoice-guards.ts (28 lines)
        invoice-transition-policy.ts (26 lines)
        issue-transition-policy.ts (26 lines)
        task-guards.ts (30 lines)
        task-transition-policy.ts (26 lines)
      value-objects/
        InvoiceId.ts (14 lines)
        InvoiceItemId.ts (14 lines)
        InvoiceStatus.ts (37 lines)
        IssueId.ts (14 lines)
        IssueStage.ts (16 lines)
        IssueStatus.ts (37 lines)
        SourceReference.ts (44 lines)
        TaskId.ts (14 lines)
        TaskStatus.ts (42 lines)
        UserId.ts (14 lines)
    infrastructure/
      firebase/
        invoice-item.converter.ts (18 lines)
        invoice.converter.ts (20 lines)
        issue.converter.ts (20 lines)
        sourceReference.converter.ts (14 lines)
        task.converter.ts (20 lines)
        workspace-flow.collections.ts (16 lines)
      repositories/
        FirebaseInvoiceItemRepository.ts (36 lines)
        FirebaseInvoiceRepository.ts (69 lines)
        FirebaseIssueRepository.ts (50 lines)
        FirebaseTaskRepository.ts (47 lines)
    interfaces/
      _actions/
        workspace-flow.actions.ts (106 lines)
      components/
        WorkspaceFlowTab.tsx (164 lines)
      contracts/
        workspace-flow.contract.ts (55 lines)
      queries/
        workspace-flow.queries.ts (57 lines)
    AGENT.md (447 lines)
    index.ts (29 lines)
    README.md (305 lines)
    Workspace-Flow-Architecture.mermaid (24 lines)
    Workspace-Flow-ERD.mermaid (46 lines)
    Workspace-Flow-Events.mermaid (24 lines)
    Workspace-Flow-File-Template.md (82 lines)
    Workspace-Flow-Lifecycle.mermaid (18 lines)
    Workspace-Flow-Permissions.mermaid (60 lines)
    Workspace-Flow-Sequence.mermaid (51 lines)
    Workspace-Flow-States.mermaid (34 lines)
    Workspace-Flow-Tree.mermaid (148 lines)
    Workspace-Flow-UI.mermaid (94 lines)
    Workspace-Flow.mermaid (84 lines)
  workspace-scheduling/
    api/
      index.ts (8 lines)
      schema.ts (18 lines)
    application/
      work-demand.use-cases.ts (41 lines)
    domain/
      repository.ts (33 lines)
      types.ts (99 lines)
    infrastructure/
      firebase/
        FirebaseDemandRepository.ts (32 lines)
      mock-demand-repository.ts (24 lines)
    interfaces/
      _actions/
        work-demand.actions.ts (25 lines)
      components/
        CalendarWidget.tsx (74 lines)
        CreateDemandForm.tsx (74 lines)
      queries/
        work-demand.queries.ts (21 lines)
      AccountSchedulingView.tsx (73 lines)
      WorkspaceSchedulingTab.tsx (63 lines)
    index.ts (20 lines)
  system.ts (32 lines)
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
    graph3d.ts (14 lines)
    index.ts (16 lines)
    network.ts (14 lines)
    timeline.ts (17 lines)
  lib-xstate/
    index.ts (31 lines)
  lib-zod/
    index.ts (35 lines)
  lib-zustand/
    index.ts (35 lines)
  shared-constants/
    index.ts (0 lines)
  shared-hooks/
    index.ts (6 lines)
  shared-types/
    index.ts (64 lines)
  shared-utils/
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
      pagination.tsx (29 lines)
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
  README.md (98 lines)
py_fn/
  .serena/
    .gitkeep (0 lines)
  docs/
    .gitkeep (0 lines)
    README.md (133 lines)
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
        rag_ingestion.py (65 lines)
        rag_query.py (85 lines)
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
        __init__.py (1 lines)
        .gitkeep (0 lines)
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
          clients.py (181 lines)
          rag_query.py (3 lines)
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
        https.py (178 lines)
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
  .gitignore (6 lines)
  main.py (43 lines)
  README.md (265 lines)
  requirements.txt (23 lines)
scripts/
  demo-flow.ts (39 lines)
.firebaserc (5 lines)
.gitignore (46 lines)
.tmp-eslint-config.json (1932 lines)
.tmp-eslint.json (1 lines)
AGENTS.md (147 lines)
apphosting.yaml (64 lines)
CLAUDE.md (45 lines)
CODE_OF_CONDUCT.md (128 lines)
components.json (25 lines)
CONTRIBUTING.md (115 lines)
eslint.config.mjs (16 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (305 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next.config.ts (1 lines)
package.json (93 lines)
PERMISSIONS.md (83 lines)
postcss.config.mjs (0 lines)
README.md (93 lines)
repomix.config.json (107 lines)
SPEC-WORKFLOW.md (42 lines)
storage.rules (9 lines)
tailwind.config.ts (2 lines)
tsconfig.json (65 lines)
```