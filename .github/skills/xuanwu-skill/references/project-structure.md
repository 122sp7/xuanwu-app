# Directory Structure

```
.github/
  agents/
    ai-genkit-lead.agent.md (43 lines)
    app-router.agent.md (48 lines)
    chunk-strategist.agent.md (36 lines)
    doc-ingest.agent.md (37 lines)
    domain-architect.agent.md (69 lines)
    e2e-qa.agent.md (47 lines)
    embedding-writer.agent.md (36 lines)
    firebase-guardian.agent.md (51 lines)
    firestore-schema.agent.md (34 lines)
    frontend-lead.agent.md (38 lines)
    hexagonal-convergence-enforcer.agent.md (92 lines)
    hexagonal-ddd-architect.agent.md (52 lines)
    kb-architect.agent.md (45 lines)
    lint-rule-enforcer.agent.md (39 lines)
    prompt-engineer.agent.md (39 lines)
    quality-lead.agent.md (53 lines)
    rag-lead.agent.md (42 lines)
    schema-migration.agent.md (34 lines)
    security-rules.agent.md (38 lines)
    server-action-writer.agent.md (34 lines)
    shadcn-composer.agent.md (40 lines)
    state-management.agent.md (41 lines)
    test-scenario-writer.agent.md (34 lines)
    ts-interface-writer.agent.md (40 lines)
    zod-validator.agent.md (43 lines)
  instructions/
    architecture-core.instructions.md (170 lines)
    architecture-runtime.instructions.md (40 lines)
    architecture.instructions.md (32 lines)
    bounded-context-rules.instructions.md (34 lines)
    ci-cd.instructions.md (20 lines)
    cloud-functions.instructions.md (29 lines)
    docs-authority-and-language.instructions.md (40 lines)
    domain-layer-rules.instructions.md (75 lines)
    domain-modeling.instructions.md (74 lines)
    embedding-pipeline.instructions.md (23 lines)
    event-driven-state.instructions.md (107 lines)
    firestore-schema.instructions.md (40 lines)
    genkit-flow.instructions.md (84 lines)
    hexagonal-rules.instructions.md (44 lines)
    hosting-deploy.instructions.md (14 lines)
    lint-format.instructions.md (20 lines)
    nextjs-app-router.instructions.md (19 lines)
    nextjs-parallel-routes.instructions.md (17 lines)
    nextjs-server-actions.instructions.md (18 lines)
    playwright-mcp-testing.instructions.md (101 lines)
    process-framework.instructions.md (49 lines)
    prompt-engineering.instructions.md (30 lines)
    rag-architecture.instructions.md (19 lines)
    README.md (34 lines)
    security-rules.instructions.md (31 lines)
    shadcn-ui.instructions.md (16 lines)
    state-management.instructions.md (118 lines)
    subdomain-rules.instructions.md (86 lines)
    tailwind-design-system.instructions.md (16 lines)
    testing-e2e.instructions.md (16 lines)
    testing-unit.instructions.md (16 lines)
  prompts/
    analyze-repo.prompt.md (35 lines)
    chunk-docs.prompt.md (27 lines)
    debug-error.prompt.md (25 lines)
    domain-modeling.prompt.md (69 lines)
    embedding-docs.prompt.md (20 lines)
    enforce-hexagonal-ddd-convergence.prompt.md (215 lines)
    feature-design.prompt.md (99 lines)
    firebase-adapter.prompt.md (63 lines)
    generate-aggregate.prompt.md (51 lines)
    generate-domain-event.prompt.md (59 lines)
    generate-value-object.prompt.md (102 lines)
    implement-feature.prompt.md (27 lines)
    implement-firestore-schema.prompt.md (19 lines)
    implement-genkit-flow.prompt.md (20 lines)
    implement-security-rules.prompt.md (19 lines)
    implement-server-action.prompt.md (21 lines)
    implement-state-machine.prompt.md (102 lines)
    implement-ui-component.prompt.md (22 lines)
    implement-zustand-store.prompt.md (72 lines)
    ingest-docs.prompt.md (21 lines)
    plan-api.prompt.md (19 lines)
    plan-feature.prompt.md (14 lines)
    plan-module.prompt.md (19 lines)
    playwright-mcp-inspect.prompt.md (165 lines)
    playwright-mcp-test.prompt.md (129 lines)
    README.md (27 lines)
    refactor-api.prompt.md (17 lines)
    refactor-module.prompt.md (18 lines)
    review-architecture.prompt.md (18 lines)
    review-code.prompt.md (18 lines)
    review-performance.prompt.md (19 lines)
    review-security.prompt.md (13 lines)
    serena-hexagonal-ddd-refactor.prompt.md (50 lines)
    use-case-generation.prompt.md (64 lines)
    write-docs.prompt.md (19 lines)
    write-e2e-tests.prompt.md (21 lines)
    write-tests.prompt.md (19 lines)
  copilot-instructions.md (95 lines)
docs/
  decisions/
    0001-hexagonal-architecture.md (80 lines)
    0002-bounded-contexts.md (81 lines)
    0003-context-map.md (79 lines)
    0004-ubiquitous-language.md (79 lines)
    0005-anti-corruption-layer.md (80 lines)
    0006-domain-event-discriminant-format.md (117 lines)
    0007-infrastructure-in-api-layer.md (73 lines)
    0008-repository-interface-placement.md (83 lines)
    0009-anemic-aggregates.md (81 lines)
    0010-aggregate-domain-event-emission.md (114 lines)
    0011-use-case-bundling.md (129 lines)
    0012-source-to-task-orchestration.md (73 lines)
    0014-main-domain-resplit.md (46 lines)
    0015-api-layer-removal.md (76 lines)
    1100-layer-violation.md (86 lines)
    1101-layer-violation-crypto-in-domain.md (97 lines)
    1102-layer-violation-ports-in-application.md (127 lines)
    1103-layer-violation-firebase-sdk-in-api-layer.md (90 lines)
    1104-layer-violation-globalthis-crypto-in-application-layer.md (78 lines)
    1200-boundary-violation.md (107 lines)
    1201-boundary-violation-business-logic-in-infrastructure.md (119 lines)
    1300-cyclic-dependency.md (117 lines)
    1400-dependency-leakage.md (64 lines)
    1401-dependency-leakage-infrastructure-api-in-platform-api.md (119 lines)
    1402-dependency-leakage-use-case-classes-in-platform-api.md (124 lines)
    1403-dependency-leakage-subdomain-api-exports-interfaces-wildcard.md (81 lines)
    1404-dependency-leakage-subdomain-api-exports-application-wildcard.md (90 lines)
    2100-tight-coupling.md (71 lines)
    2101-tight-coupling-crypto-runtime.md (98 lines)
    2200-hidden-coupling.md (59 lines)
    2201-hidden-coupling-workspace-aggregate-no-domain-events.md (162 lines)
    2300-temporal-coupling.md (63 lines)
    3100-low-cohesion.md (89 lines)
    3101-low-cohesion-platform-application-layer.md (105 lines)
    3200-duplication.md (95 lines)
    3201-duplication-event-discriminant-format.md (111 lines)
    3202-duplication-source-dto-reimplements-domain-service.md (68 lines)
    3203-duplication-shell-quick-create-orphaned-platform-copy.md (143 lines)
    4100-change-amplification.md (71 lines)
    4101-change-amplification-uuid-strategy.md (93 lines)
    4200-inconsistency.md (78 lines)
    4201-inconsistency-dto-vs-dtos.md (110 lines)
    4202-inconsistency-uuid-v7-in-workspace-domain-events.md (109 lines)
    4203-inconsistency-uuid-v7-application-infrastructure-layers.md (126 lines)
    4300-semantic-drift.md (75 lines)
    4301-semantic-drift-application-subdirectory-names.md (113 lines)
    4302-semantic-drift-notion-notebooklm-event-discriminant-format.md (75 lines)
    4303-semantic-drift-workspace-event-discriminants-use-underscore.md (119 lines)
    5100-accidental-complexity.md (89 lines)
    5101-accidental-complexity-platform-domain-stubs.md (144 lines)
    5200-cognitive-load.md (105 lines)
    5201-cognitive-load-workspace-workflow-application.md (151 lines)
    5202-cognitive-load-workspace-dto-mixes-types-and-factory-functions.md (157 lines)
    5203-cognitive-load-subdomain-api-unscoped-wildcard-exports.md (107 lines)
    6100-migration-gap-registry.md (75 lines)
    6101-lost-notebooklm-source-subdomain.md (89 lines)
    6102-lost-notebooklm-synthesis-subdomain.md (80 lines)
    6103-lost-notebooklm-interfaces-layer.md (76 lines)
    6104-lost-notion-authoring-subdomain.md (95 lines)
    6105-lost-notion-knowledge-database-subdomain.md (87 lines)
    6106-lost-notion-knowledge-subdomain.md (76 lines)
    6107-lost-platform-domain-model.md (109 lines)
    6108-lost-platform-api-contracts.md (76 lines)
    6109-lost-workspace-interfaces-layer.md (82 lines)
    6110-lost-ai-prompt-pipeline-subdomain.md (102 lines)
    6111-lost-ai-missing-subdomains.md (108 lines)
    6112-lost-ai-governance-docs.md (81 lines)
    6113-lost-packages.md (93 lines)
    6114-lost-docs-semantic-model.md (113 lines)
    6115-lost-docs-discussions.md (99 lines)
    6116-gained-shell-ui-components.md (60 lines)
    6117-gained-packages-ui-shadcn.md (62 lines)
    6118-gained-modules-template.md (69 lines)
    6119-gained-workspace-new-subdomains.md (91 lines)
    6120-gained-platform-new-subdomains.md (76 lines)
    6121-gained-ai-restructured-subdomains.md (73 lines)
    README.md (214 lines)
    SMELL-INDEX.md (121 lines)
  examples/
    ai/
      .gitkeep (0 lines)
    architecture/
      .gitkeep (0 lines)
    data/
      .gitkeep (0 lines)
    domain/
      .gitkeep (0 lines)
    end-to-end/
      deliveries/
        AGENT.md (8 lines)
        README.md (10 lines)
        upload-parse-to-task-flow.md (77 lines)
      .gitkeep (0 lines)
    modules/
      feature/
        AGENT.md (8 lines)
        notebooklm-source-processing-task-flow.md (86 lines)
        py-fn-ts-capability-bridge.md (387 lines)
        README.md (12 lines)
        workspace-nav-notion-notebooklm-implementation-guide.md (241 lines)
      .gitkeep (0 lines)
    .gitkeep (0 lines)
  structure/
    contexts/
      ai/
        AGENT.md (95 lines)
        bounded-contexts.md (61 lines)
        context-map.md (50 lines)
        cross-runtime-contracts.md (99 lines)
        ddd-strategic-design.md (119 lines)
        README.md (73 lines)
        subdomains.md (91 lines)
        ubiquitous-language.md (49 lines)
      analytics/
        AGENT.md (68 lines)
        bounded-contexts.md (11 lines)
        context-map.md (16 lines)
        README.md (27 lines)
        subdomains.md (20 lines)
        ubiquitous-language.md (15 lines)
      billing/
        AGENT.md (68 lines)
        bounded-contexts.md (11 lines)
        context-map.md (14 lines)
        README.md (27 lines)
        subdomains.md (18 lines)
        ubiquitous-language.md (15 lines)
      iam/
        AGENT.md (74 lines)
        bounded-contexts.md (12 lines)
        context-map.md (16 lines)
        README.md (27 lines)
        subdomains.md (28 lines)
        ubiquitous-language.md (17 lines)
      notebooklm/
        AGENT.md (92 lines)
        bounded-contexts.md (83 lines)
        context-map.md (79 lines)
        README.md (113 lines)
        subdomains.md (68 lines)
        ubiquitous-language.md (94 lines)
      notion/
        AGENT.md (112 lines)
        bounded-contexts.md (83 lines)
        context-map.md (80 lines)
        README.md (117 lines)
        subdomains.md (72 lines)
        ubiquitous-language.md (94 lines)
      platform/
        AGENT.md (108 lines)
        bounded-contexts.md (89 lines)
        context-map.md (80 lines)
        README.md (133 lines)
        subdomains.md (89 lines)
        ubiquitous-language.md (141 lines)
      workspace/
        AGENT.md (100 lines)
        bounded-contexts.md (93 lines)
        context-map.md (79 lines)
        README.md (126 lines)
        subdomains.md (80 lines)
        ubiquitous-language.md (120 lines)
      _template.md (144 lines)
    domain/
      bounded-context-subdomain-template.md (203 lines)
      bounded-contexts.md (280 lines)
      ddd-strategic-design.md (218 lines)
      event-driven-design.md (189 lines)
      subdomains.md (279 lines)
      ubiquitous-language.md (166 lines)
    system/
      architecture-overview.md (137 lines)
      context-map.md (121 lines)
      hard-rules-consolidated.md (459 lines)
      integration-guidelines.md (112 lines)
      module-graph.system-wide.md (135 lines)
      project-delivery-milestones.md (109 lines)
      source-to-task-flow.md (94 lines)
      strategic-patterns.md (81 lines)
      ui-ux-closed-loop.md (134 lines)
    .gitkeep (0 lines)
  tooling/
    ci-cd/
      .gitkeep (0 lines)
    cli/
      .gitkeep (0 lines)
    firebase/
      .gitkeep (0 lines)
      firebase-architecture.md (197 lines)
    firestore/
      .gitkeep (0 lines)
    genkit/
      .gitkeep (0 lines)
      genkit-flow-standards.md (229 lines)
    nextjs/
      .gitkeep (0 lines)
      state-machine-model.md (186 lines)
    .gitkeep (0 lines)
    commands-reference.md (54 lines)
    knowledge-base-reference.md (41 lines)
  AGENT.md (39 lines)
  README.md (158 lines)
packages/
  integration-firebase/
    auth/
      .gitkeep (0 lines)
    firestore/
      .gitkeep (0 lines)
    functions/
      .gitkeep (0 lines)
    storage/
      .gitkeep (0 lines)
    AGENTS.md (53 lines)
    auth.ts (14 lines)
    client.ts (6 lines)
    firestore.ts (28 lines)
    functions.ts (9 lines)
    index.ts (4 lines)
    README.md (48 lines)
    storage.ts (19 lines)
  ui-shadcn/
    hooks/
      use-mobile.ts (3 lines)
    lib/
      utils.ts (4 lines)
    provider/
      theme-provider.tsx (12 lines)
    ui/
      accordion.tsx (20 lines)
      alert-dialog.tsx (8 lines)
      alert.tsx (5 lines)
      aspect-ratio.tsx (3 lines)
      avatar.tsx (5 lines)
      badge.tsx (12 lines)
      breadcrumb.tsx (9 lines)
      button-group.tsx (8 lines)
      button.tsx (6 lines)
      calendar.tsx (12 lines)
      card.tsx (3 lines)
      carousel.tsx (49 lines)
      chart.tsx (30 lines)
      checkbox.tsx (6 lines)
      collapsible.tsx (3 lines)
      combobox.tsx (23 lines)
      command.tsx (17 lines)
      context-menu.tsx (13 lines)
      dialog.tsx (15 lines)
      direction.tsx (0 lines)
      drawer.tsx (26 lines)
      dropdown-menu.tsx (38 lines)
      empty.tsx (5 lines)
      field.tsx (8 lines)
      hover-card.tsx (5 lines)
      input-group.tsx (10 lines)
      input-otp.tsx (7 lines)
      input.tsx (7 lines)
      item.tsx (18 lines)
      kbd.tsx (3 lines)
      label.tsx (3 lines)
      menubar.tsx (22 lines)
      native-select.tsx (14 lines)
      navigation-menu.tsx (23 lines)
      pagination.tsx (29 lines)
      popover.tsx (9 lines)
      progress.tsx (14 lines)
      radio-group.tsx (8 lines)
      resizable.tsx (1 lines)
      scroll-area.tsx (15 lines)
      select.tsx (40 lines)
      separator.tsx (5 lines)
      sheet.tsx (15 lines)
      sidebar.tsx (73 lines)
      skeleton.tsx (3 lines)
      slider.tsx (5 lines)
      sonner.tsx (3 lines)
      spinner.tsx (6 lines)
      switch.tsx (13 lines)
      table.tsx (3 lines)
      tabs.tsx (18 lines)
      textarea.tsx (3 lines)
      toggle-group.tsx (30 lines)
      toggle.tsx (6 lines)
      tooltip.tsx (19 lines)
    ui-custom/
      form/
        .gitkeep (0 lines)
      modal/
        .gitkeep (0 lines)
      table/
        .gitkeep (0 lines)
    AGENTS.md (69 lines)
    index.ts (15 lines)
    README.md (86 lines)
  AGENT.md (59 lines)
  README.md (82 lines)
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
        chunk_job.py (31 lines)
        embedding_job.py (24 lines)
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
  AGENT.md (32 lines)
  main.py (43 lines)
  README.md (265 lines)
  requirements-dev.txt (2 lines)
  requirements.txt (23 lines)
src/
  app/
    (public)/
      page.tsx (3 lines)
    (shell)/
      (account)/
        [accountId]/
          [[...slug]]/
            page.tsx (5 lines)
      layout.tsx (5 lines)
    AGENT.md (40 lines)
    globals.css (47 lines)
    layout.tsx (9 lines)
    README.md (55 lines)
  modules/
    ai/
      orchestration/
        index.ts (3 lines)
      shared/
        errors/
          index.ts (1 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (1 lines)
        index.ts (0 lines)
      subdomains/
        chunk/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              dto/
                chunk-job-payload.ts (34 lines)
              memory/
                InMemoryChunkRepository.ts (18 lines)
              index.ts (1 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ChunkUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              Chunk.ts (49 lines)
            repositories/
              ChunkRepository.ts (26 lines)
            index.ts (0 lines)
        citation/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              CitationUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              Citation.ts (26 lines)
            index.ts (2 lines)
        context/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ContextUseCases.ts (11 lines)
            index.ts (2 lines)
          domain/
            entities/
              ContextSession.ts (44 lines)
            repositories/
              ContextSessionRepository.ts (13 lines)
            index.ts (2 lines)
        embedding/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              dto/
                embedding-job-payload.ts (32 lines)
              index.ts (1 lines)
            index.ts (1 lines)
          application/
            use-cases/
              EmbeddingUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              Embedding.ts (44 lines)
            repositories/
              EmbeddingRepository.ts (19 lines)
            index.ts (0 lines)
        evaluation/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              EvaluationUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              EvaluationResult.ts (37 lines)
            index.ts (2 lines)
        generation/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              GenerationUseCases.ts (29 lines)
            index.ts (0 lines)
          domain/
            ports/
              GenerationPorts.ts (83 lines)
            index.ts (0 lines)
        memory/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              MemoryUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              MemoryItem.ts (22 lines)
            index.ts (2 lines)
        pipeline/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              PipelineUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              PromptTemplate.ts (35 lines)
            index.ts (2 lines)
        retrieval/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              RetrievalUseCases.ts (7 lines)
            index.ts (2 lines)
          domain/
            ports/
              RetrievalPorts.ts (39 lines)
            index.ts (2 lines)
        tool-calling/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ToolCallingUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              AiTool.ts (27 lines)
            index.ts (2 lines)
      AGENT.md (76 lines)
      index.ts (24 lines)
      README.md (111 lines)
    analytics/
      orchestration/
        index.ts (3 lines)
      shared/
        errors/
          index.ts (1 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (1 lines)
        index.ts (0 lines)
      subdomains/
        event-contracts/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryAnalyticsEventRepository.ts (15 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              AnalyticsEventUseCases.ts (22 lines)
            index.ts (0 lines)
          domain/
            entities/
              AnalyticsEvent.ts (33 lines)
            events/
              AnalyticsDomainEvent.ts (13 lines)
            repositories/
              AnalyticsEventRepository.ts (25 lines)
            value-objects/
              EventName.ts (5 lines)
            index.ts (0 lines)
        event-ingestion/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              IngestionUseCases.ts (10 lines)
            index.ts (2 lines)
          domain/
            entities/
              IngestionBatch.ts (22 lines)
            events/
              IngestionDomainEvent.ts (19 lines)
            index.ts (2 lines)
        event-projection/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ProjectionUseCases.ts (2 lines)
            index.ts (2 lines)
          domain/
            entities/
              EventProjection.ts (23 lines)
            index.ts (2 lines)
        experimentation/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ExperimentUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              Experiment.ts (26 lines)
            index.ts (2 lines)
        insights/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              InsightUseCases.ts (2 lines)
            index.ts (2 lines)
          domain/
            entities/
              Insight.ts (23 lines)
            index.ts (2 lines)
        metrics/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryMetricRepository.ts (14 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              MetricUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              Metric.ts (43 lines)
            repositories/
              MetricRepository.ts (25 lines)
            value-objects/
              MetricName.ts (5 lines)
            index.ts (0 lines)
        realtime-insights/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              RealtimeInsightUseCases.ts (2 lines)
            index.ts (2 lines)
          domain/
            entities/
              RealtimeMetric.ts (26 lines)
            index.ts (2 lines)
      AGENT.md (51 lines)
      index.ts (18 lines)
      README.md (64 lines)
    billing/
      orchestration/
        index.ts (3 lines)
      shared/
        errors/
          index.ts (1 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (1 lines)
        index.ts (0 lines)
      subdomains/
        entitlement/
          adapters/
            inbound/
              http/
                EntitlementController.ts (25 lines)
              index.ts (2 lines)
            outbound/
              firestore/
                FirestoreEntitlementGrantRepository.ts (29 lines)
              index.ts (2 lines)
            index.ts (3 lines)
          application/
            dto/
              EntitlementDTO.ts (9 lines)
            ports/
              outbound/
                EntitlementRepositoryPort.ts (3 lines)
            use-cases/
              EntitlementUseCases.ts (29 lines)
            index.ts (5 lines)
          domain/
            entities/
              EntitlementGrant.ts (50 lines)
            events/
              EntitlementGrantDomainEvent.ts (46 lines)
            repositories/
              EntitlementGrantRepository.ts (21 lines)
            value-objects/
              EntitlementId.ts (5 lines)
              EntitlementStatus.ts (7 lines)
              FeatureKey.ts (5 lines)
            index.ts (7 lines)
        subscription/
          adapters/
            inbound/
              http/
                SubscriptionController.ts (29 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreSubscriptionRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (3 lines)
          application/
            dto/
              SubscriptionDTO.ts (11 lines)
            ports/
              outbound/
                SubscriptionRepositoryPort.ts (3 lines)
            use-cases/
              SubscriptionUseCases.ts (30 lines)
            index.ts (5 lines)
          domain/
            entities/
              Subscription.ts (56 lines)
            events/
              SubscriptionDomainEvent.ts (49 lines)
            repositories/
              SubscriptionRepository.ts (15 lines)
            value-objects/
              BillingCycle.ts (5 lines)
              PlanCode.ts (7 lines)
              SubscriptionId.ts (5 lines)
              SubscriptionStatus.ts (7 lines)
            index.ts (7 lines)
        usage-metering/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryUsageRecordRepository.ts (12 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              UsageMeteringUseCases.ts (22 lines)
            index.ts (2 lines)
          domain/
            entities/
              UsageRecord.ts (41 lines)
            repositories/
              UsageRecordRepository.ts (22 lines)
            index.ts (2 lines)
      AGENT.md (46 lines)
      index.ts (10 lines)
      README.md (57 lines)
    iam/
      adapters/
        inbound/
          react/
            AuthContext.tsx (67 lines)
            IamSessionProvider.tsx (9 lines)
            index.ts (8 lines)
            PublicLandingView.tsx (28 lines)
        outbound/
          firebase-composition.ts (140 lines)
          FirebaseAccountQueryRepository.ts (91 lines)
          FirebaseAuthIdentityRepository.ts (51 lines)
      orchestration/
        index.ts (3 lines)
      shared/
        errors/
          index.ts (15 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (1 lines)
        index.ts (0 lines)
      subdomains/
        access-control/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryAccessPolicyRepository.ts (20 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            dto/
              AccessControlDTO.ts (12 lines)
            use-cases/
              AccessControlUseCases.ts (47 lines)
            index.ts (0 lines)
          domain/
            aggregates/
              AccessPolicy.ts (53 lines)
            events/
              AccessPolicyDomainEvent.ts (36 lines)
            repositories/
              AccessPolicyRepository.ts (23 lines)
            value-objects/
              PolicyEffect.ts (3 lines)
              ResourceRef.ts (9 lines)
              SubjectRef.ts (8 lines)
            index.ts (0 lines)
        account/
          adapters/
            inbound/
              http/
                AccountController.ts (31 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreAccountRepository.ts (50 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            dto/
              AccountDTO.ts (0 lines)
            ports/
              outbound/
                AccountRepositoryPort.ts (12 lines)
            use-cases/
              AccountPolicyUseCases.ts (29 lines)
              AccountUseCases.ts (69 lines)
            index.ts (5 lines)
          domain/
            entities/
              Account.ts (87 lines)
              AccountPolicy.ts (38 lines)
              AccountProfile.ts (17 lines)
            events/
              AccountDomainEvent.ts (78 lines)
            ports/
              TokenRefreshPort.ts (13 lines)
            repositories/
              AccountPolicyRepository.ts (17 lines)
              AccountQueryRepository.ts (71 lines)
              AccountRepository.ts (55 lines)
            value-objects/
              AccountId.ts (5 lines)
              AccountStatus.ts (7 lines)
              AccountType.ts (5 lines)
              index.ts (0 lines)
              WalletAmount.ts (5 lines)
            index.ts (9 lines)
        authentication/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              AuthenticationUseCases.ts (11 lines)
            index.ts (0 lines)
          domain/
            index.ts (27 lines)
        authorization/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              AuthorizationUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            index.ts (17 lines)
        federation/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              FederationUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            index.ts (22 lines)
        identity/
          adapters/
            inbound/
              http/
                IdentityController.ts (21 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreIdentityRepository.ts (35 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            dto/
              IdentityDTO.ts (0 lines)
            use-cases/
              IdentityUseCases.ts (25 lines)
              TokenRefreshUseCases.ts (9 lines)
            index.ts (3 lines)
          domain/
            entities/
              Identity.ts (20 lines)
              TokenRefreshSignal.ts (11 lines)
              UserIdentity.ts (59 lines)
            events/
              IdentityDomainEvent.ts (64 lines)
            repositories/
              IdentityRepository.ts (19 lines)
              TokenRefreshRepository.ts (9 lines)
            value-objects/
              DisplayName.ts (5 lines)
              Email.ts (7 lines)
              IdentityStatus.ts (5 lines)
              index.ts (0 lines)
              UserId.ts (7 lines)
            index.ts (9 lines)
        organization/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              firestore/
                FirestoreOrganizationRepository.ts (159 lines)
              memory/
                InMemoryOrganizationRepository.ts (48 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            dto/
              OrganizationDTO.ts (0 lines)
            use-cases/
              OrganizationLifecycleUseCases.ts (27 lines)
              OrganizationMemberUseCases.ts (20 lines)
              OrganizationTeamUseCases.ts (18 lines)
            index.ts (0 lines)
          domain/
            aggregates/
              Organization.ts (72 lines)
              OrganizationTeam.ts (40 lines)
            entities/
              Organization.ts (111 lines)
            events/
              OrganizationDomainEvent.ts (56 lines)
              OrganizationTeamDomainEvent.ts (15 lines)
            repositories/
              OrganizationRepository.ts (57 lines)
              OrgPolicyRepository.ts (17 lines)
            value-objects/
              MemberRole.ts (7 lines)
              OrganizationId.ts (5 lines)
              OrganizationStatus.ts (5 lines)
              TeamId.ts (5 lines)
              TeamType.ts (3 lines)
            index.ts (0 lines)
        security-policy/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemorySecurityPolicyRepository.ts (7 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              SecurityPolicyUseCases.ts (13 lines)
            index.ts (0 lines)
          domain/
            index.ts (22 lines)
        session/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemorySessionRepository.ts (13 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              SessionUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            index.ts (26 lines)
        tenant/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryTenantRepository.ts (7 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              TenantUseCases.ts (12 lines)
            index.ts (0 lines)
          domain/
            index.ts (24 lines)
      AGENT.md (62 lines)
      index.ts (26 lines)
      README.md (83 lines)
    notebooklm/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotebooklmAiChatSection.tsx (25 lines)
            NotebooklmNotebookSection.tsx (18 lines)
            NotebooklmResearchSection.tsx (27 lines)
            NotebooklmSourcesSection.tsx (55 lines)
          server-actions/
            document-actions.ts (30 lines)
            notebook-actions.ts (27 lines)
        outbound/
          callable/
            FirebaseCallableAdapter.ts (59 lines)
          firebase-composition.ts (72 lines)
          TaskMaterializationWorkflowAdapter.ts (23 lines)
      orchestration/
        index.ts (2 lines)
        ProcessSourceDocumentWorkflowUseCase.ts (107 lines)
        TaskMaterializationWorkflowPort.ts (36 lines)
      shared/
        errors/
          index.ts (1 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (1 lines)
        index.ts (0 lines)
      subdomains/
        conversation/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryConversationRepository.ts (14 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ConversationUseCases.ts (21 lines)
            index.ts (0 lines)
          domain/
            entities/
              Conversation.ts (51 lines)
            repositories/
              ConversationRepository.ts (15 lines)
            index.ts (0 lines)
        document/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              firestore/
                FirestoreDocumentRepository.ts (97 lines)
              memory/
                InMemoryDocumentRepository.ts (14 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              DocumentUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              Document.ts (62 lines)
            repositories/
              DocumentRepository.ts (24 lines)
            index.ts (0 lines)
        notebook/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryNotebookRepository.ts (14 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              NotebookUseCases.ts (24 lines)
            index.ts (0 lines)
          domain/
            entities/
              Notebook.ts (52 lines)
            ports/
              NotebookGenerationPort.ts (15 lines)
            repositories/
              NotebookRepository.ts (15 lines)
            index.ts (0 lines)
      AGENT.md (59 lines)
      index.ts (12 lines)
      README.md (70 lines)
    notion/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotionDatabaseSection.tsx (24 lines)
            NotionKnowledgeSection.tsx (21 lines)
            NotionPagesSection.tsx (28 lines)
            NotionTemplatesSection.tsx (16 lines)
          server-actions/
            database-actions.ts (14 lines)
            page-actions.ts (18 lines)
            template-actions.ts (13 lines)
        outbound/
          firebase-composition.ts (36 lines)
          notion-page-stub.ts (25 lines)
      orchestration/
        index.ts (3 lines)
      shared/
        errors/
          index.ts (1 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (1 lines)
        index.ts (0 lines)
      subdomains/
        block/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryBlockRepository.ts (18 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              BlockUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              Block.ts (68 lines)
            repositories/
              BlockRepository.ts (19 lines)
            index.ts (0 lines)
        collaboration/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              CollaborationUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              Comment.ts (34 lines)
            index.ts (2 lines)
        database/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryDatabaseRepository.ts (14 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              DatabaseUseCases.ts (13 lines)
            index.ts (0 lines)
          domain/
            entities/
              Database.ts (57 lines)
            repositories/
              DatabaseRepository.ts (15 lines)
            index.ts (0 lines)
        page/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryPageRepository.ts (16 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              PageUseCases.ts (21 lines)
            index.ts (0 lines)
          domain/
            entities/
              Page.ts (60 lines)
            repositories/
              PageRepository.ts (26 lines)
            index.ts (0 lines)
        template/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              TemplateUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              Template.ts (36 lines)
            index.ts (2 lines)
        view/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              ViewUseCases.ts (1 lines)
            index.ts (2 lines)
          domain/
            entities/
              View.ts (41 lines)
            index.ts (2 lines)
      AGENT.md (62 lines)
      index.ts (16 lines)
      README.md (60 lines)
    platform/
      adapters/
        inbound/
          react/
            shell/
              AccountSwitcher.tsx (61 lines)
              CreateOrganizationDialog.tsx (40 lines)
              index.ts (6 lines)
              shell-quick-create.ts (22 lines)
              ShellAppRail.tsx (86 lines)
              ShellContextNavSection.tsx (36 lines)
              ShellDashboardSidebar.tsx (58 lines)
              ShellGuard.tsx (30 lines)
              ShellLanguageSwitcher.tsx (53 lines)
              ShellRootLayout.tsx (58 lines)
              ShellSidebarBody.tsx (56 lines)
              ShellSidebarHeader.tsx (21 lines)
              ShellSidebarNavData.tsx (57 lines)
              ShellThemeToggle.tsx (15 lines)
              ShellUserAvatar.tsx (42 lines)
            AccountScopeProvider.tsx (28 lines)
            AppContext.tsx (106 lines)
            index.ts (6 lines)
            platform-ui-stubs.tsx (190 lines)
            PlatformBootstrap.tsx (21 lines)
            ShellFrame.tsx (6 lines)
            useAccountRouteContext.ts (77 lines)
            useAccountScope.ts (8 lines)
          server-actions/
            file-actions.ts (34 lines)
        outbound/
          firebase-composition.ts (53 lines)
      orchestration/
        index.ts (21 lines)
      shared/
        errors/
          index.ts (9 lines)
        events/
          index.ts (27 lines)
        types/
          index.ts (5 lines)
        index.ts (0 lines)
      subdomains/
        background-job/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore-like/
                InMemoryBackgroundJobRepository.ts (20 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              background-job.use-cases.ts (50 lines)
            index.ts (0 lines)
          domain/
            entities/
              BackgroundJob.ts (22 lines)
              JobChunk.ts (13 lines)
              JobDocument.ts (10 lines)
            events/
              BackgroundJobDomainEvent.ts (44 lines)
            repositories/
              BackgroundJobRepository.ts (29 lines)
            index.ts (0 lines)
        cache/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              memory/
                InMemoryCacheRepository.ts (10 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              CacheUseCases.ts (30 lines)
            index.ts (0 lines)
          domain/
            entities/
              CacheEntry.ts (7 lines)
            repositories/
              CacheRepository.ts (11 lines)
            index.ts (0 lines)
        file-storage/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreFileStorageRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              FileStorageUseCases.ts (41 lines)
            index.ts (0 lines)
          domain/
            entities/
              StoredFile.ts (10 lines)
            repositories/
              FileStorageRepository.ts (13 lines)
            index.ts (0 lines)
        notification/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              memory/
                InMemoryNotificationRepository.ts (15 lines)
                InMemoryWorkspaceNotificationPreferenceRepository.ts (12 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            dto/
              notification.dto.ts (0 lines)
            queries/
              notification.queries.ts (12 lines)
              workspace-notification-preferences.queries.ts (16 lines)
            use-cases/
              notification.use-cases.ts (17 lines)
              workspace-notification-preferences.use-case.ts (31 lines)
            index.ts (0 lines)
          domain/
            aggregates/
              NotificationAggregate.ts (35 lines)
            entities/
              Notification.ts (22 lines)
              WorkspaceNotificationPreference.ts (31 lines)
            events/
              NotificationDomainEvent.ts (37 lines)
            repositories/
              NotificationRepository.ts (15 lines)
              WorkspaceNotificationPreferenceRepository.ts (11 lines)
            value-objects/
              WorkspaceNotificationEventType.ts (5 lines)
            index.ts (0 lines)
        platform-config/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            services/
              shell-navigation-catalog.ts (94 lines)
            index.ts (0 lines)
          domain/
            index.ts (20 lines)
        search/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            services/
              shell-command-catalog.ts (29 lines)
            index.ts (0 lines)
          domain/
            index.ts (14 lines)
      AGENT.md (58 lines)
      index.ts (4 lines)
      README.md (84 lines)
    shared/
      index.ts (107 lines)
    template/
      orchestration/
        TemplateCoordinator.ts (39 lines)
        TemplateFacade.ts (26 lines)
      shared/
        application/
          index.ts (3 lines)
        config/
          index.ts (15 lines)
        constants/
          index.ts (1 lines)
        domain/
          index.ts (4 lines)
        errors/
          index.ts (20 lines)
        events/
          index.ts (22 lines)
        infrastructure/
          index.ts (4 lines)
        types/
          index.ts (18 lines)
        utils/
          index.ts (12 lines)
      subdomains/
        document/
          adapters/
            inbound/
              http/
                routes.ts (16 lines)
                TemplateController.ts (18 lines)
              queue/
                TemplateQueueHandler.ts (12 lines)
              index.ts (3 lines)
            outbound/
              cache/
                TemplateCacheAdapter.ts (18 lines)
              external-api/
                TemplateApiClient.ts (10 lines)
              firestore/
                FirestoreMapper.ts (22 lines)
                FirestoreTemplateRepository.ts (31 lines)
              index.ts (5 lines)
            index.ts (3 lines)
          application/
            dto/
              CreateTemplateDTO.ts (7 lines)
              TemplateResponseDTO.ts (10 lines)
              UpdateTemplateDTO.ts (8 lines)
            ports/
              inbound/
                CreateTemplatePort.ts (11 lines)
              outbound/
                CachePort.ts (12 lines)
                ExternalApiPort.ts (9 lines)
                TemplateRepositoryPort.ts (7 lines)
            use-cases/
              CreateTemplateUseCase.ts (15 lines)
              DeleteTemplateUseCase.ts (11 lines)
              UpdateTemplateUseCase.ts (14 lines)
            index.ts (7 lines)
          domain/
            entities/
              Template.ts (40 lines)
            events/
              TemplateCreatedEvent.ts (12 lines)
              TemplateUpdatedEvent.ts (12 lines)
            repositories/
              TemplateRepository.ts (16 lines)
            services/
              TemplateDomainService.ts (16 lines)
            value-objects/
              TemplateId.ts (15 lines)
              TemplateName.ts (13 lines)
            index.ts (9 lines)
        generation/
          adapters/
            inbound/
              http/
                GenerationController.ts (18 lines)
                routes.ts (15 lines)
              queue/
                GenerationQueueHandler.ts (11 lines)
              index.ts (0 lines)
            outbound/
              ai/
                AiGenerationAdapter.ts (18 lines)
              firestore/
                FirestoreGenerationRepository.ts (50 lines)
              index.ts (0 lines)
            index.ts (2 lines)
          application/
            dto/
              GenerateTemplateDTO.ts (13 lines)
              GenerationResultDTO.ts (9 lines)
            ports/
              inbound/
                GenerateTemplatePort.ts (12 lines)
              outbound/
                AiGenerationPort.ts (10 lines)
                GenerationRepositoryPort.ts (7 lines)
            use-cases/
              GenerateTemplateUseCase.ts (18 lines)
            index.ts (3 lines)
          domain/
            entities/
              GeneratedTemplate.ts (30 lines)
            events/
              GenerationCompletedEvent.ts (7 lines)
            repositories/
              GenerationRepository.ts (16 lines)
            services/
              GenerationDomainService.ts (14 lines)
            value-objects/
              GenerationId.ts (15 lines)
            index.ts (0 lines)
        ingestion/
          adapters/
            inbound/
              http/
                IngestionController.ts (11 lines)
                routes.ts (0 lines)
              queue/
                IngestionQueueHandler.ts (11 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreIngestionJobRepository.ts (28 lines)
              storage/
                CloudStorageAdapter.ts (9 lines)
              index.ts (0 lines)
            index.ts (2 lines)
          application/
            dto/
              IngestionJobResponseDTO.ts (8 lines)
              StartIngestionDTO.ts (4 lines)
            ports/
              inbound/
                StartIngestionPort.ts (9 lines)
              outbound/
                IngestionRepositoryPort.ts (4 lines)
                StoragePort.ts (9 lines)
            use-cases/
              StartIngestionUseCase.ts (17 lines)
            index.ts (2 lines)
          domain/
            entities/
              IngestionJob.ts (39 lines)
            events/
              IngestionJobEvents.ts (13 lines)
            repositories/
              IngestionJobRepository.ts (15 lines)
            services/
              IngestionDomainService.ts (9 lines)
            value-objects/
              IngestionId.ts (15 lines)
            index.ts (0 lines)
        workflow/
          adapters/
            inbound/
              http/
                routes.ts (0 lines)
                WorkflowController.ts (11 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreWorkflowRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (2 lines)
          application/
            dto/
              InitiateWorkflowDTO.ts (4 lines)
              WorkflowResponseDTO.ts (8 lines)
            ports/
              inbound/
                InitiateWorkflowPort.ts (9 lines)
              outbound/
                WorkflowRepositoryPort.ts (4 lines)
            use-cases/
              InitiateWorkflowUseCase.ts (17 lines)
            index.ts (2 lines)
          domain/
            entities/
              TemplateWorkflow.ts (47 lines)
            events/
              WorkflowEvents.ts (13 lines)
            repositories/
              TemplateWorkflowRepository.ts (13 lines)
            services/
              WorkflowDomainService.ts (10 lines)
            value-objects/
              WorkflowId.ts (16 lines)
            index.ts (0 lines)
      AGENT.md (99 lines)
      index.ts (20 lines)
      README.md (266 lines)
    workspace/
      adapters/
        inbound/
          react/
            AccountRouteDispatcher.tsx (63 lines)
            index.ts (6 lines)
            useWorkspaceScope.ts (8 lines)
            workspace-nav-model.ts (174 lines)
            workspace-route-screens.tsx (83 lines)
            workspace-shell-interop.tsx (175 lines)
            workspace-ui-stubs.tsx (18 lines)
            WorkspaceApprovalSection.tsx (18 lines)
            WorkspaceAuditSection.tsx (23 lines)
            WorkspaceContext.tsx (47 lines)
            WorkspaceDailySection.tsx (80 lines)
            WorkspaceFilesSection.tsx (65 lines)
            WorkspaceIssuesSection.tsx (28 lines)
            WorkspaceMembersSection.tsx (18 lines)
            WorkspaceOverviewSection.tsx (71 lines)
            WorkspaceQualitySection.tsx (18 lines)
            WorkspaceScheduleSection.tsx (20 lines)
            WorkspaceScopeProvider.tsx (39 lines)
            WorkspaceSettingsSection.tsx (27 lines)
            WorkspaceSettlementSection.tsx (19 lines)
            WorkspaceTaskFormationSection.tsx (66 lines)
            WorkspaceTasksSection.tsx (28 lines)
        outbound/
          firebase-composition.ts (91 lines)
          FirebaseWorkspaceQueryRepository.ts (60 lines)
      orchestration/
        index.ts (4 lines)
      shared/
        errors/
          index.ts (15 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (15 lines)
        index.ts (0 lines)
      subdomains/
        activity/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreActivityRepository.ts (22 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ActivityDTO.ts (3 lines)
            use-cases/
              ActivityUseCases.ts (11 lines)
            index.ts (0 lines)
          domain/
            entities/
              ActivityEvent.ts (44 lines)
            events/
              ActivityDomainEvent.ts (13 lines)
            repositories/
              ActivityRepository.ts (11 lines)
            index.ts (0 lines)
        api-key/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreApiKeyRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ApiKeyDTO.ts (3 lines)
            use-cases/
              ApiKeyUseCases.ts (14 lines)
            index.ts (0 lines)
          domain/
            entities/
              ApiKey.ts (46 lines)
            events/
              ApiKeyDomainEvent.ts (18 lines)
            repositories/
              ApiKeyRepository.ts (15 lines)
            value-objects/
              ApiKeyId.ts (5 lines)
            index.ts (0 lines)
        approval/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              index.ts (1 lines)
            index.ts (0 lines)
          application/
            use-cases/
              ApprovalUseCases.ts (20 lines)
            index.ts (0 lines)
          domain/
            repositories/
              ApprovalRepository.ts (33 lines)
            index.ts (0 lines)
        audit/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreAuditRepository.ts (22 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              AuditDTO.ts (5 lines)
            use-cases/
              AuditUseCases.ts (11 lines)
            index.ts (0 lines)
          domain/
            entities/
              AuditEntry.ts (59 lines)
            events/
              AuditDomainEvent.ts (19 lines)
            repositories/
              AuditRepository.ts (11 lines)
            value-objects/
              AuditAction.ts (5 lines)
              AuditSeverity.ts (7 lines)
            index.ts (0 lines)
        feed/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreFeedRepository.ts (33 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              FeedDTO.ts (3 lines)
            use-cases/
              FeedUseCases.ts (11 lines)
            index.ts (0 lines)
          domain/
            entities/
              FeedPost.ts (47 lines)
            events/
              FeedDomainEvent.ts (13 lines)
            repositories/
              FeedPostRepository.ts (15 lines)
            index.ts (0 lines)
        invitation/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreInvitationRepository.ts (28 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              InvitationDTO.ts (3 lines)
            use-cases/
              InvitationUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceInvitation.ts (48 lines)
            events/
              InvitationDomainEvent.ts (18 lines)
            repositories/
              InvitationRepository.ts (15 lines)
            index.ts (0 lines)
        issue/
          adapters/
            inbound/
              http/
                IssueController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreIssueRepository.ts (46 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              IssueDTO.ts (6 lines)
            use-cases/
              IssueUseCases.ts (21 lines)
            index.ts (0 lines)
          domain/
            entities/
              Issue.ts (48 lines)
            events/
              IssueDomainEvent.ts (52 lines)
            repositories/
              IssueRepository.ts (23 lines)
            value-objects/
              IssueId.ts (5 lines)
              IssueStage.ts (1 lines)
              IssueStatus.ts (11 lines)
            index.ts (0 lines)
        lifecycle/
          adapters/
            inbound/
              http/
                WorkspaceController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreWorkspaceRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              WorkspaceDTO.ts (4 lines)
            use-cases/
              WorkspaceLifecycleUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              Workspace.ts (50 lines)
            events/
              WorkspaceDomainEvent.ts (26 lines)
            repositories/
              WorkspaceRepository.ts (13 lines)
            index.ts (0 lines)
        membership/
          adapters/
            inbound/
              http/
                MembershipController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreMemberRepository.ts (28 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              MembershipDTO.ts (5 lines)
            use-cases/
              MembershipUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceMember.ts (46 lines)
            events/
              MembershipDomainEvent.ts (20 lines)
            repositories/
              WorkspaceMemberRepository.ts (15 lines)
            index.ts (0 lines)
        orchestration/
          adapters/
            inbound/
              http/
                OrchestrationController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreJobRepository.ts (28 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              OrchestrationDTO.ts (3 lines)
            machines/
              task-lifecycle.machine.ts (59 lines)
            sagas/
              TaskLifecycleSaga.ts (37 lines)
            use-cases/
              OrchestrationUseCases.ts (15 lines)
              ResumeTaskFlowUseCase.ts (25 lines)
            index.ts (0 lines)
          domain/
            entities/
              TaskMaterializationJob.ts (57 lines)
            events/
              JobDomainEvent.ts (18 lines)
            repositories/
              TaskMaterializationJobRepository.ts (17 lines)
            index.ts (0 lines)
        quality/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              index.ts (1 lines)
            index.ts (0 lines)
          application/
            use-cases/
              QualityUseCases.ts (10 lines)
            index.ts (0 lines)
          domain/
            repositories/
              QualityTaskRepository.ts (14 lines)
            index.ts (0 lines)
        resource/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreQuotaRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ResourceDTO.ts (5 lines)
            use-cases/
              ResourceUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              ResourceQuota.ts (49 lines)
            events/
              ResourceQuotaDomainEvent.ts (20 lines)
            repositories/
              ResourceQuotaRepository.ts (16 lines)
            index.ts (0 lines)
        schedule/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreDemandRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ScheduleDTO.ts (4 lines)
            use-cases/
              ScheduleUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkDemand.ts (48 lines)
            events/
              ScheduleDomainEvent.ts (13 lines)
            repositories/
              DemandRepository.ts (15 lines)
            index.ts (0 lines)
        settlement/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreInvoiceRepository.ts (29 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              SettlementDTO.ts (5 lines)
            use-cases/
              CreateInvoiceFromAcceptedTasksUseCase.ts (17 lines)
              SettlementUseCases.ts (16 lines)
            index.ts (0 lines)
          domain/
            entities/
              Invoice.ts (45 lines)
            events/
              InvoiceDomainEvent.ts (20 lines)
            repositories/
              InvoiceRepository.ts (16 lines)
            value-objects/
              InvoiceStatus.ts (5 lines)
            index.ts (0 lines)
        share/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreShareRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ShareDTO.ts (4 lines)
            use-cases/
              ShareUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceShare.ts (42 lines)
            events/
              ShareDomainEvent.ts (20 lines)
            repositories/
              WorkspaceShareRepository.ts (13 lines)
            index.ts (0 lines)
        task/
          adapters/
            inbound/
              http/
                TaskController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreTaskRepository.ts (39 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            dto/
              TaskDTO.ts (6 lines)
            use-cases/
              TaskUseCases.ts (25 lines)
            index.ts (0 lines)
          domain/
            entities/
              Task.ts (65 lines)
            events/
              TaskDomainEvent.ts (41 lines)
            repositories/
              TaskRepository.ts (16 lines)
            value-objects/
              TaskId.ts (5 lines)
              TaskStatus.ts (14 lines)
            index.ts (0 lines)
        task-formation/
          adapters/
            inbound/
              server-actions/
                task-formation-actions.ts (32 lines)
              index.ts (0 lines)
            outbound/
              callable/
                FirebaseCallableTaskCandidateExtractor.ts (42 lines)
              firestore/
                FirestoreTaskFormationJobRepository.ts (30 lines)
              genkit/
                GenkitTaskCandidateExtractor.ts (35 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              TaskFormationDTO.ts (7 lines)
            machines/
              task-formation.machine.ts (46 lines)
            use-cases/
              TaskFormationUseCases.ts (47 lines)
            index.ts (0 lines)
          domain/
            entities/
              TaskFormationJob.ts (62 lines)
            events/
              TaskFormationDomainEvent.ts (32 lines)
            ports/
              TaskCandidateExtractorPort.ts (21 lines)
            repositories/
              TaskFormationJobRepository.ts (17 lines)
            value-objects/
              TaskCandidate.ts (11 lines)
              TaskFormationJobStatus.ts (1 lines)
            index.ts (0 lines)
          AGENT.md (166 lines)
          README.md (220 lines)
      AGENT.md (75 lines)
      index.ts (14 lines)
      README.md (85 lines)
    AGENT.md (72 lines)
    README.md (76 lines)
  AGENT.md (30 lines)
  README.md (8 lines)
apphosting.yaml (64 lines)
components.json (25 lines)
eslint.config.mjs (9 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (437 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next.config.ts (7 lines)
package.json (126 lines)
postcss.config.mjs (0 lines)
repomix-ai.config.json (102 lines)
repomix-analytics.config.json (102 lines)
repomix-billing.config.json (102 lines)
repomix-iam.config.json (102 lines)
repomix-markdown.config.json (105 lines)
repomix-notebooklm.config.json (102 lines)
repomix-notion.config.json (102 lines)
repomix-packages.config.json (91 lines)
repomix-platform.config.json (102 lines)
repomix-py_fn.config.json (82 lines)
repomix-src.config.json (98 lines)
repomix-workspace.config.json (102 lines)
repomix.config.json (127 lines)
storage.rules (9 lines)
tailwind.config.ts (2 lines)
tsconfig.json (45 lines)
vitest.config.ts (3 lines)
```