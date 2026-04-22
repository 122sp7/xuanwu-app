# Directory Structure

```
docs/
  decisions/
    adr/
      .gitkeep (0 lines)
    ai/
      .gitkeep (0 lines)
    architecture/
      .gitkeep (0 lines)
    data/
      .gitkeep (0 lines)
    domain/
      .gitkeep (0 lines)
    meta/
      .gitkeep (0 lines)
    platform/
      .gitkeep (0 lines)
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
        AGENTS.md (8 lines)
        README.md (10 lines)
        upload-parse-to-task-flow.md (77 lines)
    modules/
      feature/
        AGENTS.md (8 lines)
        notebooklm-source-processing-task-flow.md (86 lines)
        py-fn-ts-capability-bridge.md (377 lines)
        README.md (12 lines)
        workspace-nav-notion-notebooklm-implementation-guide.md (215 lines)
  structure/
    ai/
      .gitkeep (0 lines)
    contexts/
      ai/
        AGENTS.md (93 lines)
        bounded-contexts.md (61 lines)
        context-map.md (50 lines)
        cross-runtime-contracts.md (99 lines)
        ddd-strategic-design.md (53 lines)
        README.md (76 lines)
        subdomains.md (96 lines)
        ubiquitous-language.md (49 lines)
      analytics/
        AGENTS.md (65 lines)
        bounded-contexts.md (11 lines)
        context-map.md (16 lines)
        README.md (27 lines)
        subdomains.md (20 lines)
        ubiquitous-language.md (15 lines)
      billing/
        AGENTS.md (65 lines)
        bounded-contexts.md (11 lines)
        context-map.md (14 lines)
        README.md (27 lines)
        subdomains.md (18 lines)
        ubiquitous-language.md (15 lines)
      iam/
        AGENTS.md (71 lines)
        bounded-contexts.md (12 lines)
        context-map.md (16 lines)
        README.md (42 lines)
        subdomains.md (28 lines)
        ubiquitous-language.md (17 lines)
      notebooklm/
        AGENTS.md (89 lines)
        bounded-contexts.md (76 lines)
        context-map.md (77 lines)
        README.md (110 lines)
        subdomains.md (68 lines)
        ubiquitous-language.md (93 lines)
      notion/
        AGENTS.md (109 lines)
        bounded-contexts.md (78 lines)
        context-map.md (78 lines)
        README.md (117 lines)
        subdomains.md (72 lines)
        ubiquitous-language.md (93 lines)
      platform/
        AGENTS.md (105 lines)
        bounded-contexts.md (93 lines)
        context-map.md (78 lines)
        README.md (131 lines)
        subdomains.md (89 lines)
        ubiquitous-language.md (140 lines)
      workspace/
        AGENTS.md (97 lines)
        bounded-contexts.md (91 lines)
        context-map.md (77 lines)
        README.md (126 lines)
        subdomains.md (80 lines)
        ubiquitous-language.md (119 lines)
      _template.md (143 lines)
    data/
      .gitkeep (0 lines)
    domain/
      bounded-context-subdomain-template.md (203 lines)
      bounded-contexts.md (88 lines)
      ddd-strategic-design.md (221 lines)
      event-driven-design.md (191 lines)
      subdomains.md (273 lines)
      ubiquitous-language.md (166 lines)
    modules/
      .gitkeep (0 lines)
    system/
      architecture-overview.md (135 lines)
      context-map.md (121 lines)
      hard-rules-consolidated.md (415 lines)
      integration-guidelines.md (110 lines)
      module-graph.system-wide.md (134 lines)
      project-delivery-milestones.md (109 lines)
      source-to-task-flow.md (100 lines)
      strategic-patterns.md (79 lines)
      ui-ux-closed-loop.md (134 lines)
    templates/
      .gitkeep (0 lines)
  tooling/
    ci-cd/
      .gitkeep (0 lines)
    cli/
      .gitkeep (0 lines)
    firebase/
      firebase-architecture.md (197 lines)
    firestore/
      .gitkeep (0 lines)
    genkit/
      genkit-flow-standards.md (229 lines)
    nextjs/
      state-machine-model.md (186 lines)
    commands-reference.md (57 lines)
    knowledge-base-reference.md (41 lines)
  AGENTS.md (39 lines)
  README.md (156 lines)
fn/
  src/
    app/
      bootstrap/
        __init__.py (7 lines)
      container/
        __init__.py (0 lines)
        runtime_dependencies.py (7 lines)
      __init__.py (0 lines)
    application/
      dto/
        __init__.py (3 lines)
        chunk_job.py (31 lines)
        embedding_job.py (24 lines)
        rag.py (27 lines)
      ports/
        input/
          __init__.py (0 lines)
        output/
          __init__.py (0 lines)
          gateways.py (3 lines)
        __init__.py (0 lines)
      services/
        __init__.py (0 lines)
        authorization.py (1 lines)
        document_pipeline.py (5 lines)
        rag_query_effects.py (3 lines)
      use_cases/
        __init__.py (3 lines)
        parse_document_command.py (4 lines)
        parse_document_pipeline.py (89 lines)
        rag_ingestion.py (52 lines)
        rag_query.py (46 lines)
        rag_reindex_command.py (4 lines)
        rag_reindex.py (68 lines)
      __init__.py (0 lines)
    core/
      __init__.py (0 lines)
      auth_errors.py (7 lines)
      config.py (73 lines)
      storage_uri.py (3 lines)
    domain/
      events/
        __init__.py (0 lines)
      exceptions/
        __init__.py (0 lines)
      repositories/
        __init__.py (3 lines)
        rag.py (172 lines)
      services/
        __init__.py (3 lines)
        po_extraction.py (169 lines)
        rag_ingestion_text.py (63 lines)
        rag_result_filter.py (55 lines)
      value_objects/
        __init__.py (3 lines)
        rag.py (62 lines)
      __init__.py (0 lines)
    infrastructure/
      audit/
        __init__.py (0 lines)
        qstash.py (3 lines)
      cache/
        __init__.py (0 lines)
        rag_query_cache.py (8 lines)
      external/
        documentai/
          __init__.py (0 lines)
          client.py (138 lines)
        openai/
          __init__.py (0 lines)
          client.py (16 lines)
          embeddings.py (36 lines)
          llm.py (18 lines)
          rag_query.py (3 lines)
        upstash/
          __init__.py (0 lines)
          _base.py (18 lines)
          clients.py (13 lines)
          qstash_client.py (33 lines)
          rag_query.py (3 lines)
          redis_client.py (41 lines)
          search_client.py (99 lines)
          vector_client.py (70 lines)
        __init__.py (0 lines)
      gateways/
        __init__.py (0 lines)
        authorization_gateway.py (19 lines)
        document_artifact_gateway.py (17 lines)
        document_parser_gateway.py (21 lines)
        document_rate_limit_gateway.py (3 lines)
        document_status_gateway.py (7 lines)
        rag_ingestion_gateway.py (22 lines)
        rag_query_effects_gateway.py (5 lines)
        rag_query_gateway.py (15 lines)
      persistence/
        firestore/
          __init__.py (0 lines)
          document_repository.py (129 lines)
        storage/
          __init__.py (0 lines)
          client.py (104 lines)
        __init__.py (0 lines)
      __init__.py (0 lines)
    interface/
      handlers/
        __init__.py (1 lines)
        _https_helpers.py (38 lines)
        https.py (12 lines)
        parse_document.py (21 lines)
        rag_query_handler.py (25 lines)
        rag_reindex_handler.py (18 lines)
        storage.py (81 lines)
      schemas/
        __init__.py (0 lines)
        parse_document.py (61 lines)
        rag_query.py (71 lines)
        rag_reindex.py (42 lines)
      __init__.py (0 lines)
  .env.example (65 lines)
  AGENTS.md (180 lines)
  main.py (41 lines)
  README.md (207 lines)
  requirements-dev.txt (3 lines)
  requirements.txt (23 lines)
packages/
  infra/
    client-state/
      AGENTS.md (52 lines)
      index.ts (15 lines)
      README.md (38 lines)
    date/
      AGENTS.md (56 lines)
      index.ts (27 lines)
      README.md (57 lines)
    form/
      AGENTS.md (78 lines)
      index.ts (20 lines)
      README.md (120 lines)
    http/
      AGENTS.md (53 lines)
      index.ts (34 lines)
      README.md (57 lines)
    query/
      AGENTS.md (56 lines)
      index.ts (20 lines)
      README.md (59 lines)
    serialization/
      AGENTS.md (52 lines)
      index.ts (45 lines)
      README.md (39 lines)
    state/
      AGENTS.md (54 lines)
      index.ts (37 lines)
      README.md (94 lines)
    table/
      AGENTS.md (75 lines)
      index.ts (17 lines)
      README.md (143 lines)
    trpc/
      AGENTS.md (54 lines)
      index.ts (4 lines)
      README.md (55 lines)
    uuid/
      AGENTS.md (62 lines)
      index.ts (14 lines)
      README.md (44 lines)
    virtual/
      AGENTS.md (84 lines)
      index.ts (18 lines)
      README.md (137 lines)
    zod/
      AGENTS.md (53 lines)
      index.ts (28 lines)
      README.md (76 lines)
    AGENTS.md (32 lines)
    README.md (30 lines)
  integration-ai/
    AGENTS.md (65 lines)
    genkit.ts (41 lines)
    index.ts (57 lines)
    README.md (89 lines)
  integration-firebase/
    AGENTS.md (88 lines)
    auth.ts (14 lines)
    client.ts (6 lines)
    firestore.ts (29 lines)
    functions.ts (9 lines)
    index.ts (4 lines)
    README.md (99 lines)
    storage.ts (19 lines)
  integration-queue/
    AGENTS.md (61 lines)
    index.ts (136 lines)
    README.md (86 lines)
  ui-components/
    AGENTS.md (54 lines)
    index.ts (33 lines)
    README.md (50 lines)
  ui-dnd/
    AGENTS.md (80 lines)
    index.ts (28 lines)
    README.md (169 lines)
  ui-editor/
    AGENTS.md (61 lines)
    index.ts (76 lines)
    README.md (84 lines)
  ui-markdown/
    AGENTS.md (53 lines)
    index.tsx (13 lines)
    README.md (38 lines)
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
    AGENTS.md (92 lines)
    index.ts (11 lines)
    README.md (109 lines)
  ui-vis/
    AGENTS.md (85 lines)
    index.ts (26 lines)
    README.md (42 lines)
  ui-visualization/
    AGENTS.md (53 lines)
    index.tsx (101 lines)
    README.md (105 lines)
  AGENTS.md (37 lines)
  index.ts (53 lines)
  README.md (30 lines)
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
    AGENTS.md (23 lines)
    globals.css (47 lines)
    layout.tsx (10 lines)
    README.md (14 lines)
  modules/
    ai/
      orchestration/
        AiFacade.ts (24 lines)
        index.ts (0 lines)
      prompts/
        registry/
          GenkitPromptRegistry.ts (19 lines)
          InMemoryPromptRegistry.ts (19 lines)
          prompt-loader.ts (4 lines)
          prompt-types.ts (10 lines)
          PromptRegistry.ts (11 lines)
        versions.ts (1 lines)
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
          prompts/
            generate-text.prompt.ts (6 lines)
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
            ports/
              AiOrchestrationPort.ts (15 lines)
            index.ts (0 lines)
          infrastructure/
            prompts/
              synthesis.prompt (19 lines)
            GenkitAiOrchestrationAdapter.ts (9 lines)
            index.ts (0 lines)
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
          prompts/
            query-expansion.prompt.ts (6 lines)
        safety/
          adapters/
            inbound/
              index.ts (1 lines)
            outbound/
              index.ts (1 lines)
          application/
            use-cases/
              SafetyUseCases.ts (18 lines)
            index.ts (0 lines)
          domain/
            entities/
              SafetyCheckResult.ts (41 lines)
            index.ts (0 lines)
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
      AGENTS.md (48 lines)
      index.ts (28 lines)
      README.md (34 lines)
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
      AGENTS.md (43 lines)
      index.ts (18 lines)
      README.md (30 lines)
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
      AGENTS.md (39 lines)
      index.ts (10 lines)
      README.md (26 lines)
    iam/
      adapters/
        inbound/
          react/
            AuthContext.tsx (67 lines)
            IamSessionProvider.tsx (9 lines)
            index.ts (8 lines)
            PublicLandingView.tsx (31 lines)
        outbound/
          firebase-composition.ts (169 lines)
          FirebaseAccountQueryRepository.ts (92 lines)
          FirebaseAuthIdentityRepository.ts (52 lines)
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
                AccountController.ts (33 lines)
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
                IdentityController.ts (23 lines)
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
              OrganizationMemberUseCases.ts (28 lines)
              OrganizationTeamUseCases.ts (22 lines)
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
              SecurityPolicyUseCases.ts (14 lines)
            index.ts (0 lines)
          domain/
            index.ts (69 lines)
        session/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemorySessionRepository.ts (11 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              SessionUseCases.ts (20 lines)
            index.ts (0 lines)
          domain/
            index.ts (63 lines)
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
            index.ts (60 lines)
      AGENTS.md (46 lines)
      index.ts (97 lines)
      README.md (33 lines)
    notebooklm/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotebooklmAiChatSection.tsx (25 lines)
            NotebooklmNotebookSection.tsx (18 lines)
            NotebooklmResearchSection.tsx (28 lines)
            NotebooklmSourcesSection.tsx (178 lines)
          server-actions/
            document-actions.ts (77 lines)
            notebook-actions.ts (27 lines)
            source-processing-actions.ts (43 lines)
        outbound/
          callable/
            FirebaseCallableAdapter.ts (79 lines)
          firebase-composition.ts (119 lines)
          TaskMaterializationWorkflowAdapter.ts (49 lines)
      infrastructure/
        ai/
          synthesis.flow.ts (7 lines)
      orchestration/
        index.ts (2 lines)
        ProcessSourceDocumentWorkflowUseCase.ts (100 lines)
        TaskMaterializationWorkflowPort.ts (44 lines)
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
        source/
          adapters/
            inbound/
              index.ts (1 lines)
            outbound/
              firestore/
                FirestoreIngestionSourceRepository.ts (119 lines)
              memory/
                InMemoryIngestionSourceRepository.ts (14 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            use-cases/
              IngestionSourceUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              IngestionSource.ts (117 lines)
            repositories/
              IngestionSourceRepository.ts (24 lines)
            index.ts (0 lines)
        synthesis/
          adapters/
            inbound/
              index.ts (1 lines)
            outbound/
              index.ts (1 lines)
          application/
            use-cases/
              RunSynthesisUseCase.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              SynthesisResult.ts (33 lines)
            ports/
              SynthesisPort.ts (8 lines)
            index.ts (0 lines)
      AGENTS.md (41 lines)
      index.ts (14 lines)
      README.md (27 lines)
    notion/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotionDatabaseSection.tsx (41 lines)
            NotionKnowledgeSection.tsx (21 lines)
            NotionPagesSection.tsx (44 lines)
            NotionTemplatesSection.tsx (25 lines)
          server-actions/
            database-actions.ts (14 lines)
            page-actions.ts (18 lines)
            template-actions.ts (15 lines)
        outbound/
          firebase-composition.ts (76 lines)
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
              firestore/
                FirestoreDatabaseRepository.ts (34 lines)
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
              Database.ts (63 lines)
            repositories/
              DatabaseRepository.ts (15 lines)
            index.ts (0 lines)
        knowledge/
          adapters/
            inbound/
              index.ts (1 lines)
            outbound/
              memory/
                InMemoryKnowledgeArtifactRepository.ts (12 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            use-cases/
              KnowledgeArtifactUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              KnowledgeArtifact.ts (72 lines)
            repositories/
              KnowledgeArtifactRepository.ts (23 lines)
            index.ts (0 lines)
        page/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              firestore/
                FirestorePageRepository.ts (38 lines)
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
              Page.ts (70 lines)
            repositories/
              PageRepository.ts (26 lines)
            index.ts (0 lines)
        template/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              memory/
                InMemoryTemplateRepository.ts (13 lines)
              index.ts (2 lines)
            index.ts (1 lines)
          application/
            use-cases/
              TemplateUseCases.ts (21 lines)
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
      AGENTS.md (44 lines)
      index.ts (57 lines)
      README.md (30 lines)
    platform/
      adapters/
        inbound/
          react/
            shell/
              AccountSwitcher.tsx (52 lines)
              CreateOrganizationDialog.tsx (35 lines)
              index.ts (6 lines)
              shell-quick-create.ts (22 lines)
              ShellAppRail.tsx (87 lines)
              ShellContextNavSection.tsx (36 lines)
              ShellDashboardSidebar.tsx (58 lines)
              ShellGuard.tsx (30 lines)
              ShellLanguageSwitcher.tsx (44 lines)
              ShellRootLayout.tsx (58 lines)
              ShellSidebarBody.tsx (56 lines)
              ShellSidebarHeader.tsx (21 lines)
              ShellSidebarNavData.tsx (57 lines)
              ShellThemeToggle.tsx (15 lines)
              ShellUserAvatar.tsx (33 lines)
            AccountScopeProvider.tsx (28 lines)
            AppContext.tsx (106 lines)
            index.ts (6 lines)
            platform-ui-stubs.tsx (203 lines)
            PlatformBootstrap.tsx (21 lines)
            ShellFrame.tsx (6 lines)
            useAccountRouteContext.ts (77 lines)
            useAccountScope.ts (8 lines)
          server-actions/
            file-actions.ts (14 lines)
        outbound/
          firebase-composition.ts (72 lines)
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
        audit-log/
          adapters/
            inbound/
              index.ts (1 lines)
            outbound/
              memory/
                InMemoryAuditLogRepository.ts (8 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            use-cases/
              AuditLogUseCases.ts (16 lines)
            index.ts (0 lines)
          domain/
            entities/
              AuditLogEntry.ts (60 lines)
            repositories/
              AuditLogRepository.ts (22 lines)
            index.ts (0 lines)
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
        feature-flag/
          adapters/
            inbound/
              index.ts (1 lines)
            outbound/
              memory/
                InMemoryFeatureFlagRepository.ts (12 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            use-cases/
              FeatureFlagUseCases.ts (22 lines)
            index.ts (0 lines)
          domain/
            entities/
              FeatureFlag.ts (63 lines)
            repositories/
              FeatureFlagRepository.ts (22 lines)
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
      AGENTS.md (44 lines)
      index.ts (8 lines)
      README.md (31 lines)
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
              TemplateCreatedEvent.ts (13 lines)
              TemplateUpdatedEvent.ts (13 lines)
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
              GenerationCompletedEvent.ts (13 lines)
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
              IngestionJob.ts (46 lines)
            events/
              IngestionJobEvents.ts (24 lines)
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
              TemplateWorkflow.ts (59 lines)
            events/
              WorkflowEvents.ts (40 lines)
            repositories/
              TemplateWorkflowRepository.ts (13 lines)
            services/
              WorkflowDomainService.ts (10 lines)
            value-objects/
              WorkflowId.ts (16 lines)
            index.ts (0 lines)
      AGENTS.md (40 lines)
      index.ts (20 lines)
      README.md (27 lines)
    workspace/
      adapters/
        inbound/
          react/
            account-scoped-workspace.ts (13 lines)
            AccountRouteDispatcher.tsx (66 lines)
            index.ts (6 lines)
            useWorkspaceScope.ts (8 lines)
            workspace-audit-filter.ts (5 lines)
            workspace-nav-model.ts (174 lines)
            workspace-route-screens.tsx (84 lines)
            workspace-schedule-datetime.ts (5 lines)
            workspace-shell-interop.tsx (166 lines)
            workspace-ui-stubs.tsx (18 lines)
            WorkspaceAccountDailySection.tsx (19 lines)
            WorkspaceApprovalSection.tsx (41 lines)
            WorkspaceAuditSection.tsx (23 lines)
            WorkspaceContext.tsx (47 lines)
            WorkspaceDailySection.tsx (97 lines)
            WorkspaceFilesSection.tsx (65 lines)
            WorkspaceIssuesSection.tsx (115 lines)
            WorkspaceMembersSection.tsx (32 lines)
            WorkspaceOverviewSection.tsx (72 lines)
            WorkspaceQualitySection.tsx (30 lines)
            WorkspaceScheduleSection.tsx (15 lines)
            WorkspaceScopeProvider.tsx (39 lines)
            WorkspaceSettingsSection.tsx (26 lines)
            WorkspaceSettlementSection.tsx (31 lines)
            WorkspaceTaskFormationSection.tsx (68 lines)
            WorkspaceTasksSection.tsx (47 lines)
          server-actions/
            approval-actions.ts (12 lines)
            audit-actions.ts (12 lines)
            issue-actions.ts (16 lines)
            membership-actions.ts (12 lines)
            quality-actions.ts (12 lines)
            schedule-actions.ts (15 lines)
            settlement-actions.ts (17 lines)
            task-actions.ts (14 lines)
        outbound/
          firebase-composition.ts (202 lines)
          FirebaseWorkspaceQueryRepository.ts (61 lines)
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
              firestore/
                FirestoreApprovalDecisionRepository.ts (28 lines)
              index.ts (1 lines)
            index.ts (0 lines)
          application/
            use-cases/
              ApprovalUseCases.ts (26 lines)
            index.ts (0 lines)
          domain/
            entities/
              ApprovalDecision.ts (44 lines)
            events/
              ApprovalDomainEvent.ts (38 lines)
            repositories/
              ApprovalDecisionRepository.ts (15 lines)
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
              AuditUseCases.ts (15 lines)
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
              server-actions/
                feed-actions.ts (14 lines)
              index.ts (3 lines)
            outbound/
              firestore/
                FirestoreFeedRepository.ts (42 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              FeedDTO.ts (11 lines)
            use-cases/
              FeedUseCases.ts (28 lines)
            index.ts (0 lines)
          domain/
            entities/
              FeedPost.ts (61 lines)
            events/
              FeedDomainEvent.ts (13 lines)
            repositories/
              FeedPostRepository.ts (19 lines)
            index.ts (0 lines)
          README.md (64 lines)
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
                FirestoreIssueRepository.ts (48 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              IssueDTO.ts (6 lines)
            machines/
              issueLifecycle.machine.ts (32 lines)
            use-cases/
              IssueUseCases.ts (23 lines)
            index.ts (0 lines)
          domain/
            entities/
              Issue.ts (50 lines)
            events/
              IssueDomainEvent.ts (52 lines)
            repositories/
              IssueRepository.ts (25 lines)
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
              WorkspaceLifecycleUseCases.ts (53 lines)
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
                MembershipController.ts (18 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreMemberRepository.ts (28 lines)
              permission/
                FirestorePermissionCheckAdapter.ts (22 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              MembershipDTO.ts (5 lines)
            ports/
              PermissionCheckPort.ts (16 lines)
            use-cases/
              MembershipUseCases.ts (26 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceMember.ts (46 lines)
            events/
              MembershipDomainEvent.ts (20 lines)
            repositories/
              WorkspaceMemberRepository.ts (15 lines)
            value-objects/
              WorkspaceRolePolicy.ts (13 lines)
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
              settlement-lifecycle.machine.ts (12 lines)
              task-lifecycle.machine.ts (59 lines)
            sagas/
              TaskLifecycleSaga.ts (39 lines)
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
              firestore/
                FirestoreQualityReviewRepository.ts (28 lines)
              index.ts (1 lines)
            index.ts (0 lines)
          application/
            use-cases/
              QualityUseCases.ts (26 lines)
            index.ts (0 lines)
          domain/
            entities/
              QualityReview.ts (45 lines)
            events/
              QualityDomainEvent.ts (38 lines)
            repositories/
              QualityReviewRepository.ts (15 lines)
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
              ResourceQuotaRepository.ts (18 lines)
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
              ScheduleUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkDemand.ts (50 lines)
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
                FirestoreInvoiceRepository.ts (33 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              SettlementDTO.ts (5 lines)
            use-cases/
              CreateInvoiceFromAcceptedTasksUseCase.ts (20 lines)
              SettlementUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              Invoice.ts (54 lines)
            events/
              InvoiceDomainEvent.ts (20 lines)
            repositories/
              InvoiceRepository.ts (13 lines)
            services/
              InvoiceCalculationService.ts (29 lines)
            value-objects/
              InvoiceStatus.ts (5 lines)
              LineItem.ts (15 lines)
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
              Task.ts (71 lines)
            events/
              TaskDomainEvent.ts (41 lines)
            repositories/
              TaskRepository.ts (16 lines)
            value-objects/
              TaskId.ts (5 lines)
              TaskStatus.ts (25 lines)
            index.ts (0 lines)
        task-formation/
          adapters/
            inbound/
              server-actions/
                task-formation-actions.ts (32 lines)
              index.ts (0 lines)
            outbound/
              callable/
                FirebaseCallableTaskCandidateExtractor.ts (69 lines)
              firestore/
                FirestoreTaskFormationJobRepository.ts (30 lines)
              genkit/
                GenkitTaskCandidateExtractor.ts (45 lines)
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
          AGENTS.md (166 lines)
          README.md (220 lines)
      AGENTS.md (54 lines)
      index.ts (14 lines)
      README.md (40 lines)
apphosting.yaml (64 lines)
components.json (25 lines)
eslint.config.mjs (9 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (437 lines)
firestore.rules (40 lines)
llms.txt (82 lines)
next.config.ts (7 lines)
package.json (130 lines)
postcss.config.mjs (0 lines)
storage.rules (20 lines)
tailwind.config.ts (2 lines)
tsconfig.json (62 lines)
```