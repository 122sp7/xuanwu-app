"""
Document AI 服務層 — 封裝 google-cloud-documentai 的 process_document 呼叫。

用法：
    from infrastructure.external.documentai.client import process_document_bytes
    result = process_document_bytes(content=pdf_bytes, mime_type="application/pdf")
    print(result.text)
    print(result.chunks)    # Layout Parser chunks（結構感知分塊）
    print(result.entities)  # Form Parser entities（結構化欄位）
"""

import logging
from dataclasses import dataclass, field
from typing import Any

from google.cloud import documentai_v1 as documentai

from core.config import DOCAI_API_ENDPOINT, DOCAI_LAYOUT_PROCESSOR_NAME

logger = logging.getLogger(__name__)

# 模組層級 client — 使用 asia-southeast1 regional endpoint
_client: documentai.DocumentProcessorServiceClient | None = None


def _get_client() -> documentai.DocumentProcessorServiceClient:
    global _client
    if _client is None:
        client_options = {"api_endpoint": DOCAI_API_ENDPOINT}
        _client = documentai.DocumentProcessorServiceClient(
            client_options=client_options
        )
    return _client


def _extract_chunks(document: Any) -> list[dict[str, Any]]:
    """從 Layout Parser 回傳的 document.chunked_document.chunks 提取分塊資訊。

    Layout Parser 的 chunks 包含語意邊界（標題、段落、表格各自成 chunk），
    可直接作為 RAG 的 embedding 單位，取代字元切分。

    Returns:
        list of dicts with keys: chunk_id, text, page_start, page_end,
        source_block_indices
    """
    chunked = getattr(document, "chunked_document", None)
    if not chunked:
        return []
    result: list[dict[str, Any]] = []
    for c in chunked.chunks:
        page_span = getattr(c, "page_span", None)
        result.append(
            {
                "chunk_id": getattr(c, "chunk_id", ""),
                "text": getattr(c, "content", ""),
                "page_start": page_span.page_start if page_span else 0,
                "page_end": page_span.page_end if page_span else 0,
                "source_block_indices": list(getattr(c, "source_block_indices", [])),
            }
        )
    return result


def _extract_entities(document: Any) -> list[dict[str, Any]]:
    """從 Form Parser 回傳的 document.entities 提取結構化欄位。

    Form Parser entities 對應採購訂單中的 PO號、金額、日期、供應商等 KV 欄位。

    Returns:
        list of dicts with keys: type, mention_text, confidence, normalized_value
    """
    result: list[dict[str, Any]] = []
    for e in getattr(document, "entities", []):
        normalized = getattr(e, "normalized_value", None)
        result.append(
            {
                "type": getattr(e, "type_", ""),
                "mention_text": getattr(e, "mention_text", ""),
                "confidence": float(getattr(e, "confidence", 0.0)),
                "normalized_value": (
                    normalized.text
                    if normalized and hasattr(normalized, "text")
                    else None
                ),
            }
        )
    return result


@dataclass
class ParsedDocument:
    """Document AI 解析結果的精簡表示。"""

    text: str
    """文件的全文純文字。"""
    page_count: int
    """頁數。"""
    mime_type: str
    """原始文件的 MIME 類型。"""
    chunks: list[dict[str, Any]] = field(default_factory=list)
    """Layout Parser 語意分塊（空 list 表示 processor 不支援或無輸出）。
    每個 chunk: {chunk_id, text, page_start, page_end, source_block_indices}"""
    entities: list[dict[str, Any]] = field(default_factory=list)
    """Form Parser 結構化欄位（空 list 表示 processor 不支援或無輸出）。
    每個 entity: {type, mention_text, confidence, normalized_value}"""


def process_document_bytes(
    content: bytes,
    mime_type: str = "application/pdf",
    processor_name: str = DOCAI_LAYOUT_PROCESSOR_NAME,
) -> ParsedDocument:
    """
    送出 bytes 內容給 Document AI 同步解析。

    Args:
        content:        原始文件的二進位內容（PDF / TIFF / PNG …）。
        mime_type:      文件的 MIME 類型，預設 application/pdf。
        processor_name: Document AI processor 的完整資源名稱；
                        預設讀取 config.DOCAI_LAYOUT_PROCESSOR_NAME。

    Returns:
        ParsedDocument: 包含 text / page_count / mime_type / chunks / entities。

    Raises:
        google.api_core.exceptions.GoogleAPICallError: API 呼叫失敗時。
    """
    client = _get_client()

    raw_document = documentai.RawDocument(content=content, mime_type=mime_type)
    request = documentai.ProcessRequest(
        name=processor_name,
        raw_document=raw_document,
    )

    logger.info("DocumentAI: processing %d bytes (mime=%s)", len(content), mime_type)
    response = client.process_document(request=request)
    document = response.document

    chunks = _extract_chunks(document)
    entities = _extract_entities(document)
    logger.info(
        "DocumentAI: done — %d pages, %d chars, %d chunks, %d entities",
        len(document.pages),
        len(document.text),
        len(chunks),
        len(entities),
    )
    return ParsedDocument(
        text=document.text,
        page_count=len(document.pages),
        mime_type=mime_type,
        chunks=chunks,
        entities=entities,
    )


def process_document_gcs(
    gcs_uri: str,
    mime_type: str = "application/pdf",
    processor_name: str = DOCAI_LAYOUT_PROCESSOR_NAME,
) -> ParsedDocument:
    """
    從 GCS URI 提供的檔案，使用 Document AI 同步解析。

    Document AI 直接從 GCS 讀取，不需要下載到記憶體。

    Args:
        gcs_uri:        GCS 檔案路徑，格式為 gs://bucket-name/path/to/file。
        mime_type:      文件的 MIME 類型，預設 application/pdf。
        processor_name: Document AI processor 的完整資源名稱；
                        預設讀取 config.DOCAI_LAYOUT_PROCESSOR_NAME。

    Returns:
        ParsedDocument: 包含 text / page_count / mime_type / chunks / entities。

    Raises:
        google.api_core.exceptions.GoogleAPICallError: API 呼叫失敗時。
    """
    client = _get_client()

    gcs_document = documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type)
    request = documentai.ProcessRequest(
        name=processor_name,
        gcs_document=gcs_document,
    )

    logger.info("DocumentAI: processing GCS document (uri=%s, mime=%s)", gcs_uri, mime_type)
    response = client.process_document(request=request)
    document = response.document

    chunks = _extract_chunks(document)
    entities = _extract_entities(document)
    logger.info(
        "DocumentAI: done — %d pages, %d chars, %d chunks, %d entities",
        len(document.pages),
        len(document.text),
        len(chunks),
        len(entities),
    )
    return ParsedDocument(
        text=document.text,
        page_count=len(document.pages),
        mime_type=mime_type,
        chunks=chunks,
        entities=entities,
    )
