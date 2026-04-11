# Directory Structure

```
.github/
  agents/
    ai-genkit-lead.agent.md (41 lines)
    app-router.agent.md (48 lines)
    chunk-strategist.agent.md (35 lines)
    commands.md (54 lines)
    doc-ingest.agent.md (36 lines)
    domain-architect.agent.md (68 lines)
    domain-lead.agent.md (46 lines)
    e2e-qa.agent.md (46 lines)
    embedding-writer.agent.md (35 lines)
    firestore-schema.agent.md (33 lines)
    frontend-lead.agent.md (37 lines)
    genkit-flow.agent.md (41 lines)
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
    test-scenario-writer.agent.md (33 lines)
    ts-interface-writer.agent.md (39 lines)
  instructions/
    architecture-api-boundary.instructions.md (34 lines)
    architecture-hexagonal-ddd.instructions.md (34 lines)
    architecture-modules.instructions.md (37 lines)
    architecture-monorepo.instructions.md (32 lines)
    bounded-context-rules.instructions.md (28 lines)
    branching-strategy.instructions.md (19 lines)
    ci-cd.instructions.md (20 lines)
    cloud-functions.instructions.md (29 lines)
    commit-convention.instructions.md (19 lines)
    doc-governance.instructions.md (26 lines)
    domain-modeling.instructions.md (124 lines)
    embedding-pipeline.instructions.md (23 lines)
    event-driven-state.instructions.md (107 lines)
    firebase-architecture.instructions.md (26 lines)
    firestore-schema.instructions.md (20 lines)
    genkit-flow.instructions.md (18 lines)
    hosting-deploy.instructions.md (14 lines)
    lint-format.instructions.md (20 lines)
    nextjs-app-router.instructions.md (19 lines)
    nextjs-parallel-routes.instructions.md (17 lines)
    nextjs-server-actions.instructions.md (18 lines)
    playwright-mcp-testing.instructions.md (98 lines)
    prompt-engineering.instructions.md (30 lines)
    rag-architecture.instructions.md (19 lines)
    security-rules.instructions.md (20 lines)
    shadcn-ui.instructions.md (16 lines)
    tailwind-design-system.instructions.md (16 lines)
    testing-e2e.instructions.md (16 lines)
    testing-unit.instructions.md (16 lines)
    ubiquitous-language.instructions.md (38 lines)
  prompts/
    analyze-repo.prompt.md (35 lines)
    chunk-docs.prompt.md (26 lines)
    debug-error.prompt.md (25 lines)
    embedding-docs.prompt.md (19 lines)
    generate-aggregate.prompt.md (50 lines)
    generate-domain-event.prompt.md (58 lines)
    implement-feature.prompt.md (27 lines)
    implement-firestore-schema.prompt.md (18 lines)
    implement-genkit-flow.prompt.md (19 lines)
    implement-security-rules.prompt.md (18 lines)
    implement-server-action.prompt.md (20 lines)
    implement-ui-component.prompt.md (21 lines)
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
    write-docs.prompt.md (18 lines)
    write-e2e-tests.prompt.md (20 lines)
    write-tests.prompt.md (18 lines)
  copilot-instructions.md (53 lines)
app/
  (public)/
    page.tsx (288 lines)
  (shell)/
    ai-chat/
      page.tsx (22 lines)
    dashboard/
      page.tsx (8 lines)
    dev-tools/
      dev-tools-badges.tsx (59 lines)
      dev-tools-helpers.ts (117 lines)
      dev-tools-parsed-docs-section.tsx (122 lines)
      page.tsx (475 lines)
      use-dev-tools-doc-list.ts (203 lines)
    knowledge/
      block-editor/
        page.tsx (19 lines)
      pages/
        [pageId]/
          page.tsx (21 lines)
        page.tsx (7 lines)
      page.tsx (281 lines)
    knowledge-base/
      articles/
        [articleId]/
          page.tsx (21 lines)
        page.tsx (7 lines)
      page.tsx (5 lines)
    knowledge-database/
      databases/
        [databaseId]/
          forms/
            page.tsx (21 lines)
          page.tsx (21 lines)
        page.tsx (7 lines)
      page.tsx (5 lines)
    notebook/
      rag-query/
        page.tsx (27 lines)
      page.tsx (5 lines)
    organization/
      audit/
        page.tsx (17 lines)
      content/
        page.tsx (9 lines)
      daily/
        page.tsx (39 lines)
      members/
        page.tsx (9 lines)
      permissions/
        page.tsx (9 lines)
      schedule/
        dispatcher/
          page.tsx (9 lines)
        page.tsx (40 lines)
      teams/
        page.tsx (9 lines)
      workspaces/
        page.tsx (13 lines)
      _utils.ts (14 lines)
      page.tsx (187 lines)
    settings/
      general/
        page.tsx (8 lines)
      notifications/
        page.tsx (9 lines)
      profile/
        page.tsx (8 lines)
      page.tsx (8 lines)
    source/
      documents/
        page.tsx (53 lines)
      libraries/
        page.tsx (35 lines)
      page.tsx (5 lines)
    workspace/
      [workspaceId]/
        page.tsx (27 lines)
      page.tsx (39 lines)
    workspace-feed/
      page.tsx (36 lines)
    layout.tsx (12 lines)
  globals.css (197 lines)
  layout.tsx (26 lines)
docs/
  contexts/
    notebooklm/
      AGENT.md (98 lines)
      bounded-contexts.md (83 lines)
      context-map.md (75 lines)
      README.md (111 lines)
      subdomains.md (72 lines)
      ubiquitous-language.md (78 lines)
    notion/
      AGENT.md (103 lines)
      bounded-contexts.md (83 lines)
      context-map.md (76 lines)
      README.md (115 lines)
      subdomains.md (75 lines)
      ubiquitous-language.md (78 lines)
    platform/
      AGENT.md (117 lines)
      bounded-contexts.md (85 lines)
      context-map.md (71 lines)
      README.md (125 lines)
      subdomains.md (91 lines)
      ubiquitous-language.md (82 lines)
    workspace/
      AGENT.md (94 lines)
      bounded-contexts.md (83 lines)
      context-map.md (75 lines)
      README.md (107 lines)
      subdomains.md (71 lines)
      ubiquitous-language.md (78 lines)
    _template.md (144 lines)
  decisions/
    0001-hexagonal-architecture.md (80 lines)
    0002-bounded-contexts.md (81 lines)
    0003-context-map.md (79 lines)
    0004-ubiquitous-language.md (79 lines)
    0005-anti-corruption-layer.md (80 lines)
    README.md (68 lines)
  architecture-overview.md (109 lines)
  bounded-context-subdomain-template.md (154 lines)
  bounded-contexts.md (80 lines)
  context-map.md (84 lines)
  integration-guidelines.md (94 lines)
  project-delivery-milestones.md (95 lines)
  README.md (90 lines)
  strategic-patterns.md (81 lines)
  subdomains.md (79 lines)
  ubiquitous-language.md (86 lines)
features/
  README.md (42 lines)
modules/
  notebooklm/
    api/
      factories.ts (2 lines)
      index.ts (79 lines)
      server.ts (12 lines)
    application/
      .gitkeep (0 lines)
    docs/
      aggregates.md (66 lines)
      application-services.md (28 lines)
      bounded-context.md (86 lines)
      context-map.md (27 lines)
      domain-events.md (23 lines)
      domain-services.md (22 lines)
      README.md (39 lines)
      repositories.md (36 lines)
      subdomains.md (56 lines)
      ubiquitous-language.md (30 lines)
    domain/
      .gitkeep (0 lines)
    infrastructure/
      .gitkeep (0 lines)
    interfaces/
      .gitkeep (0 lines)
    subdomains/
      ai/
        api/
          index.ts (85 lines)
          server.ts (20 lines)
        application/
          use-cases/
            answer-rag-query.use-case.ts (123 lines)
            submit-rag-feedback.use-case.ts (50 lines)
            wiki-rag.use-cases.ts (43 lines)
        domain/
          entities/
            generation.entities.ts (47 lines)
            rag-feedback.entities.ts (29 lines)
            rag-query.entities.ts (45 lines)
            retrieval.entities.ts (42 lines)
          events/
            AiDomainEvent.ts (54 lines)
            index.ts (1 lines)
          ports/
            IVectorStore.ts (49 lines)
          repositories/
            IRagGenerationRepository.ts (13 lines)
            IRagQueryFeedbackRepository.ts (12 lines)
            IRagRetrievalRepository.ts (23 lines)
            IWikiContentRepository.ts (76 lines)
          services/
            index.ts (3 lines)
            RagCitationBuilder.ts (17 lines)
            RagPromptBuilder.ts (28 lines)
            RagScoringService.ts (74 lines)
          value-objects/
            index.ts (4 lines)
            OrganizationScope.ts (8 lines)
            RagPrompt.ts (5 lines)
            RelevanceScore.ts (8 lines)
            TopK.ts (10 lines)
          index.ts (12 lines)
        infrastructure/
          firebase/
            FirebaseRagQueryFeedbackAdapter.ts (104 lines)
            FirebaseRagRetrievalAdapter.ts (131 lines)
            FirebaseWikiContentAdapter.ts (183 lines)
          genkit/
            genkit-ai-client.ts (34 lines)
            GenkitRagGenerationAdapter.ts (85 lines)
        interfaces/
          components/
            RagQueryView.tsx (185 lines)
        README.md (32 lines)
      conversation/
        api/
          factories.ts (5 lines)
          index.ts (24 lines)
        application/
          dto/
            conversation.dto.ts (5 lines)
        domain/
          entities/
            message.ts (14 lines)
            thread.ts (13 lines)
          repositories/
            IThreadRepository.ts (10 lines)
        infrastructure/
          firebase/
            FirebaseThreadRepository.ts (67 lines)
        interfaces/
          _actions/
            chat.actions.ts (22 lines)
            thread.actions.ts (12 lines)
          components/
            AiChatPage.tsx (341 lines)
          helpers.ts (35 lines)
        README.md (32 lines)
      conversation-versioning/
        README.md (31 lines)
      evaluation/
        README.md (37 lines)
      grounding/
        README.md (37 lines)
      ingestion/
        README.md (37 lines)
      note/
        README.md (31 lines)
      notebook/
        api/
          factories.ts (5 lines)
          index.ts (11 lines)
          server.ts (11 lines)
        application/
          dto/
            notebook.dto.ts (8 lines)
          use-cases/
            generate-notebook-response.use-case.ts (28 lines)
        domain/
          entities/
            AgentGeneration.ts (17 lines)
          repositories/
            NotebookRepository.ts (8 lines)
        infrastructure/
          genkit/
            client.ts (25 lines)
            GenkitNotebookRepository.ts (36 lines)
        interfaces/
          _actions/
            generate-notebook-response.actions.ts (15 lines)
        README.md (32 lines)
      retrieval/
        README.md (37 lines)
      source/
        api/
          factories.ts (10 lines)
          index.ts (145 lines)
        application/
          dto/
            rag-document.dto.ts (72 lines)
            source-file.dto.ts (71 lines)
            source.dto.ts (6 lines)
          use-cases/
            list-source-files.use-case.ts (40 lines)
            register-rag-document.use-case.ts (86 lines)
            upload-complete-source-file.use-case.ts (133 lines)
            upload-init-source-file.use-case.ts (112 lines)
            wiki-library.helpers.ts (47 lines)
            wiki-library.use-cases.ts (191 lines)
          utils/
            slug-utils.ts (26 lines)
        domain/
          entities/
            RagDocument.ts (62 lines)
            SourceFile.ts (41 lines)
            SourceFileVersion.ts (21 lines)
            SourceRetentionPolicy.ts (14 lines)
            WikiLibrary.ts (60 lines)
          ports/
            ActorContextPort.ts (15 lines)
            OrganizationPolicyPort.ts (22 lines)
            WorkspaceGrantPort.ts (23 lines)
          repositories/
            IRagDocumentRepository.ts (20 lines)
            ISourceFileRepository.ts (21 lines)
            IWikiLibraryRepository.ts (17 lines)
          services/
            complete-upload-source-file.service.ts (24 lines)
            resolve-source-organization-id.service.ts (16 lines)
        infrastructure/
          firebase/
            FirebaseRagDocumentAdapter.ts (169 lines)
            FirebaseSourceFileAdapter.ts (164 lines)
            FirebaseWikiLibraryAdapter.ts (192 lines)
          memory/
            InMemoryWikiLibraryAdapter.ts (67 lines)
        interfaces/
          _actions/
            source-file.actions.ts (94 lines)
            source-processing.actions.ts (102 lines)
          components/
            file-processing-dialog.body.tsx (130 lines)
            file-processing-dialog.parts.tsx (138 lines)
            file-processing-dialog.surface.tsx (85 lines)
            file-processing-dialog.utils.ts (87 lines)
            FileProcessingDialog.tsx (235 lines)
            LibrariesView.tsx (239 lines)
            LibraryTableView.tsx (231 lines)
            SourceDocumentsView.tsx (188 lines)
            WorkspaceFilesTab.tsx (230 lines)
          contracts/
            source-command-result.ts (16 lines)
          hooks/
            useSourceDocumentsSnapshot.ts (179 lines)
          queries/
            source-file.queries.ts (25 lines)
        README.md (33 lines)
      synthesis/
        README.md (35 lines)
    AGENT.md (63 lines)
    README.md (68 lines)
  notion/
    api/
      index.ts (21 lines)
    application/
      .gitkeep (0 lines)
    docs/
      aggregates.md (201 lines)
      application-services.md (153 lines)
      bounded-context.md (98 lines)
      context-map.md (106 lines)
      domain-events.md (113 lines)
      domain-services.md (48 lines)
      README.md (50 lines)
      repositories.md (70 lines)
      subdomains.md (83 lines)
      ubiquitous-language.md (87 lines)
    domain/
      .gitkeep (0 lines)
    infrastructure/
      .gitkeep (0 lines)
    interfaces/
      .gitkeep (0 lines)
    subdomains/
      attachments/
        README.md (32 lines)
      authoring/
        api/
          factories.ts (10 lines)
          index.ts (41 lines)
        application/
          dto/
            ArticleDto.ts (56 lines)
            authoring.dto.ts (6 lines)
            CategoryDto.ts (35 lines)
            index.ts (16 lines)
          use-cases/
            ArticleLifecycleUseCases.ts (91 lines)
            ArticlePublicationUseCases.ts (32 lines)
            ArticleVerificationUseCases.ts (45 lines)
            CategoryUseCases.ts (86 lines)
            index.ts (24 lines)
        domain/
          aggregates/
            Article.ts (150 lines)
            Category.ts (85 lines)
            index.ts (4 lines)
          events/
            AuthoringEvents.ts (38 lines)
            index.ts (9 lines)
            NotionDomainEvent.ts (12 lines)
          repositories/
            IArticleRepository.ts (21 lines)
            ICategoryRepository.ts (14 lines)
            index.ts (4 lines)
          services/
            index.ts (2 lines)
          value-objects/
            index.ts (3 lines)
          index.ts (6 lines)
        infrastructure/
          firebase/
            FirebaseArticleRepository.ts (111 lines)
            FirebaseCategoryRepository.ts (85 lines)
            index.ts (4 lines)
          index.ts (1 lines)
        interfaces/
          _actions/
            article.actions.ts (89 lines)
            category.actions.ts (55 lines)
            index.ts (19 lines)
          components/
            ArticleDetailPage.tsx (298 lines)
            ArticleDialog.tsx (204 lines)
            CategoryTreePanel.tsx (132 lines)
            index.ts (3 lines)
            KnowledgeBaseArticlesRouteScreen.tsx (199 lines)
          queries/
            index.ts (32 lines)
          store/
            index.ts (3 lines)
        README.md (45 lines)
      automation/
        README.md (32 lines)
      collaboration/
        api/
          factories.ts (15 lines)
          index.ts (31 lines)
        application/
          dto/
            collaboration.dto.ts (8 lines)
            CollaborationDto.ts (89 lines)
            index.ts (10 lines)
          use-cases/
            CommentUseCases.ts (76 lines)
            index.ts (3 lines)
            PermissionUseCases.ts (40 lines)
            VersionUseCases.ts (40 lines)
        domain/
          aggregates/
            Comment.ts (34 lines)
            index.ts (3 lines)
            Permission.ts (28 lines)
            Version.ts (23 lines)
          events/
            index.ts (7 lines)
          repositories/
            ICommentRepository.ts (49 lines)
            index.ts (3 lines)
            IPermissionRepository.ts (27 lines)
            IVersionRepository.ts (25 lines)
          services/
            index.ts (3 lines)
          value-objects/
            index.ts (3 lines)
          index.ts (5 lines)
        infrastructure/
          firebase/
            FirebaseCommentRepository.ts (139 lines)
            FirebasePermissionRepository.ts (83 lines)
            FirebaseVersionRepository.ts (81 lines)
            index.ts (3 lines)
          index.ts (1 lines)
        interfaces/
          _actions/
            comment.actions.ts (70 lines)
            index.ts (3 lines)
            permission.actions.ts (28 lines)
            version.actions.ts (28 lines)
          components/
            CommentPanel.tsx (146 lines)
            index.ts (2 lines)
            VersionHistoryPanel.tsx (96 lines)
          queries/
            index.ts (28 lines)
          store/
            index.ts (3 lines)
        README.md (44 lines)
      database/
        api/
          factories.ts (20 lines)
          index.ts (102 lines)
        application/
          dto/
            database.dto.ts (9 lines)
            DatabaseDto.ts (130 lines)
            index.ts (12 lines)
          use-cases/
            AutomationUseCases.ts (48 lines)
            DatabaseUseCases.ts (69 lines)
            index.ts (4 lines)
            RecordUseCases.ts (50 lines)
            ViewUseCases.ts (50 lines)
        domain/
          aggregates/
            Database.ts (45 lines)
            DatabaseAutomation.ts (44 lines)
            DatabaseRecord.ts (21 lines)
            index.ts (4 lines)
            View.ts (41 lines)
          events/
            index.ts (7 lines)
          repositories/
            IAutomationRepository.ts (42 lines)
            IDatabaseRecordRepository.ts (29 lines)
            IDatabaseRepository.ts (42 lines)
            index.ts (4 lines)
            IViewRepository.ts (33 lines)
          services/
            index.ts (4 lines)
          value-objects/
            index.ts (4 lines)
          index.ts (5 lines)
        infrastructure/
          firebase/
            FirebaseAutomationRepository.ts (118 lines)
            FirebaseDatabaseRecordRepository.ts (106 lines)
            FirebaseDatabaseRepository.ts (131 lines)
            FirebaseViewRepository.ts (119 lines)
            index.ts (4 lines)
          index.ts (1 lines)
        interfaces/
          _actions/
            database.actions.ts (154 lines)
            index.ts (15 lines)
          components/
            DatabaseAddFieldDialog.tsx (90 lines)
            DatabaseAutomationView.tsx (181 lines)
            DatabaseBoardView.tsx (137 lines)
            DatabaseCalendarView.tsx (142 lines)
            DatabaseDetailPage.tsx (258 lines)
            DatabaseDialog.tsx (107 lines)
            DatabaseFormsPage.tsx (147 lines)
            DatabaseFormView.tsx (174 lines)
            DatabaseGalleryView.tsx (117 lines)
            DatabaseListView.tsx (163 lines)
            DatabaseTableView.tsx (224 lines)
            index.ts (8 lines)
            KnowledgeDatabasesRouteScreen.tsx (146 lines)
          queries/
            index.ts (33 lines)
          store/
            index.ts (3 lines)
        README.md (55 lines)
      knowledge/
        api/
          factories.ts (15 lines)
          index.ts (84 lines)
        application/
          dto/
            ContentBlockDto.ts (53 lines)
            index.ts (4 lines)
            knowledge.dto.ts (9 lines)
            KnowledgeCollectionDto.ts (59 lines)
            KnowledgePageDto.ts (70 lines)
            KnowledgeWikiDto.ts (49 lines)
          use-cases/
            BacklinkUseCases.ts (41 lines)
            ContentBlockUseCases.ts (95 lines)
            KnowledgeCollectionUseCases.ts (125 lines)
            KnowledgePageAppearanceUseCases.ts (47 lines)
            KnowledgePageReviewUseCases.ts (130 lines)
            KnowledgePageUseCases.ts (183 lines)
            KnowledgeVersionUseCases.ts (15 lines)
        domain/
          aggregates/
            BacklinkIndex.ts (36 lines)
            ContentBlock.ts (141 lines)
            index.ts (11 lines)
            KnowledgeCollection.ts (186 lines)
            KnowledgePage.ts (305 lines)
          events/
            index.ts (3 lines)
            KnowledgeBlockEvents.ts (47 lines)
            KnowledgeCollectionEvents.ts (47 lines)
            KnowledgePageEvents.ts (150 lines)
            NotionDomainEvent.ts (12 lines)
          repositories/
            IBacklinkIndexRepository.ts (26 lines)
            IContentBlockRepository.ts (15 lines)
            IKnowledgeCollectionRepository.ts (14 lines)
            IKnowledgePageRepository.ts (20 lines)
            index.ts (4 lines)
          services/
            BacklinkExtractorService.ts (39 lines)
            index.ts (2 lines)
          value-objects/
            ApprovalState.ts (4 lines)
            BlockContent.ts (134 lines)
            BlockId.ts (12 lines)
            CollectionId.ts (12 lines)
            index.ts (17 lines)
            PageId.ts (12 lines)
            PageStatus.ts (6 lines)
            VerificationState.ts (4 lines)
          index.ts (5 lines)
        infrastructure/
          firebase/
            FirebaseBacklinkIndexRepository.ts (97 lines)
            FirebaseContentBlockRepository.ts (98 lines)
            FirebaseKnowledgeCollectionRepository.ts (68 lines)
            FirebaseKnowledgePageRepository.ts (113 lines)
            index.ts (4 lines)
          index.ts (1 lines)
        interfaces/
          _actions/
            index.ts (29 lines)
            knowledge-block.actions.ts (25 lines)
            knowledge-collection.actions.ts (50 lines)
            knowledge-page.actions.ts (106 lines)
          components/
            BlockEditorView.tsx (76 lines)
            KnowledgePageDetailPage.tsx (245 lines)
            KnowledgePageHeaderWidgets.tsx (212 lines)
            KnowledgePagesRouteScreen.tsx (117 lines)
            KnowledgeSidebarSection.tsx (150 lines)
            PageDialog.tsx (57 lines)
            PageEditorView.tsx (41 lines)
            PageTreeView.tsx (74 lines)
          queries/
            index.ts (52 lines)
          store/
            block-editor.store.ts (100 lines)
        README.md (44 lines)
      knowledge-analytics/
        README.md (32 lines)
      knowledge-integration/
        README.md (32 lines)
      knowledge-versioning/
        README.md (33 lines)
      notes/
        README.md (32 lines)
      publishing/
        README.md (37 lines)
      relations/
        README.md (37 lines)
      taxonomy/
        README.md (37 lines)
      templates/
        README.md (32 lines)
    AGENT.md (101 lines)
    README.md (108 lines)
  platform/
    api/
      contracts.ts (31 lines)
      facade.ts (95 lines)
      index.ts (89 lines)
    application/
      commands/
        ActivateSubscriptionAgreementCommand.ts (18 lines)
        ApplyConfigurationProfileCommand.ts (18 lines)
        EmitObservabilitySignalCommand.ts (18 lines)
        FireWorkflowTriggerCommand.ts (18 lines)
        index.ts (17 lines)
        PublishPolicyCatalogCommand.ts (18 lines)
        RecordAuditSignalCommand.ts (18 lines)
        RegisterIntegrationContractCommand.ts (18 lines)
        RegisterPlatformContextCommand.ts (18 lines)
        RequestNotificationDispatchCommand.ts (18 lines)
      dtos/
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
        index.ts (14 lines)
      event-mappers/
        index.ts (11 lines)
        mapDomainEventToPublishedEvent.ts (18 lines)
        mapExternalEventToPlatformEvent.ts (16 lines)
        mapIngressEventToCommand.ts (19 lines)
      handlers/
        ActivateSubscriptionAgreementHandler.ts (29 lines)
        ApplyConfigurationProfileHandler.ts (29 lines)
        EmitObservabilitySignalHandler.ts (27 lines)
        FireWorkflowTriggerHandler.ts (28 lines)
        GetPlatformContextViewHandler.ts (25 lines)
        GetPolicyCatalogViewHandler.ts (25 lines)
        GetSubscriptionEntitlementsHandler.ts (26 lines)
        GetWorkflowPolicyViewHandler.ts (26 lines)
        index.ts (22 lines)
        ListEnabledCapabilitiesHandler.ts (26 lines)
        PublishPolicyCatalogHandler.ts (28 lines)
        RecordAuditSignalHandler.ts (27 lines)
        RegisterIntegrationContractHandler.ts (29 lines)
        RegisterPlatformContextHandler.ts (29 lines)
        RequestNotificationDispatchHandler.ts (28 lines)
      queries/
        GetPlatformContextViewQuery.ts (18 lines)
        GetPolicyCatalogViewQuery.ts (18 lines)
        GetSubscriptionEntitlementsQuery.ts (18 lines)
        GetWorkflowPolicyViewQuery.ts (18 lines)
        index.ts (13 lines)
        ListEnabledCapabilitiesQuery.ts (18 lines)
      utils/
        assertNever.ts (17 lines)
        buildCausationId.ts (14 lines)
        buildCorrelationId.ts (14 lines)
        index.ts (12 lines)
        toIsoTimestamp.ts (11 lines)
      index.ts (8 lines)
    docs/
      aggregates.md (181 lines)
      application-services.md (93 lines)
      bounded-context.md (151 lines)
      context-map.md (132 lines)
      domain-events.md (152 lines)
      domain-services.md (65 lines)
      README.md (79 lines)
      repositories.md (125 lines)
      subdomains.md (109 lines)
      ubiquitous-language.md (176 lines)
    domain/
      aggregates/
        index.ts (16 lines)
        IntegrationContract.ts (31 lines)
        PlatformContext.ts (39 lines)
        PolicyCatalog.ts (30 lines)
        SubscriptionAgreement.ts (30 lines)
      constants/
        index.ts (11 lines)
        PlatformErrorCodeConstants.ts (20 lines)
        PlatformEventTypeConstants.ts (15 lines)
        PlatformLifecycleConstants.ts (21 lines)
      entities/
        DispatchContextEntity.ts (25 lines)
        index.ts (11 lines)
        PolicyRuleEntity.ts (25 lines)
        SignalSubscriptionEntity.ts (23 lines)
      errors/
        createDeliveryNotAllowedError.ts (18 lines)
        createEntitlementDeniedError.ts (17 lines)
        createPolicyConflictError.ts (17 lines)
        index.ts (11 lines)
      events/
        contracts/
          index.ts (5 lines)
        published/
          buildPublishedEventEnvelope.ts (19 lines)
          index.ts (11 lines)
          publishBatchPlatformEvents.ts (16 lines)
          publishSinglePlatformEvent.ts (17 lines)
        AnalyticsEventRecordedEvent.ts (21 lines)
        AuditSignalRecordedEvent.ts (21 lines)
        BackgroundJobEnqueuedEvent.ts (21 lines)
        CompliancePolicyVerifiedEvent.ts (21 lines)
        ConfigProfileAppliedEvent.ts (21 lines)
        ContentAssetPublishedEvent.ts (21 lines)
        index.ts (81 lines)
        IntegrationContractRegisteredEvent.ts (21 lines)
        IntegrationDeliveryFailedEvent.ts (21 lines)
        NotificationDispatchRequestedEvent.ts (21 lines)
        ObservabilitySignalEmittedEvent.ts (21 lines)
        OnboardingFlowCompletedEvent.ts (21 lines)
        PermissionDecisionRecordedEvent.ts (21 lines)
        PlatformCapabilityDisabledEvent.ts (21 lines)
        PlatformCapabilityEnabledEvent.ts (21 lines)
        PlatformContextRegisteredEvent.ts (21 lines)
        PolicyCatalogPublishedEvent.ts (21 lines)
        ReferralRewardRecordedEvent.ts (21 lines)
        SearchQueryExecutedEvent.ts (21 lines)
        SubscriptionAgreementActivatedEvent.ts (21 lines)
        SupportTicketOpenedEvent.ts (21 lines)
        WorkflowTriggerFiredEvent.ts (21 lines)
      factories/
        createIntegrationContractAggregate.ts (18 lines)
        createPlatformContextAggregate.ts (20 lines)
        createPolicyCatalogAggregate.ts (18 lines)
        createSubscriptionAgreementAggregate.ts (18 lines)
        index.ts (12 lines)
      ports/
        input/
          index.ts (52 lines)
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
          index.ts (146 lines)
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
        index.ts (6 lines)
      services/
        AuditClassificationService.ts (14 lines)
        CapabilityEntitlementPolicy.ts (16 lines)
        ConfigurationCompositionService.ts (13 lines)
        index.ts (16 lines)
        IntegrationCompatibilityService.ts (13 lines)
        NotificationRoutingPolicy.ts (14 lines)
        ObservabilityCorrelationService.ts (14 lines)
        PermissionResolutionService.ts (17 lines)
        WorkflowDispatchPolicy.ts (14 lines)
      types/
        CorrelationContext.ts (23 lines)
        DispatchOutcome.ts (23 lines)
        index.ts (11 lines)
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
        Entitlement.ts (11 lines)
        index.ts (52 lines)
        IntegrationContractId.ts (9 lines)
        NotificationRoute.ts (12 lines)
        ObservabilitySignal.ts (11 lines)
        PermissionDecision.ts (14 lines)
        PlanConstraint.ts (12 lines)
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
      index.ts (9 lines)
    infrastructure/
      cache/
        CachedPlatformContextViewRepository.ts (24 lines)
        CachedPolicyCatalogViewRepository.ts (24 lines)
        CachedUsageMeterRepository.ts (24 lines)
        index.ts (11 lines)
      db/
        FirebaseIntegrationContractRepository.ts (24 lines)
        FirebasePlatformContextRepository.ts (24 lines)
        FirebasePolicyCatalogRepository.ts (24 lines)
        FirebaseSubscriptionAgreementRepository.ts (24 lines)
        index.ts (12 lines)
      email/
        index.ts (9 lines)
        SmtpNotificationGateway.ts (25 lines)
      events/
        ingress/
          index.ts (14 lines)
          ingestAccountProfileAmended.ts (23 lines)
          ingestIdentitySubjectAuthenticated.ts (23 lines)
          ingestIntegrationCallbackReceived.ts (23 lines)
          ingestOrganizationMembershipChanged.ts (23 lines)
          ingestSubscriptionEntitlementChanged.ts (23 lines)
          ingestWorkflowExecutionCompleted.ts (23 lines)
        routing/
          index.ts (11 lines)
          resolveEventHandler.ts (15 lines)
          routeDomainEvent.ts (17 lines)
          routeIngressEvent.ts (21 lines)
      external/
        buildExternalDeliveryRequest.ts (16 lines)
        dispatchExternalDelivery.ts (17 lines)
        index.ts (11 lines)
        mapExternalResponseToDispatchOutcome.ts (16 lines)
      messaging/
        index.ts (11 lines)
        QStashDomainEventPublisher.ts (24 lines)
        QStashJobQueuePort.ts (14 lines)
        QStashWorkflowDispatcher.ts (19 lines)
      monitoring/
        FirebaseObservabilitySink.ts (22 lines)
        index.ts (11 lines)
      persistence/
        index.ts (12 lines)
        mapIntegrationContractToPersistenceRecord.ts (19 lines)
        mapPlatformContextToPersistenceRecord.ts (19 lines)
        mapPolicyCatalogToPersistenceRecord.ts (19 lines)
        mapSubscriptionAgreementToPersistenceRecord.ts (19 lines)
      storage/
        FirebaseStorageAuditSignalStore.ts (24 lines)
        index.ts (11 lines)
      index.ts (10 lines)
    interfaces/
      api/
        handlePlatformCommandHttp.ts (20 lines)
        handlePlatformQueryHttp.ts (19 lines)
        index.ts (12 lines)
        mapHttpRequestToPlatformCommand.ts (17 lines)
        mapPlatformResultToHttpResponse.ts (19 lines)
      cli/
        index.ts (11 lines)
        parseCliInputToCommand.ts (17 lines)
        renderPlatformCliResult.ts (16 lines)
        runPlatformCliCommand.ts (18 lines)
      web/
        components/
          AppBreadcrumbs.tsx (65 lines)
          AppRail.tsx (358 lines)
          DashboardSidebar.tsx (552 lines)
          GlobalSearchDialog.tsx (95 lines)
          HeaderControls.tsx (56 lines)
          ShellLayout.tsx (321 lines)
          TranslationSwitcher.tsx (80 lines)
        navigation/
          sidebar-nav-data.tsx (149 lines)
        providers/
          app-context.ts (65 lines)
          app-provider.tsx (243 lines)
          providers.tsx (25 lines)
        index.ts (31 lines)
      index.ts (1 lines)
    subdomains/
      access-control/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (47 lines)
      account/
        api/
          index.ts (26 lines)
        application/
          dto/
            account.dto.ts (13 lines)
          use-cases/
            account-policy.use-cases.ts (99 lines)
            account.use-cases.ts (152 lines)
          index.ts (14 lines)
        domain/
          aggregates/
            Account.ts (225 lines)
            index.ts (1 lines)
          entities/
            Account.ts (88 lines)
            AccountPolicy.ts (44 lines)
          events/
            AccountDomainEvent.ts (76 lines)
            index.ts (1 lines)
          ports/
            TokenRefreshPort.ts (17 lines)
          repositories/
            AccountPolicyRepository.ts (14 lines)
            AccountQueryRepository.ts (23 lines)
            AccountRepository.ts (24 lines)
          value-objects/
            AccountId.ts (8 lines)
            AccountStatus.ts (14 lines)
            AccountType.ts (10 lines)
            index.ts (11 lines)
            WalletAmount.ts (8 lines)
          index.ts (30 lines)
        infrastructure/
          firebase/
            FirebaseAccountPolicyRepository.ts (102 lines)
            FirebaseAccountQueryRepository.ts (174 lines)
            FirebaseAccountRepository.ts (190 lines)
          account-service.ts (80 lines)
          identity-token-refresh.adapter.ts (15 lines)
          index.ts (1 lines)
        interfaces/
          _actions/
            account-policy.actions.ts (41 lines)
            account.actions.ts (77 lines)
          components/
            HeaderUserAvatar.tsx (70 lines)
            NavUser.tsx (37 lines)
          queries/
            account.queries.ts (71 lines)
          index.ts (30 lines)
        README.md (51 lines)
      account-profile/
        api/
          index.ts (8 lines)
        application/
          index.ts (1 lines)
          legacy-account-profile-application.port.ts (9 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          create-legacy-account-profile-application.adapter.ts (9 lines)
          index.ts (1 lines)
        README.md (48 lines)
      ai/
        README.md (39 lines)
      analytics/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (50 lines)
      audit-log/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (49 lines)
      background-job/
        api/
          index.ts (11 lines)
        application/
          use-cases/
            ingestion.use-cases.ts (138 lines)
          index.ts (11 lines)
        domain/
          entities/
            IngestionChunk.ts (21 lines)
            IngestionDocument.ts (18 lines)
            IngestionJob.ts (67 lines)
          repositories/
            IIngestionJobRepository.ts (30 lines)
          index.ts (5 lines)
        infrastructure/
          index.ts (3 lines)
          ingestion-service.ts (60 lines)
          InMemoryIngestionJobRepository.ts (59 lines)
        README.md (78 lines)
      billing/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (44 lines)
      compliance/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (50 lines)
      consent/
        README.md (37 lines)
      content/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (86 lines)
      entitlement/
        README.md (37 lines)
      feature-flag/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (78 lines)
      identity/
        api/
          index.ts (8 lines)
        application/
          use-cases/
            identity.use-cases.ts (79 lines)
            token-refresh.use-cases.ts (31 lines)
          identity-error-message.ts (55 lines)
          index.ts (9 lines)
        domain/
          aggregates/
            index.ts (1 lines)
            UserIdentity.ts (174 lines)
          entities/
            Identity.ts (25 lines)
            TokenRefreshSignal.ts (13 lines)
          events/
            IdentityDomainEvent.ts (62 lines)
            index.ts (1 lines)
          repositories/
            IdentityRepository.ts (11 lines)
            TokenRefreshRepository.ts (6 lines)
          value-objects/
            DisplayName.ts (8 lines)
            Email.ts (12 lines)
            IdentityStatus.ts (10 lines)
            index.ts (11 lines)
            UserId.ts (12 lines)
          index.ts (7 lines)
        infrastructure/
          firebase/
            FirebaseIdentityRepository.ts (64 lines)
            FirebaseTokenRefreshRepository.ts (36 lines)
          identity-service.ts (66 lines)
          index.ts (4 lines)
        interfaces/
          _actions/
            identity.actions.ts (57 lines)
          components/
            ShellGuard.tsx (50 lines)
          contexts/
            auth-context.ts (33 lines)
          hooks/
            useTokenRefreshListener.tsx (30 lines)
          providers/
            auth-provider.tsx (159 lines)
          utils/
            dev-demo-auth.ts (82 lines)
          index.ts (27 lines)
        README.md (44 lines)
      integration/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (51 lines)
      notification/
        api/
          index.ts (16 lines)
        application/
          dto/
            notification.dto.ts (5 lines)
          use-cases/
            notification.use-cases.ts (47 lines)
          index.ts (5 lines)
        domain/
          entities/
            Notification.ts (26 lines)
          repositories/
            NotificationRepository.ts (13 lines)
          index.ts (6 lines)
        infrastructure/
          firebase/
            FirebaseNotificationRepository.ts (104 lines)
          index.ts (1 lines)
          notification-service.ts (35 lines)
        interfaces/
          _actions/
            notification.actions.ts (36 lines)
          components/
            NotificationBell.tsx (181 lines)
            NotificationsPage.tsx (170 lines)
          queries/
            notification.queries.ts (10 lines)
          index.ts (6 lines)
        README.md (64 lines)
      observability/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (43 lines)
      onboarding/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (64 lines)
      organization/
        api/
          index.ts (70 lines)
        application/
          dto/
            organization.dto.ts (16 lines)
          use-cases/
            organization-lifecycle.use-cases.ts (64 lines)
            organization-member.use-cases.ts (59 lines)
            organization-partner.use-cases.ts (45 lines)
            organization-policy.use-cases.ts (46 lines)
            organization-team.use-cases.ts (11 lines)
          index.ts (31 lines)
        domain/
          aggregates/
            index.ts (1 lines)
            Organization.ts (351 lines)
          entities/
            Organization.ts (132 lines)
          events/
            index.ts (1 lines)
            OrganizationDomainEvent.ts (97 lines)
          repositories/
            OrganizationRepository.ts (43 lines)
            OrgPolicyRepository.ts (12 lines)
          value-objects/
            index.ts (8 lines)
            MemberRole.ts (23 lines)
            OrganizationId.ts (8 lines)
            OrganizationStatus.ts (14 lines)
          index.ts (26 lines)
        infrastructure/
          firebase/
            FirebaseOrganizationRepository.ts (293 lines)
            FirebaseOrgPolicyRepository.ts (76 lines)
            organization-mappers.ts (64 lines)
          index.ts (1 lines)
          organization-service.ts (131 lines)
        interfaces/
          _actions/
            organization-policy.actions.ts (24 lines)
            organization.actions.ts (107 lines)
          components/
            AccountSwitcher.tsx (200 lines)
            CreateOrganizationDialog.tsx (135 lines)
            MembersPage.tsx (227 lines)
            OrganizationAuditPage.tsx (151 lines)
            PermissionsPage.tsx (215 lines)
            TeamsPage.tsx (213 lines)
          queries/
            organization.queries.ts (18 lines)
          index.ts (29 lines)
        README.md (69 lines)
      platform-config/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (34 lines)
      referral/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (49 lines)
      search/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (45 lines)
      secret-management/
        README.md (37 lines)
      security-policy/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (43 lines)
      subscription/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (49 lines)
      support/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (58 lines)
      team/
        api/
          index.ts (15 lines)
        application/
          use-cases/
            team.use-cases.ts (57 lines)
        domain/
          entities/
            Team.ts (20 lines)
          repositories/
            TeamRepository.ts (16 lines)
        infrastructure/
          firebase/
            FirebaseTeamRepository.ts (71 lines)
        README.md (39 lines)
      tenant/
        README.md (37 lines)
      workflow/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (48 lines)
    AGENT.md (176 lines)
    README.md (116 lines)
  workspace/
    api/
      runtime/
        factories.ts (25 lines)
      contracts.ts (146 lines)
      facade.ts (84 lines)
      index.ts (20 lines)
      ui.ts (126 lines)
    application/
      dtos/
        AGENT.md (66 lines)
        wiki-content-tree.dto.ts (8 lines)
        workspace-interfaces.dto.ts (60 lines)
        workspace-member-view.dto.ts (6 lines)
      services/
        AGENT.md (77 lines)
        WorkspaceCommandApplicationService.ts (260 lines)
        WorkspaceQueryApplicationService.ts (65 lines)
      use-cases/
        AGENT.md (65 lines)
        wiki-content-tree.use-case.ts (62 lines)
        workspace-access.use-cases.ts (67 lines)
        workspace-capabilities.use-cases.ts (27 lines)
        workspace-lifecycle.use-cases.ts (140 lines)
        workspace-member.use-cases.ts (10 lines)
        workspace-query.use-cases.ts (75 lines)
        workspace.use-cases.ts (31 lines)
    docs/
      aggregates.md (70 lines)
      application-services.md (61 lines)
      bounded-context.md (46 lines)
      context-map.md (41 lines)
      domain-events.md (42 lines)
      domain-services.md (32 lines)
      README.md (43 lines)
      repositories.md (40 lines)
      subdomains.md (54 lines)
      ubiquitous-language.md (48 lines)
    domain/
      aggregates/
        AGENT.md (64 lines)
        Workspace.test.ts (89 lines)
        Workspace.ts (305 lines)
      entities/
        AGENT.md (51 lines)
        WikiContentTree.ts (41 lines)
        WorkspaceAccess.ts (11 lines)
        WorkspaceCapability.ts (15 lines)
        WorkspaceLocation.ts (10 lines)
        WorkspaceMemberView.ts (25 lines)
        WorkspaceProfile.ts (22 lines)
      events/
        AGENT.md (56 lines)
        workspace.events.ts (93 lines)
      factories/
        AGENT.md (44 lines)
        WorkspaceFactory.ts (17 lines)
      ports/
        input/
          AGENT.md (42 lines)
          WorkspaceCommandPort.ts (29 lines)
          WorkspaceQueryPort.ts (23 lines)
        output/
          AGENT.md (50 lines)
          WikiWorkspaceRepository.ts (12 lines)
          WorkspaceAccessRepository.ts (8 lines)
          WorkspaceCapabilityRepository.ts (6 lines)
          WorkspaceDomainEventPublisher.ts (13 lines)
          WorkspaceLocationRepository.ts (7 lines)
          WorkspaceQueryRepository.ts (16 lines)
          WorkspaceRepository.ts (17 lines)
        index.ts (29 lines)
        README.md (43 lines)
      services/
        AGENT.md (64 lines)
      value-objects/
        Address.ts (29 lines)
        AGENT.md (47 lines)
        index.ts (42 lines)
        workspace-value-objects.test.ts (46 lines)
        WorkspaceLifecycleState.ts (39 lines)
        WorkspaceName.ts (19 lines)
        WorkspaceVisibility.ts (18 lines)
    infrastructure/
      events/
        AGENT.md (42 lines)
        SharedWorkspaceDomainEventPublisher.ts (61 lines)
      firebase/
        AGENT.md (42 lines)
        FirebaseWikiWorkspaceRepository.ts (16 lines)
        FirebaseWorkspaceQueryRepository.ts (243 lines)
        FirebaseWorkspaceRepository.ts (237 lines)
    interfaces/
      api/
        actions/
          workspace.command.ts (64 lines)
        contracts/
          index.ts (9 lines)
          wiki-content.contract.ts (8 lines)
          workspace-member.contract.ts (6 lines)
          workspace.contract.ts (48 lines)
        facades/
          index.ts (8 lines)
          workspace-member.facade.ts (6 lines)
          workspace.facade.ts (51 lines)
        queries/
          wiki-content-tree.query.ts (11 lines)
          workspace-member.query.ts (11 lines)
          workspace.query.ts (28 lines)
        runtime/
          index.ts (2 lines)
          workspace-runtime.ts (70 lines)
          workspace-session-context.ts (17 lines)
        AGENT.md (56 lines)
        index.ts (13 lines)
      cli/
        AGENT.md (40 lines)
      web/
        components/
          cards/
            WorkspaceContextCard.tsx (56 lines)
            WorkspaceInformationCard.tsx (91 lines)
            WorkspaceOverviewSummaryCard.tsx (95 lines)
            WorkspaceProductSpineCard.tsx (131 lines)
            WorkspaceQuickstartCard.tsx (57 lines)
          dialogs/
            CreateWorkspaceDialog.tsx (87 lines)
            CustomizeNavigationDialog.tsx (254 lines)
            NavCheckRow.tsx (140 lines)
            WorkspaceSettingsDialog.tsx (126 lines)
            WorkspaceSettingsInformationFields.tsx (272 lines)
          layout/
            workspace-detail-helpers.ts (52 lines)
            WorkspaceSidebarSection.tsx (149 lines)
          navigation/
            workspace-quick-access.tsx (76 lines)
          rails/
            CreateWorkspaceDialogRail.tsx (131 lines)
          screens/
            OrganizationWorkspacesScreen.tsx (142 lines)
            WorkspaceDetailRouteScreen.tsx (44 lines)
            WorkspaceDetailScreen.tsx (243 lines)
            WorkspaceHubScreen.tsx (279 lines)
          tabs/
            WorkspaceDailyTab.tsx (18 lines)
            WorkspaceMembersTab.tsx (200 lines)
            WorkspaceOverviewSettingsTab.tsx (100 lines)
            WorkspaceOverviewTab.tsx (267 lines)
        hooks/
          useRecentWorkspaces.ts (89 lines)
          useWorkspaceDetail.ts (69 lines)
          useWorkspaceHub.ts (151 lines)
          useWorkspaceSettingsSave.ts (137 lines)
        navigation/
          nav-preferences-data.ts (139 lines)
          use-sidebar-locale.ts (45 lines)
          workspace-nav-items.ts (37 lines)
          workspace-tabs.ts (68 lines)
        state/
          workspace-session.ts (5 lines)
          workspace-settings.ts (53 lines)
        utils/
          workspace-map.ts (13 lines)
        view-models/
          workspace-grants.ts (13 lines)
          workspace-supporting-records.ts (76 lines)
        AGENT.md (67 lines)
        index.ts (61 lines)
    subdomains/
      audit/
        api/
          factories.ts (5 lines)
          index.ts (22 lines)
        application/
          dto/
            audit.dto.ts (6 lines)
          use-cases/
            list-audit-logs.use-cases.ts (18 lines)
        domain/
          aggregates/
            AuditEntry.ts (174 lines)
            index.ts (2 lines)
          entities/
            AuditLog.ts (11 lines)
          events/
            AuditDomainEvent.ts (32 lines)
            index.ts (6 lines)
          repositories/
            AuditRepository.ts (6 lines)
          services/
            AuditRecordingService.ts (27 lines)
            index.ts (1 lines)
          value-objects/
            ActorId.ts (13 lines)
            AuditAction.ts (15 lines)
            AuditSeverity.ts (32 lines)
            index.ts (8 lines)
          index.ts (11 lines)
          schema.ts (30 lines)
        infrastructure/
          firebase/
            FirebaseAuditRepository.ts (88 lines)
        interfaces/
          components/
            AuditStream.tsx (141 lines)
            WorkspaceAuditTab.tsx (127 lines)
          queries/
            audit.queries.ts (36 lines)
        README.md (54 lines)
      feed/
        api/
          factories.ts (10 lines)
          index.ts (34 lines)
          workspace-feed.facade.ts (123 lines)
        application/
          dto/
            workspace-feed.dto.ts (59 lines)
          use-cases/
            workspace-feed-interaction.use-cases.ts (113 lines)
            workspace-feed-post.use-cases.ts (107 lines)
            workspace-feed.use-cases.ts (15 lines)
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
        README.md (212 lines)
      lifecycle/
        README.md (37 lines)
      membership/
        README.md (37 lines)
      presence/
        README.md (37 lines)
      scheduling/
        api/
          factories.ts (5 lines)
          index.ts (38 lines)
          schema.ts (27 lines)
        application/
          dto/
            work-demand.dto.ts (24 lines)
          work-demand.use-cases.ts (85 lines)
        domain/
          repository.ts (15 lines)
          types.ts (84 lines)
        infrastructure/
          firebase/
            FirebaseDemandRepository.ts (114 lines)
          mock-demand-repository.ts (34 lines)
        interfaces/
          _actions/
            work-demand.actions.ts (46 lines)
          components/
            CalendarWidget.tsx (209 lines)
            CreateDemandForm.tsx (179 lines)
          queries/
            work-demand.queries.ts (20 lines)
          AccountSchedulingView.tsx (226 lines)
          WorkspaceSchedulingTab.tsx (197 lines)
        README.md (60 lines)
      sharing/
        README.md (37 lines)
      workspace-workflow/
        api/
          contracts.ts (76 lines)
          factories.ts (15 lines)
          index.ts (95 lines)
          listeners.ts (46 lines)
          workspace-flow-invoice.facade.ts (110 lines)
          workspace-flow-issue.facade.ts (99 lines)
          workspace-flow-task.facade.ts (108 lines)
          workspace-flow.facade.ts (118 lines)
        application/
          dto/
            add-invoice-item.dto.ts (14 lines)
            create-task.dto.ts (16 lines)
            invoice-query.dto.ts (15 lines)
            issue-query.dto.ts (15 lines)
            materialize-from-knowledge.dto.ts (34 lines)
            open-issue.dto.ts (19 lines)
            pagination.dto.ts (22 lines)
            remove-invoice-item.dto.ts (12 lines)
            resolve-issue.dto.ts (12 lines)
            task-query.dto.ts (17 lines)
            update-invoice-item.dto.ts (12 lines)
            update-task.dto.ts (14 lines)
            workflow.dto.ts (11 lines)
          ports/
            InvoiceService.ts (23 lines)
            IssueService.ts (20 lines)
            TaskService.ts (21 lines)
          process-managers/
            knowledge-to-workflow-materializer.ts (97 lines)
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
            materialize-tasks-from-knowledge.use-case.ts (62 lines)
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
            workspace-flow-invoice.actions.ts (101 lines)
            workspace-flow-issue.actions.ts (84 lines)
            workspace-flow-task.actions.ts (77 lines)
            workspace-flow.actions.ts (45 lines)
          components/
            AssignTaskDialog.tsx (84 lines)
            CreateTaskDialog.tsx (130 lines)
            InvoiceRow.tsx (134 lines)
            IssueRow.tsx (112 lines)
            OpenIssueDialog.tsx (126 lines)
            TaskRow.tsx (211 lines)
            WorkspaceFlowTab.tsx (214 lines)
          contracts/
            workspace-flow.contract.ts (85 lines)
          queries/
            workspace-flow.queries.ts (59 lines)
        README.md (63 lines)
    AGENT.md (83 lines)
    README.md (90 lines)
  system.ts (9 lines)
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
    graph3d.ts (37 lines)
    index.ts (40 lines)
    network.ts (37 lines)
    timeline.ts (22 lines)
  lib-xstate/
    index.ts (78 lines)
  lib-zod/
    index.ts (45 lines)
  lib-zustand/
    index.ts (55 lines)
  shared-constants/
    index.ts (6 lines)
  shared-events/
    index.ts (226 lines)
  shared-hooks/
    index.ts (11 lines)
  shared-types/
    index.ts (117 lines)
  shared-utils/
    index.test.ts (17 lines)
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
      input-group.tsx (162 lines)
      input-otp.tsx (87 lines)
      input.tsx (19 lines)
      kbd.tsx (26 lines)
      label.tsx (24 lines)
      menubar.tsx (280 lines)
      navigation-menu.tsx (164 lines)
      pagination.tsx (130 lines)
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
        __init__.py (11 lines)
        rag_ingestion.py (166 lines)
        rag_query.py (231 lines)
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
        __init__.py (33 lines)
        .gitkeep (0 lines)
        rag_ingestion_text.py (67 lines)
        rag_result_filter.py (163 lines)
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
          _base.py (32 lines)
          clients.py (55 lines)
          qstash_client.py (99 lines)
          rag_query.py (18 lines)
          redis_client.py (98 lines)
          search_client.py (230 lines)
          vector_client.py (128 lines)
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
        _https_helpers.py (101 lines)
        https.py (22 lines)
        parse_document.py (184 lines)
        rag_query_handler.py (116 lines)
        rag_reindex_handler.py (128 lines)
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
    test_parse_document_handler.py (112 lines)
  .gitignore (6 lines)
  main.py (87 lines)
  README.md (265 lines)
  requirements-dev.txt (2 lines)
  requirements.txt (23 lines)
.firebaserc (5 lines)
.gitattributes (2 lines)
.gitignore (75 lines)
apphosting.yaml (64 lines)
components.json (25 lines)
eslint.config.mjs (182 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (437 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next-env.d.ts (6 lines)
next.config.ts (10 lines)
package.json (109 lines)
postcss.config.mjs (7 lines)
repomix.config.json (112 lines)
storage.rules (9 lines)
tailwind.config.ts (100 lines)
tsconfig.json (66 lines)
vitest.config.ts (23 lines)
```