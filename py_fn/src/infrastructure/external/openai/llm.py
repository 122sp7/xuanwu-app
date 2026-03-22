"""
LLM service — 封裝 OpenAI chat completion 呼叫。
"""

from openai.types.chat import ChatCompletionMessageParam

from core.config import OPENAI_LLM_MODEL
from infrastructure.external.openai.client import get_openai_client


def chat_complete(
    messages: list[ChatCompletionMessageParam],
    model: str | None = None,
    temperature: float = 0.2,
) -> str:
    """
    呼叫 LLM 取得單次文字回覆。

    Args:
        messages: OpenAI chat messages。
        model: 覆蓋預設模型，未傳則使用 OPENAI_LLM_MODEL。
        temperature: 取樣溫度。

    Returns:
        str: 模型輸出文字。
    """
    client = get_openai_client()
    resp = client.chat.completions.create(
        model=model or OPENAI_LLM_MODEL,
        messages=messages,
        temperature=temperature,
    )
    content = resp.choices[0].message.content
    return content or ""
