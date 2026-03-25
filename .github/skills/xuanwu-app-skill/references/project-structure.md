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
    README.md (71 lines)
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
      app-router-parallel-routes.instructions.md (38 lines)
    modules/
      modules-api-surface.instructions.md (36 lines)
      modules-index-entry.instructions.md (34 lines)
      modules-infrastructure-adapters.instructions.md (35 lines)
      modules-interfaces-api-consumption.instructions.md (35 lines)
    architecture-api-boundary.instructions.md (41 lines)
    architecture-mddd.instructions.md (41 lines)
    architecture-modules.instructions.md (43 lines)
    architecture-monorepo.instructions.md (38 lines)
    branching-strategy.instructions.md (27 lines)
    ci-cd.instructions.md (28 lines)
    cloud-functions.instructions.md (36 lines)
    commit-convention.instructions.md (27 lines)
    embedding-pipeline.instructions.md (28 lines)
    firebase-architecture.instructions.md (32 lines)
    firestore-schema.instructions.md (27 lines)
    genkit-flow.instructions.md (22 lines)
    hosting-deploy.instructions.md (22 lines)
    lint-format.instructions.md (27 lines)
    nextjs-app-router.instructions.md (24 lines)
    nextjs-parallel-routes.instructions.md (22 lines)
    nextjs-server-actions.instructions.md (24 lines)
    prompt-engineering.instructions.md (38 lines)
    rag-architecture.instructions.md (22 lines)
    README.md (83 lines)
    security-rules.instructions.md (27 lines)
    shadcn-ui.instructions.md (22 lines)
    tailwind-design-system.instructions.md (22 lines)
    testing-e2e.instructions.md (22 lines)
    testing-unit.instructions.md (22 lines)
  prompts/
    app/
      create-parallel-route-slice.prompt.md (44 lines)
    modules/
      create-module-api-surface.prompt.md (44 lines)
    analyze-repo.prompt.md (42 lines)
    chunk-docs.prompt.md (31 lines)
    debug-error.prompt.md (31 lines)
    embedding-docs.prompt.md (25 lines)
    implement-feature.prompt.md (32 lines)
    implement-firestore-schema.prompt.md (25 lines)
    implement-genkit-flow.prompt.md (25 lines)
    implement-security-rules.prompt.md (25 lines)
    implement-server-action.prompt.md (25 lines)
    implement-ui-component.prompt.md (25 lines)
    ingest-docs.prompt.md (25 lines)
    plan-api.prompt.md (25 lines)
    plan-feature.prompt.md (20 lines)
    plan-module.prompt.md (25 lines)
    README.md (54 lines)
    refactor-api.prompt.md (24 lines)
    refactor-module.prompt.md (25 lines)
    review-architecture.prompt.md (20 lines)
    review-code.prompt.md (24 lines)
    review-performance.prompt.md (25 lines)
    review-security.prompt.md (20 lines)
    write-docs.prompt.md (25 lines)
    write-e2e-tests.prompt.md (26 lines)
    write-tests.prompt.md (24 lines)
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
  skills/
    app-router-parallel-routes/
      SKILL.md (36 lines)
    context7/
      SKILL.md (34 lines)
    deploy-to-vercel/
      resources/
        deploy-codex.sh (301 lines)
        deploy.sh (301 lines)
      SKILL.md (34 lines)
    documentation-writer/
      SKILL.md (31 lines)
    liteparse/
      SKILL.md (36 lines)
    llamaparse/
      scripts/
        example.ts (165 lines)
      SKILL.md (36 lines)
    modules-mddd-api-surface/
      SKILL.md (38 lines)
    next-devtools-mcp/
      SKILL.md (34 lines)
    serena-mcp/
      SKILL.md (76 lines)
    shadcn/
      SKILL.md (296 lines)
    slavingia-skills-company-values/
      SKILL.md (31 lines)
    slavingia-skills-find-community/
      SKILL.md (31 lines)
    slavingia-skills-first-customers/
      SKILL.md (31 lines)
    slavingia-skills-grow-sustainably/
      SKILL.md (31 lines)
    slavingia-skills-minimalist-review/
      SKILL.md (32 lines)
    slavingia-skills-mvp/
      SKILL.md (31 lines)
    slavingia-skills-pricing/
      SKILL.md (31 lines)
    slavingia-skills-validate-idea/
      SKILL.md (31 lines)
    vercel-cli-with-tokens/
      SKILL.md (34 lines)
    vercel-composition-patterns/
      rules/
        _sections.md (29 lines)
        _template.md (24 lines)
        architecture-avoid-boolean-props.md (100 lines)
        architecture-compound-components.md (112 lines)
        patterns-children-over-render-props.md (87 lines)
        patterns-explicit-variants.md (100 lines)
        react19-no-forwardref.md (42 lines)
        state-context-interface.md (191 lines)
        state-decouple-implementation.md (113 lines)
        state-lift-state.md (125 lines)
      AGENTS.md (36 lines)
      README.md (60 lines)
      SKILL.md (40 lines)
    vercel-react-best-practices/
      rules/
        advanced-event-handler-refs.md (55 lines)
        advanced-use-latest.md (49 lines)
        async-api-routes.md (38 lines)
        async-defer-await.md (80 lines)
        async-dependencies.md (36 lines)
        async-parallel.md (28 lines)
        async-suspense-boundaries.md (99 lines)
        bundle-barrel-imports.md (59 lines)
        bundle-conditional.md (31 lines)
        bundle-defer-third-party.md (49 lines)
        bundle-dynamic-imports.md (35 lines)
        bundle-preload.md (50 lines)
        client-event-listeners.md (74 lines)
        client-swr-dedup.md (56 lines)
        js-batch-dom-css.md (82 lines)
        js-cache-function-results.md (80 lines)
        js-cache-property-access.md (28 lines)
        js-cache-storage.md (70 lines)
        js-combine-iterations.md (32 lines)
        js-early-exit.md (50 lines)
        js-hoist-regexp.md (45 lines)
        js-index-maps.md (37 lines)
        js-length-check-first.md (49 lines)
        js-min-max-loop.md (82 lines)
        js-set-map-lookups.md (24 lines)
        js-tosorted-immutable.md (57 lines)
        rendering-activity.md (26 lines)
        rendering-animate-svg-wrapper.md (47 lines)
        rendering-conditional-render.md (40 lines)
        rendering-content-visibility.md (38 lines)
        rendering-hoist-jsx.md (46 lines)
        rendering-hydration-no-flicker.md (82 lines)
        rendering-svg-precision.md (28 lines)
        rerender-defer-reads.md (39 lines)
        rerender-dependencies.md (45 lines)
        rerender-derived-state.md (29 lines)
        rerender-functional-setstate.md (74 lines)
        rerender-lazy-state-init.md (58 lines)
        rerender-memo.md (44 lines)
        rerender-transitions.md (40 lines)
        server-after-nonblocking.md (73 lines)
        server-cache-lru.md (41 lines)
        server-cache-react.md (26 lines)
        server-parallel-fetching.md (79 lines)
        server-serialization.md (38 lines)
      AGENTS.md (42 lines)
      SKILL.md (34 lines)
    vercel-react-native-skills/
      rules/
        _sections.md (86 lines)
        _template.md (28 lines)
        animation-derived-value.md (53 lines)
        animation-gesture-detector-press.md (95 lines)
        animation-gpu-properties.md (65 lines)
        design-system-compound-components.md (66 lines)
        fonts-config-plugin.md (71 lines)
        imports-design-system-folder.md (68 lines)
        js-hoist-intl.md (61 lines)
        list-performance-callbacks.md (44 lines)
        list-performance-function-references.md (132 lines)
        list-performance-images.md (53 lines)
        list-performance-inline-objects.md (97 lines)
        list-performance-item-expensive.md (94 lines)
        list-performance-item-memo.md (82 lines)
        list-performance-item-types.md (104 lines)
        list-performance-virtualize.md (67 lines)
        monorepo-native-deps-in-app.md (46 lines)
        monorepo-single-dependency-versions.md (63 lines)
        navigation-native-navigators.md (188 lines)
        react-compiler-destructure-functions.md (50 lines)
        react-compiler-reanimated-shared-values.md (48 lines)
        react-state-dispatcher.md (91 lines)
        react-state-fallback.md (56 lines)
        react-state-minimize.md (65 lines)
        rendering-no-falsy-and.md (74 lines)
        rendering-text-in-text-component.md (36 lines)
        scroll-position-no-state.md (82 lines)
        state-ground-truth.md (80 lines)
        ui-expo-image.md (66 lines)
        ui-image-gallery.md (104 lines)
        ui-measure-views.md (78 lines)
        ui-menus.md (174 lines)
        ui-native-modals.md (77 lines)
        ui-pressable.md (61 lines)
        ui-safe-area-scroll.md (65 lines)
        ui-scrollview-content-inset.md (45 lines)
        ui-styling.md (87 lines)
      AGENTS.md (36 lines)
      README.md (165 lines)
      SKILL.md (39 lines)
    vscode-agent-foundations/
      SKILL.md (31 lines)
    vscode-context-engineering/
      SKILL.md (31 lines)
    vscode-copilot-skillbook/
      SKILL.md (32 lines)
    vscode-customization-architecture/
      SKILL.md (31 lines)
    vscode-tasks-authoring/
      SKILL.md (31 lines)
    vscode-testing-debugging-browser/
      SKILL.md (31 lines)
    vscode-typescript-workbench/
      SKILL.md (31 lines)
    web-design-guidelines/
      SKILL.md (39 lines)
    xuanwu-development-contracts/
      SKILL.md (31 lines)
    xuanwu-mddd-boundaries/
      SKILL.md (31 lines)
    xuanwu-rag-runtime-boundary/
      SKILL.md (31 lines)
    README.md (43 lines)
  copilot-instructions.md (78 lines)
  README.md (263 lines)
  terminology-glossary.md (92 lines)
