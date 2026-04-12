# Directory Structure

```
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
        page.tsx (14 lines)
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
modules/
  notebooklm/
    api/
      api.instructions.md (21 lines)
      factories.ts (2 lines)
      index.ts (124 lines)
      server.ts (12 lines)
    application/
      dtos/
        .gitkeep (0 lines)
      services/
        .gitkeep (0 lines)
      use-cases/
        .gitkeep (0 lines)
      application.instructions.md (22 lines)
    docs/
      docs.instructions.md (20 lines)
      README.md (24 lines)
    domain/
      events/
        index.ts (1 lines)
        NotebookLmDomainEvent.ts (13 lines)
      published-language/
        index.ts (35 lines)
      services/
        .gitkeep (0 lines)
      .gitkeep (0 lines)
      domain-modeling.instructions.md (19 lines)
    infrastructure/
      .gitkeep (0 lines)
      infrastructure.instructions.md (22 lines)
    interfaces/
      components/
        RagQueryView.tsx (183 lines)
      .gitkeep (0 lines)
      interfaces.instructions.md (23 lines)
    subdomains/
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
          ports/
            index.ts (7 lines)
          repositories/
            IThreadRepository.ts (10 lines)
          index.ts (7 lines)
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
        README.md (28 lines)
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
          ports/
            index.ts (7 lines)
          repositories/
            NotebookRepository.ts (8 lines)
          index.ts (5 lines)
        infrastructure/
          genkit/
            client.ts (25 lines)
            GenkitNotebookRepository.ts (36 lines)
        interfaces/
          _actions/
            generate-notebook-response.actions.ts (15 lines)
        README.md (13 lines)
      source/
        api/
          factories.ts (40 lines)
          index.ts (157 lines)
        application/
          dto/
            rag-document.dto.ts (72 lines)
            source-file.dto.ts (71 lines)
            source-live-document.dto.ts (106 lines)
            source.dto.ts (6 lines)
          queries/
            source-file.queries.ts (40 lines)
          use-cases/
            create-knowledge-draft-from-source.use-case.ts (112 lines)
            delete-source-document.use-case.ts (44 lines)
            register-rag-document.use-case.ts (86 lines)
            rename-source-document.use-case.ts (46 lines)
            upload-complete-source-file.use-case.ts (140 lines)
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
            index.ts (12 lines)
            IParsedDocumentPort.ts (12 lines)
            ISourceDocumentPort.ts (13 lines)
          repositories/
            IRagDocumentRepository.ts (20 lines)
            ISourceFileRepository.ts (21 lines)
            IWikiLibraryRepository.ts (17 lines)
          services/
            complete-upload-source-file.service.ts (24 lines)
            resolve-source-organization-id.service.ts (16 lines)
          index.ts (7 lines)
        infrastructure/
          adapters/
            NotionKnowledgePageGatewayAdapter.ts (109 lines)
          firebase/
            FirebaseDocumentStatusAdapter.ts (54 lines)
            FirebaseParsedDocumentAdapter.ts (32 lines)
            FirebaseRagDocumentAdapter.ts (169 lines)
            FirebaseSourceDocumentCommandAdapter.ts (31 lines)
            FirebaseSourceFileAdapter.ts (164 lines)
            FirebaseWikiLibraryAdapter.ts (192 lines)
          memory/
            InMemoryWikiLibraryAdapter.ts (67 lines)
        interfaces/
          _actions/
            source-file.actions.ts (73 lines)
            source-processing.actions.ts (26 lines)
          components/
            file-processing-dialog.body.tsx (130 lines)
            file-processing-dialog.parts.tsx (138 lines)
            file-processing-dialog.surface.tsx (85 lines)
            file-processing-dialog.utils.ts (44 lines)
            FileProcessingDialog.tsx (235 lines)
            LibrariesView.tsx (239 lines)
            LibraryTableView.tsx (231 lines)
            SourceDocumentsView.tsx (188 lines)
            WorkspaceFilesTab.tsx (230 lines)
          contracts/
            source-command-result.ts (16 lines)
          hooks/
            useSourceDocumentsSnapshot.ts (108 lines)
          queries/
            source-file.queries.ts (25 lines)
        README.md (28 lines)
      synthesis/
        api/
          index.ts (145 lines)
          server.ts (20 lines)
        application/
          use-cases/
            answer-rag-query.use-case.ts (123 lines)
            submit-rag-feedback.use-case.ts (50 lines)
          index.ts (6 lines)
        domain/
          entities/
            generation.entities.ts (47 lines)
            GroundingEvidence.ts (24 lines)
            QualityFeedback.ts (31 lines)
            rag-feedback.entities.ts (29 lines)
            rag-query.entities.ts (45 lines)
            retrieval.entities.ts (42 lines)
            RetrievedChunk.ts (30 lines)
            SynthesisResult.ts (45 lines)
          events/
            EvaluationEvents.ts (18 lines)
            GroundingEvents.ts (16 lines)
            RetrievalEvents.ts (26 lines)
            SynthesisEvents.ts (26 lines)
            SynthesisPipelineDomainEvent.ts (63 lines)
          ports/
            IChunkRetrievalPort.ts (22 lines)
            IFeedbackPort.ts (14 lines)
            IGenerationPort.ts (14 lines)
            IVectorStore.ts (49 lines)
          repositories/
            IKnowledgeContentRepository.ts (76 lines)
            IRagGenerationRepository.ts (13 lines)
            IRagQueryFeedbackRepository.ts (12 lines)
            IRagRetrievalRepository.ts (23 lines)
          services/
            ICitationBuilder.ts (25 lines)
            RagCitationBuilder.ts (17 lines)
            RagPromptBuilder.ts (28 lines)
            RagScoringService.ts (74 lines)
          value-objects/
            index.ts (4 lines)
            OrganizationScope.ts (8 lines)
            RagPrompt.ts (5 lines)
            RelevanceScore.ts (8 lines)
            TopK.ts (10 lines)
          index.ts (39 lines)
        infrastructure/
          firebase/
            FirebaseKnowledgeContentAdapter.ts (183 lines)
            FirebaseRagQueryFeedbackAdapter.ts (104 lines)
            FirebaseRagRetrievalAdapter.ts (131 lines)
          genkit/
            genkit-ai-client.ts (34 lines)
            GenkitRagGenerationAdapter.ts (85 lines)
          index.ts (8 lines)
        interfaces/
          components/
            RagQueryView.tsx (185 lines)
        README.md (37 lines)
      subdomains.instructions.md (23 lines)
    AGENT.md (114 lines)
    notebooklm.instructions.md (36 lines)
    README.md (84 lines)
  notion/
    api/
      api.instructions.md (21 lines)
      index.ts (38 lines)
    application/
      dtos/
        .gitkeep (0 lines)
      services/
        .gitkeep (0 lines)
      use-cases/
        .gitkeep (0 lines)
      application.instructions.md (21 lines)
    docs/
      docs.instructions.md (20 lines)
      README.md (24 lines)
    domain/
      events/
        index.ts (1 lines)
        NotionDomainEvent.ts (17 lines)
      published-language/
        index.ts (45 lines)
      services/
        .gitkeep (0 lines)
      .gitkeep (0 lines)
      domain-modeling.instructions.md (19 lines)
    infrastructure/
      .gitkeep (0 lines)
      infrastructure.instructions.md (22 lines)
    interfaces/
      .gitkeep (0 lines)
      interfaces.instructions.md (23 lines)
    subdomains/
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
            index.ts (20 lines)
        domain/
          aggregates/
            Article.ts (150 lines)
            Category.ts (85 lines)
            index.ts (4 lines)
          events/
            AuthoringEvents.ts (38 lines)
            index.ts (9 lines)
            NotionDomainEvent.ts (12 lines)
          ports/
            index.ts (8 lines)
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
        README.md (29 lines)
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
          ports/
            index.ts (9 lines)
          repositories/
            ICommentRepository.ts (49 lines)
            index.ts (3 lines)
            IPermissionRepository.ts (27 lines)
            IVersionRepository.ts (25 lines)
          services/
            index.ts (3 lines)
          value-objects/
            index.ts (3 lines)
          index.ts (7 lines)
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
        README.md (29 lines)
      database/
        api/
          factories.ts (20 lines)
          index.ts (102 lines)
        application/
          dto/
            database.dto.ts (9 lines)
            DatabaseDto.ts (130 lines)
            index.ts (12 lines)
          queries/
            automation.queries.ts (10 lines)
            database.queries.ts (22 lines)
            record.queries.ts (13 lines)
            view.queries.ts (13 lines)
          use-cases/
            AutomationUseCases.ts (42 lines)
            DatabaseUseCases.ts (53 lines)
            index.ts (4 lines)
            RecordUseCases.ts (43 lines)
            ViewUseCases.ts (43 lines)
        domain/
          aggregates/
            Database.ts (45 lines)
            DatabaseAutomation.ts (44 lines)
            DatabaseRecord.ts (21 lines)
            index.ts (4 lines)
            View.ts (41 lines)
          events/
            index.ts (7 lines)
          ports/
            index.ts (10 lines)
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
          index.ts (7 lines)
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
        README.md (29 lines)
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
            KnowledgePageLifecycleDto.ts (41 lines)
          queries/
            backlink.queries.ts (41 lines)
            content-block.queries.ts (95 lines)
            knowledge-collection.queries.ts (26 lines)
            knowledge-page.queries.ts (71 lines)
            knowledge-version.queries.ts (15 lines)
          use-cases/
            KnowledgeCollectionUseCases.ts (108 lines)
            KnowledgePageAppearanceUseCases.ts (47 lines)
            KnowledgePageReviewUseCases.ts (130 lines)
            KnowledgePageUseCases.ts (123 lines)
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
          ports/
            index.ts (10 lines)
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
          index.ts (7 lines)
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
            KnowledgeSidebarSection.tsx (173 lines)
            PageDialog.tsx (57 lines)
            PageEditorView.tsx (41 lines)
            PageTreeView.tsx (74 lines)
          queries/
            index.ts (52 lines)
          store/
            block-editor.store.ts (100 lines)
        README.md (29 lines)
      relations/
        api/
          index.ts (24 lines)
        application/
          index.ts (1 lines)
        domain/
          entities/
            Relation.ts (29 lines)
          events/
            RelationEvents.ts (26 lines)
          repositories/
            IRelationRepository.ts (15 lines)
          index.ts (3 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (28 lines)
      taxonomy/
        api/
          index.ts (23 lines)
        application/
          index.ts (1 lines)
        domain/
          entities/
            TaxonomyNode.ts (27 lines)
          events/
            TaxonomyEvents.ts (25 lines)
          repositories/
            ITaxonomyRepository.ts (15 lines)
          index.ts (3 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (28 lines)
      subdomains.instructions.md (22 lines)
    AGENT.md (155 lines)
    notion.instructions.md (44 lines)
    README.md (128 lines)
  platform/
    api/
      api.instructions.md (20 lines)
      contracts.ts (31 lines)
      facade.ts (95 lines)
      index.ts (114 lines)
      platform-service.ts (90 lines)
    application/
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
        index.ts (8 lines)
        PlatformCommandDispatcher.ts (130 lines)
        PlatformQueryDispatcher.ts (67 lines)
      queries/
        get-platform-context-view.queries.ts (17 lines)
        get-policy-catalog-view.queries.ts (17 lines)
        get-subscription-entitlements.queries.ts (17 lines)
        get-workflow-policy-view.queries.ts (17 lines)
        index.ts (5 lines)
        list-enabled-capabilities.queries.ts (18 lines)
      services/
        build-causation-id.ts (16 lines)
        build-correlation-id.ts (12 lines)
        index.ts (14 lines)
        shell-quick-create.ts (47 lines)
      use-cases/
        activate-subscription-agreement.use-cases.ts (68 lines)
        apply-configuration-profile.use-cases.ts (62 lines)
        emit-observability-signal.use-cases.ts (66 lines)
        fire-workflow-trigger.use-cases.ts (63 lines)
        index.ts (38 lines)
        publish-policy-catalog.use-cases.ts (59 lines)
        record-audit-signal.use-cases.ts (53 lines)
        register-integration-contract.use-cases.ts (61 lines)
        register-platform-context.use-cases.ts (53 lines)
        request-notification-dispatch.use-cases.ts (66 lines)
      application.instructions.md (22 lines)
      index.ts (8 lines)
    docs/
      docs.instructions.md (20 lines)
      README.md (24 lines)
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
        assert-never.ts (20 lines)
        AuditClassificationService.ts (14 lines)
        CapabilityEntitlementPolicy.ts (16 lines)
        ConfigurationCompositionService.ts (13 lines)
        index.ts (9 lines)
        IntegrationCompatibilityService.ts (13 lines)
        NotificationRoutingPolicy.ts (14 lines)
        ObservabilityCorrelationService.ts (14 lines)
        PermissionResolutionService.ts (17 lines)
        to-iso-timestamp.ts (13 lines)
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
        Entitlement.ts (39 lines)
        index.ts (52 lines)
        IntegrationContractId.ts (9 lines)
        NotificationRoute.ts (12 lines)
        ObservabilitySignal.ts (11 lines)
        PermissionDecision.ts (47 lines)
        PlanConstraint.ts (45 lines)
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
      index.ts (9 lines)
    infrastructure/
      cache/
        CachedPlatformContextViewRepository.ts (27 lines)
        CachedPolicyCatalogViewRepository.ts (35 lines)
        CachedUsageMeterRepository.ts (34 lines)
        index.ts (7 lines)
      db/
        EnvSecretReferenceResolver.ts (15 lines)
        FirebaseConfigurationProfileStore.ts (22 lines)
        FirebaseIntegrationContractRepository.ts (28 lines)
        FirebasePlatformContextRepository.ts (28 lines)
        FirebasePolicyCatalogRepository.ts (36 lines)
        FirebaseSubscriptionAgreementRepository.ts (35 lines)
        FirebaseWorkflowPolicyRepository.ts (37 lines)
        index.ts (11 lines)
      email/
        index.ts (5 lines)
        SmtpNotificationGateway.ts (19 lines)
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
        index.ts (7 lines)
        QStashDomainEventPublisher.ts (59 lines)
        QStashJobQueuePort.ts (50 lines)
        QStashWorkflowDispatcher.ts (48 lines)
      monitoring/
        FirebaseObservabilitySink.ts (18 lines)
        index.ts (5 lines)
      persistence/
        index.ts (12 lines)
        mapIntegrationContractToPersistenceRecord.ts (19 lines)
        mapPlatformContextToPersistenceRecord.ts (19 lines)
        mapPolicyCatalogToPersistenceRecord.ts (19 lines)
        mapSubscriptionAgreementToPersistenceRecord.ts (19 lines)
      storage/
        FirebaseStorageAuditSignalStore.ts (23 lines)
        index.ts (5 lines)
      index.ts (10 lines)
      infrastructure.instructions.md (23 lines)
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
        providers/
          ShellAppProvider.tsx (265 lines)
          ShellProviders.tsx (25 lines)
        shell/
          breadcrumbs/
            ShellAppBreadcrumbs.tsx (39 lines)
          header/
            components/
              ShellHeaderControls.tsx (25 lines)
              ShellNotificationButton.tsx (11 lines)
              ShellThemeToggle.tsx (39 lines)
              ShellTranslationSwitcher.tsx (80 lines)
              ShellUserAvatar.tsx (13 lines)
          layout/
            ShellRootLayout.tsx (284 lines)
          navigation/
            components/
              ShellDashboardSidebar.tsx (233 lines)
            data/
              ShellSidebarNavData.tsx (133 lines)
            services/
              shell-quick-create.ts (34 lines)
          search/
            ShellGlobalSearchDialog.tsx (86 lines)
          sidebar/
            ShellAppRail.tsx (321 lines)
            ShellContextNavSection.tsx (61 lines)
            ShellSidebarBody.tsx (196 lines)
            ShellSidebarHeader.tsx (46 lines)
        index.ts (39 lines)
      index.ts (1 lines)
      interfaces.instructions.md (24 lines)
    subdomains/
      access-control/
        api/
          index.ts (16 lines)
        application/
          dtos/
            access-control.dto.ts (12 lines)
            index.ts (1 lines)
          services/
            shell-account-access.ts (25 lines)
          use-cases/
            access-control.use-cases.ts (133 lines)
            index.ts (1 lines)
          index.ts (3 lines)
        domain/
          aggregates/
            AccessPolicy.ts (112 lines)
            index.ts (1 lines)
          events/
            AccessPolicyDomainEvent.ts (36 lines)
            index.ts (1 lines)
          repositories/
            AccessPolicyRepository.ts (16 lines)
            index.ts (1 lines)
          value-objects/
            index.ts (3 lines)
            PolicyEffect.ts (5 lines)
            ResourceRef.ts (16 lines)
            SubjectRef.ts (11 lines)
          index.ts (4 lines)
        infrastructure/
          firebase/
            FirebaseAccessPolicyRepository.ts (93 lines)
          access-control-service.ts (46 lines)
          index.ts (2 lines)
        README.md (13 lines)
      account/
        api/
          index.ts (32 lines)
          legacy-account-profile.bridge.ts (27 lines)
        application/
          dtos/
            account.dto.ts (13 lines)
          services/
            resolve-active-account.ts (58 lines)
          use-cases/
            account-policy.use-cases.ts (99 lines)
            account.use-cases.ts (152 lines)
          index.ts (21 lines)
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
            index.ts (11 lines)
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
          index.ts (31 lines)
        infrastructure/
          firebase/
            FirebaseAccountPolicyRepository.ts (102 lines)
            FirebaseAccountQueryRepository.ts (174 lines)
            FirebaseAccountRepository.ts (190 lines)
          account-service.ts (87 lines)
          identity-token-refresh.adapter.ts (25 lines)
          index.ts (2 lines)
        interfaces/
          _actions/
            account-policy.actions.ts (41 lines)
            account.actions.ts (77 lines)
          components/
            HeaderUserAvatar.tsx (70 lines)
            NavUser.tsx (37 lines)
          queries/
            account.queries.ts (72 lines)
          index.ts (30 lines)
        README.md (28 lines)
      account-profile/
        api/
          index.ts (59 lines)
        application/
          dtos/
            account-profile.dto.ts (11 lines)
          use-cases/
            get-account-profile.use-case.ts (50 lines)
            update-account-profile.use-case.ts (40 lines)
          index.ts (9 lines)
        domain/
          aggregates/
            AccountProfileAggregate.ts (96 lines)
            index.ts (2 lines)
          entities/
            AccountProfile.ts (47 lines)
          events/
            AccountProfileDomainEvent.ts (16 lines)
            index.ts (5 lines)
          ports/
            index.ts (9 lines)
          repositories/
            AccountProfileCommandRepository.ts (11 lines)
            AccountProfileQueryRepository.ts (11 lines)
          value-objects/
            index.ts (7 lines)
            ProfileDisplayName.ts (13 lines)
            ProfileId.ts (8 lines)
          index.ts (20 lines)
        infrastructure/
          account-profile-service.ts (97 lines)
          create-legacy-account-profile-application.adapter.ts (123 lines)
          index.ts (13 lines)
        interfaces/
          _actions/
            account-profile.actions.ts (19 lines)
          components/
            screens/
              SettingsProfileRouteScreen.tsx (182 lines)
          queries/
            account-profile.queries.ts (21 lines)
          index.ts (3 lines)
        README.md (13 lines)
      ai/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (14 lines)
      analytics/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      audit-log/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
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
          events/
            index.ts (7 lines)
            IngestionJobDomainEvent.ts (44 lines)
          ports/
            index.ts (8 lines)
          repositories/
            IIngestionJobRepository.ts (30 lines)
          index.ts (7 lines)
        infrastructure/
          index.ts (3 lines)
          ingestion-service.ts (60 lines)
          InMemoryIngestionJobRepository.ts (59 lines)
        README.md (13 lines)
      billing/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      compliance/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      consent/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (14 lines)
      content/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      entitlement/
        api/
          index.ts (14 lines)
        application/
          dtos/
            entitlement.dto.ts (9 lines)
            index.ts (1 lines)
          use-cases/
            entitlement.use-cases.ts (117 lines)
            index.ts (1 lines)
          index.ts (2 lines)
        domain/
          aggregates/
            EntitlementGrant.ts (117 lines)
            index.ts (1 lines)
          events/
            EntitlementGrantDomainEvent.ts (46 lines)
            index.ts (1 lines)
          repositories/
            EntitlementGrantRepository.ts (16 lines)
            index.ts (1 lines)
          value-objects/
            EntitlementId.ts (8 lines)
            EntitlementStatus.ts (14 lines)
            FeatureKey.ts (12 lines)
            index.ts (3 lines)
          index.ts (4 lines)
        infrastructure/
          firebase/
            FirebaseEntitlementGrantRepository.ts (84 lines)
          entitlement-service.ts (41 lines)
          index.ts (2 lines)
        README.md (14 lines)
      feature-flag/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
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
          ports/
            index.ts (9 lines)
          repositories/
            IdentityRepository.ts (11 lines)
            TokenRefreshRepository.ts (6 lines)
          value-objects/
            DisplayName.ts (8 lines)
            Email.ts (12 lines)
            IdentityStatus.ts (10 lines)
            index.ts (11 lines)
            UserId.ts (12 lines)
          index.ts (8 lines)
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
        README.md (28 lines)
      integration/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      notification/
        api/
          index.ts (16 lines)
        application/
          dtos/
            notification.dto.ts (5 lines)
          queries/
            notification.queries.ts (18 lines)
          use-cases/
            notification.use-cases.ts (50 lines)
          index.ts (5 lines)
        domain/
          aggregates/
            index.ts (2 lines)
            NotificationAggregate.ts (100 lines)
          entities/
            Notification.ts (26 lines)
          events/
            index.ts (7 lines)
            NotificationDomainEvent.ts (37 lines)
          ports/
            index.ts (8 lines)
          repositories/
            NotificationRepository.ts (13 lines)
          value-objects/
            index.ts (2 lines)
            NotificationId.ts (8 lines)
          index.ts (10 lines)
        infrastructure/
          firebase/
            FirebaseNotificationRepository.ts (104 lines)
          index.ts (1 lines)
          notification-service.ts (38 lines)
        interfaces/
          _actions/
            notification.actions.ts (36 lines)
          components/
            NotificationBell.tsx (181 lines)
            NotificationsPage.tsx (170 lines)
          queries/
            notification.queries.ts (10 lines)
          index.ts (6 lines)
        README.md (28 lines)
      observability/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      onboarding/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      organization/
        api/
          index.ts (75 lines)
        application/
          dtos/
            organization.dto.ts (16 lines)
          use-cases/
            organization-lifecycle.use-cases.ts (64 lines)
            organization-member.use-cases.ts (59 lines)
            organization-partner.use-cases.ts (45 lines)
            organization-policy.use-cases.ts (46 lines)
            organization-team.use-cases.ts (69 lines)
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
          ports/
            index.ts (1 lines)
            IOrganizationTeamPort.ts (18 lines)
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
          organization-service.ts (142 lines)
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
        README.md (28 lines)
      platform-config/
        api/
          index.ts (5 lines)
        application/
          services/
            shell-navigation-catalog.ts (199 lines)
          index.ts (22 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      referral/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      search/
        api/
          index.ts (5 lines)
        application/
          services/
            shell-command-catalog.ts (21 lines)
          index.ts (6 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      secret-management/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (14 lines)
      security-policy/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      subscription/
        api/
          index.ts (12 lines)
        application/
          dtos/
            index.ts (1 lines)
            subscription.dto.ts (11 lines)
          use-cases/
            index.ts (1 lines)
            subscription.use-cases.ts (122 lines)
          index.ts (2 lines)
        domain/
          aggregates/
            index.ts (1 lines)
            Subscription.ts (153 lines)
          events/
            index.ts (1 lines)
            SubscriptionDomainEvent.ts (49 lines)
          repositories/
            index.ts (1 lines)
            SubscriptionRepository.ts (12 lines)
          value-objects/
            BillingCycle.ts (7 lines)
            index.ts (4 lines)
            PlanCode.ts (11 lines)
            SubscriptionId.ts (8 lines)
            SubscriptionStatus.ts (20 lines)
          index.ts (4 lines)
        infrastructure/
          firebase/
            FirebaseSubscriptionRepository.ts (93 lines)
          index.ts (2 lines)
          subscription-service.ts (41 lines)
        README.md (13 lines)
      support/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      team/
        api/
          index.ts (23 lines)
        application/
          use-cases/
            team.use-cases.ts (57 lines)
        domain/
          aggregates/
            index.ts (2 lines)
            OrganizationTeam.ts (148 lines)
          entities/
            Team.ts (20 lines)
          events/
            index.ts (7 lines)
            OrganizationTeamDomainEvent.ts (73 lines)
          ports/
            index.ts (8 lines)
          repositories/
            TeamRepository.ts (16 lines)
          value-objects/
            index.ts (4 lines)
            TeamId.ts (11 lines)
            TeamType.ts (10 lines)
          index.ts (10 lines)
        infrastructure/
          firebase/
            FirebaseTeamRepository.ts (71 lines)
        interfaces/
          _actions/
            team.actions.ts (60 lines)
          index.ts (5 lines)
        README.md (13 lines)
      tenant/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (14 lines)
      workflow/
        api/
          index.ts (5 lines)
        application/
          index.ts (1 lines)
        domain/
          index.ts (1 lines)
        infrastructure/
          index.ts (1 lines)
        README.md (13 lines)
      subdomains.instructions.md (21 lines)
    AGENT.md (42 lines)
    index.ts (5 lines)
    platform.instructions.md (41 lines)
    README.md (97 lines)
  workspace/
    api/
      runtime/
        factories.ts (25 lines)
      api.instructions.md (21 lines)
      contracts.ts (146 lines)
      facade.ts (84 lines)
      index.ts (20 lines)
      ui.ts (135 lines)
    application/
      dtos/
        wiki-content-tree.dto.ts (8 lines)
        workspace-interfaces.dto.ts (60 lines)
        workspace-member-view.dto.ts (6 lines)
      queries/
        wiki-content-tree.queries.ts (66 lines)
        workspace.queries.ts (67 lines)
      services/
        WorkspaceCommandApplicationService.ts (123 lines)
        WorkspaceQueryApplicationService.ts (64 lines)
      use-cases/
        workspace-capabilities.use-cases.ts (27 lines)
        workspace-location.use-cases.ts (31 lines)
        workspace.use-cases.ts (15 lines)
      application.instructions.md (21 lines)
    docs/
      docs.instructions.md (20 lines)
      README.md (24 lines)
    domain/
      aggregates/
        Workspace.test.ts (89 lines)
        Workspace.ts (305 lines)
      entities/
        WikiContentTree.ts (41 lines)
        WorkspaceAccess.ts (11 lines)
        WorkspaceCapability.ts (15 lines)
        WorkspaceLocation.ts (10 lines)
        WorkspaceMemberView.ts (25 lines)
        WorkspaceProfile.ts (22 lines)
      events/
        workspace.events.ts (93 lines)
      factories/
        WorkspaceFactory.ts (17 lines)
      ports/
        input/
          WorkspaceCommandPort.ts (29 lines)
          WorkspaceQueryPort.ts (23 lines)
        output/
          WikiWorkspaceRepository.ts (12 lines)
          WorkspaceAccessRepository.ts (8 lines)
          WorkspaceCapabilityRepository.ts (6 lines)
          WorkspaceDomainEventPublisher.ts (13 lines)
          WorkspaceLocationRepository.ts (7 lines)
          WorkspaceQueryRepository.ts (16 lines)
          WorkspaceRepository.ts (17 lines)
        index.ts (29 lines)
      value-objects/
        Address.ts (29 lines)
        index.ts (42 lines)
        workspace-value-objects.test.ts (46 lines)
        WorkspaceLifecycleState.ts (39 lines)
        WorkspaceName.ts (19 lines)
        WorkspaceVisibility.ts (18 lines)
      domain-modeling.instructions.md (19 lines)
    infrastructure/
      events/
        SharedWorkspaceDomainEventPublisher.ts (61 lines)
      firebase/
        FirebaseWikiWorkspaceRepository.ts (16 lines)
        FirebaseWorkspaceQueryRepository.ts (243 lines)
        FirebaseWorkspaceRepository.ts (237 lines)
      infrastructure.instructions.md (22 lines)
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
        index.ts (13 lines)
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
            WorkspaceQuickAccessRow.tsx (172 lines)
            WorkspaceSectionContent.tsx (95 lines)
            WorkspaceSidebarSection.tsx (151 lines)
          navigation/
            workspace-quick-access.tsx (76 lines)
          rails/
            CreateWorkspaceDialogRail.tsx (131 lines)
          screens/
            OrganizationWorkspacesScreen.tsx (142 lines)
            WorkspaceDetailRouteScreen.tsx (44 lines)
            WorkspaceDetailScreen.tsx (281 lines)
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
          nav-preferences-data.ts (158 lines)
          use-sidebar-locale.ts (45 lines)
          workspace-context-links.ts (46 lines)
          workspace-nav-items.ts (41 lines)
          workspace-tabs.ts (98 lines)
        state/
          workspace-session.ts (5 lines)
          workspace-settings.ts (53 lines)
        utils/
          workspace-map.ts (13 lines)
        view-models/
          workspace-grants.ts (13 lines)
          workspace-supporting-records.ts (76 lines)
        index.ts (61 lines)
      interfaces.instructions.md (24 lines)
    subdomains/
      audit/
        api/
          factories.ts (5 lines)
          index.ts (23 lines)
        application/
          dto/
            audit.dto.ts (6 lines)
          queries/
            list-audit-logs.queries.ts (18 lines)
          use-cases/
            record-audit-entry.use-case.ts (14 lines)
        domain/
          aggregates/
            AuditEntry.ts (174 lines)
            index.ts (2 lines)
          entities/
            AuditLog.ts (18 lines)
          events/
            AuditDomainEvent.ts (32 lines)
            index.ts (6 lines)
          ports/
            index.ts (7 lines)
          repositories/
            AuditRepository.ts (8 lines)
          services/
            AuditRecordingService.ts (27 lines)
            index.ts (1 lines)
          value-objects/
            ActorId.ts (24 lines)
            AuditAction.ts (15 lines)
            AuditSeverity.ts (32 lines)
            index.ts (8 lines)
          index.ts (14 lines)
          schema.ts (30 lines)
        infrastructure/
          firebase/
            FirebaseAuditRepository.ts (94 lines)
        interfaces/
          components/
            AuditStream.tsx (141 lines)
            WorkspaceAuditTab.tsx (127 lines)
          queries/
            audit.queries.ts (36 lines)
        README.md (28 lines)
      feed/
        api/
          factories.ts (10 lines)
          index.ts (34 lines)
          workspace-feed.facade.ts (123 lines)
        application/
          dto/
            workspace-feed.dto.ts (59 lines)
          queries/
            workspace-feed-post.queries.ts (37 lines)
          use-cases/
            workspace-feed-interaction.use-cases.ts (113 lines)
            workspace-feed-post.use-cases.ts (80 lines)
            workspace-feed.use-cases.ts (15 lines)
        domain/
          entities/
            workspace-feed-post.entity.ts (53 lines)
          events/
            workspace-feed.events.ts (59 lines)
          ports/
            index.ts (10 lines)
          repositories/
            workspace-feed.repositories.ts (24 lines)
          index.ts (31 lines)
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
        README.md (28 lines)
      lifecycle/
        api/
          index.ts (30 lines)
        application/
          services/
            WorkspaceLifecycleApplicationService.ts (70 lines)
          use-cases/
            create-workspace.use-case.ts (104 lines)
            delete-workspace.use-case.ts (37 lines)
            update-workspace-settings.use-case.ts (131 lines)
          index.ts (11 lines)
        domain/
          ports/
            index.ts (14 lines)
          index.ts (34 lines)
        infrastructure/
          index.ts (8 lines)
        README.md (34 lines)
      membership/
        api/
          index.ts (16 lines)
        application/
          queries/
            workspace-member.queries.ts (19 lines)
          index.ts (7 lines)
        domain/
          ports/
            index.ts (8 lines)
          index.ts (17 lines)
        infrastructure/
          index.ts (10 lines)
        README.md (38 lines)
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
            work-demand.queries.ts (26 lines)
          AccountSchedulingView.tsx (226 lines)
          WorkspaceSchedulingTab.tsx (197 lines)
        README.md (28 lines)
      sharing/
        api/
          index.ts (17 lines)
        application/
          services/
            WorkspaceSharingApplicationService.ts (40 lines)
          use-cases/
            grant-individual-access.use-case.ts (32 lines)
            grant-team-access.use-case.ts (31 lines)
          index.ts (10 lines)
        domain/
          ports/
            index.ts (8 lines)
          index.ts (14 lines)
        infrastructure/
          index.ts (7 lines)
        README.md (38 lines)
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
          ports/
            index.ts (9 lines)
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
          index.ts (21 lines)
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
            WorkspaceFlowTab.tsx (339 lines)
          contracts/
            workspace-flow.contract.ts (85 lines)
          queries/
            workspace-flow.queries.ts (59 lines)
        README.md (28 lines)
      subdomains.instructions.md (23 lines)
    AGENT.md (41 lines)
    README.md (80 lines)
    workspace.instructions.md (39 lines)
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
```