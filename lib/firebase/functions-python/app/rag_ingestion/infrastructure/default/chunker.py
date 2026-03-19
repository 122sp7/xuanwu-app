from app.rag_ingestion.domain.entities import RagChunkDraft
from app.rag_ingestion.domain.ports import RagChunkerPort

# Keep the scaffold chunk size near a short paragraph so local tests stay deterministic and
# future embedding providers can swap in without immediately exceeding common token windows.
MAX_CHUNK_LENGTH = 800


class SimpleParagraphChunker(RagChunkerPort):
    def chunk(self, text: str) -> list[RagChunkDraft]:
        normalized = text.strip()
        if not normalized:
            return [RagChunkDraft(chunk_index=0, text="", page=1)]

        paragraphs = [segment.strip() for segment in normalized.split("\n") if segment.strip()]
        if not paragraphs:
            paragraphs = [normalized]

        chunks: list[RagChunkDraft] = []
        for paragraph in paragraphs:
            start = 0
            while start < len(paragraph):
                end = min(start + MAX_CHUNK_LENGTH, len(paragraph))
                chunks.append(
                    RagChunkDraft(
                        chunk_index=len(chunks),
                        text=paragraph[start:end],
                        page=1,
                    )
                )
                start = end

        return chunks or [RagChunkDraft(chunk_index=0, text=normalized, page=1)]