agents/
  agents (1 lines)
  commands.md (52 lines)
  hooks (1 lines)
  instructions (1 lines)
  knowledge-base.md (218 lines)
  prompts (1 lines)
  README.md (70 lines)
  rules (1 lines)
  skills (1 lines)
app/
  (public)/
    page.tsx (298 lines)
  (shell)/
    _components/
      account-switcher.tsx (200 lines)
      app-breadcrumbs.tsx (67 lines)
      app-rail.tsx (671 lines)
      customize-navigation-dialog.tsx (610 lines)
      dashboard-sidebar.tsx (972 lines)
      global-search-dialog.tsx (94 lines)
      header-controls.tsx (202 lines)
      header-user-avatar.tsx (87 lines)
      nav-user.tsx (37 lines)
      shell-guard.tsx (50 lines)
      translation-switcher.tsx (80 lines)
    ai-chat/
      page.tsx (48 lines)
    dashboard/
      page.tsx (97 lines)
    dev-tools/
      page.tsx (873 lines)
    organization/
      audit/
        page.tsx (132 lines)
      content/
        page.tsx (10 lines)
      daily/
        page.tsx (39 lines)
      members/
        page.tsx (102 lines)
      permissions/
        page.tsx (100 lines)
      schedule/
        dispatcher/
          page.tsx (43 lines)
        page.tsx (40 lines)
      teams/
        page.tsx (99 lines)
      workspaces/
        page.tsx (125 lines)
      _utils.ts (27 lines)
      page.tsx (141 lines)
    settings/
      general/
        page.tsx (143 lines)
      notifications/
        page.tsx (104 lines)
      profile/
        page.tsx (164 lines)
      page.tsx (8 lines)
    wiki-beta/
      block-editor/
        page.tsx (19 lines)
      documents/
        page.tsx (22 lines)
      libraries/
        page.tsx (47 lines)
      namespaces/
        page.tsx (5 lines)
      pages/
        page.tsx (42 lines)
      pages-dnd/
        page.tsx (27 lines)
      rag-query/
        page.tsx (24 lines)
      rag-reindex/
        page.tsx (14 lines)
      page.tsx (205 lines)
    workspace/
      [workspaceId]/
        page.tsx (25 lines)
      page.tsx (41 lines)
    layout.tsx (295 lines)
  providers/
    app-context.ts (65 lines)
    app-provider.tsx (249 lines)
    auth-context.ts (35 lines)
    auth-provider.tsx (155 lines)
    dev-demo-auth.ts (82 lines)
    providers.tsx (25 lines)
  globals.css (128 lines)
  layout.tsx (26 lines)
