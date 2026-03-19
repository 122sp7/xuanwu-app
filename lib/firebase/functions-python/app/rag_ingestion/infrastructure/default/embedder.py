from app.rag_ingestion.domain.entities import RagChunkDraft
from app.rag_ingestion.domain.ports import RagEmbedderPort

SCAFFOLD_EMBEDDING_DIMENSION = 4


class DeterministicRagEmbedder(RagEmbedderPort):
    """Temporary scaffold embedder producing 4-dimensional vectors (dimension=4).

    Keep this implementation aligned with the `chunks.embedding` vector dimension declared in
    `firestore.indexes.json` until a production embedding model replaces the deterministic scaffold.
    `SCAFFOLD_EMBEDDING_DIMENSION` exists so the temporary index-alignment constraint stays visible
    in the worker scaffold while the implementation still returns a fixed 4-value tuple.
    """
    def embed(self, chunks: list[RagChunkDraft]) -> list[tuple[float, ...]]:
        return [
            (
                float(token_count),
                float(character_count),
                float(chunk.chunk_index + 1),
                round(token_count / character_count, 6),
            )
            for chunk in chunks
            for token_count, character_count in [
                (max(len(chunk.text.split()), 1), max(len(chunk.text), 1))
            ]
        ]
