"""
OpenAI client service — 提供 embeddings / LLM 共用 client。
"""

from openai import OpenAI

from app.config import OPENAI_API_KEY

_client: OpenAI | None = None


def get_openai_client() -> OpenAI:
    """
    取得單例 OpenAI client。

    Raises:
        RuntimeError: OPENAI_API_KEY 未設定時。
    """
    global _client
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")
    if _client is None:
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client
