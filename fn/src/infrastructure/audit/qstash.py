from __future__ import annotations

import logging

from core.config import QSTASH_RAG_AUDIT_URL
from infrastructure.external.upstash.clients import publish_qstash_json

logger = logging.getLogger(__name__)


def publish_query_audit(*, query: str, top_k: int, citation_count: int, vector_hits: int, search_hits: int) -> None:
    if not (QSTASH_RAG_AUDIT_URL.startswith("http://") or QSTASH_RAG_AUDIT_URL.startswith("https://")):
        return

    try:
        publish_qstash_json(
            url=QSTASH_RAG_AUDIT_URL,
            body={
                "event": "rag.query.completed",
                "query": query,
                "top_k": top_k,
                "citation_count": citation_count,
                "vector_hits": vector_hits,
                "search_hits": search_hits,
                "cached": False,
            },
        )
    except Exception as exc:
        logger.debug("qstash publish skipped: %s", exc)
