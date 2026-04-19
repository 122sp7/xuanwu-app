# Directory Structure

```
.github/
  copilot-instructions.md (119 lines)
docs/
  decisions/
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
        py-fn-ts-capability-bridge.md (387 lines)
        README.md (12 lines)
        workspace-nav-notion-notebooklm-implementation-guide.md (241 lines)
  structure/
    ai/
      .gitkeep (0 lines)
    contexts/
      ai/
        AGENTS.md (93 lines)
        bounded-contexts.md (61 lines)
        context-map.md (50 lines)
        cross-runtime-contracts.md (99 lines)
        ddd-strategic-design.md (118 lines)
        README.md (76 lines)
        subdomains.md (96 lines)
        ubiquitous-language.md (49 lines)
      analytics/
        AGENTS.md (82 lines)
        bounded-contexts.md (11 lines)
        context-map.md (16 lines)
        README.md (27 lines)
        subdomains.md (20 lines)
        ubiquitous-language.md (15 lines)
      billing/
        AGENTS.md (82 lines)
        bounded-contexts.md (11 lines)
        context-map.md (14 lines)
        README.md (27 lines)
        subdomains.md (18 lines)
        ubiquitous-language.md (15 lines)
      iam/
        AGENTS.md (88 lines)
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
      bounded-contexts.md (272 lines)
      ddd-strategic-design.md (218 lines)
      event-driven-design.md (189 lines)
      subdomains.md (273 lines)
      ubiquitous-language.md (166 lines)
    modules/
      .gitkeep (0 lines)
    system/
      architecture-overview.md (135 lines)
      context-map.md (121 lines)
      hard-rules-consolidated.md (414 lines)
      integration-guidelines.md (110 lines)
      module-graph.system-wide.md (134 lines)
      project-delivery-milestones.md (109 lines)
      source-to-task-flow.md (94 lines)
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
    commands-reference.md (54 lines)
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
        runtime_dependencies.py (41 lines)
      __init__.py (0 lines)
    application/
      dto/
        __init__.py (3 lines)
        chunk_job.py (31 lines)
        embedding_job.py (24 lines)
        rag.py (11 lines)
      ports/
        input/
          __init__.py (0 lines)
        output/
          __init__.py (0 lines)
          gateways.py (3 lines)
        __init__.py (0 lines)
      services/
        __init__.py (0 lines)
        document_pipeline.py (1 lines)
      use_cases/
        __init__.py (3 lines)
        rag_ingestion.py (44 lines)
        rag_query.py (46 lines)
      __init__.py (0 lines)
    core/
      __init__.py (0 lines)
      config.py (71 lines)
    domain/
      events/
        __init__.py (0 lines)
      exceptions/
        __init__.py (0 lines)
      repositories/
        __init__.py (3 lines)
        rag.py (61 lines)
      services/
        __init__.py (3 lines)
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
          search_client.py (73 lines)
          vector_client.py (40 lines)
        __init__.py (0 lines)
      persistence/
        firestore/
          __init__.py (0 lines)
          document_repository.py (89 lines)
        storage/
          __init__.py (0 lines)
          client.py (68 lines)
        __init__.py (0 lines)
      __init__.py (0 lines)
    interface/
      handlers/
        __init__.py (1 lines)
        _https_helpers.py (40 lines)
        https.py (12 lines)
        parse_document.py (36 lines)
        rag_query_handler.py (23 lines)
        rag_reindex_handler.py (39 lines)
        storage.py (100 lines)
      schemas/
        __init__.py (0 lines)
        parse_document.py (58 lines)
        rag_query.py (71 lines)
        rag_reindex.py (42 lines)
      __init__.py (0 lines)
  tests/
    __init__.py (0 lines)
    conftest.py (1 lines)
    test_domain_repository_gateways.py (47 lines)
    test_input_schemas.py (59 lines)
    test_rag_ingestion_text.py (24 lines)
  AGENTS.md (137 lines)
  main.py (41 lines)
  README.md (212 lines)
  requirements-dev.txt (3 lines)
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
    AGENTS.md (23 lines)
    globals.css (47 lines)
    layout.tsx (10 lines)
    README.md (19 lines)
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
      AGENTS.md (76 lines)
      index.ts (26 lines)
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
      AGENTS.md (51 lines)
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
      AGENTS.md (46 lines)
      index.ts (10 lines)
      README.md (57 lines)
    iam/
      index.ts (97 lines)
    notebooklm/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotebooklmAiChatSection.tsx (25 lines)
            NotebooklmNotebookSection.tsx (18 lines)
            NotebooklmResearchSection.tsx (28 lines)
            NotebooklmSourcesSection.tsx (56 lines)
          server-actions/
            document-actions.ts (30 lines)
            notebook-actions.ts (27 lines)
            source-processing-actions.ts (43 lines)
        outbound/
          callable/
            FirebaseCallableAdapter.ts (59 lines)
          firebase-composition.ts (71 lines)
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
        document/
          adapters/
            inbound/
              index.ts (2 lines)
            outbound/
              firestore/
                FirestoreDocumentRepository.ts (94 lines)
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
      AGENTS.md (59 lines)
      index.ts (12 lines)
      README.md (70 lines)
    notion/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotionDatabaseSection.tsx (25 lines)
            NotionKnowledgeSection.tsx (21 lines)
            NotionPagesSection.tsx (28 lines)
            NotionTemplatesSection.tsx (17 lines)
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
      AGENTS.md (62 lines)
      index.ts (16 lines)
      README.md (60 lines)
    platform/
      adapters/
        inbound/
          react/
            shell/
              AccountSwitcher.tsx (52 lines)
              CreateOrganizationDialog.tsx (35 lines)
              index.ts (6 lines)
              shell-quick-create.ts (22 lines)
              ShellAppRail.tsx (86 lines)
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
      AGENTS.md (58 lines)
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
              template-state-model.test.ts (5 lines)
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
      AGENTS.md (99 lines)
      index.ts (20 lines)
      README.md (266 lines)
    workspace/
      adapters/
        inbound/
          react/
            account-scoped-workspace.ts (13 lines)
            AccountRouteDispatcher.test.ts (11 lines)
            AccountRouteDispatcher.tsx (67 lines)
            index.ts (6 lines)
            useWorkspaceScope.ts (8 lines)
            workspace-nav-model.ts (174 lines)
            workspace-route-screens.tsx (82 lines)
            workspace-shell-interop.tsx (166 lines)
            workspace-ui-stubs.tsx (18 lines)
            WorkspaceApprovalSection.tsx (41 lines)
            WorkspaceAuditSection.tsx (18 lines)
            WorkspaceContext.tsx (47 lines)
            WorkspaceDailySection.tsx (90 lines)
            WorkspaceFilesSection.tsx (65 lines)
            WorkspaceIssuesSection.tsx (115 lines)
            WorkspaceMembersSection.tsx (18 lines)
            WorkspaceOverviewSection.tsx (72 lines)
            WorkspaceQualitySection.tsx (30 lines)
            WorkspaceScheduleSection.tsx (18 lines)
            WorkspaceScopeProvider.tsx (39 lines)
            WorkspaceSettingsSection.tsx (26 lines)
            WorkspaceSettlementSection.tsx (31 lines)
            WorkspaceTaskFormationSection.tsx (66 lines)
            WorkspaceTasksSection.tsx (47 lines)
          server-actions/
            approval-actions.ts (12 lines)
            audit-actions.ts (12 lines)
            issue-actions.ts (16 lines)
            quality-actions.ts (12 lines)
            schedule-actions.ts (15 lines)
            settlement-actions.ts (14 lines)
            task-actions.ts (14 lines)
        outbound/
          firebase-composition.ts (159 lines)
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
                feed-actions.ts (17 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreFeedRepository.ts (42 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              FeedDTO.ts (7 lines)
            use-cases/
              FeedUseCases.ts (20 lines)
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
              issueLifecycle.machine.ts (36 lines)
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
              WorkspaceLifecycleUseCases.test.ts (30 lines)
              WorkspaceLifecycleUseCases.ts (36 lines)
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
              MembershipUseCases.ts (23 lines)
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
                FirestoreInvoiceRepository.ts (29 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              SettlementDTO.ts (5 lines)
            use-cases/
              CreateInvoiceFromAcceptedTasksUseCase.ts (17 lines)
              SettlementUseCases.ts (17 lines)
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
                FirebaseCallableTaskCandidateExtractor.ts (17 lines)
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
      AGENTS.md (75 lines)
      index.ts (14 lines)
      README.md (85 lines)
apphosting.yaml (64 lines)
components.json (25 lines)
eslint.config.mjs (9 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (437 lines)
llms.txt (82 lines)
next.config.ts (7 lines)
package.json (127 lines)
postcss.config.mjs (0 lines)
tailwind.config.ts (2 lines)
tsconfig.json (62 lines)
```