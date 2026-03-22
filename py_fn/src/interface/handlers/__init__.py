"""Interface layer entrypoint adapters for Firebase handlers."""

from app.handlers.https import (
	handle_parse_document,
	handle_rag_query,
	handle_rag_reindex_document,
)
from app.handlers.storage import handle_object_finalized

__all__ = [
	"handle_object_finalized",
	"handle_parse_document",
	"handle_rag_query",
	"handle_rag_reindex_document",
]

