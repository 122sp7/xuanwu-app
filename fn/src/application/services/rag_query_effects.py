from __future__ import annotations

import logging

from application.dto import RagQueryEffectPlan
from domain.repositories import RagQueryEffectsGateway, get_rag_query_effects_gateway

logger = logging.getLogger(__name__)


def persist_rag_query_effects(
    *,
    effect_plan: RagQueryEffectPlan,
    response: dict,
    effects_gateway: RagQueryEffectsGateway | None = None,
) -> None:
    effects_gateway = effects_gateway or get_rag_query_effects_gateway()

    try:
        effects_gateway.save_query_cache(effect_plan.cache_key, response)
    except Exception as exc:
        logger.warning("redis query cache write failed: %s", exc)

    try:
        effects_gateway.publish_query_audit(
            query=effect_plan.query,
            top_k=effect_plan.top_k,
            citation_count=effect_plan.citation_count,
            vector_hits=effect_plan.vector_hits,
            search_hits=effect_plan.search_hits,
        )
    except Exception as exc:
        logger.warning("rag query audit publish failed: %s", exc)
