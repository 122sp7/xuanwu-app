"""Unit tests for domain/services/rag_ingestion_text.py — Layout Parser path."""

from __future__ import annotations

import pytest

from domain.services.rag_ingestion_text import layout_chunks_to_rag_chunks


def test_layoutChunksToRagChunks_WithValidChunks_ReturnsExpectedShape() -> None:
    layout_chunks = [
        {
            "chunk_id": "c1",
            "text": "  採購訂單標頭  ",
            "page_start": 1,
            "page_end": 1,
            "source_block_indices": [0],
        },
        {
            "chunk_id": "c2",
            "text": "明細表格",
            "page_start": 1,
            "page_end": 2,
            "source_block_indices": [1, 2],
        },
    ]

    result = layout_chunks_to_rag_chunks(layout_chunks)

    assert len(result) == 2

    first = result[0]
    assert first["text"] == "採購訂單標頭"  # whitespace stripped
    assert first["chunk_id"] == "c1"
    assert first["page_start"] == 1
    assert first["page_end"] == 1
    assert first["source_block_indices"] == [0]
    # char_start / char_end are schema-compat fields
    assert first["char_start"] == 0
    assert first["char_end"] == len("採購訂單標頭")

    second = result[1]
    assert second["text"] == "明細表格"
    assert second["page_start"] == 1
    assert second["page_end"] == 2


def test_layoutChunksToRagChunks_WithEmptyTextChunk_SkipsChunk() -> None:
    layout_chunks = [
        {"chunk_id": "c1", "text": "有效內容", "page_start": 1, "page_end": 1, "source_block_indices": []},
        {"chunk_id": "c2", "text": "   ", "page_start": 2, "page_end": 2, "source_block_indices": []},
        {"chunk_id": "c3", "text": "", "page_start": 3, "page_end": 3, "source_block_indices": []},
    ]

    result = layout_chunks_to_rag_chunks(layout_chunks)

    assert len(result) == 1
    assert result[0]["chunk_id"] == "c1"


def test_layoutChunksToRagChunks_WithEmptyInput_ReturnsEmptyList() -> None:
    assert layout_chunks_to_rag_chunks([]) == []


def test_layoutChunksToRagChunks_WithMissingOptionalFields_UsesDefaults() -> None:
    layout_chunks = [{"text": "只有文字欄位"}]

    result = layout_chunks_to_rag_chunks(layout_chunks)

    assert len(result) == 1
    chunk = result[0]
    assert chunk["text"] == "只有文字欄位"
    assert chunk["chunk_id"] == ""
    assert chunk["page_start"] == 0
    assert chunk["page_end"] == 0
    assert chunk["source_block_indices"] == []
