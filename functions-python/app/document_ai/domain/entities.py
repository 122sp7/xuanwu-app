from dataclasses import dataclass, field


@dataclass(frozen=True)
class DocumentAiProcessCommand:
    workspace_id: str
    file_name: str
    mime_type: str
    content_bytes: bytes


@dataclass(frozen=True)
class DocumentAiProcessResult:
    text: str
    page_count: int


@dataclass(frozen=True)
class DocumentAiClassifyResult:
    """Classification result from the Document AI OCR Classifier processor."""

    document_type: str
    confidence: float
    # Raw entity types returned by the processor (may contain multiple predictions).
    raw_entity_types: tuple[str, ...] = field(default_factory=tuple)
