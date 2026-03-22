"""
Embeddings service — 封裝 OpenAI embedding 呼叫。
"""

from app.config import OPENAI_EMBEDDING_DIMENSIONS, OPENAI_EMBEDDING_MODEL
from app.services.openai_client import get_openai_client


def _build_embedding_kwargs(model_name: str) -> dict:
    kwargs = {"model": model_name}
    if OPENAI_EMBEDDING_DIMENSIONS > 0 and model_name.startswith("text-embedding-3"):
        kwargs["dimensions"] = OPENAI_EMBEDDING_DIMENSIONS
    return kwargs


def embed_text(text: str, model: str | None = None) -> list[float]:
    """
    產生單段文字 embedding。

    Args:
        text: 需嵌入的文字。
        model: 覆蓋預設模型，未傳則使用 OPENAI_EMBEDDING_MODEL。

    Returns:
        list[float]: embedding 向量。
    """
    client = get_openai_client()
    model_name = model or OPENAI_EMBEDDING_MODEL
    resp = client.embeddings.create(
        **_build_embedding_kwargs(model_name),
        input=text,
    )
    return resp.data[0].embedding


def embed_texts(texts: list[str], model: str | None = None) -> list[list[float]]:
    """
    批次產生多段文字 embeddings。

    Args:
        texts: 文字列表。
        model: 覆蓋預設模型，未傳則使用 OPENAI_EMBEDDING_MODEL。

    Returns:
        list[list[float]]: 與輸入順序一致的向量列表。
    """
    if not texts:
        return []

    client = get_openai_client()
    model_name = model or OPENAI_EMBEDDING_MODEL
    resp = client.embeddings.create(
        **_build_embedding_kwargs(model_name),
        input=texts,
    )
    return [item.embedding for item in resp.data]
