"""
Document AI 服務層 — 封裝 google-cloud-documentai 的 process_document 呼叫。

用法：
    from infrastructure.external.documentai.client import process_document_bytes
    result = process_document_bytes(content=pdf_bytes, mime_type="application/pdf")
    print(result.text)
"""

import logging
from dataclasses import dataclass

from google.cloud import documentai_v1 as documentai

from core.config import DOCAI_API_ENDPOINT, DOCAI_PROCESSOR_NAME

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


@dataclass
class ParsedDocument:
    """Document AI 解析結果的精簡表示。"""

    text: str
    """文件的全文純文字。"""
    page_count: int
    """頁數。"""
    mime_type: str
    """原始文件的 MIME 類型。"""


def process_document_bytes(
    content: bytes,
    mime_type: str = "application/pdf",
    processor_name: str = DOCAI_PROCESSOR_NAME,
) -> ParsedDocument:
    """
    送出 bytes 內容給 Document AI 同步解析。

    Args:
        content:        原始文件的二進位內容（PDF / TIFF / PNG …）。
        mime_type:      文件的 MIME 類型，預設 application/pdf。
        processor_name: Document AI processor 的完整資源名稱；
                        預設讀取 config.DOCAI_PROCESSOR_NAME。

    Returns:
        ParsedDocument: 包含 text / page_count / mime_type。

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

    logger.info(
        "DocumentAI: done — %d pages, %d chars",
        len(document.pages),
        len(document.text),
    )
    return ParsedDocument(
        text=document.text,
        page_count=len(document.pages),
        mime_type=mime_type,
    )


def process_document_gcs(
    gcs_uri: str,
    mime_type: str = "application/pdf",
    processor_name: str = DOCAI_PROCESSOR_NAME,
) -> ParsedDocument:
    """
    從 GCS URI 提供的檔案，使用 Document AI 同步解析。

    Document AI 直接從 GCS 讀取，不需要下載到記憶體。

    Args:
        gcs_uri:        GCS 檔案路徑，格式為 gs://bucket-name/path/to/file。
        mime_type:      文件的 MIME 類型，預設 application/pdf。
        processor_name: Document AI processor 的完整資源名稱；
                        預設讀取 config.DOCAI_PROCESSOR_NAME。

    Returns:
        ParsedDocument: 包含 text / page_count / mime_type。

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

    logger.info(
        "DocumentAI: done — %d pages, %d chars",
        len(document.pages),
        len(document.text),
    )
    return ParsedDocument(
        text=document.text,
        page_count=len(document.pages),
        mime_type=mime_type,
    )
