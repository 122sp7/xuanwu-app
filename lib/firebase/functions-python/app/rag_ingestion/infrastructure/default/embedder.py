from app.rag_ingestion.domain.entities import RagChunkDraft
from app.rag_ingestion.domain.ports import RagEmbedderPort


class DeterministicRagEmbedder(RagEmbedderPort):
    def embed(self, chunks: list[RagChunkDraft]) -> list[tuple[float, ...]]:
        vectors: list[tuple[float, ...]] = []
        for chunk in chunks:
            token_count = max(len(chunk.text.split()), 1)
            character_count = max(len(chunk.text), 1)
            vectors.append(
                (
                    float(token_count),
                    float(character_count),
                    float(chunk.chunk_index + 1),
                    round(token_count / character_count, 6),
                )
            )
        return vectors
