from __future__ import annotations

from application.use_cases.rag_query import execute_rag_query


class _FakeRagQueryGateway:
    def __init__(self, *, cached: dict | None = None) -> None:
        self.cached = cached

    def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str:
        return f"{account_scope}:{query}:{top_k}"

    def get_query_cache(self, cache_key: str) -> dict | None:
        return self.cached

    def to_query_vector(self, query: str) -> list[float]:
        return [0.1]

    def query_vector(self, vector: list[float], top_k: int) -> list[dict]:
        return [
            {
                "score": 0.9,
                "metadata": {
                    "doc_id": "doc-1",
                    "chunk_id": "doc-1:0001",
                    "account_id": "acct-1",
                    "workspace_id": "ws-1",
                    "taxonomy": "general",
                    "processing_status": "ready",
                    "indexed_at": "2026-04-21T00:00:00Z",
                    "filename": "doc-1.pdf",
                    "json_gcs_uri": "gs://bucket/doc-1.json",
                },
                "text": "relevant text",
            }
        ]

    def query_search(self, query: str, top_k: int) -> list[dict]:
        return []

    def generate_answer(self, *, query: str, context_block: str) -> str:
        return f"answer:{query}:{context_block}"


def test_execute_rag_query_with_cache_hit_returns_no_effect_plan() -> None:
    execution = execute_rag_query(
        query="hello",
        account_scope="acct-1",
        workspace_scope="ws-1",
        top_k=3,
        taxonomy_filters=["general"],
        max_age_days=30,
        require_ready=True,
        gateway=_FakeRagQueryGateway(
            cached={
                "answer": "cached-answer",
                "citations": [],
                "vector_hits": 1,
                "search_hits": 0,
                "account_scope": "acct-1",
                "workspace_scope": "ws-1",
            }
        ),
    )

    assert execution.response["cache"] == "hit"
    assert execution.effect_plan is None


def test_execute_rag_query_with_generated_answer_returns_effect_plan() -> None:
    execution = execute_rag_query(
        query="hello",
        account_scope="acct-1",
        workspace_scope="ws-1",
        top_k=3,
        taxonomy_filters=["general"],
        max_age_days=30,
        require_ready=True,
        gateway=_FakeRagQueryGateway(),
    )

    assert execution.response["cache"] == "miss"
    assert execution.response["answer"].startswith("answer:hello:")
    assert execution.effect_plan is not None
    assert execution.effect_plan.cache_key == "acct-1:workspace=ws-1;taxonomy=general;maxAge=30;ready=True;q=hello:3"
    assert execution.effect_plan.citation_count == 1
