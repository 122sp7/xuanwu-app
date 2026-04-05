# Directory Structure

```
.agents/
  skills (1 lines)
agents/
  agents (1 lines)
  hooks (1 lines)
  instructions (1 lines)
  prompts (1 lines)
  rules (1 lines)
  skills (1 lines)
app/
  (public)/
    page.tsx (37 lines)
  (shell)/
    _components/
      account-switcher.tsx (32 lines)
      app-breadcrumbs.tsx (7 lines)
      app-rail.tsx (116 lines)
      customize-navigation-dialog.tsx (126 lines)
      dashboard-sidebar.tsx (112 lines)
      global-search-dialog.tsx (23 lines)
      header-controls.tsx (16 lines)
      header-user-avatar.tsx (24 lines)
      nav-user.tsx (7 lines)
      shell-guard.tsx (19 lines)
      translation-switcher.tsx (23 lines)
    ai-chat/
      _actions.ts (8 lines)
      page.tsx (29 lines)
    dashboard/
      page.tsx (5 lines)
    dev-tools/
      page.tsx (133 lines)
    organization/
      audit/
        page.tsx (17 lines)
      content/
        page.tsx (7 lines)
      daily/
        page.tsx (4 lines)
      members/
        page.tsx (14 lines)
      permissions/
        page.tsx (15 lines)
      schedule/
        dispatcher/
          page.tsx (6 lines)
        page.tsx (4 lines)
      teams/
        page.tsx (14 lines)
      workspaces/
        page.tsx (16 lines)
      _utils.ts (6 lines)
      page.tsx (24 lines)
    settings/
      general/
        page.tsx (5 lines)
      notifications/
        page.tsx (5 lines)
      profile/
        page.tsx (5 lines)
      page.tsx (5 lines)
    wiki/
      articles/
        [articleId]/
          page.tsx (44 lines)
        page.tsx (13 lines)
      block-editor/
        page.tsx (2 lines)
      databases/
        [databaseId]/
          page.tsx (43 lines)
        page.tsx (12 lines)
      documents/
        page.tsx (4 lines)
      libraries/
        page.tsx (4 lines)
      namespaces/
        page.tsx (2 lines)
      pages/
        page.tsx (9 lines)
      pages-dnd/
        page.tsx (1 lines)
      rag-query/
        page.tsx (4 lines)
      rag-reindex/
        page.tsx (3 lines)
      page.tsx (13 lines)
    workspace/
      [workspaceId]/
        page.tsx (3 lines)
      page.tsx (6 lines)
    layout.tsx (45 lines)
  providers/
    app-context.ts (70 lines)
    app-provider.tsx (50 lines)
    auth-context.ts (25 lines)
    auth-provider.tsx (40 lines)
    dev-demo-auth.ts (12 lines)
    providers.tsx (14 lines)
  globals.css (10 lines)
  layout.tsx (11 lines)
modules/
  account/
    api/
      index.ts (11 lines)
    application/
      use-cases/
        account-policy.use-cases.ts (34 lines)
        account.use-cases.ts (49 lines)
    domain/
      entities/
        Account.ts (75 lines)
        AccountPolicy.ts (44 lines)
      repositories/
        AccountPolicyRepository.ts (20 lines)
        AccountQueryRepository.ts (72 lines)
        AccountRepository.ts (30 lines)
    infrastructure/
      firebase/
        FirebaseAccountPolicyRepository.ts (30 lines)
        FirebaseAccountQueryRepository.ts (49 lines)
        FirebaseAccountRepository.ts (55 lines)
    interfaces/
      _actions/
        account-policy.actions.ts (22 lines)
        account.actions.ts (44 lines)
      queries/
        account.queries.ts (46 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (40 lines)
    aggregates.md (47 lines)
    application-services.md (27 lines)
    context-map.md (35 lines)
    domain-events.md (32 lines)
    domain-services.md (22 lines)
    index.ts (7 lines)
    README.md (37 lines)
    repositories.md (30 lines)
    ubiquitous-language.md (21 lines)
  ai/
    api/
      index.ts (5 lines)
      knowledge-api.ts (4 lines)
      knowledge-ingestion-api.ts (27 lines)
    application/
      use-cases/
        advance-ingestion-stage.use-case.ts (18 lines)
        register-ingestion-document.use-case.ts (18 lines)
      link-extractor.service.ts (5 lines)
    domain/
      entities/
        graph-node.ts (5 lines)
        IngestionChunk.ts (11 lines)
        IngestionDocument.ts (10 lines)
        IngestionJob.ts (22 lines)
        link.ts (5 lines)
      repositories/
        GraphRepository.ts (5 lines)
        IngestionJobRepository.ts (28 lines)
    infrastructure/
      InMemoryGraphRepository.ts (5 lines)
      InMemoryIngestionJobRepository.ts (16 lines)
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
      index.ts (29 lines)
    application/
      use-cases/
        identity.use-cases.ts (32 lines)
        token-refresh.use-cases.ts (22 lines)
      identity-error-message.ts (23 lines)
    domain/
      entities/
        Identity.ts (23 lines)
        TokenRefreshSignal.ts (15 lines)
      repositories/
        IdentityRepository.ts (37 lines)
        TokenRefreshRepository.ts (31 lines)
    infrastructure/
      firebase/
        FirebaseIdentityRepository.ts (39 lines)
        FirebaseTokenRefreshRepository.ts (20 lines)
    interfaces/
      _actions/
        identity.actions.ts (24 lines)
      hooks/
        useTokenRefreshListener.tsx (27 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (41 lines)
    aggregates.md (43 lines)
    application-services.md (28 lines)
    context-map.md (33 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    index.ts (6 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (21 lines)
  knowledge/
    api/
      events.ts (12 lines)
      index.ts (22 lines)
      knowledge-api.ts (54 lines)
      knowledge-facade.ts (80 lines)
    application/
      dto/
        knowledge.dto.ts (77 lines)
      use-cases/
        knowledge-block.use-cases.ts (32 lines)
        knowledge-collection.use-cases.ts (58 lines)
        knowledge-page.use-cases.ts (89 lines)
        knowledge-version.use-cases.ts (20 lines)
      block-service.ts (34 lines)
    domain/
      entities/
        content-block.entity.ts (30 lines)
        content-page.entity.ts (120 lines)
        content-version.entity.ts (27 lines)
        knowledge-collection.entity.ts (107 lines)
      events/
        knowledge.events.ts (149 lines)
      repositories/
        knowledge.repositories.ts (115 lines)
      value-objects/
        block-content.ts (37 lines)
      index.ts (6 lines)
    infrastructure/
      firebase/
        FirebaseContentBlockRepository.ts (41 lines)
        FirebaseContentCollectionRepository.ts (54 lines)
        FirebaseContentPageRepository.ts (53 lines)
      index.ts (4 lines)
      InMemoryKnowledgeRepository.ts (50 lines)
    interfaces/
      _actions/
        knowledge.actions.ts (104 lines)
      components/
        BlockEditorView.tsx (37 lines)
        PageDialog.tsx (30 lines)
        PageTreeView.tsx (13 lines)
      queries/
        knowledge.queries.ts (44 lines)
      store/
        block-editor.store.ts (22 lines)
      index.ts (4 lines)
    AGENT.md (45 lines)
    aggregates.md (59 lines)
    application-services.md (28 lines)
    context-map.md (64 lines)
    domain-events.md (21 lines)
    domain-services.md (38 lines)
    index.ts (27 lines)
    README.md (42 lines)
    repositories.md (42 lines)
    ubiquitous-language.md (33 lines)
  knowledge-base/
    api/
      index.ts (16 lines)
    application/
      dto/
        knowledge-base.dto.ts (10 lines)
      use-cases/
        article.use-cases.ts (51 lines)
        category.use-cases.ts (36 lines)
    domain/
      entities/
        article.entity.ts (22 lines)
        category.entity.ts (14 lines)
      repositories/
        ArticleRepository.ts (32 lines)
        CategoryRepository.ts (16 lines)
      services/
        BacklinkExtractorService.ts (3 lines)
      index.ts (3 lines)
    infrastructure/
      firebase/
        FirebaseArticleRepository.ts (55 lines)
        FirebaseCategoryRepository.ts (25 lines)
    interfaces/
      _actions/
        knowledge-base.actions.ts (43 lines)
      components/
        ArticleDialog.tsx (40 lines)
      queries/
        knowledge-base.queries.ts (17 lines)
    AGENT.md (46 lines)
    aggregates.md (89 lines)
    application-services.md (71 lines)
    context-map.md (51 lines)
    domain-events.md (138 lines)
    domain-services.md (71 lines)
    index.ts (8 lines)
    README.md (35 lines)
    repositories.md (90 lines)
    ubiquitous-language.md (44 lines)
  knowledge-collaboration/
    api/
      index.ts (17 lines)
    application/
      dto/
        knowledge-collaboration.dto.ts (25 lines)
      use-cases/
        comment.use-cases.ts (33 lines)
        permission.use-cases.ts (24 lines)
        version.use-cases.ts (23 lines)
    domain/
      entities/
        comment.entity.ts (14 lines)
        permission.entity.ts (14 lines)
        version.entity.ts (12 lines)
      repositories/
        ICommentRepository.ts (39 lines)
        IPermissionRepository.ts (29 lines)
        IVersionRepository.ts (26 lines)
    infrastructure/
      firebase/
        FirebaseCommentRepository.ts (30 lines)
        FirebasePermissionRepository.ts (27 lines)
        FirebaseVersionRepository.ts (23 lines)
    interfaces/
      _actions/
        knowledge-collaboration.actions.ts (23 lines)
      components/
        CommentPanel.tsx (34 lines)
        VersionHistoryPanel.tsx (15 lines)
      queries/
        knowledge-collaboration.queries.ts (16 lines)
    AGENT.md (27 lines)
    aggregates.md (89 lines)
    application-services.md (31 lines)
    context-map.md (49 lines)
    domain-events.md (119 lines)
    domain-services.md (67 lines)
    index.ts (6 lines)
    README.md (35 lines)
    repositories.md (63 lines)
    ubiquitous-language.md (40 lines)
  knowledge-database/
    api/
      index.ts (13 lines)
    application/
      dto/
        knowledge-database.dto.ts (29 lines)
      use-cases/
        database.use-cases.ts (38 lines)
        record.use-cases.ts (28 lines)
        view.use-cases.ts (29 lines)
    domain/
      entities/
        database.entity.ts (34 lines)
        record.entity.ts (11 lines)
        view.entity.ts (30 lines)
      repositories/
        IDatabaseRecordRepository.ts (30 lines)
        IDatabaseRepository.ts (40 lines)
        IViewRepository.ts (36 lines)
    infrastructure/
      firebase/
        FirebaseDatabaseRepository.ts (31 lines)
        FirebaseRecordRepository.ts (28 lines)
        FirebaseViewRepository.ts (28 lines)
    interfaces/
      _actions/
        knowledge-database.actions.ts (33 lines)
      components/
        DatabaseDialog.tsx (29 lines)
        DatabaseTableView.tsx (27 lines)
      queries/
        knowledge-database.queries.ts (15 lines)
    AGENT.md (33 lines)
    aggregates.md (120 lines)
    application-services.md (36 lines)
    context-map.md (48 lines)
    domain-events.md (151 lines)
    domain-services.md (88 lines)
    index.ts (3 lines)
    README.md (35 lines)
    repositories.md (65 lines)
    ubiquitous-language.md (45 lines)
  notebook/
    api/
      index.ts (3 lines)
      server.ts (6 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (3 lines)
        generate-agent-response.use-case.ts (9 lines)
      index.ts (0 lines)
    domain/
      entities/
        AgentGeneration.ts (14 lines)
        message.ts (11 lines)
        RagQuery.ts (3 lines)
        thread.ts (11 lines)
      repositories/
        NotebookRepository.ts (9 lines)
        RagGenerationRepository.ts (3 lines)
        RagRetrievalRepository.ts (3 lines)
      index.ts (0 lines)
    infrastructure/
      firebase/
        FirebaseRagRetrievalRepository.ts (3 lines)
        index.ts (0 lines)
      genkit/
        client.ts (11 lines)
        GenkitNotebookRepository.ts (9 lines)
        index.ts (3 lines)
      index.ts (0 lines)
    interfaces/
      _actions/
        notebook.actions.ts (14 lines)
      index.ts (0 lines)
    .gitkeep (0 lines)
    AGENT.md (46 lines)
    aggregates.md (66 lines)
    application-services.md (28 lines)
    context-map.md (31 lines)
    domain-events.md (23 lines)
    domain-services.md (22 lines)
    index.ts (0 lines)
    README.md (37 lines)
    repositories.md (36 lines)
    ubiquitous-language.md (30 lines)
  notification/
    api/
      index.ts (13 lines)
      notification.facade.ts (30 lines)
    application/
      use-cases/
        notification.use-cases.ts (19 lines)
    domain/
      entities/
        Notification.ts (24 lines)
      repositories/
        NotificationRepository.ts (14 lines)
    infrastructure/
      firebase/
        FirebaseNotificationRepository.ts (33 lines)
    interfaces/
      _actions/
        notification.actions.ts (20 lines)
      components/
        NotificationBell.tsx (32 lines)
      queries/
        notification.queries.ts (7 lines)
      index.ts (0 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (34 lines)
    aggregates.md (33 lines)
    application-services.md (26 lines)
    context-map.md (23 lines)
    domain-events.md (24 lines)
    domain-services.md (22 lines)
    index.ts (6 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (20 lines)
  organization/
    api/
      index.ts (41 lines)
    application/
      use-cases/
        organization-policy.use-cases.ts (23 lines)
        organization.use-cases.ts (96 lines)
    domain/
      entities/
        Organization.ts (123 lines)
      repositories/
        OrganizationRepository.ts (80 lines)
    infrastructure/
      firebase/
        FirebaseOrganizationRepository.ts (118 lines)
    interfaces/
      _actions/
        organization.actions.ts (96 lines)
      queries/
        organization.queries.ts (24 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (36 lines)
    aggregates.md (43 lines)
    application-services.md (27 lines)
    context-map.md (31 lines)
    domain-events.md (27 lines)
    domain-services.md (22 lines)
    index.ts (11 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (24 lines)
  search/
    api/
      index.ts (33 lines)
      server.ts (8 lines)
    application/
      use-cases/
        answer-rag-query.use-case.ts (14 lines)
        submit-rag-feedback.use-case.ts (23 lines)
        wiki-rag.use-case.ts (34 lines)
    domain/
      entities/
        RagQuery.ts (47 lines)
        RagQueryFeedback.ts (58 lines)
        WikiRagTypes.ts (53 lines)
      ports/
        vector-store.ts (78 lines)
      repositories/
        RagGenerationRepository.ts (23 lines)
        RagQueryFeedbackRepository.ts (20 lines)
        RagRetrievalRepository.ts (13 lines)
        WikiContentRepository.ts (39 lines)
    infrastructure/
      firebase/
        FirebaseRagQueryFeedbackRepository.ts (37 lines)
        FirebaseRagRetrievalRepository.ts (28 lines)
        FirebaseWikiContentRepository.ts (32 lines)
      genkit/
        client.ts (4 lines)
        GenkitRagGenerationRepository.ts (11 lines)
    interfaces/
      components/
        RagQueryView.tsx (26 lines)
        RagView.tsx (59 lines)
    AGENT.md (45 lines)
    aggregates.md (39 lines)
    application-services.md (28 lines)
    context-map.md (44 lines)
    domain-events.md (28 lines)
    domain-services.md (22 lines)
    index.ts (9 lines)
    README.md (37 lines)
    repositories.md (33 lines)
    ubiquitous-language.md (25 lines)
  shared/
    api/
      index.ts (8 lines)
    application/
      publish-domain-event.ts (26 lines)
    domain/
      events/
        knowledge-page-created.event.ts (47 lines)
        knowledge-updated.event.ts (33 lines)
      event-record.ts (57 lines)
      events.ts (23 lines)
      slug-utils.ts (15 lines)
      types.ts (48 lines)
    infrastructure/
      InMemoryEventStoreRepository.ts (14 lines)
      NoopEventBusRepository.ts (13 lines)
      SimpleEventBus.ts (27 lines)
    AGENT.md (41 lines)
    aggregates.md (44 lines)
    application-services.md (26 lines)
    context-map.md (29 lines)
    domain-events.md (34 lines)
    domain-services.md (22 lines)
    index.ts (7 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (23 lines)
  source/
    api/
      index.ts (41 lines)
    application/
      dto/
        file.dto.ts (56 lines)
        rag-document.dto.ts (51 lines)
      use-cases/
        list-workspace-files.use-case.ts (7 lines)
        register-uploaded-rag-document.use-case.ts (28 lines)
        upload-complete-file.use-case.ts (25 lines)
        upload-init-file.use-case.ts (23 lines)
        wiki-libraries.use-case.ts (55 lines)
      index.ts (0 lines)
    domain/
      entities/
        AuditRecord.ts (17 lines)
        File.ts (24 lines)
        FileVersion.ts (11 lines)
        PermissionSnapshot.ts (12 lines)
        RetentionPolicy.ts (8 lines)
        wiki-library.types.ts (55 lines)
      ports/
        ActorContextPort.ts (10 lines)
        OrganizationPolicyPort.ts (16 lines)
        WorkspaceGrantPort.ts (15 lines)
      repositories/
        FileRepository.ts (18 lines)
        RagDocumentRepository.ts (114 lines)
        WikiLibraryRepository.ts (27 lines)
      services/
        complete-upload-file.ts (6 lines)
        resolve-file-organization-id.ts (4 lines)
      index.ts (0 lines)
    infrastructure/
      firebase/
        FirebaseFileRepository.ts (55 lines)
        FirebaseRagDocumentRepository.ts (47 lines)
      repositories/
        in-memory-wiki-library.repository.ts (20 lines)
      index.ts (0 lines)
    interfaces/
      _actions/
        file.actions.ts (31 lines)
      components/
        LibrariesView.tsx (21 lines)
        LibraryTableView.tsx (40 lines)
        SourceDocumentsView.tsx (49 lines)
        WorkspaceFilesTab.tsx (26 lines)
      contracts/
        file-command-result.ts (15 lines)
      hooks/
        useDocumentsSnapshot.ts (48 lines)
      queries/
        file.queries.ts (11 lines)
      index.ts (0 lines)
    AGENT.md (48 lines)
    aggregates.md (62 lines)
    application-services.md (33 lines)
    context-map.md (37 lines)
    domain-events.md (24 lines)
    domain-services.md (23 lines)
    index.ts (0 lines)
    README.md (37 lines)
    repositories.md (31 lines)
    ubiquitous-language.md (26 lines)
  workspace/
    api/
      index.ts (21 lines)
    application/
      use-cases/
        wiki-content-tree.use-case.ts (19 lines)
        workspace-member.use-cases.ts (6 lines)
        workspace.use-cases.ts (59 lines)
    domain/
      entities/
        WikiContentTree.ts (39 lines)
        Workspace.ts (72 lines)
        WorkspaceMember.ts (21 lines)
      repositories/
        WikiWorkspaceRepository.ts (12 lines)
        WorkspaceQueryRepository.ts (19 lines)
        WorkspaceRepository.ts (49 lines)
    infrastructure/
      firebase/
        FirebaseWikiWorkspaceRepository.ts (7 lines)
        FirebaseWorkspaceQueryRepository.ts (35 lines)
        FirebaseWorkspaceRepository.ts (55 lines)
    interfaces/
      _actions/
        workspace.actions.ts (48 lines)
      components/
        WorkspaceDailyTab.tsx (6 lines)
        WorkspaceDetailScreen.tsx (97 lines)
        WorkspaceHubScreen.tsx (38 lines)
        WorkspaceMembersTab.tsx (23 lines)
        WorkspaceWikiTab.tsx (9 lines)
        WorkspaceWikiView.tsx (24 lines)
      hooks/
        useWorkspaceHub.ts (14 lines)
      queries/
        workspace-member.queries.ts (5 lines)
        workspace.queries.ts (17 lines)
      workspace-tabs.ts (17 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (40 lines)
    aggregates.md (54 lines)
    application-services.md (28 lines)
    context-map.md (44 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    index.ts (3 lines)
    README.md (37 lines)
    repositories.md (30 lines)
    ubiquitous-language.md (22 lines)
  workspace-audit/
    api/
      index.ts (11 lines)
    application/
      use-cases/
        audit.use-cases.ts (10 lines)
      .gitkeep (0 lines)
    domain/
      entities/
        AuditLog.ts (10 lines)
      repositories/
        AuditRepository.ts (8 lines)
      .gitkeep (0 lines)
      schema.ts (53 lines)
    infrastructure/
      firebase/
        FirebaseAuditRepository.ts (21 lines)
      .gitkeep (0 lines)
    interfaces/
      components/
        AuditStream.tsx (44 lines)
        WorkspaceAuditTab.tsx (17 lines)
      queries/
        audit.queries.ts (14 lines)
      .gitkeep (0 lines)
    ports/
      .gitkeep (0 lines)
    AGENT.md (45 lines)
    aggregates.md (40 lines)
    application-services.md (27 lines)
    context-map.md (43 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    index.ts (1 lines)
    README.md (37 lines)
    repositories.md (27 lines)
    ubiquitous-language.md (26 lines)
  workspace-feed/
    api/
      index.ts (1 lines)
      workspace-feed.facade.ts (66 lines)
    application/
      dto/
        workspace-feed.dto.ts (13 lines)
      use-cases/
        workspace-feed.use-cases.ts (51 lines)
    domain/
      entities/
        workspace-feed-post.entity.ts (47 lines)
      events/
        workspace-feed.events.ts (40 lines)
      repositories/
        workspace-feed.repositories.ts (36 lines)
      index.ts (0 lines)
    infrastructure/
      firebase/
        FirebaseWorkspaceFeedInteractionRepository.ts (24 lines)
        FirebaseWorkspaceFeedPostRepository.ts (49 lines)
      index.ts (0 lines)
    interfaces/
      _actions/
        workspace-feed.actions.ts (29 lines)
      components/
        WorkspaceFeedAccountView.tsx (15 lines)
        WorkspaceFeedWorkspaceView.tsx (26 lines)
      queries/
        workspace-feed.queries.ts (17 lines)
      index.ts (0 lines)
    AGENT.md (18 lines)
    aggregates.md (21 lines)
    application-services.md (27 lines)
    context-map.md (25 lines)
    domain-events.md (19 lines)
    domain-services.md (22 lines)
    index.ts (10 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (9 lines)
  workspace-flow/
    api/
      contracts.ts (25 lines)
      index.ts (37 lines)
      listeners.ts (36 lines)
      workspace-flow.facade.ts (120 lines)
    application/
      dto/
        add-invoice-item.dto.ts (13 lines)
        create-task.dto.ts (15 lines)
        invoice-query.dto.ts (18 lines)
        issue-query.dto.ts (18 lines)
        materialize-from-content.dto.ts (34 lines)
        open-issue.dto.ts (17 lines)
        pagination.dto.ts (25 lines)
        remove-invoice-item.dto.ts (11 lines)
        resolve-issue.dto.ts (11 lines)
        task-query.dto.ts (22 lines)
        update-invoice-item.dto.ts (13 lines)
        update-task.dto.ts (13 lines)
      ports/
        InvoiceService.ts (28 lines)
        IssueService.ts (23 lines)
        TaskService.ts (25 lines)
      process-managers/
        content-to-workflow-materializer.ts (51 lines)
      use-cases/
        add-invoice-item.use-case.ts (16 lines)
        approve-invoice.use-case.ts (15 lines)
        approve-task-acceptance.use-case.ts (17 lines)
        archive-task.use-case.ts (20 lines)
        assign-task.use-case.ts (17 lines)
        close-invoice.use-case.ts (15 lines)
        close-issue.use-case.ts (15 lines)
        create-invoice.use-case.ts (14 lines)
        create-task.use-case.ts (15 lines)
        fail-issue-retest.use-case.ts (15 lines)
        fix-issue.use-case.ts (15 lines)
        materialize-tasks-from-content.use-case.ts (25 lines)
        open-issue.use-case.ts (15 lines)
        pass-issue-retest.use-case.ts (15 lines)
        pass-task-qa.use-case.ts (17 lines)
        pay-invoice.use-case.ts (15 lines)
        reject-invoice.use-case.ts (15 lines)
        remove-invoice-item.use-case.ts (15 lines)
        resolve-issue.use-case.ts (15 lines)
        review-invoice.use-case.ts (15 lines)
        start-issue.use-case.ts (15 lines)
        submit-invoice.use-case.ts (16 lines)
        submit-issue-retest.use-case.ts (15 lines)
        submit-task-to-qa.use-case.ts (15 lines)
        update-invoice-item.use-case.ts (15 lines)
        update-task.use-case.ts (14 lines)
    domain/
      entities/
        Invoice.ts (39 lines)
        InvoiceItem.ts (23 lines)
        Issue.ts (42 lines)
        Task.ts (50 lines)
      events/
        InvoiceEvent.ts (90 lines)
        IssueEvent.ts (74 lines)
        TaskEvent.ts (67 lines)
      repositories/
        InvoiceRepository.ts (54 lines)
        IssueRepository.ts (41 lines)
        TaskRepository.ts (37 lines)
      services/
        invoice-guards.ts (24 lines)
        invoice-transition-policy.ts (23 lines)
        issue-transition-policy.ts (23 lines)
        task-guards.ts (26 lines)
        task-transition-policy.ts (23 lines)
      value-objects/
        InvoiceId.ts (13 lines)
        InvoiceItemId.ts (13 lines)
        InvoiceStatus.ts (33 lines)
        IssueId.ts (13 lines)
        IssueStage.ts (14 lines)
        IssueStatus.ts (33 lines)
        SourceReference.ts (42 lines)
        TaskId.ts (13 lines)
        TaskStatus.ts (36 lines)
        UserId.ts (13 lines)
    infrastructure/
      firebase/
        invoice-item.converter.ts (16 lines)
        invoice.converter.ts (19 lines)
        issue.converter.ts (19 lines)
        sourceReference.converter.ts (12 lines)
        task.converter.ts (19 lines)
        workspace-flow.collections.ts (15 lines)
      repositories/
        FirebaseInvoiceItemRepository.ts (29 lines)
        FirebaseInvoiceRepository.ts (56 lines)
        FirebaseIssueRepository.ts (40 lines)
        FirebaseTaskRepository.ts (38 lines)
    interfaces/
      _actions/
        workspace-flow.actions.ts (75 lines)
      components/
        WorkspaceFlowTab.tsx (151 lines)
      contracts/
        workspace-flow.contract.ts (44 lines)
      queries/
        workspace-flow.queries.ts (48 lines)
    AGENT.md (47 lines)
    aggregates.md (91 lines)
    application-services.md (67 lines)
    context-map.md (46 lines)
    domain-events.md (41 lines)
    domain-services.md (26 lines)
    index.ts (28 lines)
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
      index.ts (8 lines)
      schema.ts (15 lines)
    application/
      work-demand.use-cases.ts (33 lines)
    domain/
      repository.ts (31 lines)
      types.ts (89 lines)
    infrastructure/
      firebase/
        FirebaseDemandRepository.ts (24 lines)
      mock-demand-repository.ts (19 lines)
    interfaces/
      _actions/
        work-demand.actions.ts (20 lines)
      components/
        CalendarWidget.tsx (68 lines)
        CreateDemandForm.tsx (67 lines)
      queries/
        work-demand.queries.ts (17 lines)
      AccountSchedulingView.tsx (65 lines)
      WorkspaceSchedulingTab.tsx (55 lines)
    AGENT.md (41 lines)
    aggregates.md (48 lines)
    application-services.md (26 lines)
    context-map.md (35 lines)
    domain-events.md (22 lines)
    domain-services.md (22 lines)
    index.ts (19 lines)
    README.md (37 lines)
    repositories.md (27 lines)
    ubiquitous-language.md (32 lines)
  system.ts (24 lines)
packages/
  api-contracts/
    index.ts (3 lines)
  integration-firebase/
    admin.ts (3 lines)
    analytics.ts (23 lines)
    appcheck.ts (28 lines)
    auth.ts (12 lines)
    client.ts (4 lines)
    database.ts (39 lines)
    firestore.ts (26 lines)
    functions.ts (18 lines)
    index.ts (5 lines)
    messaging.ts (19 lines)
    performance.ts (16 lines)
    remote-config.ts (25 lines)
    storage.ts (27 lines)
  integration-http/
    index.ts (5 lines)
  lib-date-fns/
    index.ts (31 lines)
  lib-dragdrop/
    index.ts (32 lines)
  lib-react-markdown/
    index.ts (13 lines)
  lib-remark-gfm/
    index.ts (7 lines)
  lib-superjson/
    index.ts (12 lines)
  lib-tanstack/
    index.ts (11 lines)
  lib-uuid/
    index.ts (25 lines)
  lib-vis/
    data.ts (11 lines)
    graph3d.ts (14 lines)
    index.ts (16 lines)
    network.ts (14 lines)
    timeline.ts (16 lines)
  lib-xstate/
    index.ts (30 lines)
  lib-zod/
    index.ts (34 lines)
  lib-zustand/
    index.ts (34 lines)
  shared-constants/
    index.ts (0 lines)
  shared-hooks/
    index.ts (5 lines)
  shared-types/
    index.ts (50 lines)
  shared-utils/
    index.ts (5 lines)
  shared-validators/
    index.ts (13 lines)
  ui-shadcn/
    hooks/
      use-mobile.ts (3 lines)
      use-toast.ts (52 lines)
    ui/
      accordion.tsx (21 lines)
      alert-dialog.tsx (16 lines)
      alert.tsx (4 lines)
      aspect-ratio.tsx (4 lines)
      avatar.tsx (4 lines)
      badge.tsx (13 lines)
      breadcrumb.tsx (6 lines)
      button.tsx (5 lines)
      calendar.tsx (11 lines)
      card.tsx (3 lines)
      carousel.tsx (44 lines)
      chart.tsx (23 lines)
      checkbox.tsx (7 lines)
      collapsible.tsx (7 lines)
      command.tsx (16 lines)
      context-menu.tsx (21 lines)
      dialog.tsx (18 lines)
      drawer.tsx (20 lines)
      dropdown-menu.tsx (24 lines)
      hover-card.tsx (5 lines)
      input-group.tsx (9 lines)
      input-otp.tsx (6 lines)
      input.tsx (4 lines)
      kbd.tsx (3 lines)
      label.tsx (6 lines)
      menubar.tsx (18 lines)
      navigation-menu.tsx (12 lines)
      pagination.tsx (26 lines)
      popover.tsx (10 lines)
      progress.tsx (2 lines)
      radio-group.tsx (10 lines)
      scroll-area.tsx (12 lines)
      select.tsx (36 lines)
      separator.tsx (8 lines)
      sheet.tsx (16 lines)
      sidebar.tsx (55 lines)
      skeleton.tsx (3 lines)
      slider.tsx (11 lines)
      sonner.tsx (3 lines)
      spinner.tsx (5 lines)
      switch.tsx (11 lines)
      table.tsx (3 lines)
      tabs.tsx (19 lines)
      textarea.tsx (3 lines)
      toggle-group.tsx (20 lines)
      toggle.tsx (3 lines)
      tooltip.tsx (9 lines)
    index.ts (10 lines)
    utils.ts (3 lines)
  ui-vis/
    index.ts (4 lines)
    network.tsx (94 lines)
    react-graph-vis.d.ts (15 lines)
    timeline.tsx (88 lines)
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
        runtime_dependencies.py (26 lines)
      settings/
        .gitkeep (0 lines)
      __init__.py (4 lines)
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
        rag_ingestion.py (61 lines)
        rag_query.py (77 lines)
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
      config.py (48 lines)
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
        rag.py (40 lines)
      services/
        __init__.py (1 lines)
        .gitkeep (0 lines)
      value_objects/
        __init__.py (3 lines)
        .gitkeep (0 lines)
        rag.py (59 lines)
      __init__.py (1 lines)
    infrastructure/
      audit/
        qstash.py (2 lines)
      cache/
        rag_query_cache.py (7 lines)
      config/
        .gitkeep (0 lines)
      external/
        documentai/
          __init__.py (1 lines)
          client.py (61 lines)
        openai/
          __init__.py (3 lines)
          client.py (14 lines)
          embeddings.py (32 lines)
          llm.py (16 lines)
          rag_query.py (2 lines)
        upstash/
          __init__.py (1 lines)
          clients.py (172 lines)
          rag_query.py (2 lines)
        __init__.py (1 lines)
      logging/
        .gitkeep (0 lines)
      persistence/
        firestore/
          __init__.py (1 lines)
          document_repository.py (78 lines)
        storage/
          __init__.py (1 lines)
          client.py (57 lines)
        __init__.py (1 lines)
      repositories/
        .gitkeep (0 lines)
      __init__.py (1 lines)
    interface/
      controllers/
        .gitkeep (0 lines)
      handlers/
        __init__.py (3 lines)
        https.py (163 lines)
        storage.py (90 lines)
      middleware/
        .gitkeep (0 lines)
      routes/
        .gitkeep (0 lines)
      schemas/
        .gitkeep (0 lines)
      __init__.py (1 lines)
  tests/
    conftest.py (1 lines)
    test_domain_repository_gateways.py (32 lines)
  .gitignore (6 lines)
  main.py (40 lines)
  README.md (265 lines)
  requirements.txt (23 lines)
scripts/
  demo-flow.ts (14 lines)
  init-framework.sh (429 lines)
.firebaserc (5 lines)
.gitattributes (2 lines)
.gitignore (74 lines)
.mcp.json (29 lines)
AGENTS.md (147 lines)
apphosting.yaml (48 lines)
CLAUDE.md (45 lines)
components.json (25 lines)
CONTRIBUTING.md (115 lines)
eslint.config.mjs (16 lines)
firebase.apphosting.json (13 lines)
firebase.json (60 lines)
firestore.indexes.json (305 lines)
firestore.rules (9 lines)
llms.txt (82 lines)
next-env.d.ts (5 lines)
next.config.ts (1 lines)
package.json (93 lines)
PERMISSIONS.md (10 lines)
postcss.config.mjs (0 lines)
README.md (141 lines)
repomix.config.json (112 lines)
repomix.markdown.config.json (112 lines)
repomix.skill.config.json (120 lines)
SPEC-WORKFLOW.md (11 lines)
storage.rules (9 lines)
tailwind.config.ts (2 lines)
tsconfig.json (65 lines)
```