docs/
  architecture/
    adr/
      README.md (15 lines)
    domain-implementation-target.md (79 lines)
    README.md (16 lines)
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
    rag-enterprise-e2e.mermaid (77 lines)
    README.md (36 lines)
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
      index.ts (34 lines)
    application/
      use-cases/
        account-policy.use-cases.ts (98 lines)
        account.use-cases.ts (160 lines)
    domain/
      entities/
        Account.ts (87 lines)
        AccountPolicy.ts (45 lines)
      repositories/
        AccountPolicyRepository.ts (15 lines)
        AccountQueryRepository.ts (53 lines)
        AccountRepository.ts (22 lines)
    infrastructure/
      firebase/
        FirebaseAccountPolicyRepository.ts (105 lines)
        FirebaseAccountQueryRepository.ts (183 lines)
        FirebaseAccountRepository.ts (208 lines)
    interfaces/
      _actions/
        account-policy.actions.ts (47 lines)
        account.actions.ts (93 lines)
      queries/
        account.queries.ts (81 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (74 lines)
  agent/
    api/
      index.ts (41 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (4 lines)
        generate-agent-response.use-case.ts (28 lines)
      index.ts (2 lines)
    domain/
      entities/
        AgentGeneration.ts (17 lines)
        message.ts (14 lines)
        RagQuery.ts (12 lines)
        thread.ts (12 lines)
      repositories/
        AgentRepository.ts (8 lines)
        RagGenerationRepository.ts (9 lines)
        RagRetrievalRepository.ts (7 lines)
      index.ts (25 lines)
    infrastructure/
      firebase/
        FirebaseRagRetrievalRepository.ts (4 lines)
        index.ts (1 lines)
      genkit/
        client.ts (25 lines)
        GenkitAgentRepository.ts (36 lines)
        index.ts (12 lines)
      index.ts (2 lines)
    interfaces/
      _actions/
        agent.actions.ts (27 lines)
      index.ts (1 lines)
    .gitkeep (0 lines)
    index.ts (4 lines)
  asset/
    api/
      index.ts (53 lines)
    application/
      dto/
        file.dto.ts (62 lines)
        rag-document.dto.ts (50 lines)
      use-cases/
        list-workspace-files.use-case.ts (37 lines)
        register-uploaded-rag-document.use-case.ts (130 lines)
        upload-complete-file.use-case.ts (204 lines)
        upload-init-file.use-case.ts (127 lines)
        wiki-beta-libraries.use-case.ts (242 lines)
      index.ts (6 lines)
    domain/
      entities/
        AuditRecord.ts (18 lines)
        File.ts (33 lines)
        FileVersion.ts (15 lines)
        PermissionSnapshot.ts (12 lines)
        RetentionPolicy.ts (8 lines)
        wiki-beta-library.types.ts (62 lines)
      ports/
        ActorContextPort.ts (9 lines)
        OrganizationPolicyPort.ts (16 lines)
        WorkspaceGrantPort.ts (14 lines)
      repositories/
        FileRepository.ts (15 lines)
        RagDocumentRepository.ts (85 lines)
        WikiBetaLibraryRepository.ts (21 lines)
      services/
        complete-upload-file.ts (16 lines)
        resolve-file-organization-id.ts (6 lines)
      index.ts (12 lines)
    infrastructure/
      firebase/
        FirebaseFileRepository.ts (201 lines)
        FirebaseRagDocumentRepository.ts (202 lines)
      repositories/
        in-memory-wiki-beta-library.repository.ts (92 lines)
      index.ts (3 lines)
    interfaces/
      _actions/
        file.actions.ts (94 lines)
      components/
        AssetDocumentsView.tsx (401 lines)
        LibrariesView.tsx (299 lines)
        LibraryTableView.tsx (260 lines)
        WorkspaceFilesTab.tsx (248 lines)
      contracts/
        file-command-result.ts (16 lines)
      hooks/
        useDocumentsSnapshot.ts (177 lines)
      queries/
        file.queries.ts (31 lines)
      index.ts (4 lines)
    index.ts (1 lines)
    README.md (902 lines)
  content/
    api/
      content-api.ts (79 lines)
      content-facade.ts (157 lines)
      index.ts (41 lines)
    application/
      dto/
        content.dto.ts (90 lines)
      use-cases/
        content-block.use-cases.ts (73 lines)
        content-page.use-cases.ts (167 lines)
        content-version.use-cases.ts (43 lines)
        wiki-beta-pages.use-case.ts (285 lines)
      block-service.ts (59 lines)
    domain/
      entities/
        block.ts (34 lines)
        content-block.entity.ts (35 lines)
        content-page.entity.ts (59 lines)
        content-version.entity.ts (31 lines)
        page.ts (18 lines)
        wiki-beta-page.types.ts (45 lines)
      events/
        content.events.ts (86 lines)
      repositories/
        content.repositories.ts (47 lines)
        WikiBetaPageRepository.ts (14 lines)
      value-objects/
        block-content.ts (60 lines)
      index.ts (55 lines)
    infrastructure/
      firebase/
        FirebaseContentBlockRepository.ts (137 lines)
        FirebaseContentPageRepository.ts (206 lines)
      repositories/
        firebase-wiki-beta-page.repository.ts (107 lines)
        in-memory-wiki-beta-page.repository.ts (58 lines)
      index.ts (9 lines)
      InMemoryContentRepository.ts (188 lines)
    interfaces/
      _actions/
        content.actions.ts (142 lines)
      components/
        BlockEditorView.tsx (197 lines)
        PagesDnDView.tsx (183 lines)
        PagesView.tsx (258 lines)
      queries/
        content.queries.ts (52 lines)
      store/
        block-editor.store.ts (68 lines)
      index.ts (26 lines)
    index.ts (66 lines)
  identity/
    api/
      index.ts (34 lines)
    application/
      use-cases/
        identity.use-cases.ts (103 lines)
        token-refresh.use-cases.ts (45 lines)
      identity-error-message.ts (69 lines)
    domain/
      entities/
        Identity.ts (25 lines)
        TokenRefreshSignal.ts (15 lines)
      repositories/
        IdentityRepository.ts (30 lines)
        TokenRefreshRepository.ts (22 lines)
    infrastructure/
      firebase/
        FirebaseIdentityRepository.ts (83 lines)
        FirebaseTokenRefreshRepository.ts (48 lines)
    interfaces/
      _actions/
        identity.actions.ts (63 lines)
      hooks/
        useTokenRefreshListener.tsx (44 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (27 lines)
  knowledge/
    api/
      index.ts (21 lines)
      knowledge-api.ts (7 lines)
      knowledge-ingestion-api.ts (38 lines)
    application/
      use-cases/
        advance-ingestion-stage.use-case.ts (56 lines)
        register-ingestion-document.use-case.ts (72 lines)
      link-extractor.service.ts (6 lines)
    domain/
      entities/
        graph-node.ts (5 lines)
        IngestionChunk.ts (11 lines)
        IngestionDocument.ts (10 lines)
        IngestionJob.ts (39 lines)
        link.ts (5 lines)
      repositories/
        GraphRepository.ts (5 lines)
        IngestionJobRepository.ts (16 lines)
    infrastructure/
      InMemoryGraphRepository.ts (6 lines)
      InMemoryIngestionJobRepository.ts (51 lines)
    .gitkeep (0 lines)
  knowledge-graph/
    api/
      index.ts (12 lines)
      knowledge-graph-api.ts (64 lines)
    application/
      link-extractor.service.ts (80 lines)
    domain/
      entities/
        graph-node.ts (21 lines)
        link.ts (25 lines)
        view-config.ts (29 lines)
      repositories/
        GraphRepository.ts (33 lines)
    infrastructure/
      InMemoryGraphRepository.ts (43 lines)
    .gitkeep (0 lines)
    Graph-ERD.mermaid (40 lines)
    Graph-Flow.mermaid (63 lines)
    Graph-Sequence.mermaid (62 lines)
    Graph-Tree.mermaid (142 lines)
    Graph-UI.mermaid (102 lines)
    README.md (71 lines)
  notification/
    api/
      index.ts (28 lines)
    application/
      use-cases/
        notification.use-cases.ts (56 lines)
    domain/
      entities/
        Notification.ts (28 lines)
      repositories/
        NotificationRepository.ts (9 lines)
    infrastructure/
      firebase/
        FirebaseNotificationRepository.ts (105 lines)
    interfaces/
      _actions/
        notification.actions.ts (45 lines)
      queries/
        notification.queries.ts (16 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (21 lines)
  organization/
    api/
      index.ts (61 lines)
    application/
      use-cases/
        organization-policy.use-cases.ts (63 lines)
        organization.use-cases.ts (284 lines)
    domain/
      entities/
        Organization.ts (140 lines)
      repositories/
        OrganizationRepository.ts (57 lines)
    infrastructure/
      firebase/
        FirebaseOrganizationRepository.ts (513 lines)
    interfaces/
      _actions/
        organization.actions.ts (224 lines)
      queries/
        organization.queries.ts (48 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (76 lines)
  retrieval/
    api/
      index.ts (57 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (132 lines)
        wiki-beta-rag.use-case.ts (47 lines)
    domain/
      entities/
        RagQuery.ts (54 lines)
        WikiBetaRagTypes.ts (58 lines)
      ports/
        vector-store.ts (51 lines)
      repositories/
        RagGenerationRepository.ts (26 lines)
        RagRetrievalRepository.ts (13 lines)
        WikiBetaContentRepository.ts (27 lines)
    infrastructure/
      firebase/
        FirebaseRagRetrievalRepository.ts (119 lines)
        FirebaseWikiBetaContentRepository.ts (194 lines)
      genkit/
        client.ts (23 lines)
        GenkitRagGenerationRepository.ts (60 lines)
    interfaces/
      components/
        RagQueryView.tsx (163 lines)
        RagView.tsx (659 lines)
  shared/
    api/
      index.ts (31 lines)
    application/
      publish-domain-event.ts (49 lines)
    domain/
      events/
        content-updated.event.ts (41 lines)
      event-record.ts (66 lines)
      events.ts (16 lines)
      slug-utils.ts (27 lines)
      types.ts (54 lines)
    infrastructure/
      InMemoryEventStoreRepository.ts (37 lines)
      NoopEventBusRepository.ts (14 lines)
      SimpleEventBus.ts (44 lines)
    index.ts (29 lines)
  workspace/
    api/
      index.ts (51 lines)
    application/
      use-cases/
        wiki-beta-content-tree.use-case.ts (65 lines)
        workspace-member.use-cases.ts (10 lines)
        workspace.use-cases.ts (203 lines)
    domain/
      entities/
        WikiBetaContentTree.ts (45 lines)
        Workspace.ts (85 lines)
        WorkspaceMember.ts (25 lines)
      repositories/
        WikiBetaWorkspaceRepository.ts (12 lines)
        WorkspaceQueryRepository.ts (16 lines)
        WorkspaceRepository.ts (35 lines)
    infrastructure/
      firebase/
        FirebaseWikiBetaWorkspaceRepository.ts (14 lines)
        FirebaseWorkspaceQueryRepository.ts (211 lines)
        FirebaseWorkspaceRepository.ts (216 lines)
    interfaces/
      _actions/
        workspace.actions.ts (108 lines)
      components/
        WorkspaceDailyTab.tsx (18 lines)
        WorkspaceDetailScreen.tsx (918 lines)
        WorkspaceHubScreen.tsx (284 lines)
        WorkspaceMembersTab.tsx (201 lines)
        WorkspaceWikiBetaView.tsx (67 lines)
        WorkspaceWikiTab.tsx (15 lines)
      hooks/
        useWorkspaceHub.ts (150 lines)
      queries/
        workspace-member.queries.ts (15 lines)
        workspace.queries.ts (41 lines)
      workspace-tabs.ts (110 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (71 lines)
  workspace-audit/
    api/
      index.ts (30 lines)
    application/
      use-cases/
        audit.use-cases.ts (18 lines)
      .gitkeep (0 lines)
    domain/
      entities/
        AuditLog.ts (11 lines)
      repositories/
        AuditRepository.ts (6 lines)
      .gitkeep (0 lines)
      schema.ts (66 lines)
    infrastructure/
      firebase/
        FirebaseAuditRepository.ts (88 lines)
      .gitkeep (0 lines)
    interfaces/
      components/
        AuditStream.tsx (162 lines)
        WorkspaceAuditTab.tsx (127 lines)
      queries/
        audit.queries.ts (36 lines)
      .gitkeep (0 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (0 lines)
    index.ts (22 lines)
    README.md (27 lines)
  workspace-feed/
    api/
      index.ts (7 lines)
      workspace-feed.facade.ts (123 lines)
    application/
      dto/
        workspace-feed.dto.ts (53 lines)
      use-cases/
        workspace-feed.use-cases.ts (217 lines)
    domain/
      entities/
        workspace-feed-post.entity.ts (53 lines)
      events/
        workspace-feed.events.ts (59 lines)
      repositories/
        workspace-feed.repositories.ts (24 lines)
      index.ts (28 lines)
    infrastructure/
      firebase/
        FirebaseWorkspaceFeedInteractionRepository.ts (91 lines)
        FirebaseWorkspaceFeedPostRepository.ts (215 lines)
      index.ts (2 lines)
    interfaces/
      _actions/
        workspace-feed.actions.ts (108 lines)
      components/
        WorkspaceFeedAccountView.tsx (182 lines)
        WorkspaceFeedWorkspaceView.tsx (255 lines)
      queries/
        workspace-feed.queries.ts (36 lines)
      index.ts (18 lines)
    index.ts (22 lines)
  workspace-flow/
    api/
      contracts.ts (72 lines)
      index.ts (75 lines)
      workspace-flow.facade.ts (251 lines)
    application/
      dto/
        add-invoice-item.dto.ts (14 lines)
        create-task.dto.ts (16 lines)
        invoice-query.dto.ts (15 lines)
        issue-query.dto.ts (15 lines)
        open-issue.dto.ts (19 lines)
        pagination.dto.ts (22 lines)
        remove-invoice-item.dto.ts (12 lines)
        resolve-issue.dto.ts (12 lines)
        task-query.dto.ts (17 lines)
        update-invoice-item.dto.ts (12 lines)
        update-task.dto.ts (14 lines)
      ports/
        InvoiceService.ts (23 lines)
        IssueService.ts (20 lines)
        TaskService.ts (21 lines)
      use-cases/
        add-invoice-item.use-case.ts (43 lines)
        approve-invoice.use-case.ts (39 lines)
        approve-task-acceptance.use-case.ts (52 lines)
        archive-task.use-case.ts (51 lines)
        assign-task.use-case.ts (45 lines)
        close-invoice.use-case.ts (39 lines)
        close-issue.use-case.ts (39 lines)
        create-invoice.use-case.ts (24 lines)
        create-task.use-case.ts (31 lines)
        fail-issue-retest.use-case.ts (39 lines)
        fix-issue.use-case.ts (39 lines)
        open-issue.use-case.ts (35 lines)
        pass-issue-retest.use-case.ts (39 lines)
        pass-task-qa.use-case.ts (52 lines)
        pay-invoice.use-case.ts (39 lines)
        reject-invoice.use-case.ts (39 lines)
        remove-invoice-item.use-case.ts (39 lines)
        resolve-issue.use-case.ts (39 lines)
        review-invoice.use-case.ts (39 lines)
        start-issue.use-case.ts (39 lines)
        submit-invoice.use-case.ts (48 lines)
        submit-issue-retest.use-case.ts (39 lines)
        submit-task-to-qa.use-case.ts (39 lines)
        update-invoice-item.use-case.ts (47 lines)
        update-task.use-case.ts (32 lines)
    domain/
      entities/
        Invoice.ts (31 lines)
        InvoiceItem.ts (27 lines)
        Issue.ts (45 lines)
        Task.ts (43 lines)
      events/
        InvoiceEvent.ts (104 lines)
        IssueEvent.ts (86 lines)
        TaskEvent.ts (78 lines)
      repositories/
        InvoiceRepository.ts (35 lines)
        IssueRepository.ts (28 lines)
        TaskRepository.ts (26 lines)
      services/
        invoice-guards.ts (32 lines)
        invoice-transition-policy.ts (34 lines)
        issue-transition-policy.ts (34 lines)
        task-guards.ts (35 lines)
        task-transition-policy.ts (34 lines)
      value-objects/
        InvoiceId.ts (18 lines)
        InvoiceItemId.ts (18 lines)
        InvoiceStatus.ts (58 lines)
        IssueId.ts (18 lines)
        IssueStage.ts (22 lines)
        IssueStatus.ts (58 lines)
        TaskId.ts (18 lines)
        TaskStatus.ts (64 lines)
        UserId.ts (18 lines)
    infrastructure/
      firebase/
        invoice-item.converter.ts (27 lines)
        invoice.converter.ts (36 lines)
        issue.converter.ts (41 lines)
        task.converter.ts (37 lines)
        workspace-flow.collections.ts (20 lines)
      repositories/
        FirebaseInvoiceItemRepository.ts (51 lines)
        FirebaseInvoiceRepository.ts (213 lines)
        FirebaseIssueRepository.ts (145 lines)
        FirebaseTaskRepository.ts (134 lines)
    interfaces/
      _actions/
        workspace-flow.actions.ts (258 lines)
      contracts/
        workspace-flow.contract.ts (85 lines)
      queries/
        workspace-flow.queries.ts (73 lines)
    AGENT.md (447 lines)
    index.ts (100 lines)
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
      index.ts (20 lines)
      schema.ts (34 lines)
    application/
      work-demand.use-cases.ts (96 lines)
    domain/
      repository.ts (22 lines)
      types.ts (112 lines)
    infrastructure/
      firebase/
        FirebaseDemandRepository.ts (114 lines)
      mock-demand-repository.ts (44 lines)
    interfaces/
      _actions/
        work-demand.actions.ts (55 lines)
      components/
        CalendarWidget.tsx (240 lines)
        CreateDemandForm.tsx (198 lines)
      queries/
        work-demand.queries.ts (29 lines)
      AccountSchedulingView.tsx (252 lines)
      WorkspaceSchedulingTab.tsx (218 lines)
    index.ts (41 lines)
  system.ts (37 lines)
packages/
  api-contracts/
    index.ts (16 lines)
  integration-firebase/
    admin.ts (9 lines)
    analytics.ts (44 lines)
    appcheck.ts (50 lines)
    auth.ts (20 lines)
    client.ts (32 lines)
    database.ts (85 lines)
    firestore.ts (50 lines)
    functions.ts (44 lines)
    index.ts (69 lines)
    messaging.ts (37 lines)
    performance.ts (30 lines)
    remote-config.ts (51 lines)
    storage.ts (53 lines)
  integration-http/
    index.ts (22 lines)
  lib-date-fns/
    index.ts (121 lines)
  lib-dragdrop/
    index.ts (56 lines)
  lib-react-markdown/
    index.ts (27 lines)
  lib-remark-gfm/
    index.ts (12 lines)
  lib-superjson/
    index.ts (16 lines)
  lib-tanstack/
    index.ts (71 lines)
  lib-uuid/
    index.ts (30 lines)
  lib-vis/
    data.ts (30 lines)
    graph3d.ts (35 lines)
    index.ts (40 lines)
    network.ts (35 lines)
    timeline.ts (20 lines)
  lib-xstate/
    index.ts (78 lines)
  lib-zod/
    index.ts (45 lines)
  lib-zustand/
    index.ts (55 lines)
  shared-constants/
    index.ts (6 lines)
  shared-hooks/
    index.ts (11 lines)
  shared-types/
    index.ts (68 lines)
  shared-utils/
    index.ts (14 lines)
  shared-validators/
    index.ts (47 lines)
  ui-shadcn/
    hooks/
      use-mobile.ts (19 lines)
      use-toast.ts (195 lines)
    ui/
      accordion.tsx (81 lines)
      alert-dialog.tsx (199 lines)
      alert.tsx (76 lines)
      aspect-ratio.tsx (11 lines)
      avatar.tsx (112 lines)
      badge.tsx (49 lines)
      breadcrumb.tsx (122 lines)
      button.tsx (67 lines)
      calendar.tsx (222 lines)
      card.tsx (103 lines)
      carousel.tsx (242 lines)
      chart.tsx (356 lines)
      checkbox.tsx (33 lines)
      collapsible.tsx (33 lines)
      command.tsx (195 lines)
      context-menu.tsx (263 lines)
      dialog.tsx (165 lines)
      drawer.tsx (131 lines)
      dropdown-menu.tsx (269 lines)
      hover-card.tsx (44 lines)
      input-group.tsx (156 lines)
      input-otp.tsx (87 lines)
      input.tsx (19 lines)
      kbd.tsx (26 lines)
      label.tsx (24 lines)
      menubar.tsx (280 lines)
      navigation-menu.tsx (164 lines)
      pagination.tsx (129 lines)
      popover.tsx (89 lines)
      progress.tsx (31 lines)
      radio-group.tsx (44 lines)
      scroll-area.tsx (55 lines)
      select.tsx (192 lines)
      separator.tsx (28 lines)
      sheet.tsx (144 lines)
      sidebar.tsx (702 lines)
      skeleton.tsx (13 lines)
      slider.tsx (59 lines)
      sonner.tsx (49 lines)
      spinner.tsx (10 lines)
      switch.tsx (33 lines)
      table.tsx (116 lines)
      tabs.tsx (90 lines)
      textarea.tsx (18 lines)
      toggle-group.tsx (89 lines)
      toggle.tsx (46 lines)
      tooltip.tsx (57 lines)
    index.ts (14 lines)
    utils.ts (6 lines)
  ui-vis/
    index.ts (12 lines)
    network.tsx (146 lines)
    react-graph-vis.d.ts (22 lines)
    timeline.tsx (123 lines)
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
        __init__.py (14 lines)
      config/
        .gitkeep (0 lines)
      container/
        .gitkeep (0 lines)
        runtime_dependencies.py (188 lines)
      settings/
        .gitkeep (0 lines)
      __init__.py (5 lines)
    application/
      dto/
        __init__.py (5 lines)
        .gitkeep (0 lines)
        rag.py (15 lines)
      mappers/
        .gitkeep (0 lines)
      ports/
        input/
          .gitkeep (0 lines)
        output/
          .gitkeep (0 lines)
          gateways.py (25 lines)
      services/
        .gitkeep (0 lines)
        document_pipeline.py (20 lines)
      use_cases/
        __init__.py (19 lines)
        rag_ingestion.py (222 lines)
        rag_query.py (390 lines)
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
      config.py (69 lines)
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
        __init__.py (25 lines)
        .gitkeep (0 lines)
        rag.py (135 lines)
      services/
        __init__.py (1 lines)
        .gitkeep (0 lines)
      value_objects/
        __init__.py (9 lines)
        .gitkeep (0 lines)
        rag.py (143 lines)
      __init__.py (1 lines)
    infrastructure/
      audit/
        qstash.py (29 lines)
      cache/
        rag_query_cache.py (29 lines)
      config/
        .gitkeep (0 lines)
      external/
        documentai/
          __init__.py (1 lines)
          client.py (132 lines)
        openai/
          __init__.py (12 lines)
          client.py (28 lines)
          embeddings.py (56 lines)
          llm.py (34 lines)
          rag_query.py (24 lines)
        upstash/
          __init__.py (1 lines)
          clients.py (538 lines)
          rag_query.py (18 lines)
        __init__.py (1 lines)
      logging/
        .gitkeep (0 lines)
      persistence/
        firestore/
          __init__.py (1 lines)
          document_repository.py (237 lines)
        storage/
          __init__.py (1 lines)
          client.py (84 lines)
        __init__.py (1 lines)
      repositories/
        .gitkeep (0 lines)
      __init__.py (1 lines)
    interface/
      controllers/
        .gitkeep (0 lines)
      handlers/
        __init__.py (15 lines)
        https.py (515 lines)
        storage.py (228 lines)
      middleware/
        .gitkeep (0 lines)
      routes/
        .gitkeep (0 lines)
      schemas/
        .gitkeep (0 lines)
      __init__.py (1 lines)
  tests/
    conftest.py (10 lines)
    test_domain_repository_gateways.py (156 lines)
  .gitignore (6 lines)
  main.py (87 lines)
  README.md (265 lines)
  requirements.txt (23 lines)
scripts/
  demo-flow.ts (103 lines)
.firebaserc (5 lines)
.gitignore (46 lines)
.tmp-eslint-config.json (1932 lines)
.tmp-eslint.json (1 lines)
AGENTS.md (121 lines)
apphosting.yaml (64 lines)
CLAUDE.md (45 lines)
CODE_OF_CONDUCT.md (128 lines)
components.json (25 lines)
CONTRIBUTING.md (115 lines)
eslint.config.mjs (331 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (249 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next.config.ts (9 lines)
package.json (92 lines)
PERMISSIONS.md (83 lines)
postcss.config.mjs (7 lines)
README.md (84 lines)
repomix.config.json (107 lines)
SPEC-WORKFLOW.md (42 lines)
storage.rules (9 lines)
tailwind.config.ts (100 lines)
tsconfig.json (65 lines)
```