# Directory Structure

```
fn/
  src/
    app/
      bootstrap/
        __init__.py (7 lines)
      container/
        __init__.py (0 lines)
        runtime_dependencies.py (67 lines)
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
      config.py (73 lines)
    domain/
      events/
        __init__.py (0 lines)
      exceptions/
        __init__.py (0 lines)
      repositories/
        __init__.py (3 lines)
        rag.py (65 lines)
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
          search_client.py (73 lines)
          vector_client.py (40 lines)
        __init__.py (0 lines)
      persistence/
        firestore/
          __init__.py (0 lines)
          document_repository.py (118 lines)
        storage/
          __init__.py (0 lines)
          client.py (86 lines)
        __init__.py (0 lines)
      __init__.py (0 lines)
    interface/
      handlers/
        __init__.py (1 lines)
        _https_helpers.py (40 lines)
        https.py (12 lines)
        parse_document.py (48 lines)
        rag_query_handler.py (23 lines)
        rag_reindex_handler.py (42 lines)
        storage.py (100 lines)
      schemas/
        __init__.py (0 lines)
        parse_document.py (61 lines)
        rag_query.py (71 lines)
        rag_reindex.py (42 lines)
      __init__.py (0 lines)
  tests/
    __init__.py (0 lines)
    conftest.py (1 lines)
    test_domain_repository_gateways.py (47 lines)
    test_input_schemas.py (61 lines)
    test_po_extraction.py (125 lines)
    test_rag_ingestion_text.py (24 lines)
  .env.example (65 lines)
  AGENTS.md (137 lines)
  main.py (41 lines)
  README.md (214 lines)
  requirements-dev.txt (3 lines)
  requirements.txt (23 lines)
```