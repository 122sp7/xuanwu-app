# Directory Structure

```
.agents/
  skills (1 lines)
.claude/
  agents/
    worker-architect.md (41 lines)
    worker-builder.md (32 lines)
    worker-explorer.md (34 lines)
    worker-research.md (202 lines)
    worker-researcher.md (37 lines)
    worker-reviewer.md (47 lines)
  commands/
    architect.md (52 lines)
    builder.md (48 lines)
    code-check.md (136 lines)
    qa-engineer.md (56 lines)
    security-auditor.md (60 lines)
    swarm-execute.md (176 lines)
    swarm-plan.md (165 lines)
    swarm-research.md (149 lines)
    swarm-review.md (133 lines)
    ui-ux-designer.md (61 lines)
  hooks/
    dangerous-command-guard.sh (59 lines)
    package.json (13 lines)
    post-tool-use-tracker.sh (67 lines)
    pre-commit-verification.sh (145 lines)
    pre-push-main-blocker.sh (73 lines)
    pre-tool-use-validator.sh (127 lines)
    session-start-loader.sh (88 lines)
    skill-activation-prompt.sh (5 lines)
    skill-activation-prompt.ts (180 lines)
    stop-validator.sh (52 lines)
    subagent-stop-validator.sh (29 lines)
    tsconfig.json (15 lines)
  rules/
    agent-constraints.md (12 lines)
    code-quality.md (79 lines)
    core-directives.md (75 lines)
    security.md (64 lines)
    tech-strategy.md (127 lines)
  skills/
    architecture/
      capacity-planning/
        SKILL.md (89 lines)
      cloud-native-patterns/
        SKILL.md (104 lines)
      defense-in-depth/
        SKILL.md (76 lines)
      designing-apis/
        SKILL.md (112 lines)
      designing-systems/
        resources/
          adr.template.md (47 lines)
          system-design.template.md (81 lines)
        SKILL.md (71 lines)
      domain-driven-design/
        SKILL.md (104 lines)
      writing-adrs/
        SKILL.md (88 lines)
    core-engineering/
      data-management/
        SKILL.md (77 lines)
      data-to-ui/
        SKILL.md (206 lines)
      debugging/
        SKILL.md (79 lines)
      dependency-management/
        SKILL.md (81 lines)
      implementing-code/
        SKILL.md (70 lines)
      optimizing-code/
        SKILL.md (79 lines)
      refactoring-code/
        SKILL.md (57 lines)
      test-driven-development/
        SKILL.md (91 lines)
      testing/
        SKILL.md (93 lines)
    design/
      accessibility/
        SKILL.md (96 lines)
      component-recipes/
        SKILL.md (231 lines)
      demo-design-tokens/
        SKILL.md (165 lines)
      design-systems/
        SKILL.md (98 lines)
      interface-design/
        resources/
          design-framework.template.md (104 lines)
        SKILL.md (84 lines)
      visual-assets/
        SKILL.md (84 lines)
    languages/
      bash/
        SKILL.md (136 lines)
      biome/
        SKILL.md (273 lines)
      expo-router/
        SKILL.md (106 lines)
      expo-sdk/
        SKILL.md (145 lines)
      framer-motion/
        SKILL.md (514 lines)
      go/
        SKILL.md (167 lines)
      hono/
        SKILL.md (343 lines)
      kotlin/
        SKILL.md (478 lines)
      nativewind/
        SKILL.md (123 lines)
      python/
        SKILL.md (132 lines)
      radix-ui/
        SKILL.md (249 lines)
      react-native-patterns/
        SKILL.md (202 lines)
      react-patterns/
        SKILL.md (267 lines)
      reanimated/
        SKILL.md (126 lines)
      rust/
        SKILL.md (161 lines)
      swift/
        SKILL.md (405 lines)
      tailwind-css/
        SKILL.md (267 lines)
      terraform/
        SKILL.md (181 lines)
      typescript/
        SKILL.md (132 lines)
      vite/
        SKILL.md (248 lines)
    operations/
      beads-workflow/
        SKILL.md (115 lines)
      chaos-engineering/
        SKILL.md (96 lines)
      deploy-aws-ecs/
        SKILL.md (173 lines)
      deploy-cloudflare/
        SKILL.md (159 lines)
      deploy-railway/
        SKILL.md (111 lines)
      incident-management/
        SKILL.md (92 lines)
      infrastructure/
        SKILL.md (165 lines)
      observability/
        SKILL.md (97 lines)
      swarm-coordination/
        SKILL.md (164 lines)
    product/
      agile-methodology/
        SKILL.md (86 lines)
      brainstorming/
        SKILL.md (73 lines)
      context-management/
        SKILL.md (80 lines)
      decomposing-tasks/
        SKILL.md (93 lines)
      documentation/
        SKILL.md (135 lines)
      estimating-work/
        SKILL.md (74 lines)
      execution-roadmaps/
        resources/
          execution-roadmap.template.md (105 lines)
        SKILL.md (75 lines)
      reaching-consensus/
        SKILL.md (77 lines)
      requirements-analysis/
        SKILL.md (77 lines)
      writing-pr-faqs/
        resources/
          pr-faq.template.md (81 lines)
        SKILL.md (78 lines)
      writing-prds/
        resources/
          prd.template.md (70 lines)
        SKILL.md (67 lines)
    security/
      application-security/
        SKILL.md (97 lines)
      compliance/
        SKILL.md (97 lines)
      identity-access/
        SKILL.md (94 lines)
      security-review/
        SKILL.md (98 lines)
      threat-modeling/
        SKILL.md (106 lines)
    skill-rules.json (614 lines)
  templates/
    artifacts/
      adr.template.md (144 lines)
      design_spec.template.md (172 lines)
      plan.template.md (172 lines)
      postmortem.template.md (267 lines)
      pr_faq.template.md (218 lines)
      prd.template.md (175 lines)
      roadmap.template.md (185 lines)
      security_audit.template.md (321 lines)
      system_design.template.md (446 lines)
    agent.template.md (54 lines)
    command.template.md (66 lines)
    hook.template.sh (116 lines)
    rule.template.md (58 lines)
    skill.template.md (67 lines)
  settings.json (382 lines)
.github/
  agents/
    ai-genkit-lead.agent.md (37 lines)
    app-router.agent.md (48 lines)
    chunk-strategist.agent.md (33 lines)
    commands.md (52 lines)
    doc-ingest.agent.md (34 lines)
    domain-architect.agent.md (83 lines)
    domain-lead.agent.md (46 lines)
    e2e-qa.agent.md (46 lines)
    embedding-writer.agent.md (33 lines)
    firestore-schema.agent.md (33 lines)
    frontend-lead.agent.md (37 lines)
    genkit-flow.agent.md (38 lines)
    kb-architect.agent.md (44 lines)
    knowledge-base.md (228 lines)
    lint-rule-enforcer.agent.md (38 lines)
    mddd-architect.agent.md (51 lines)
    prompt-engineer.agent.md (38 lines)
    quality-lead.agent.md (52 lines)
    rag-lead.agent.md (38 lines)
    README.md (25 lines)
    schema-migration.agent.md (33 lines)
    security-rules.agent.md (37 lines)
    server-action-writer.agent.md (33 lines)
    shadcn-composer.agent.md (40 lines)
    test-scenario-writer.agent.md (33 lines)
    ts-interface-writer.agent.md (39 lines)
    workspace-audit.agent.md (0 lines)
  instructions/
    app/
      app-router-parallel-routes.instructions.md (33 lines)
    modules/
      modules-api-surface.instructions.md (31 lines)
      modules-index-entry.instructions.md (27 lines)
      modules-infrastructure-adapters.instructions.md (29 lines)
      modules-interfaces-api-consumption.instructions.md (29 lines)
    architecture-api-boundary.instructions.md (35 lines)
    architecture-mddd.instructions.md (35 lines)
    architecture-modules.instructions.md (37 lines)
    architecture-monorepo.instructions.md (33 lines)
    bounded-context-rules.instructions.md (52 lines)
    branching-strategy.instructions.md (19 lines)
    ci-cd.instructions.md (20 lines)
    cloud-functions.instructions.md (29 lines)
    commit-convention.instructions.md (19 lines)
    doc-governance.instructions.md (57 lines)
    domain-modeling.instructions.md (125 lines)
    embedding-pipeline.instructions.md (23 lines)
    event-driven-state.instructions.md (108 lines)
    firebase-architecture.instructions.md (26 lines)
    firestore-schema.instructions.md (20 lines)
    genkit-flow.instructions.md (16 lines)
    hosting-deploy.instructions.md (14 lines)
    lint-format.instructions.md (20 lines)
    nextjs-app-router.instructions.md (19 lines)
    nextjs-parallel-routes.instructions.md (17 lines)
    nextjs-server-actions.instructions.md (18 lines)
    prompt-engineering.instructions.md (30 lines)
    rag-architecture.instructions.md (17 lines)
    README.md (60 lines)
    security-rules.instructions.md (20 lines)
    shadcn-ui.instructions.md (16 lines)
    tailwind-design-system.instructions.md (16 lines)
    testing-e2e.instructions.md (16 lines)
    testing-unit.instructions.md (16 lines)
    ubiquitous-language.instructions.md (38 lines)
  prompts/
    app/
      create-parallel-route-slice.prompt.md (39 lines)
    analyze-repo.prompt.md (36 lines)
    chunk-docs.prompt.md (26 lines)
    debug-error.prompt.md (25 lines)
    embedding-docs.prompt.md (19 lines)
    generate-aggregate.prompt.md (51 lines)
    generate-domain-event.prompt.md (59 lines)
    implement-feature.prompt.md (28 lines)
    implement-firestore-schema.prompt.md (18 lines)
    implement-genkit-flow.prompt.md (19 lines)
    implement-security-rules.prompt.md (18 lines)
    implement-server-action.prompt.md (20 lines)
    implement-ui-component.prompt.md (21 lines)
    ingest-docs.prompt.md (20 lines)
    plan-api.prompt.md (19 lines)
    plan-feature.prompt.md (15 lines)
    plan-module.prompt.md (19 lines)
    README.md (49 lines)
    refactor-api.prompt.md (18 lines)
    refactor-module.prompt.md (19 lines)
    review-architecture.prompt.md (14 lines)
    review-code.prompt.md (18 lines)
    review-performance.prompt.md (19 lines)
    review-security.prompt.md (13 lines)
    write-docs.prompt.md (18 lines)
    write-e2e-tests.prompt.md (20 lines)
    write-tests.prompt.md (18 lines)
  copilot-instructions.md (97 lines)
  README.md (31 lines)
  terminology-glossary.md (30 lines)
agents/
  agents (1 lines)
  hooks (1 lines)
  instructions (1 lines)
  prompts (1 lines)
  rules (1 lines)
  skills (1 lines)
app/
  (public)/
    page.tsx (298 lines)
  (shell)/
    _components/
      account-switcher.tsx (200 lines)
      app-breadcrumbs.tsx (65 lines)
      app-rail.tsx (645 lines)
      customize-navigation-dialog.tsx (611 lines)
      dashboard-sidebar.tsx (940 lines)
      global-search-dialog.tsx (93 lines)
      header-controls.tsx (202 lines)
      header-user-avatar.tsx (73 lines)
      nav-user.tsx (37 lines)
      shell-guard.tsx (50 lines)
      translation-switcher.tsx (80 lines)
    ai-chat/
      _actions.ts (14 lines)
      page.tsx (306 lines)
    dashboard/
      page.tsx (8 lines)
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
          page.tsx (9 lines)
        page.tsx (40 lines)
      teams/
        page.tsx (99 lines)
      workspaces/
        page.tsx (125 lines)
      _utils.ts (27 lines)
      page.tsx (169 lines)
    settings/
      general/
        page.tsx (8 lines)
      notifications/
        page.tsx (8 lines)
      profile/
        page.tsx (8 lines)
      page.tsx (8 lines)
    wiki/
      block-editor/
        page.tsx (19 lines)
      documents/
        page.tsx (30 lines)
      libraries/
        page.tsx (47 lines)
      namespaces/
        page.tsx (5 lines)
      pages/
        page.tsx (42 lines)
      pages-dnd/
        page.tsx (27 lines)
      rag-query/
        page.tsx (28 lines)
      rag-reindex/
        page.tsx (14 lines)
      page.tsx (276 lines)
    workspace/
      [workspaceId]/
        page.tsx (25 lines)
      page.tsx (41 lines)
    layout.tsx (316 lines)
  providers/
    app-context.ts (65 lines)
    app-provider.tsx (249 lines)
    auth-context.ts (35 lines)
    auth-provider.tsx (155 lines)
    dev-demo-auth.ts (82 lines)
    providers.tsx (25 lines)
  globals.css (128 lines)
  layout.tsx (26 lines)
diagrams/
  agent-architecture-commander-subagents.mermaid (38 lines)
  architecture.mermaid (228 lines)
  domain-id-api-boundary-template-v2.mermaid (88 lines)
  erd-model.mermaid (155 lines)
  event-bus-message-flow.mermaid (39 lines)
  onboarding-flow.mermaid (57 lines)
  rag-enterprise-e2e.mermaid (80 lines)
  security-rules-decision-flow.mermaid (45 lines)
  state-machine.mermaid (67 lines)
  workspace-interaction-flow.mermaid (99 lines)
docs/
  ddd/
    account/
      AGENT.md (40 lines)
      aggregates.md (47 lines)
      application-services.md (27 lines)
      context-map.md (35 lines)
      domain-events.md (32 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (30 lines)
      ubiquitous-language.md (21 lines)
    ai/
      AGENT.md (47 lines)
      aggregates.md (68 lines)
      application-services.md (28 lines)
      context-map.md (40 lines)
      domain-events.md (23 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (23 lines)
    identity/
      AGENT.md (41 lines)
      aggregates.md (43 lines)
      application-services.md (28 lines)
      context-map.md (33 lines)
      domain-events.md (26 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (21 lines)
    knowledge/
      AGENT.md (45 lines)
      aggregates.md (77 lines)
      application-services.md (31 lines)
      context-map.md (48 lines)
      domain-events.md (54 lines)
      domain-services.md (22 lines)
      README.md (38 lines)
      repositories.md (32 lines)
      ubiquitous-language.md (25 lines)
    notebook/
      AGENT.md (46 lines)
      aggregates.md (66 lines)
      application-services.md (28 lines)
      context-map.md (31 lines)
      domain-events.md (23 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (36 lines)
      ubiquitous-language.md (30 lines)
    notification/
      AGENT.md (34 lines)
      aggregates.md (33 lines)
      application-services.md (26 lines)
      context-map.md (23 lines)
      domain-events.md (24 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (26 lines)
      ubiquitous-language.md (20 lines)
    organization/
      AGENT.md (36 lines)
      aggregates.md (43 lines)
      application-services.md (27 lines)
      context-map.md (31 lines)
      domain-events.md (27 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (26 lines)
      ubiquitous-language.md (24 lines)
    search/
      AGENT.md (45 lines)
      aggregates.md (39 lines)
      application-services.md (28 lines)
      context-map.md (44 lines)
      domain-events.md (28 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (33 lines)
      ubiquitous-language.md (25 lines)
    shared/
      AGENT.md (41 lines)
      aggregates.md (44 lines)
      application-services.md (26 lines)
      context-map.md (29 lines)
      domain-events.md (34 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (23 lines)
    source/
      AGENT.md (48 lines)
      aggregates.md (62 lines)
      application-services.md (33 lines)
      context-map.md (37 lines)
      domain-events.md (24 lines)
      domain-services.md (23 lines)
      README.md (37 lines)
      repositories.md (31 lines)
      ubiquitous-language.md (26 lines)
    wiki/
      AGENT.md (42 lines)
      aggregates.md (64 lines)
      application-services.md (27 lines)
      context-map.md (42 lines)
      domain-events.md (28 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (26 lines)
      ubiquitous-language.md (25 lines)
    workspace/
      AGENT.md (40 lines)
      aggregates.md (54 lines)
      application-services.md (28 lines)
      context-map.md (44 lines)
      domain-events.md (26 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (30 lines)
      ubiquitous-language.md (22 lines)
    workspace-audit/
      AGENT.md (45 lines)
      aggregates.md (40 lines)
      application-services.md (27 lines)
      context-map.md (43 lines)
      domain-events.md (26 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (27 lines)
      ubiquitous-language.md (26 lines)
    workspace-feed/
      AGENT.md (18 lines)
      aggregates.md (21 lines)
      application-services.md (27 lines)
      context-map.md (25 lines)
      domain-events.md (19 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (9 lines)
    workspace-flow/
      AGENT.md (47 lines)
      aggregates.md (91 lines)
      application-services.md (67 lines)
      context-map.md (46 lines)
      domain-events.md (41 lines)
      domain-services.md (26 lines)
      README.md (37 lines)
      repositories.md (37 lines)
      ubiquitous-language.md (26 lines)
    workspace-scheduling/
      AGENT.md (41 lines)
      aggregates.md (48 lines)
      application-services.md (26 lines)
      context-map.md (35 lines)
      domain-events.md (22 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (27 lines)
      ubiquitous-language.md (32 lines)
    bounded-contexts.md (91 lines)
    subdomains.md (121 lines)
  development/
    modules-implementation-guide.md (165 lines)
    README.md (0 lines)
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
  beads.md (42 lines)
  customization.md (102 lines)
  getting-started.md (68 lines)
  handoffs.md (57 lines)
  hooks.md (143 lines)
  mcp-servers.md (92 lines)
  personas.md (48 lines)
  README.md (28 lines)
  skills.md (89 lines)
  SOURCE-OF-TRUTH.md (25 lines)
  swarm.md (98 lines)
modules/
  account/
    api/
      index.ts (42 lines)
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
    AGENT.md (40 lines)
    aggregates.md (47 lines)
    application-services.md (27 lines)
    context-map.md (35 lines)
    domain-events.md (32 lines)
    domain-services.md (22 lines)
    index.ts (74 lines)
    README.md (37 lines)
    repositories.md (30 lines)
    ubiquitous-language.md (21 lines)
  ai/
    api/
      index.ts (11 lines)
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
    AGENT.md (47 lines)
    aggregates.md (68 lines)
    application-services.md (28 lines)
    context-map.md (40 lines)
    domain-events.md (23 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (23 lines)
  identity/
    api/
      index.ts (59 lines)
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
    AGENT.md (41 lines)
    aggregates.md (43 lines)
    application-services.md (28 lines)
    context-map.md (33 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    index.ts (27 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (21 lines)
  knowledge/
    api/
      events.ts (39 lines)
      index.ts (98 lines)
      knowledge-api.ts (105 lines)
      knowledge-facade.ts (157 lines)
    application/
      dto/
        knowledge.dto.ts (128 lines)
      use-cases/
        knowledge-block.use-cases.ts (73 lines)
        knowledge-page.use-cases.ts (243 lines)
        knowledge-version.use-cases.ts (43 lines)
        wiki-pages.use-case.ts (281 lines)
      block-service.ts (59 lines)
    domain/
      entities/
        content-block.entity.ts (35 lines)
        content-page.entity.ts (74 lines)
        content-version.entity.ts (31 lines)
        wiki-page.types.ts (45 lines)
      events/
        knowledge.events.ts (119 lines)
      repositories/
        knowledge.repositories.ts (50 lines)
        WikiPageRepository.ts (14 lines)
      value-objects/
        block-content.ts (60 lines)
      index.ts (55 lines)
    infrastructure/
      firebase/
        FirebaseContentBlockRepository.ts (137 lines)
        FirebaseContentPageRepository.ts (232 lines)
      repositories/
        firebase-wiki-page.repository.ts (110 lines)
        in-memory-wiki-page.repository.ts (58 lines)
      index.ts (9 lines)
      InMemoryKnowledgeRepository.ts (204 lines)
    interfaces/
      _actions/
        knowledge.actions.ts (164 lines)
      components/
        BlockEditorView.tsx (197 lines)
        PagesDnDView.tsx (183 lines)
        PagesView.tsx (258 lines)
      queries/
        knowledge.queries.ts (52 lines)
      store/
        block-editor.store.ts (68 lines)
      index.ts (26 lines)
    AGENT.md (45 lines)
    aggregates.md (77 lines)
    application-services.md (31 lines)
    context-map.md (48 lines)
    domain-events.md (54 lines)
    domain-services.md (22 lines)
    index.ts (66 lines)
    README.md (38 lines)
    repositories.md (32 lines)
    ubiquitous-language.md (25 lines)
  notebook/
    api/
      index.ts (16 lines)
      server.ts (9 lines)
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
        thread.ts (13 lines)
      repositories/
        NotebookRepository.ts (8 lines)
        RagGenerationRepository.ts (9 lines)
        RagRetrievalRepository.ts (7 lines)
      index.ts (25 lines)
    infrastructure/
      firebase/
        FirebaseRagRetrievalRepository.ts (4 lines)
        index.ts (1 lines)
      genkit/
        client.ts (25 lines)
        GenkitNotebookRepository.ts (36 lines)
        index.ts (12 lines)
      index.ts (2 lines)
    interfaces/
      _actions/
        notebook.actions.ts (27 lines)
      index.ts (1 lines)
    .gitkeep (0 lines)
    AGENT.md (46 lines)
    aggregates.md (66 lines)
    application-services.md (28 lines)
    context-map.md (31 lines)
    domain-events.md (23 lines)
    domain-services.md (22 lines)
    index.ts (4 lines)
    README.md (37 lines)
    repositories.md (36 lines)
    ubiquitous-language.md (30 lines)
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
    AGENT.md (34 lines)
    aggregates.md (33 lines)
    application-services.md (26 lines)
    context-map.md (23 lines)
    domain-events.md (24 lines)
    domain-services.md (22 lines)
    index.ts (21 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (20 lines)
  organization/
    api/
      index.ts (94 lines)
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
    AGENT.md (36 lines)
    aggregates.md (43 lines)
    application-services.md (27 lines)
    context-map.md (31 lines)
    domain-events.md (27 lines)
    domain-services.md (22 lines)
    index.ts (76 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (24 lines)
  search/
    api/
      index.ts (88 lines)
      server.ts (12 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (132 lines)
        submit-rag-feedback.use-case.ts (61 lines)
        wiki-rag.use-case.ts (44 lines)
    domain/
      entities/
        RagQuery.ts (54 lines)
        RagQueryFeedback.ts (42 lines)
        WikiRagTypes.ts (57 lines)
      ports/
        vector-store.ts (51 lines)
      repositories/
        RagGenerationRepository.ts (26 lines)
        RagQueryFeedbackRepository.ts (17 lines)
        RagRetrievalRepository.ts (13 lines)
        WikiContentRepository.ts (27 lines)
    infrastructure/
      firebase/
        FirebaseRagQueryFeedbackRepository.ts (91 lines)
        FirebaseRagRetrievalRepository.ts (119 lines)
        FirebaseWikiContentRepository.ts (194 lines)
      genkit/
        client.ts (23 lines)
        GenkitRagGenerationRepository.ts (60 lines)
    interfaces/
      components/
        RagQueryView.tsx (163 lines)
        RagView.tsx (659 lines)
    AGENT.md (45 lines)
    aggregates.md (39 lines)
    application-services.md (28 lines)
    context-map.md (44 lines)
    domain-events.md (28 lines)
    domain-services.md (22 lines)
    index.ts (13 lines)
    README.md (37 lines)
    repositories.md (33 lines)
    ubiquitous-language.md (25 lines)
  shared/
    api/
      index.ts (36 lines)
    application/
      publish-domain-event.ts (49 lines)
    domain/
      events/
        knowledge-page-created.event.ts (52 lines)
        knowledge-updated.event.ts (41 lines)
      event-record.ts (66 lines)
      events.ts (16 lines)
      slug-utils.ts (27 lines)
      types.ts (54 lines)
    infrastructure/
      InMemoryEventStoreRepository.ts (37 lines)
      NoopEventBusRepository.ts (14 lines)
      SimpleEventBus.ts (44 lines)
    AGENT.md (41 lines)
    aggregates.md (44 lines)
    application-services.md (26 lines)
    context-map.md (29 lines)
    domain-events.md (34 lines)
    domain-services.md (22 lines)
    index.ts (29 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (23 lines)
  source/
    api/
      index.ts (95 lines)
    application/
      dto/
        file.dto.ts (62 lines)
        rag-document.dto.ts (50 lines)
      use-cases/
        list-workspace-files.use-case.ts (37 lines)
        register-uploaded-rag-document.use-case.ts (130 lines)
        upload-complete-file.use-case.ts (204 lines)
        upload-init-file.use-case.ts (127 lines)
        wiki-libraries.use-case.ts (239 lines)
      index.ts (6 lines)
    domain/
      entities/
        AuditRecord.ts (18 lines)
        File.ts (33 lines)
        FileVersion.ts (15 lines)
        PermissionSnapshot.ts (12 lines)
        RetentionPolicy.ts (8 lines)
        wiki-library.types.ts (62 lines)
      ports/
        ActorContextPort.ts (9 lines)
        OrganizationPolicyPort.ts (16 lines)
        WorkspaceGrantPort.ts (14 lines)
      repositories/
        FileRepository.ts (15 lines)
        RagDocumentRepository.ts (85 lines)
        WikiLibraryRepository.ts (21 lines)
      services/
        complete-upload-file.ts (16 lines)
        resolve-file-organization-id.ts (6 lines)
      index.ts (12 lines)
    infrastructure/
      firebase/
        FirebaseFileRepository.ts (201 lines)
        FirebaseRagDocumentRepository.ts (202 lines)
      repositories/
        in-memory-wiki-library.repository.ts (92 lines)
      index.ts (3 lines)
    interfaces/
      _actions/
        file.actions.ts (94 lines)
      components/
        LibrariesView.tsx (299 lines)
        LibraryTableView.tsx (260 lines)
        SourceDocumentsView.tsx (401 lines)
        WorkspaceFilesTab.tsx (248 lines)
      contracts/
        file-command-result.ts (16 lines)
      hooks/
        useDocumentsSnapshot.ts (182 lines)
      queries/
        file.queries.ts (31 lines)
      index.ts (4 lines)
    AGENT.md (48 lines)
    aggregates.md (62 lines)
    application-services.md (33 lines)
    context-map.md (37 lines)
    domain-events.md (24 lines)
    domain-services.md (23 lines)
    index.ts (1 lines)
    README.md (37 lines)
    repositories.md (31 lines)
    ubiquitous-language.md (26 lines)
  wiki/
    api/
      index.ts (13 lines)
      wiki-api.ts (66 lines)
    application/
      use-cases/
        auto-link.use-case.ts (76 lines)
      link-extractor.service.ts (82 lines)
    domain/
      entities/
        graph-edge.ts (40 lines)
        graph-node.ts (38 lines)
        view-config.ts (29 lines)
      repositories/
        GraphRepository.ts (36 lines)
    infrastructure/
      InMemoryGraphRepository.ts (47 lines)
    .gitkeep (0 lines)
    AGENT.md (42 lines)
    aggregates.md (64 lines)
    application-services.md (27 lines)
    context-map.md (42 lines)
    domain-events.md (28 lines)
    domain-services.md (22 lines)
    Graph-ERD.mermaid (40 lines)
    Graph-Flow.mermaid (63 lines)
    Graph-Sequence.mermaid (62 lines)
    Graph-Tree.mermaid (142 lines)
    Graph-UI.mermaid (102 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (25 lines)
  workspace/
    api/
      index.ts (65 lines)
    application/
      use-cases/
        wiki-content-tree.use-case.ts (62 lines)
        workspace-member.use-cases.ts (10 lines)
        workspace.use-cases.ts (203 lines)
    domain/
      entities/
        WikiContentTree.ts (45 lines)
        Workspace.ts (85 lines)
        WorkspaceMember.ts (25 lines)
      repositories/
        WikiWorkspaceRepository.ts (12 lines)
        WorkspaceQueryRepository.ts (16 lines)
        WorkspaceRepository.ts (35 lines)
    infrastructure/
      firebase/
        FirebaseWikiWorkspaceRepository.ts (16 lines)
        FirebaseWorkspaceQueryRepository.ts (211 lines)
        FirebaseWorkspaceRepository.ts (216 lines)
    interfaces/
      _actions/
        workspace.actions.ts (108 lines)
      components/
        WorkspaceDailyTab.tsx (18 lines)
        WorkspaceDetailScreen.tsx (1049 lines)
        WorkspaceHubScreen.tsx (321 lines)
        WorkspaceMembersTab.tsx (201 lines)
        WorkspaceWikiTab.tsx (15 lines)
        WorkspaceWikiView.tsx (155 lines)
      hooks/
        useWorkspaceHub.ts (150 lines)
      queries/
        workspace-member.queries.ts (15 lines)
        workspace.queries.ts (41 lines)
      workspace-tabs.ts (112 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (40 lines)
    aggregates.md (54 lines)
    application-services.md (28 lines)
    context-map.md (44 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    index.ts (71 lines)
    README.md (37 lines)
    repositories.md (30 lines)
    ubiquitous-language.md (22 lines)
  workspace-audit/
    api/
      index.ts (31 lines)
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
    AGENT.md (45 lines)
    aggregates.md (40 lines)
    application-services.md (27 lines)
    context-map.md (43 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    index.ts (22 lines)
    README.md (37 lines)
    repositories.md (27 lines)
    ubiquitous-language.md (26 lines)
  workspace-feed/
    api/
      index.ts (11 lines)
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
    AGENT.md (18 lines)
    aggregates.md (21 lines)
    application-services.md (27 lines)
    context-map.md (25 lines)
    domain-events.md (19 lines)
    domain-services.md (22 lines)
    index.ts (22 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (9 lines)
  workspace-flow/
    api/
      contracts.ts (76 lines)
      index.ts (89 lines)
      listeners.ts (46 lines)
      workspace-flow.facade.ts (251 lines)
    application/
      dto/
        add-invoice-item.dto.ts (14 lines)
        create-task.dto.ts (16 lines)
        invoice-query.dto.ts (15 lines)
        issue-query.dto.ts (15 lines)
        materialize-from-content.dto.ts (34 lines)
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
      process-managers/
        content-to-workflow-materializer.ts (89 lines)
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
        materialize-tasks-from-content.use-case.ts (67 lines)
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
        Invoice.ts (38 lines)
        InvoiceItem.ts (27 lines)
        Issue.ts (45 lines)
        Task.ts (50 lines)
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
        SourceReference.ts (30 lines)
        TaskId.ts (18 lines)
        TaskStatus.ts (64 lines)
        UserId.ts (18 lines)
    infrastructure/
      firebase/
        invoice-item.converter.ts (27 lines)
        invoice.converter.ts (38 lines)
        issue.converter.ts (41 lines)
        sourceReference.converter.ts (26 lines)
        task.converter.ts (39 lines)
        workspace-flow.collections.ts (20 lines)
      repositories/
        FirebaseInvoiceItemRepository.ts (51 lines)
        FirebaseInvoiceRepository.ts (218 lines)
        FirebaseIssueRepository.ts (145 lines)
        FirebaseTaskRepository.ts (139 lines)
    interfaces/
      _actions/
        workspace-flow.actions.ts (258 lines)
      components/
        WorkspaceFlowTab.tsx (933 lines)
      contracts/
        workspace-flow.contract.ts (85 lines)
      queries/
        workspace-flow.queries.ts (73 lines)
    AGENT.md (47 lines)
    aggregates.md (91 lines)
    application-services.md (67 lines)
    context-map.md (46 lines)
    domain-events.md (41 lines)
    domain-services.md (26 lines)
    index.ts (100 lines)
    README.md (37 lines)
    repositories.md (37 lines)
    ubiquitous-language.md (26 lines)
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
      index.ts (21 lines)
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
    AGENT.md (41 lines)
    aggregates.md (48 lines)
    application-services.md (26 lines)
    context-map.md (35 lines)
    domain-events.md (22 lines)
    domain-services.md (22 lines)
    index.ts (41 lines)
    README.md (37 lines)
    repositories.md (27 lines)
    ubiquitous-language.md (32 lines)
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
py_fn/
  .serena/
    .gitkeep (0 lines)
  docs/
    .gitkeep (0 lines)
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
  init-framework.sh (484 lines)
.firebaserc (5 lines)
.gitattributes (2 lines)
.gitignore (73 lines)
.mcp.json (29 lines)
AGENTS.md (147 lines)
apphosting.yaml (64 lines)
CLAUDE.md (45 lines)
components.json (25 lines)
CONTRIBUTING.md (115 lines)
eslint.config.mjs (331 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (305 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next-env.d.ts (6 lines)
next.config.ts (10 lines)
package.json (93 lines)
PERMISSIONS.md (10 lines)
postcss.config.mjs (7 lines)
README.md (141 lines)
repomix.config.json (110 lines)
SPEC-WORKFLOW.md (11 lines)
storage.rules (9 lines)
tailwind.config.ts (100 lines)
tsconfig.json (65 lines)
```