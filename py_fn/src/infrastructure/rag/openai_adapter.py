from __future__ import annotations

from infrastructure.external.openai.embeddings import embed_text
from infrastructure.external.openai.llm import chat_complete


def to_query_vector(query: str, *, model: str) -> list[float]:
    return embed_text(query, model=model)


def generate_answer(*, query: str, context_block: str) -> str:
    return chat_complete(
        messages=[
            {
                "role": "system",
                "content": "你是 RAG 助手，只能依據提供的 context 回答，若不足請明確說明。",
            },
            {
                "role": "user",
                "content": f"問題：{query}\\n\\nContext:\\n{context_block}",
            },
        ],
        temperature=0.1,
    )
