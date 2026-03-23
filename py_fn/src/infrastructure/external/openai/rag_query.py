# Backward-compatibility shim — canonical definitions in infrastructure/rag/openai_adapter.py
from infrastructure.rag.openai_adapter import generate_answer, to_query_vector

__all__ = ["generate_answer", "to_query_vector"]
