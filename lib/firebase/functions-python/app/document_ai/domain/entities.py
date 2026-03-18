from dataclasses import dataclass


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
