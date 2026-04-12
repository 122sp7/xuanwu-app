# Directory Structure

```
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
```