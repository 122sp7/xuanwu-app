"""OpenAI integration — client, embeddings, and LLM wrappers."""

from infrastructure.external.openai.client import get_openai_client
from infrastructure.external.openai.embeddings import embed_text, embed_texts
from infrastructure.external.openai.llm import chat_complete

__all__ = [
    "get_openai_client",
    "embed_text",
    "embed_texts",
    "chat_complete",
]
