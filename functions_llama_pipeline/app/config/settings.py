"""Centralised environment configuration for the LlamaIndex pipeline."""

import os


class LlamaPipelineSettings:
    """Read-only configuration sourced from environment variables."""

    @staticmethod
    def llama_cloud_api_key() -> str:
        value = os.getenv("LLAMA_CLOUD_API_KEY", "")
        if not value:
            raise ValueError(
                "LLAMA_CLOUD_API_KEY is required. "
                "Get your API key from https://cloud.llamaindex.ai/"
            )
        return value

    @staticmethod
    def openai_api_key() -> str:
        value = os.getenv("OPENAI_API_KEY", "")
        if not value:
            raise ValueError(
                "OPENAI_API_KEY is required. "
                "Get your API key from https://platform.openai.com/api-keys"
            )
        return value

    @staticmethod
    def cohere_api_key() -> str:
        """Optional — only needed when Cohere reranker is enabled."""
        return os.getenv("COHERE_API_KEY", "")

    @staticmethod
    def embedding_model() -> str:
        return os.getenv("LLAMA_EMBEDDING_MODEL", "text-embedding-3-small")

    @staticmethod
    def embedding_dimensions() -> int:
        return int(os.getenv("LLAMA_EMBEDDING_DIMENSIONS", "1536"))

    @staticmethod
    def llm_model() -> str:
        return os.getenv("LLAMA_LLM_MODEL", "gpt-4o-mini")

    @staticmethod
    def rerank_model() -> str:
        return os.getenv("LLAMA_RERANK_MODEL", "rerank-english-v3.0")

    @staticmethod
    def rerank_top_n() -> int:
        return int(os.getenv("LLAMA_RERANK_TOP_N", "5"))

    @staticmethod
    def retrieval_top_k() -> int:
        return int(os.getenv("LLAMA_RETRIEVAL_TOP_K", "10"))

    @staticmethod
    def chunk_size() -> int:
        return int(os.getenv("LLAMA_CHUNK_SIZE", "512"))

    @staticmethod
    def chunk_overlap() -> int:
        return int(os.getenv("LLAMA_CHUNK_OVERLAP", "64"))

    @staticmethod
    def firebase_storage_bucket() -> str:
        return os.getenv(
            "FIREBASE_STORAGE_BUCKET",
            os.getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", ""),
        )
