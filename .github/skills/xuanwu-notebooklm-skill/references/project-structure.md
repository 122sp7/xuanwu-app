# Directory Structure

```
docs/
  structure/
    contexts/
      notebooklm/
        AGENTS.md (89 lines)
        bounded-contexts.md (76 lines)
        context-map.md (77 lines)
        README.md (110 lines)
        subdomains.md (68 lines)
        ubiquitous-language.md (93 lines)
src/
  modules/
    notebooklm/
      adapters/
        inbound/
          react/
            index.ts (4 lines)
            NotebooklmAiChatSection.tsx (25 lines)
            NotebooklmNotebookSection.tsx (18 lines)
            NotebooklmResearchSection.tsx (28 lines)
            NotebooklmSourcesSection.tsx (137 lines)
          server-actions/
            document-actions.ts (75 lines)
            notebook-actions.ts (27 lines)
            source-processing-actions.ts (43 lines)
        outbound/
          callable/
            FirebaseCallableAdapter.ts (75 lines)
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
                FirestoreIngestionSourceRepository.ts (117 lines)
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
              IngestionSource.ts (118 lines)
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
      AGENTS.md (59 lines)
      index.ts (14 lines)
      README.md (70 lines)
```