"""OpenAI embedding adapter — implements RagEmbedderPort using text-embedding-3-small.

Dependency Direction: interfaces -> application -> domain <- infrastructure
"""
import logging
import time

from openai import OpenAI

from app.config.settings import OpenAiSettings
from app.rag_ingestion.domain.entities import RagChunkDraft
from app.rag_ingestion.domain.ports import RagEmbedderPort

logger = logging.getLogger(__name__)

# Retry configuration for transient OpenAI API errors (rate-limit, server errors).
_MAX_RETRIES = 3
_RETRY_BACKOFF_BASE_SECONDS = 2.0


class OpenAiEmbedder(RagEmbedderPort):
    """Production embedder using OpenAI text-embedding-3-small (1536 dimensions).

    Replaces the deterministic scaffold embedder (DeterministicRagEmbedder) for
    production RAG ingestion. Each call to embed() processes chunks in batches of
    at most `settings.max_batch_size` (≤ 20), aligned with the rate-limit contract
    declared in IEmbeddingRepository.

    Usage::

        settings = load_settings()
        embedder = OpenAiEmbedder(settings.openai)
        embeddings = embedder.embed(chunk_drafts)
    """

    def __init__(self, settings: OpenAiSettings) -> None:
        self._settings = settings
        self._client = OpenAI(api_key=settings.api_key)

    def embed(self, chunks: list[RagChunkDraft]) -> list[tuple[float, ...]]:
        """Embed all chunks, processing up to max_batch_size per API call.

        Returns embeddings in the same order as the input chunks.
        Raises openai.OpenAIError on unrecoverable API failures.
        """
        if not chunks:
            return []

        all_embeddings: list[tuple[float, ...]] = []
        batch_size = self._settings.max_batch_size

        for batch_start in range(0, len(chunks), batch_size):
            batch = chunks[batch_start : batch_start + batch_size]
            texts = [chunk.text for chunk in batch]
            batch_embeddings = self._embed_batch_with_retry(texts)
            all_embeddings.extend(batch_embeddings)

        return all_embeddings

    # ── private ──────────────────────────────────────────────────────────────

    def _embed_batch_with_retry(self, texts: list[str]) -> list[tuple[float, ...]]:
        """Call the OpenAI embeddings API for a single batch with exponential backoff."""
        last_error: Exception | None = None

        for attempt in range(_MAX_RETRIES):
            try:
                response = self._client.embeddings.create(
                    input=texts,
                    model=self._settings.model,
                    dimensions=self._settings.dimensions,
                )
                # The API guarantees results are returned in the same order as input.
                return [tuple(item.embedding) for item in response.data]
            except Exception as exc:
                last_error = exc
                if attempt < _MAX_RETRIES - 1:
                    wait = _RETRY_BACKOFF_BASE_SECONDS * (2**attempt)
                    logger.warning(
                        "OpenAI embedding attempt %d/%d failed (%s); retrying in %.1fs",
                        attempt + 1,
                        _MAX_RETRIES,
                        exc,
                        wait,
                    )
                    time.sleep(wait)

        raise RuntimeError(
            f"OpenAI embedding failed after {_MAX_RETRIES} attempts"
        ) from last_error
