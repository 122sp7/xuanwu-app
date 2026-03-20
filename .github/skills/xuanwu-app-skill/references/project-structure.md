# Directory Structure

```
.github/
  agents/
    billing-auditor.agent.md (19 lines)
    commander.agent.md (52 lines)
    firestore-guard.agent.md (18 lines)
    implementer.agent.md (20 lines)
    planner.agent.md (24 lines)
    rag-architect.agent.md (18 lines)
    reviewer.agent.md (15 lines)
    vsa-mddd-implementer.agent.md (60 lines)
    vsa-mddd-planner.agent.md (43 lines)
  copilot/
    serena-browser-setup.md (72 lines)
    serena-coding-agent-mcp.json (43 lines)
  hooks/
    guardrails.json (11 lines)
    README.md (19 lines)
  instructions/
    agent-skills.instructions.md (261 lines)
    agents.instructions.md (1008 lines)
    billing.instructions.md (12 lines)
    cloud-functions.instructions.md (12 lines)
    context-engineering.instructions.md (55 lines)
    copilot-config.instructions.md (25 lines)
    firestore.instructions.md (12 lines)
    genkit-flows.instructions.md (12 lines)
    instructions.instructions.md (256 lines)
    mddd-migration.instructions.md (28 lines)
    memory-bank.instructions.md (299 lines)
    nextjs-app-router.instructions.md (12 lines)
    nextjs-tailwind.instructions.md (49 lines)
    nextjs-ui.instructions.md (14 lines)
    performance-optimization.instructions.md (54 lines)
    prompt.instructions.md (88 lines)
    react-components.instructions.md (12 lines)
    skill-usage.instructions.md (49 lines)
    state-machine.instructions.md (12 lines)
    typescript.instructions.md (13 lines)
  ISSUE_TEMPLATE/
    billing-issue.yml (29 lines)
    bug.yml (36 lines)
    config.yml (5 lines)
    feature.yml (27 lines)
    task-wbs.yml (29 lines)
    ticket-support.yml (32 lines)
  prompts/
    add-shadcn-component.prompt.md (15 lines)
    analyze-codebase.prompt.md (15 lines)
    implement-vsa-mddd.prompt.md (22 lines)
    ingest-knowledge.prompt.md (15 lines)
    plan-file-module-mddd.prompt.md (22 lines)
    plan-vsa-mddd.prompt.md (19 lines)
    refresh-migration-context.prompt.md (13 lines)
    review-security-rules.prompt.md (15 lines)
    scaffold-billing-cycle.prompt.md (15 lines)
    scaffold-feature.prompt.md (15 lines)
    scaffold-genkit-flow.prompt.md (15 lines)
    scaffold-ticket.prompt.md (15 lines)
    scaffold-wbs-task.prompt.md (15 lines)
    write-tests.prompt.md (15 lines)
  skills/
    awesome-rag-skill/
      references/
        files.md (930 lines)
        project-structure.md (8 lines)
        summary.md (51 lines)
      SKILL.md (77 lines)
    billing-lifecycle/
      templates/
        billing-cycle-template.md (24 lines)
      SKILL.md (20 lines)
    chatbot-ui-skill/
      references/
        files.md (31127 lines)
        project-structure.md (311 lines)
        summary.md (66 lines)
        tech-stack.md (126 lines)
      SKILL.md (79 lines)
    docmost-skill/
      references/
        files.md (97866 lines)
        project-structure.md (1032 lines)
        summary.md (66 lines)
        tech-stack.md (86 lines)
      SKILL.md (79 lines)
    documentation/
      SKILL.md (241 lines)
    google-cloud-skills-boost-skill/
      references/
        requested-resources.md (151 lines)
        summary.md (94 lines)
      SKILL.md (40 lines)
    langchain-ai-skill/
      references/
        files.md (4508 lines)
        project-structure.md (58 lines)
        summary.md (64 lines)
        tech-stack.md (69 lines)
      SKILL.md (79 lines)
    multitenancy/
      templates/
        tenant-boundary-checklist.md (27 lines)
      SKILL.md (20 lines)
    rag-pipeline/
      templates/
        ingestion-checklist.md (29 lines)
      SKILL.md (20 lines)
    ragflow-skill/
      references/
        project-structure.md (2677 lines)
        summary.md (66 lines)
        tech-stack.md (40 lines)
      SKILL.md (79 lines)
    vsa-mddd-migration/
      SKILL.md (59 lines)
    vscode-docs-skill/
      references/
        files.md (78424 lines)
        project-structure.md (373 lines)
        summary.md (60 lines)
      SKILL.md (77 lines)
    wbs-state-machine/
      templates/
        wbs-machine-template.md (29 lines)
      SKILL.md (20 lines)
    README.md (217 lines)
  workflows/
    ci.yml (35 lines)
    copilot-setup-steps.yml (119 lines)
    deploy-preview.yml (17 lines)
    deploy-production.yml (17 lines)
    firestore-rules-test.yml (17 lines)
    functions-deploy.yml (17 lines)
    genkit-flow-test.yml (29 lines)
    rag-index-sync.yml (29 lines)
  copilot-instructions.md (86 lines)
  pull_request_template.md (34 lines)
  README.md (195 lines)
.serena/
  memories/
    migration/
      task-slice-progress.md (1 lines)
      taxonomy-slice-progress.md (1 lines)
      workspace-interface-hook.md (1 lines)
      workspace-screen-component.md (1 lines)
      workspace-shell-phase.md (1 lines)
    ui/
      shell-consistency.md (1 lines)
    00-project-overview.md (23 lines)
    01-architecture-index.md (28 lines)
    02-module-index.md (31 lines)
    03-runtime-entrypoints.md (21 lines)
    04-commands-and-checks.md (24 lines)
    05-environment-and-integrations.md (19 lines)
    INDEX.md (24 lines)
  .gitignore (2 lines)
  project.yml (138 lines)
app/
  (public)/
    page.tsx (255 lines)
  (shell)/
    _components/
      account-switcher.tsx (200 lines)
      dashboard-sidebar.tsx (309 lines)
      header-controls.tsx (64 lines)
      header-user-avatar.tsx (59 lines)
      nav-user.tsx (37 lines)
      shell-guard.tsx (50 lines)
      translation-switcher.tsx (80 lines)
    dashboard/
      page.tsx (97 lines)
    organization/
      page.tsx (519 lines)
    settings/
      page.tsx (72 lines)
    workspace/
      [workspaceId]/
        page.tsx (22 lines)
      page.tsx (41 lines)
    layout.tsx (229 lines)
  providers/
    app-context.ts (50 lines)
    app-provider.tsx (164 lines)
    auth-context.ts (35 lines)
    auth-provider.tsx (139 lines)
    providers.tsx (23 lines)
  globals.css (128 lines)
  layout.tsx (26 lines)
core/
  event-core/
    application/
      use-cases/
        list-events-by-aggregate.ts (21 lines)
        publish-domain-event.ts (48 lines)
    domain/
      entities/
        domain-event.entity.ts (44 lines)
      repositories/
        ievent-bus.repository.ts (11 lines)
        ievent-store.repository.ts (15 lines)
      value-objects/
        event-metadata.vo.ts (14 lines)
    infrastructure/
      persistence/
        config.ts (15 lines)
      repositories/
        in-memory-event-store.repository.ts (42 lines)
        noop-event-bus.repository.ts (14 lines)
    interfaces/
      api/
        event.controller.ts (29 lines)
    AGENT.md (36 lines)
    index.ts (18 lines)
    README.md (52 lines)
  knowledge-core/
    application/
      use-cases/
        create-knowledge.ts (26 lines)
    domain/
      entities/
        knowledge.entity.ts (25 lines)
      repositories/
        iknowledge.repository.ts (13 lines)
        iretrieval.repository.ts (17 lines)
      value-objects/
        access-control.vo.ts (18 lines)
        content-status.vo.ts (21 lines)
        knowledge.vo.ts (19 lines)
        search-filter.vo.ts (23 lines)
        taxonomy.vo.ts (25 lines)
        usage-stats.vo.ts (12 lines)
        vector.vo.ts (11 lines)
    infrastructure/
      persistence/
        config.ts (18 lines)
        upstash-redis.ts (12 lines)
        upstash-vector.ts (12 lines)
      repositories/
        upstash-knowledge.repository.ts (24 lines)
    interfaces/
      api/
        knowledge.controller.ts (15 lines)
    AGENT.md (36 lines)
    index.ts (6 lines)
    README.md (56 lines)
  namespace-core/
    application/
      dto/
        .gitkeep (0 lines)
      use-cases/
        .gitkeep (0 lines)
    domain/
      entities/
        .gitkeep (0 lines)
      exceptions/
        .gitkeep (0 lines)
      repositories/
        .gitkeep (0 lines)
      value-objects/
        .gitkeep (0 lines)
    infrastructure/
      persistence/
        .gitkeep (0 lines)
      repositories/
        .gitkeep (0 lines)
    interfaces/
      api/
        .gitkeep (0 lines)
    AGENT.md (0 lines)
    index.ts (0 lines)
    README.md (0 lines)
docs/
  adr/
    ADR-001-rag-upload-storage-and-document-lifecycle.md (172 lines)
    ADR-002-rag-upload-storage-and-naming.md (164 lines)
    ADR-003-rag-firestore-data-model-and-lifecycle.md (202 lines)
    ADR-004-rag-query-retrieval-and-enterprise-enhancements.md (180 lines)
    ADR-005-rag-ingestion-execution-contract.md (151 lines)
    ADR-006-rag-query-execution-contract.md (118 lines)
    ADR-007-rag-optional-enhancements-rollout.md (113 lines)
    ADR-008-rag-observability-slo-and-acceptance.md (116 lines)
    ADR-009-rag-firestore-index-matrix.md (109 lines)
    ADR-010-rag-upload-and-worker-event-contract.md (135 lines)
    ADR-011-rag-genkit-flow-contract.md (144 lines)
  ai/
    prompt-engineering.md (5 lines)
    workflow-orchestration.md (5 lines)
  architecture/
    notes/
      model-driven-hexagonal-architecture.md (5 lines)
    schema-registry.md (5 lines)
    state-machines.md (5 lines)
    vector-topology.md (5 lines)
  design/
    core-logic.mermaid (55 lines)
    erd-model.mermaid (70 lines)
    project-derivation.mermaid (187 lines)
    rag-enterprise-e2e.mermaid (138 lines)
    rag-implementation-mapping.md (160 lines)
    state-machine.mermaid (41 lines)
  explanation/
    development-contract-governance.md (56 lines)
  reference/
    development-contracts/
      acceptance-contract.md (66 lines)
      audit-contract.md (81 lines)
      billing-contract.md (76 lines)
      overview.md (37 lines)
      parser-contract.md (85 lines)
      rag-ingestion-contract.md (124 lines)
      schedule-contract.md (152 lines)
infrastructure/
  axios/
    httpClient.ts (22 lines)
  firebase/
    admin.ts (5 lines)
    client.ts (5 lines)
    index.ts (65 lines)
  upstash/
    client.ts (9 lines)
interfaces/
  graphql/
    schema.ts (8 lines)
  rest/
    apiRouter.ts (7 lines)
libs/
  date-fns/
    index.ts (121 lines)
  dragdrop/
    index.ts (56 lines)
  firebase/
    functions-python/
      app/
        bootstrap/
          __init__.py (0 lines)
          firebase.py (8 lines)
        config/
          __init__.py (0 lines)
          settings.py (46 lines)
        document_ai/
          application/
            use_cases/
              __init__.py (0 lines)
              process_document_with_ai.py (25 lines)
            __init__.py (0 lines)
          domain/
            __init__.py (0 lines)
            entities.py (15 lines)
            ports.py (17 lines)
          infrastructure/
            firebase/
              __init__.py (0 lines)
              audit_log_repository.py (27 lines)
            google/
              __init__.py (0 lines)
              document_ai_processor.py (34 lines)
            __init__.py (0 lines)
          interfaces/
            callables/
              __init__.py (0 lines)
              process_document_with_ai.py (93 lines)
            __init__.py (0 lines)
          __init__.py (0 lines)
        rag_ingestion/
          application/
            use_cases/
              __init__.py (0 lines)
              process_uploaded_document.py (85 lines)
            __init__.py (0 lines)
          domain/
            __init__.py (0 lines)
            entities.py (58 lines)
            ports.py (34 lines)
          infrastructure/
            default/
              __init__.py (0 lines)
              chunker.py (35 lines)
              embedder.py (27 lines)
              parser.py (9 lines)
              taxonomy_classifier.py (19 lines)
            firebase/
              __init__.py (0 lines)
              document_repository.py (73 lines)
            __init__.py (0 lines)
          interfaces/
            callables/
              __init__.py (0 lines)
              process_uploaded_rag_document.py (85 lines)
            __init__.py (0 lines)
          __init__.py (0 lines)
        __init__.py (0 lines)
      docs/
        adr/
          ADR-001-document-parsing.md (48 lines)
          ADR-002-runtime-boundary-and-infrastructure-role.md (112 lines)
          ADR-003-dependency-selection-policy.md (126 lines)
          ADR-004-structure-and-interaction-design.md (176 lines)
          ADR-005-migration-from-typescript-functions.md (134 lines)
          ADR-006-enterprise-rag-end-to-end-pipeline.md (210 lines)
          ADR-007-firestore-rag-data-model-and-indexing.md (177 lines)
          README.md (196 lines)
      tests/
        __init__.py (0 lines)
        test_process_uploaded_document.py (139 lines)
      .gitignore (10 lines)
      AGENTS.md (87 lines)
      main.py (18 lines)
      pyproject.toml (13 lines)
      README.md (362 lines)
      requirements-dev.txt (4 lines)
      requirements.txt (17 lines)
    admin.ts (9 lines)
    analytics.ts (44 lines)
    appcheck.ts (50 lines)
    auth.ts (20 lines)
    client.ts (32 lines)
    database.ts (85 lines)
    firestore.ts (50 lines)
    functions.ts (42 lines)
    index.ts (69 lines)
    messaging.ts (37 lines)
    performance.ts (30 lines)
    remote-config.ts (51 lines)
    storage.ts (53 lines)
  react-markdown/
    index.ts (27 lines)
  remark-gfm/
    index.ts (12 lines)
  superjson/
    index.ts (16 lines)
  tanstack/
    index.ts (71 lines)
  upstash/
    box.ts (57 lines)
    index.ts (31 lines)
    qstash.ts (42 lines)
    redis.ts (25 lines)
    vector.ts (36 lines)
    workflow.ts (47 lines)
  uuid/
    index.ts (30 lines)
  vis/
    data.ts (30 lines)
    graph3d.ts (35 lines)
    index.ts (21 lines)
    network.ts (35 lines)
    timeline.ts (20 lines)
  xstate/
    index.ts (78 lines)
  zod/
    index.ts (45 lines)
  zustand/
    index.ts (55 lines)
  utils.ts (6 lines)
modules/
  acceptance/
    application/
      use-cases/
        list-workspace-acceptance-gates.use-case.ts (29 lines)
      index.ts (1 lines)
    domain/
      entities/
        AcceptanceGate.ts (14 lines)
      repositories/
        AcceptanceRepository.ts (9 lines)
      services/
        derive-acceptance-gates.ts (99 lines)
      index.ts (12 lines)
    infrastructure/
      default/
        DefaultWorkspaceAcceptanceRepository.ts (38 lines)
      index.ts (1 lines)
    interfaces/
      components/
        WorkspaceAcceptanceTab.tsx (64 lines)
      queries/
        acceptance.queries.ts (15 lines)
      index.ts (2 lines)
    index.ts (4 lines)
    README.md (25 lines)
  account/
    application/
      use-cases/
        account-policy.use-cases.ts (104 lines)
        account.use-cases.ts (167 lines)
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
        account-policy.actions.ts (49 lines)
        account.actions.ts (95 lines)
      queries/
        account.queries.ts (79 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (74 lines)
  ai/
    application/
      use-cases/
        answer-rag-query.use-case.ts (134 lines)
        generate-ai-response.use-case.ts (28 lines)
      .gitkeep (0 lines)
      index.ts (2 lines)
    domain/
      entities/
        AIGeneration.ts (17 lines)
        RagQuery.ts (54 lines)
      repositories/
        AIRepository.ts (5 lines)
        RagGenerationRepository.ts (26 lines)
        RagRetrievalRepository.ts (13 lines)
      .gitkeep (0 lines)
      index.ts (25 lines)
    infrastructure/
      firebase/
        FirebaseRagRetrievalRepository.ts (126 lines)
        index.ts (1 lines)
      genkit/
        client.ts (25 lines)
        GenkitAIRepository.ts (36 lines)
        GenkitRagGenerationRepository.ts (60 lines)
        index.ts (12 lines)
      .gitkeep (0 lines)
      index.ts (2 lines)
    interfaces/
      _actions/
        ai.actions.ts (27 lines)
      .gitkeep (0 lines)
      index.ts (1 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (28 lines)
    index.ts (4 lines)
    README.md (38 lines)
  audit/
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
    infrastructure/
      firebase/
        FirebaseAuditRepository.ts (88 lines)
      .gitkeep (0 lines)
    interfaces/
      components/
        WorkspaceAuditTab.tsx (127 lines)
      queries/
        audit.queries.ts (36 lines)
      .gitkeep (0 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (0 lines)
    index.ts (12 lines)
    README.md (25 lines)
  billing/
    application/
      use-cases/
        list-billing-records.use-case.ts (20 lines)
      .gitkeep (0 lines)
      index.ts (1 lines)
    domain/
      entities/
        BillingRecord.ts (21 lines)
      repositories/
        BillingRepository.ts (5 lines)
      .gitkeep (0 lines)
      index.ts (2 lines)
    infrastructure/
      memory/
        InMemoryBillingRepository.ts (20 lines)
      .gitkeep (0 lines)
      index.ts (1 lines)
    interfaces/
      queries/
        billing.queries.ts (11 lines)
      .gitkeep (0 lines)
      index.ts (1 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (0 lines)
    index.ts (4 lines)
    README.md (25 lines)
  daily/
    application/
      use-cases/
        daily-digest.use-cases.ts (24 lines)
    domain/
      entities/
        DailyDigest.ts (27 lines)
      repositories/
        DailyDigestRepository.ts (12 lines)
    infrastructure/
      default/
        DefaultDailyDigestRepository.ts (112 lines)
    interfaces/
      queries/
        daily-digest.queries.ts (53 lines)
    index.ts (16 lines)
  file/
    application/
      dto/
        file.dto.ts (45 lines)
        rag-document.dto.ts (37 lines)
      use-cases/
        list-workspace-files.use-case.ts (37 lines)
        register-uploaded-rag-document.use-case.ts (107 lines)
        upload-complete-file.use-case.ts (126 lines)
        upload-init-file.use-case.ts (127 lines)
      index.ts (6 lines)
    domain/
      entities/
        AuditRecord.ts (18 lines)
        File.ts (33 lines)
        FileVersion.ts (15 lines)
        PermissionSnapshot.ts (12 lines)
        RetentionPolicy.ts (8 lines)
      ports/
        ActorContextPort.ts (9 lines)
        OrganizationPolicyPort.ts (16 lines)
        WorkspaceGrantPort.ts (14 lines)
      repositories/
        FileRepository.ts (14 lines)
        RagDocumentRepository.ts (37 lines)
      services/
        complete-upload-file.ts (16 lines)
        resolve-file-organization-id.ts (6 lines)
      index.ts (12 lines)
    infrastructure/
      firebase/
        FirebaseFileRepository.ts (159 lines)
        FirebaseRagDocumentRepository.ts (34 lines)
      index.ts (2 lines)
    interfaces/
      _actions/
        file.actions.ts (66 lines)
      components/
        WorkspaceFilesTab.tsx (140 lines)
      contracts/
        file-command-result.ts (26 lines)
      queries/
        file.queries.ts (17 lines)
      index.ts (4 lines)
    index.ts (4 lines)
    README.md (900 lines)
  finance/
    application/
      use-cases/
        finance.use-cases.ts (101 lines)
    domain/
      entities/
        Finance.ts (60 lines)
      repositories/
        FinanceRepository.ts (13 lines)
    infrastructure/
      firebase/
        FirebaseFinanceRepository.ts (79 lines)
    interfaces/
      _actions/
        finance.actions.ts (47 lines)
      components/
        WorkspaceFinanceTab.tsx (177 lines)
      queries/
        finance.queries.ts (15 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (23 lines)
  identity/
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
    index.ts (26 lines)
  issue/
    application/
      use-cases/
        issue.use-cases.ts (87 lines)
    domain/
      entities/
        Issue.ts (30 lines)
      repositories/
        IssueRepository.ts (12 lines)
    infrastructure/
      firebase/
        FirebaseIssueRepository.ts (142 lines)
    interfaces/
      _actions/
        issue.actions.ts (62 lines)
      components/
        WorkspaceIssueTab.tsx (272 lines)
      queries/
        issue.queries.ts (9 lines)
    index.ts (22 lines)
  notification/
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
  parser/
    application/
      use-cases/
        get-workspace-parser-summary.use-case.ts (21 lines)
      index.ts (1 lines)
    domain/
      entities/
        ParserSummary.ts (6 lines)
      repositories/
        ParserRepository.ts (9 lines)
      services/
        derive-parser-summary.ts (76 lines)
      index.ts (10 lines)
    infrastructure/
      default/
        DefaultWorkspaceParserRepository.ts (54 lines)
      index.ts (1 lines)
    interfaces/
      components/
        WorkspaceDocumentParserTab.tsx (138 lines)
      queries/
        parser.queries.ts (17 lines)
      index.ts (2 lines)
    index.ts (4 lines)
    README.md (25 lines)
  qa/
    application/
      use-cases/
        quality-check.use-cases.ts (87 lines)
    domain/
      entities/
        QualityCheck.ts (27 lines)
      repositories/
        QualityCheckRepository.ts (15 lines)
    infrastructure/
      firebase/
        FirebaseQualityCheckRepository.ts (140 lines)
    interfaces/
      _actions/
        qa.actions.ts (64 lines)
      components/
        WorkspaceQATab.tsx (272 lines)
      queries/
        qa.queries.ts (15 lines)
    index.ts (21 lines)
  schedule/
    application/
      use-cases/
        mddd/
          run-schedule-mddd-flow.use-case.ts (285 lines)
        acknowledge-workspace-schedule-item.use-case.ts (56 lines)
        list-workspace-schedule-items.use-case.ts (14 lines)
        submit-schedule-request.use-case.ts (124 lines)
      index.ts (4 lines)
    domain/
      entities/
        ScheduleAcknowledgement.ts (15 lines)
        ScheduleItem.ts (14 lines)
        ScheduleRequest.ts (42 lines)
      mddd/
        entities/
          Assignment.ts (86 lines)
          Match.ts (38 lines)
          References.ts (25 lines)
          Request.ts (81 lines)
          Schedule.ts (66 lines)
          Task.ts (77 lines)
        events/
          ScheduleDomainEvents.ts (45 lines)
        repositories/
          AssignmentRepository.ts (7 lines)
          index.ts (8 lines)
          MatchRepository.ts (6 lines)
          MemberAvailabilityRepository.ts (6 lines)
          OrganizationStructureRepository.ts (6 lines)
          ProjectionRepository.ts (5 lines)
          RequestRepository.ts (7 lines)
          ScheduleRepository.ts (7 lines)
          TaskRepository.ts (7 lines)
        services/
          matching-engine.ts (128 lines)
          scheduling-engine.ts (84 lines)
        value-objects/
          Requirements.ts (24 lines)
          Scheduling.ts (41 lines)
          WorkflowStatuses.ts (33 lines)
        index.ts (13 lines)
      repositories/
        ScheduleAcknowledgementRepository.ts (10 lines)
        ScheduleRepository.ts (9 lines)
        ScheduleRequestRepository.ts (8 lines)
      services/
        derive-schedule-items.ts (158 lines)
      index.ts (29 lines)
    infrastructure/
      default/
        DefaultWorkspaceScheduleRepository.ts (44 lines)
      firebase/
        converters/
          schedule-request.converter.ts (107 lines)
        FirebaseScheduleAcknowledgementRepository.ts (85 lines)
        FirebaseScheduleRequestRepository.ts (42 lines)
        FirebaseWorkspaceScheduleRepository.ts (84 lines)
      index.ts (4 lines)
    interfaces/
      _actions/
        schedule-mddd.actions.ts (26 lines)
        schedule-request.actions.ts (22 lines)
        schedule.actions.ts (24 lines)
      components/
        WorkspaceScheduleTab.tsx (101 lines)
      queries/
        schedule.queries.ts (12 lines)
      index.ts (5 lines)
    index.ts (4 lines)
    README.md (693 lines)
  task/
    application/
      use-cases/
        task.use-cases.ts (85 lines)
    domain/
      entities/
        Task.ts (33 lines)
      repositories/
        TaskRepository.ts (12 lines)
    infrastructure/
      firebase/
        FirebaseTaskRepository.ts (147 lines)
    interfaces/
      _actions/
        task.actions.ts (54 lines)
      components/
        WorkspaceTaskTab.tsx (294 lines)
      queries/
        task.queries.ts (10 lines)
    index.ts (22 lines)
  workspace/
    application/
      use-cases/
        workspace-member.use-cases.ts (10 lines)
        workspace.use-cases.ts (203 lines)
    domain/
      entities/
        Workspace.ts (85 lines)
        WorkspaceMember.ts (25 lines)
      repositories/
        WorkspaceQueryRepository.ts (9 lines)
        WorkspaceRepository.ts (35 lines)
    infrastructure/
      firebase/
        FirebaseWorkspaceQueryRepository.ts (183 lines)
        FirebaseWorkspaceRepository.ts (216 lines)
    interfaces/
      _actions/
        workspace.actions.ts (108 lines)
      components/
        WorkspaceDailyTab.tsx (142 lines)
        WorkspaceDetailScreen.tsx (938 lines)
        WorkspaceHubScreen.tsx (284 lines)
        WorkspaceMembersTab.tsx (201 lines)
      hooks/
        useWorkspaceHub.ts (150 lines)
      queries/
        workspace-member.queries.ts (15 lines)
        workspace.queries.ts (31 lines)
    ports/
      .gitkeep (0 lines)
    index.ts (57 lines)
public/
  file.svg (1 lines)
  globe.svg (1 lines)
  next.svg (1 lines)
  vercel.svg (1 lines)
  window.svg (1 lines)
shared/
  constants/
    index.ts (6 lines)
  hooks/
    useStore.ts (11 lines)
  types/
    index.ts (68 lines)
  utils/
    index.ts (7 lines)
  validators/
    index.ts (47 lines)
ui/
  shadcn/
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
    utils/
      utils.ts (6 lines)
    .gitkeep (0 lines)
  vis/
    index.ts (21 lines)
    network.tsx (146 lines)
    timeline.tsx (123 lines)
.firebaserc (5 lines)
.gitignore (42 lines)
AGENTS.md (75 lines)
apphosting.yaml (64 lines)
ARCHITECTURE.md (146 lines)
components.json (25 lines)
eslint.config.mjs (26 lines)
firebase.apphosting.json (13 lines)
firebase.json (52 lines)
firestore.indexes.json (179 lines)
firestore.rules (9 lines)
next.config.ts (9 lines)
package.json (89 lines)
postcss.config.mjs (7 lines)
README.md (1 lines)
repomix.config.json (43 lines)
storage.rules (9 lines)
tailwind.config.ts (100 lines)
tsconfig.json (43 lines)
```