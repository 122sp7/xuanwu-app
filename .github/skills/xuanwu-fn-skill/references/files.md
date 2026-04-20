# Files

## File: fn/src/app/bootstrap/__init__.py
````python
"""
Firebase Admin SDK 初始化 — 整個 fn 只 initialize_app() 一次，
其他模組直接 import firebase_admin 即可取得已初始化的 app。
"""
⋮----
# Cloud Run / Cloud Functions 執行環境使用 ADC（Application Default Credentials）
# 本機測試時請先執行： gcloud auth application-default login
````

## File: fn/src/app/container/__init__.py
````python

````

## File: fn/src/app/__init__.py
````python

````

## File: fn/src/application/dto/__init__.py
````python
"""Application DTOs."""
⋮----
__all__ = [
````

## File: fn/src/application/dto/chunk_job.py
````python
"""
chunk_job.py

Pydantic mirror of the TypeScript ChunkJobPayload schema.
Defined in: src/modules/ai/subdomains/chunk/adapters/outbound/dto/chunk-job-payload.ts

Both sides must stay semantically aligned. Changes to the TypeScript schema
require corresponding updates here, and vice versa.

See: docs/structure/contexts/ai/cross-runtime-contracts.md
"""
⋮----
class ChunkingStrategy(str, Enum)
⋮----
FIXED_SIZE = "fixed-size"
SEMANTIC = "semantic"
MARKDOWN_SECTION = "markdown-section"
⋮----
class ChunkJobPayload(BaseModel)
⋮----
"""QStash message payload for document chunking jobs dispatched by Next.js."""
⋮----
job_id: UUID4 = Field(..., description="Unique identifier for this job (idempotency key)")
document_id: str = Field(..., min_length=1, description="Raw document ID to be chunked")
workspace_id: str = Field(..., min_length=1, description="Workspace scope for multi-tenant isolation")
source_type: str = Field(..., min_length=1, description='Source type (e.g. "notion-page", "uploaded-file")')
strategy_hint: Optional[ChunkingStrategy] = Field(None, description="Preferred chunking strategy")
max_tokens_per_chunk: Optional[int] = Field(
requested_at: datetime = Field(..., description="ISO 8601 timestamp when the job was requested")
⋮----
model_config = {"str_strip_whitespace": True}
````

## File: fn/src/application/dto/embedding_job.py
````python
"""
embedding_job.py

Pydantic mirror of the TypeScript EmbeddingJobPayload schema.
Defined in: src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts

Both sides must stay semantically aligned. Changes to the TypeScript schema
require corresponding updates here, and vice versa.

See: docs/structure/contexts/ai/cross-runtime-contracts.md
"""
⋮----
class EmbeddingJobPayload(BaseModel)
⋮----
"""QStash message payload for embedding generation jobs dispatched by Next.js."""
⋮----
job_id: UUID4 = Field(..., description="Unique identifier for this job (idempotency key)")
document_id: str = Field(..., min_length=1, description="Source document / artifact ID")
workspace_id: str = Field(..., min_length=1, description="Workspace scope for multi-tenant isolation")
chunk_ids: List[str] = Field(..., min_length=1, description="Chunk IDs to generate embeddings for")
model_hint: Optional[str] = Field(None, description="Preferred embedding model; uses default if omitted")
requested_at: datetime = Field(..., description="ISO 8601 timestamp when the job was requested")
⋮----
model_config = {"str_strip_whitespace": True}
````

## File: fn/src/application/dto/rag.py
````python
@dataclass
class RagIngestionResult
⋮----
chunk_count: int
vector_count: int
embedding_model: str
embedding_dimensions: int
raw_chars: int
normalized_chars: int
normalization_version: str
language_hint: str
````

## File: fn/src/application/ports/input/__init__.py
````python

````

## File: fn/src/application/ports/output/__init__.py
````python

````

## File: fn/src/application/ports/output/gateways.py
````python
"""Backward-compatible application-layer re-export of domain repository contracts."""
⋮----
__all__ = [
````

## File: fn/src/application/ports/__init__.py
````python

````

## File: fn/src/application/services/__init__.py
````python

````

## File: fn/src/application/services/document_pipeline.py
````python
def get_document_pipeline() -> DocumentPipelineGateway
````

## File: fn/src/application/use_cases/__init__.py
````python
"""Application use cases."""
⋮----
__all__ = [
````

## File: fn/src/application/use_cases/rag_ingestion.py
````python
"""
RAG pipeline — ingestion use case (clean → chunk → embed → upsert).
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
"""Step 1~5: clean -> chunk -> metadata -> embed -> upsert vector。

    當 layout_chunks 非空時優先使用 Layout Parser 語意分塊，保留表格結構與
    段落語意邊界（chunking_strategy="layout-v1"）。
    否則退回字元切分（chunking_strategy="char-split-v2"），維持向下相容。
    """
gateway = gateway or get_rag_ingestion_gateway()
⋮----
raw_chars = len(text or "")
normalized = clean_text(text or "")
normalized_chars = len(normalized)
language_hint = detect_language_hint(normalized)
⋮----
# ── 選擇分塊策略 ─────────────────────────────────────────────────────────
⋮----
base_chunks = layout_chunks_to_rag_chunks(layout_chunks)
chunking_strategy = "layout-v1"
normalization_version = "layout-v1"
⋮----
base_chunks = chunk_text(
chunking_strategy = "char-split-v2"
normalization_version = "v2"
⋮----
texts = [item["text"] for item in base_chunks]
vectors = gateway.embed_texts(texts, model=OPENAI_EMBEDDING_MODEL)
⋮----
now_iso = datetime.now(UTC).isoformat()
payload: list[dict[str, Any]] = []
⋮----
chunk_id = f"{doc_id}:{i:04d}"
⋮----
# Layout Parser specific fields (empty strings for char-split path)
⋮----
# Best effort: keep Upstash Search in sync with vector chunks.
⋮----
search_docs = [
⋮----
# 文件索引摘要寫入 Redis，方便後續檢視與治理。
````

## File: fn/src/application/use_cases/rag_query.py
````python
"""
RAG query — application use case orchestration.

Delegates all domain filtering to domain.services.rag_result_filter.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
"""Filter and map raw retrieval hits into context snippets and citations.

    Returns (contexts, citations, dropped_workspace, dropped_status,
             dropped_freshness, dropped_taxonomy).
    """
contexts: list[str] = []
citations: list[RagCitation] = []
dropped_workspace = dropped_status = dropped_freshness = dropped_taxonomy = 0
⋮----
metadata = normalize_metadata(hit.get("metadata"))
⋮----
snippet = extract_snippet(hit, metadata)
⋮----
"""Application use case for RAG query orchestration."""
gateway = gateway or get_rag_query_gateway()
⋮----
request = RagQueryInput.from_raw(
⋮----
cache_key = gateway.build_query_cache_key(
⋮----
cached = gateway.get_query_cache(cache_key)
⋮----
retrieval_top_k = request.retrieval_top_k()
vector = gateway.to_query_vector(request.query)
vector_hits_raw = gateway.query_vector(vector, top_k=retrieval_top_k)
search_hits_raw = gateway.query_search(request.query, top_k=retrieval_top_k)
⋮----
seen_snippets: set[str] = set()
⋮----
contexts = vec_contexts + srch_contexts
citations = vec_citations + srch_citations
vector_hit_count = len(vec_citations)
search_hit_count = len(srch_citations)
⋮----
context_block = "\n\n---\n\n".join(contexts[: request.top_k])
⋮----
answer = gateway.generate_answer(query=request.query, context_block=context_block)
result = RagQueryResult(
````

## File: fn/src/application/__init__.py
````python

````

## File: fn/src/core/__init__.py
````python

````

## File: fn/src/core/config.py
````python
"""
專案層級常數 — 從環境變數讀取，讓同一份程式碼在 dev / staging / prod 皆可用。
"""
⋮----
# ── GCP 基礎設定 ────────────────────────────────────────────────────────────
GCP_PROJECT: str = "65970295651"
GCP_REGION: str = os.environ.get("FUNCTION_REGION", "asia-southeast1")
⋮----
# -- Cloud Storage ----------------------------------------
# Firebase Storage bucket (from firebase.json storage.bucket)
UPLOAD_BUCKET: str = os.environ.get(
⋮----
# ── Document AI ──────────────────────────────────────────────────────────────
# 格式： projects/{project}/locations/{location}/processors/{processor_id}
#
# ⚠️  兩個 processor 均位於 US region，endpoint 必須使用 us-documentai.googleapis.com
# Layout Parser  → https://us-documentai.googleapis.com/v1/projects/65970295651/locations/us/processors/929c4719f45b1eee:process
# Form Parser    → https://us-documentai.googleapis.com/v1/projects/65970295651/locations/us/processors/7318076ba71e0758:process
⋮----
DOCAI_LOCATION: str = "us"
DOCAI_API_ENDPOINT: str = "us-documentai.googleapis.com"
⋮----
# Layout Parser — 保留表格結構與段落語意邊界的主要 Processor（混合文件首選）
# AP8 採購訂購單：多層嵌套表格 + 大量段落文字，Layout Parser 輸出 context-aware chunks
DOCAI_LAYOUT_PROCESSOR_NAME: str = os.environ.get(
⋮----
# Form Parser — 結構化欄位擷取副通道（PO號、金額、日期、供應商等 KV entity）
# 若未設定則使用預設 US Form Parser；設為空字串可停用副通道
DOCAI_FORM_PROCESSOR_NAME: str = os.environ.get(
⋮----
# OCR Processor（選配）— 當 Layout Parser 無有效輸出時的文字擷取後備通道。
# 預設留空（不啟用）；若提供值，需填入 US region processor resource name。
DOCAI_OCR_PROCESSOR_NAME: str = os.environ.get(
⋮----
# 舊版 asia-southeast1 processor — 已棄用，保留供向下相容
_DOCAI_PROCESSOR_NAME_LEGACY: str = (
⋮----
# ── OpenAI (Embeddings / LLM) ───────────────────────────────────────────────
OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_EMBEDDING_MODEL: str = os.environ.get(
OPENAI_EMBEDDING_DIMENSIONS: int = int(os.environ.get("OPENAI_EMBEDDING_DIMENSIONS", "1024"))
OPENAI_LLM_MODEL: str = os.environ.get("OPENAI_LLM_MODEL", "gpt-4o-mini")
OPENAI_TIMEOUT_SECONDS: float = float(os.environ.get("OPENAI_TIMEOUT_SECONDS", "30"))
OPENAI_MAX_RETRIES: int = int(os.environ.get("OPENAI_MAX_RETRIES", "2"))
⋮----
# ── Upstash (Vector / Redis / Search / QStash) ─────────────────────────────
UPSTASH_REDIS_REST_URL: str = os.environ.get("UPSTASH_REDIS_REST_URL", "").strip()
UPSTASH_REDIS_REST_TOKEN: str = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "").strip()
⋮----
UPSTASH_VECTOR_REST_URL: str = os.environ.get("UPSTASH_VECTOR_REST_URL", "").strip()
UPSTASH_VECTOR_REST_TOKEN: str = os.environ.get("UPSTASH_VECTOR_REST_TOKEN", "").strip()
⋮----
UPSTASH_SEARCH_REST_URL: str = os.environ.get("UPSTASH_SEARCH_REST_URL", "").strip()
UPSTASH_SEARCH_REST_TOKEN: str = os.environ.get("UPSTASH_SEARCH_REST_TOKEN", "").strip()
UPSTASH_SEARCH_INDEX: str = os.environ.get("UPSTASH_SEARCH_INDEX", "").strip()
UPSTASH_SEARCH_TIMEOUT_SECONDS: float = float(os.environ.get("UPSTASH_SEARCH_TIMEOUT_SECONDS", "8"))
⋮----
QSTASH_URL: str = os.environ.get("QSTASH_URL", "https://qstash-us-east-1.upstash.io").strip()
QSTASH_TOKEN: str = os.environ.get("QSTASH_TOKEN", "").strip()
QSTASH_CURRENT_SIGNING_KEY: str = os.environ.get("QSTASH_CURRENT_SIGNING_KEY", "").strip()
QSTASH_NEXT_SIGNING_KEY: str = os.environ.get("QSTASH_NEXT_SIGNING_KEY", "").strip()
QSTASH_RAG_AUDIT_URL: str = os.environ.get("QSTASH_RAG_AUDIT_URL", "").strip()
⋮----
# ── RAG Pipeline ─────────────────────────────────────────────────────────────
RAG_VECTOR_NAMESPACE: str = os.environ.get("RAG_VECTOR_NAMESPACE", "rag-docs").strip()
RAG_CHUNK_SIZE_CHARS: int = int(os.environ.get("RAG_CHUNK_SIZE_CHARS", "1200"))
RAG_CHUNK_OVERLAP_CHARS: int = int(os.environ.get("RAG_CHUNK_OVERLAP_CHARS", "150"))
RAG_QUERY_TOP_K: int = int(os.environ.get("RAG_QUERY_TOP_K", "5"))
RAG_QUERY_CACHE_TTL_SECONDS: int = int(os.environ.get("RAG_QUERY_CACHE_TTL_SECONDS", "300"))
RAG_QUERY_RATE_LIMIT_MAX: int = int(os.environ.get("RAG_QUERY_RATE_LIMIT_MAX", "30"))
RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS: int = int(os.environ.get("RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS", "60"))
RAG_QUERY_DEFAULT_MAX_AGE_DAYS: int = int(os.environ.get("RAG_QUERY_DEFAULT_MAX_AGE_DAYS", "365"))
RAG_QUERY_REQUIRE_READY_STATUS: bool = os.environ.get("RAG_QUERY_REQUIRE_READY_STATUS", "true").strip().lower() in (
RAG_DOC_CACHE_TTL_SECONDS: int = int(os.environ.get("RAG_DOC_CACHE_TTL_SECONDS", "2592000"))
RAG_REDIS_PREFIX: str = os.environ.get("RAG_REDIS_PREFIX", "rag").strip()
````

## File: fn/src/domain/events/__init__.py
````python

````

## File: fn/src/domain/exceptions/__init__.py
````python

````

## File: fn/src/domain/repositories/__init__.py
````python
"""Domain repository contracts."""
⋮----
__all__ = [
````

## File: fn/src/domain/repositories/rag.py
````python
class RagQueryGateway(Protocol)
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str: ...
⋮----
def get_query_cache(self, cache_key: str) -> dict[str, Any] | None: ...
⋮----
def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None: ...
⋮----
def to_query_vector(self, query: str) -> list[float]: ...
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]: ...
⋮----
def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]: ...
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str: ...
⋮----
class RagIngestionGateway(Protocol)
⋮----
def embed_texts(self, texts: list[str], model: str) -> list[list[float]]: ...
⋮----
def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any: ...
⋮----
def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int: ...
⋮----
def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None: ...
⋮----
class DocumentPipelineGateway(Protocol)
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout") -> Any: ...
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None: ...
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None: ...
⋮----
def parsed_json_path(self, upload_object_path: str) -> str: ...
⋮----
def layout_json_path(self, upload_object_path: str) -> str: ...
⋮----
def form_json_path(self, upload_object_path: str) -> str: ...
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str: ...
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes: ...
⋮----
_rag_query_gateway: RagQueryGateway | None = None
_rag_ingestion_gateway: RagIngestionGateway | None = None
_document_pipeline_gateway: DocumentPipelineGateway | None = None
⋮----
def register_rag_query_gateway(gateway: RagQueryGateway) -> None
⋮----
_rag_query_gateway = gateway
⋮----
def get_rag_query_gateway() -> RagQueryGateway
⋮----
def register_rag_ingestion_gateway(gateway: RagIngestionGateway) -> None
⋮----
_rag_ingestion_gateway = gateway
⋮----
def get_rag_ingestion_gateway() -> RagIngestionGateway
⋮----
def register_document_pipeline_gateway(gateway: DocumentPipelineGateway) -> None
⋮----
_document_pipeline_gateway = gateway
⋮----
def get_document_pipeline_gateway() -> DocumentPipelineGateway
````

## File: fn/src/domain/services/__init__.py
````python
"""Domain services."""
⋮----
__all__ = [
````

## File: fn/src/domain/services/rag_ingestion_text.py
````python
"""
Domain Service — RAG ingestion text processing.

Pure business logic for text normalization, language detection, and
chunking.  No infrastructure dependency.
"""
⋮----
"""將 Document AI Layout Parser 的 chunks 轉換為內部 RAG chunk 格式。

    Layout Parser 已根據文件語意邊界（標題、段落、表格）切分好 chunks，
    直接使用可避免字元切分破壞完整性。

    Args:
        layout_chunks: Document AI Layout Parser 輸出的 chunk 列表，
                       每個 chunk 包含 {chunk_id, text, page_start, page_end,
                       source_block_indices}。

    Returns:
        list of dicts compatible with the RAG ingestion pipeline:
        {text, char_start, char_end, page_start, page_end,
         chunk_id, source_block_indices}
    """
result: list[dict[str, Any]] = []
⋮----
text = (chunk.get("text") or "").strip()
⋮----
# char_start / char_end are not meaningful for layout chunks;
# kept for schema compatibility with the char-split path.
⋮----
def detect_language_hint(text: str) -> str
⋮----
"""粗略語系判斷：cjk / latin / mixed。"""
cjk_count = len(re.findall(r"[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]", text))
latin_count = len(re.findall(r"[A-Za-z]", text))
⋮----
def clean_text(raw_text: str) -> str
⋮----
"""Step 1: Normalization v2，保留段落與可引用性。"""
text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
text = re.sub(r"[\u200b\u200c\u200d\ufeff]", "", text)
text = text.replace("\u3000", " ")
text = re.sub(r"[\t ]+", " ", text)
text = re.sub(r"\n[\t ]+", "\n", text)
text = re.sub(r"\n{3,}", "\n\n", text)
⋮----
def chunk_text(text: str, chunk_size: int, overlap: int) -> list[dict[str, Any]]
⋮----
"""Step 2 + Step 3: 分塊並建立 chunk metadata。"""
⋮----
chunk_size = 1200
⋮----
overlap = 0
⋮----
overlap = max(0, chunk_size // 4)
⋮----
chunks: list[dict[str, Any]] = []
start = 0
text_len = len(text)
⋮----
end = min(start + chunk_size, text_len)
content = text[start:end].strip()
⋮----
start = end - overlap
````

## File: fn/src/domain/services/rag_result_filter.py
````python
"""
Domain Service — RAG result filtering and snippet extraction.

Pure business logic for matching and ranking retrieval hits against
request scope constraints.  No infrastructure dependency.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def normalize_metadata(value: Any) -> dict[str, Any]
⋮----
raw = value.strip()
⋮----
parsed = json.loads(raw)
⋮----
def match_account(metadata: dict[str, Any], account_scope: str) -> bool
⋮----
candidates = (
⋮----
def match_workspace(metadata: dict[str, Any], workspace_scope: str) -> bool
⋮----
def match_ready_status(metadata: dict[str, Any], require_ready: bool) -> bool
⋮----
def _parse_datetime(value: Any) -> datetime | None
⋮----
raw = str(value or "").strip()
⋮----
normalized = raw.replace("Z", "+00:00")
parsed = datetime.fromisoformat(normalized)
⋮----
def match_freshness(metadata: dict[str, Any], max_age_days: int) -> bool
⋮----
timestamp = next(
⋮----
cutoff = datetime.now(UTC) - timedelta(days=max_age_days)
⋮----
def match_taxonomy(metadata: dict[str, Any], taxonomy_filters: tuple[str, ...]) -> bool
⋮----
normalized_filters = {item.lower() for item in taxonomy_filters if item}
⋮----
candidates = {
⋮----
tags = metadata.get("tags")
⋮----
def extract_text_candidate(value: Any) -> str
⋮----
snippet = str(value.get(key) or "").strip()
⋮----
def extract_snippet(hit: dict[str, Any], metadata: dict[str, Any]) -> str
⋮----
snippet = extract_text_candidate(candidate)
⋮----
def resolve_filename(metadata: dict[str, Any], fallback: str | None = None) -> str | None
⋮----
name = str(value or "").strip()
````

## File: fn/src/domain/value_objects/__init__.py
````python
"""Domain value objects."""
⋮----
__all__ = [
````

## File: fn/src/domain/value_objects/rag.py
````python
@dataclass(frozen=True)
class RagQueryInput
⋮----
query: str
account_scope: str
workspace_scope: str
top_k: int
taxonomy_filters: tuple[str, ...]
max_age_days: int
require_ready: bool
⋮----
normalized_query = (query or "").strip()
normalized_scope = (account_scope or "").strip()
normalized_workspace_scope = (workspace_scope or "").strip()
⋮----
effective_top_k = default_top_k
⋮----
effective_top_k = int(top_k)
⋮----
effective_top_k = min(effective_top_k, max_top_k)
⋮----
normalized_filters = tuple(
⋮----
effective_max_age_days = default_max_age_days
⋮----
effective_max_age_days = int(max_age_days)
⋮----
@property
    def has_query(self) -> bool
⋮----
def retrieval_top_k(self, multiplier: int = 4, cap: int = 40) -> int
⋮----
@dataclass(frozen=True)
class RagCitation
⋮----
provider: str
doc_id: str | None = None
chunk_id: str | None = None
score: float | int | None = None
filename: str | None = None
json_gcs_uri: str | None = None
search_id: str | None = None
account_id: str | None = None
workspace_id: str | None = None
taxonomy: str | None = None
processing_status: str | None = None
indexed_at: str | None = None
⋮----
def to_dict(self) -> dict[str, Any]
⋮----
@dataclass(frozen=True)
class RagQueryResult
⋮----
answer: str
citations: tuple[RagCitation, ...]
cache: str
vector_hits: int
search_hits: int
⋮----
debug: dict[str, Any] | None = None
⋮----
payload: dict[str, Any] = {
````

## File: fn/src/domain/__init__.py
````python

````

## File: fn/src/infrastructure/audit/__init__.py
````python

````

## File: fn/src/infrastructure/audit/qstash.py
````python
logger = logging.getLogger(__name__)
⋮----
def publish_query_audit(*, query: str, top_k: int, citation_count: int, vector_hits: int, search_hits: int) -> None
````

## File: fn/src/infrastructure/cache/__init__.py
````python

````

## File: fn/src/infrastructure/cache/rag_query_cache.py
````python
def build_query_cache_key(*, account_scope: str, query: str, top_k: int) -> str
⋮----
key_base = (
digest = hashlib.sha256(key_base.encode("utf-8")).hexdigest()
⋮----
def get_query_cache(cache_key: str) -> dict[str, Any] | None
⋮----
def save_query_cache(cache_key: str, payload: dict[str, Any]) -> None
````

## File: fn/src/infrastructure/external/documentai/__init__.py
````python

````

## File: fn/src/infrastructure/external/documentai/client.py
````python
"""
Document AI 服務層 — 封裝 google-cloud-documentai 的 process_document 呼叫。

⚠️  兩個 processor 均位於 US region，client 須使用 us-documentai.googleapis.com

用法：
    from infrastructure.external.documentai.client import process_document_gcs_with_form
    result = process_document_gcs_with_form(gcs_uri="gs://bucket/file.pdf")
    print(result.text)
    print(result.chunks)    # Layout Parser chunks（結構感知分塊）
    print(result.entities)  # Form Parser entities（結構化欄位）
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
# 模組層級 client — 使用 us regional endpoint（兩個 processor 均位於 US region）
_client: documentai.DocumentProcessorServiceClient | None = None
⋮----
def _get_client() -> documentai.DocumentProcessorServiceClient
⋮----
client_options = {"api_endpoint": DOCAI_API_ENDPOINT}
_client = documentai.DocumentProcessorServiceClient(
⋮----
def _extract_chunks(document: Any) -> list[dict[str, Any]]
⋮----
"""從 Layout Parser 回傳的 document.chunked_document.chunks 提取分塊資訊。

    Layout Parser 的 chunks 包含語意邊界（標題、段落、表格各自成 chunk），
    可直接作為 RAG 的 embedding 單位，取代字元切分。

    Returns:
        list of dicts with keys: chunk_id, text, page_start, page_end,
        source_block_indices
    """
chunked = getattr(document, "chunked_document", None)
⋮----
result: list[dict[str, Any]] = []
⋮----
page_span = getattr(c, "page_span", None)
⋮----
def _extract_entities(document: Any) -> list[dict[str, Any]]
⋮----
"""從 Form Parser 回傳的 document.entities 提取結構化欄位。

    Form Parser entities 對應採購訂單中的 PO號、金額、日期、供應商等 KV 欄位。

    Returns:
        list of dicts with keys: type, mention_text, confidence, normalized_value
    """
⋮----
normalized = getattr(e, "normalized_value", None)
⋮----
@dataclass
class ParsedDocument
⋮----
"""Document AI 解析結果的精簡表示。"""
⋮----
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
⋮----
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
⋮----
raw_document = documentai.RawDocument(content=content, mime_type=mime_type)
request = documentai.ProcessRequest(
⋮----
response = client.process_document(request=request)
document = response.document
⋮----
chunks = _extract_chunks(document)
entities = _extract_entities(document)
⋮----
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
⋮----
gcs_document = documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type)
⋮----
"""
    Layout Parser（主）+ Form Parser（副）雙通道解析。

    1. 呼叫 Layout Parser（DOCAI_LAYOUT_PROCESSOR_NAME）取得語意分塊（chunks）。
    2. 若 DOCAI_FORM_PROCESSOR_NAME 已設定，額外呼叫 Form Parser 取得結構化欄位（entities）。
    3. 合併為單一 ParsedDocument 回傳。

    Form Parser 副通道為 best-effort：失敗時記錄 warning 並以空 entities 繼續，
    不阻斷主流程（Rule 10 — Failure Strategy）。

    Args:
        gcs_uri:   GCS 檔案路徑，格式為 gs://bucket-name/path/to/file。
        mime_type: 文件的 MIME 類型，預設 application/pdf。

    Returns:
        ParsedDocument: chunks 來自 Layout Parser，entities 來自 Form Parser（或空 list）。
    """
parsed = process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
⋮----
form_name = DOCAI_FORM_PROCESSOR_NAME
⋮----
form_parsed = process_document_gcs(
````

## File: fn/src/infrastructure/external/openai/__init__.py
````python

````

## File: fn/src/infrastructure/external/openai/client.py
````python
"""
OpenAI client service — 提供 embeddings / LLM 共用 client。
"""
⋮----
_client: OpenAI | None = None
⋮----
def get_openai_client() -> OpenAI
⋮----
"""
    取得單例 OpenAI client。

    Raises:
        RuntimeError: OPENAI_API_KEY 未設定時。
    """
⋮----
_client = OpenAI(
````

## File: fn/src/infrastructure/external/openai/embeddings.py
````python
"""
Embeddings service — 封裝 OpenAI embedding 呼叫。
"""
⋮----
def _build_embedding_kwargs(model_name: str) -> dict
⋮----
kwargs = {"model": model_name}
⋮----
def embed_text(text: str, model: str | None = None) -> list[float]
⋮----
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
⋮----
def embed_texts(texts: list[str], model: str | None = None) -> list[list[float]]
⋮----
"""
    批次產生多段文字 embeddings。

    Args:
        texts: 文字列表。
        model: 覆蓋預設模型，未傳則使用 OPENAI_EMBEDDING_MODEL。

    Returns:
        list[list[float]]: 與輸入順序一致的向量列表。
    """
````

## File: fn/src/infrastructure/external/openai/llm.py
````python
"""
LLM service — 封裝 OpenAI chat completion 呼叫。
"""
⋮----
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
content = resp.choices[0].message.content
````

## File: fn/src/infrastructure/external/openai/rag_query.py
````python
def to_query_vector(query: str, *, model: str) -> list[float]
⋮----
def generate_answer(*, query: str, context_block: str) -> str
````

## File: fn/src/infrastructure/external/upstash/__init__.py
````python

````

## File: fn/src/infrastructure/external/upstash/_base.py
````python
"""
Upstash 共用工具 — 錯誤類別與基礎輔助函數。
供 vector_client / redis_client / search_client / qstash_client 共享使用。
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
class UpstashConfigError(RuntimeError)
⋮----
"""Upstash 配置缺失。"""
⋮----
class UpstashSdkError(RuntimeError)
⋮----
"""Upstash SDK 載入失敗。"""
⋮----
def _require(value: str, name: str) -> str
⋮----
def _import_module(module_name: str, install_hint: str)
````

## File: fn/src/infrastructure/external/upstash/clients.py
````python
"""
Upstash clients — 向後相容的重新匯出桶。
各功能已拆分至對應的聚焦模組：
  - vector_client.py  (upsert_vectors, query_vectors)
  - redis_client.py   (redis_get_json, redis_set_json, redis_fixed_window_allow)
  - search_client.py  (upsert_search_documents, query_search_documents)
  - qstash_client.py  (publish_qstash_json)
  - _base.py          (UpstashConfigError, UpstashSdkError)

此檔案保留所有原始公開符號以維持向後相容。
"""
⋮----
__all__ = [
````

## File: fn/src/infrastructure/external/upstash/qstash_client.py
````python
"""
Upstash QStash 客戶端 — 非同步訊息投遞操作。
"""
⋮----
_QSTASH_CLIENT: Any | None = None
⋮----
logger = logging.getLogger(__name__)
⋮----
def get_qstash_client() -> Any
⋮----
"""取得 QStash 官方 SDK client（單例）。"""
⋮----
mod = _import_module("qstash", "pip install qstash")
client_cls = getattr(mod, "QStash", None)
⋮----
# 新舊 SDK 參數名稱兼容
kwargs: dict[str, Any] = {
⋮----
_QSTASH_CLIENT = client_cls(**kwargs)
⋮----
# 退回最小初始化方式
_QSTASH_CLIENT = client_cls(token=_require(QSTASH_TOKEN, "QSTASH_TOKEN"))
⋮----
def publish_qstash_json(url: str, body: dict[str, Any], delay: str | None = None) -> bool
⋮----
"""透過 QStash 投遞 JSON 訊息（best effort）。"""
target_url = url.strip()
⋮----
client = get_qstash_client()
⋮----
publish_json = getattr(client, "publish_json", None)
⋮----
publish = getattr(client, "publish", None)
````

## File: fn/src/infrastructure/external/upstash/rag_query.py
````python
def query_vector(vector: list[float], top_k: int) -> list[dict]
⋮----
def query_search(query: str, top_k: int) -> list[dict]
````

## File: fn/src/infrastructure/external/upstash/redis_client.py
````python
"""
Upstash Redis 客戶端 — JSON 讀寫與固定窗口限流操作。
"""
⋮----
_REDIS_CLIENT: Any | None = None
⋮----
logger = logging.getLogger(__name__)
⋮----
def get_redis_client() -> Any
⋮----
"""取得 Upstash Redis 官方 SDK client（單例）。"""
⋮----
mod = _import_module("upstash_redis", "pip install upstash-redis")
redis_cls = getattr(mod, "Redis", None)
⋮----
_REDIS_CLIENT = redis_cls(
⋮----
def redis_get_json(key: str) -> dict[str, Any] | None
⋮----
"""從 Upstash Redis 讀取 JSON 字串並反序列化。"""
client = get_redis_client()
raw = client.get(key)
⋮----
raw_text = raw.decode("utf-8", errors="ignore")
⋮----
raw_text = str(raw)
⋮----
parsed = json.loads(raw_text)
⋮----
def redis_set_json(key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None
⋮----
"""將 dict 寫入 Upstash Redis；可選擇 TTL。"""
⋮----
payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
⋮----
"""固定窗限流：回傳 (allowed, remaining)。"""
⋮----
current = int(client.incr(key) or 0)
⋮----
allowed = current <= max_requests
remaining = max(0, max_requests - current)
````

## File: fn/src/infrastructure/external/upstash/search_client.py
````python
"""
Upstash Search 客戶端 — 全文搜尋 upsert / query 操作。
"""
⋮----
_SEARCH_INDEX: Any | None = None
⋮----
logger = logging.getLogger(__name__)
⋮----
def get_search_index() -> Any
⋮----
"""取得 Upstash Search 官方 SDK index（單例）。"""
⋮----
mod = _import_module("upstash_search", "pip install upstash-search")
search_cls = getattr(mod, "Search", None)
⋮----
index_name = UPSTASH_SEARCH_INDEX or "default"
client = search_cls(
_SEARCH_INDEX = client.index(index_name)
⋮----
def upsert_search_documents(documents: list[dict[str, Any]]) -> int
⋮----
"""批次寫入 Upstash Search index（best effort，不拋出上層）。"""
⋮----
normalized: list[dict[str, Any]] = []
⋮----
doc_id = str(item.get("id") or "").strip()
⋮----
content = item.get("content") if isinstance(item.get("content"), dict) else {}
metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
⋮----
index = get_search_index()
⋮----
def query_search_documents(query: str, top_k: int) -> list[dict[str, Any]]
⋮----
"""
    以 Upstash Search REST 進行補充檢索（best effort）。

    回傳格式統一為 list[dict]，單筆含 text / score / source 等欄位。
    """
⋮----
# Prefer official SDK first; fallback to REST probing for compatibility.
⋮----
result = index.search(query=query, limit=top_k)
⋮----
items = result
⋮----
items = (
⋮----
items = getattr(result, "results", None) or getattr(result, "data", None) or []
⋮----
item = dict(item)
⋮----
text = str(
⋮----
endpoint_base = UPSTASH_SEARCH_REST_URL.rstrip("/")
body_candidates = [
path_candidates = ["/query", "/search"]
⋮----
url = f"{endpoint_base}{path}"
⋮----
raw = None
⋮----
req = urlrequest.Request(
⋮----
raw = resp.read().decode("utf-8", errors="ignore")
⋮----
payload = json.loads(raw)
⋮----
candidates = []
⋮----
candidates = (
⋮----
candidates = payload
````

## File: fn/src/infrastructure/external/upstash/vector_client.py
````python
"""
Upstash Vector 客戶端 — 向量 upsert / query 操作。
"""
⋮----
_VECTOR_INDEX: Any | None = None
⋮----
logger = logging.getLogger(__name__)
⋮----
def get_vector_index() -> Any
⋮----
"""取得 Upstash Vector 官方 SDK Index 實例（單例）。"""
⋮----
mod = _import_module("upstash_vector", "pip install upstash-vector")
index_cls = getattr(mod, "Index", None)
⋮----
_VECTOR_INDEX = index_cls(
⋮----
def _normalize_vector_item(item: Any) -> dict[str, Any]
⋮----
def upsert_vectors(items: list[dict[str, Any]], namespace: str = "") -> Any
⋮----
"""
    批次 upsert 向量資料到 Upstash Vector。

    items 每筆至少包含：
      - id: str
      - vector: list[float]
      - metadata: dict[str, Any]
    """
index = get_vector_index()
sdk_payload = [
tuples_payload = [
⋮----
"""查詢 Upstash Vector，統一輸出為 list[dict]。"""
⋮----
result = index.query(
⋮----
result = index.query(vector=vector, top_k=top_k, namespace=namespace)
⋮----
candidates = result.get("result") or result.get("matches") or result.get("data") or []
````

## File: fn/src/infrastructure/external/__init__.py
````python

````

## File: fn/src/infrastructure/persistence/firestore/__init__.py
````python

````

## File: fn/src/infrastructure/persistence/firestore/document_repository.py
````python
"""
Firestore 服務層 — 使用 firebase-admin 管理完整的 document lifecycle。

Firestore 只存輕量索引（供 account-scoped 列表），
解析全文以 JSON 格式存回 GCS 的對應路徑（files/ 前綴）。

Document Schema:
    {
        "id": "doc-abc123",
        "status": "processing" | "completed" | "error",
        "source": {
            "gcs_uri": "gs://bucket/uploads/file.pdf",
            "filename": "file.pdf",
            "size_bytes": 102400,
            "uploaded_at": "2026-03-22T...",
            "mime_type": "application/pdf"
        },
        "parsed": {
            "json_gcs_uri": "gs://bucket/files/file.json",   // 全文 JSON 位置
            "page_count": 5,
            "parsed_at": "2026-03-22T...",
            "extraction_ms": 1234
        },
        "error": {  // 只在 status=error 時出現
            "message": "...",
            "timestamp": "2026-03-22T..."
        }
    }

用法：
    init_document(doc_id, gcs_uri, filename, size_bytes, mime_type)
    update_parsed(doc_id, json_gcs_uri, page_count, extraction_ms)
    record_error(doc_id, message)
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def _document_ref(doc_id: str, account_id: str)
⋮----
"""Resolve strict account-scoped document reference."""
⋮----
db = fb_firestore.client()
⋮----
"""
    初始化 Firestore document，標記為 processing 狀態。

    在檔案上傳到 GCS 時呼叫，建立初始的 source metadata。

    Args:
        doc_id:      文件識別碼。
        gcs_uri:     GCS 位置，例如 gs://bucket/path/file.pdf
        filename:    原始檔名。
        size_bytes:  文件大小（位元組）。
        mime_type:   MIME 類型。
    """
ref = _document_ref(doc_id, account_id)
⋮----
payload = {
⋮----
"""
    更新 document 的解析結果索引，標記為 completed 狀態。

    全文內容已寫入 GCS JSON 檔（json_gcs_uri），
    Firestore 只保留輕量索引供前端列表使用。

    Args:
        doc_id:         文件識別碼。
        json_gcs_uri:   GCS JSON 檔案位置，例如 gs://bucket/files/file.json
        page_count:     頁數。
        extraction_ms:  解析耗時（毫秒），非必填。
        chunk_count:    Layout Parser 語意分塊數量。
        entity_count:   Form Parser 結構化欄位數量。
    """
⋮----
"""
    更新 Layout Parser 解析結果，標記文件為 completed 狀態。

    Layout JSON（含 text、chunks）已寫入 GCS，
    Firestore 只保留輕量索引（layout_json_gcs_uri、page_count、layout_chunk_count）。

    Args:
        doc_id:               文件識別碼。
        layout_json_gcs_uri:  Layout Parser GCS JSON 路徑（.layout.json）。
        page_count:           頁數。
        extraction_ms:        解析耗時（毫秒）。
        chunk_count:          語意分塊數量。
    """
⋮----
"""
    更新 Form Parser 解析結果（不覆蓋 Layout Parser 的欄位）。

    Form JSON（含 entities）已寫入 GCS，
    Firestore 用 dot-notation update 新增 form 專屬欄位。

    Args:
        doc_id:              文件識別碼。
        form_json_gcs_uri:   Form Parser GCS JSON 路徑（.form.json）。
        extraction_ms:       解析耗時（毫秒）。
        entity_count:        結構化欄位數量。
    """
⋮----
def record_error(doc_id: str, message: str, account_id: str) -> None
⋮----
"""
    記錄解析錯誤，標記為 error 狀態。

    在 Document AI 呼叫失敗時呼叫。

    Args:
        doc_id:  文件識別碼。
        message: 錯誤訊息。
    """
⋮----
"""標記 RAG ingestion 完成（ready）。"""
⋮----
def record_rag_error(doc_id: str, message: str, account_id: str) -> None
⋮----
"""記錄 RAG ingestion 失敗，不覆蓋 parse 狀態。"""
````

## File: fn/src/infrastructure/persistence/storage/__init__.py
````python

````

## File: fn/src/infrastructure/persistence/storage/client.py
````python
"""
Cloud Storage 服務層 — 使用 firebase-admin 的 storage 模組下載／上傳物件。

用法：
    from infrastructure.persistence.storage.client import download_bytes, upload_json
    data = download_bytes(bucket_name="my-bucket", object_path="uploads/doc.pdf")
    uri  = upload_json(bucket_name="my-bucket", object_path="files/doc.json", data={...})
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
# 上傳檔案路徑前綴 → 解析結果前綴
_UPLOAD_PREFIX = "uploads/"
_FILES_PREFIX = "files/"
⋮----
def parsed_json_path(upload_object_path: str) -> str
⋮----
"""
    將 GCS 上傳路徑轉換為對應的解析結果 JSON 路徑。

    規則：
      - 去掉 uploads/ 前綴，換成 files/ 前綴
      - 副檔名替換為 .json

    範例：
        uploads/org/ws/file.pdf  ->  files/org/ws/file.json
        uploads/doc.png          ->  files/doc.json
    """
relative = upload_object_path.removeprefix(_UPLOAD_PREFIX)
⋮----
def layout_json_path(upload_object_path: str) -> str
⋮----
"""
    Layout Parser 解析結果的 GCS 路徑。

    範例：
        uploads/org/ws/file.pdf  ->  files/org/ws/file.layout.json
    """
⋮----
def form_json_path(upload_object_path: str) -> str
⋮----
"""
    Form Parser 解析結果的 GCS 路徑。

    範例：
        uploads/org/ws/file.pdf  ->  files/org/ws/file.form.json
    """
⋮----
def upload_json(bucket_name: str, object_path: str, data: dict) -> str
⋮----
"""
    將 dict 序列化為 JSON 後上傳至 Cloud Storage。

    Args:
        bucket_name: GCS bucket 名稱（不含 gs:// 前綴）。
        object_path: bucket 內的目標路徑，例如 files/org/ws/file.json
        data:        要序列化的資料，必須可 JSON 序列化。

    Returns:
        str: gs:// 完整 URI，例如 gs://bucket/files/org/ws/file.json
    """
bucket = fb_storage.bucket(bucket_name)
blob = bucket.blob(object_path)
⋮----
# 緊湊序列化可降低 CPU 與儲存傳輸成本。
json_bytes = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
⋮----
uri = f"gs://{bucket_name}/{object_path}"
⋮----
def download_bytes(bucket_name: str, object_path: str) -> bytes
⋮----
"""
    從 Cloud Storage 下載物件並回傳 bytes。

    Args:
        bucket_name: GCS bucket 名稱（不含 gs:// 前綴）。
        object_path: bucket 內的物件路徑。

    Returns:
        bytes: 物件的完整二進位內容。

    Raises:
        google.cloud.exceptions.NotFound: 物件不存在時。
    """
⋮----
data = blob.download_as_bytes()
````

## File: fn/src/infrastructure/persistence/__init__.py
````python

````

## File: fn/src/infrastructure/__init__.py
````python

````

## File: fn/src/interface/handlers/__init__.py
````python
__all__ = [
````

## File: fn/src/interface/handlers/_https_helpers.py
````python
"""
HTTPS handler 共用工具 — 驗證、存取控制與輸入解析輔助函數。
供 parse_document / rag_query / rag_reindex 共享使用。
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def _extract_auth_uid(req: https_fn.CallableRequest) -> str
⋮----
auth = getattr(req, "auth", None)
⋮----
uid = str(getattr(auth, "uid", "")).strip()
⋮----
token = getattr(auth, "token", None)
⋮----
def _assert_account_access(uid: str, account_id: str) -> None
⋮----
db = fb_firestore.client()
snap = db.collection("accounts").document(account_id).get()
⋮----
data = snap.to_dict() or {}
owner_id = str(data.get("ownerId", "")).strip()
member_ids = data.get("memberIds") if isinstance(data.get("memberIds"), list) else []
member_set = {str(item or "").strip() for item in member_ids}
⋮----
def _assert_workspace_belongs_account(account_id: str, workspace_id: str) -> None
⋮----
snap = db.collection("workspaces").document(workspace_id).get()
⋮----
bound_account_id = str(data.get("accountId", "")).strip()
⋮----
def _parse_taxonomy_filters(raw_value: Any) -> list[str]
⋮----
def _to_bool(raw_value: Any, default_value: bool) -> bool
⋮----
raw = str(raw_value or "").strip().lower()
⋮----
def _parse_gs_uri(gs_uri: str) -> tuple[str, str]
⋮----
path_part = gs_uri.split("gs://", 1)[1]
````

## File: fn/src/interface/handlers/https.py
````python
"""
HTTPS Callable 觸發器 — 向後相容的重新匯出桶。
各 handler 已拆分至對應的聚焦模組：
  - parse_document.py      (handle_parse_document)
  - rag_query_handler.py   (handle_rag_query)
  - rag_reindex_handler.py (handle_rag_reindex_document)
  - _https_helpers.py      (共用驗證/解析工具)

此檔案保留所有原始公開符號以維持向後相容。
"""
⋮----
__all__ = [
````

## File: fn/src/interface/handlers/parse_document.py
````python
"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。

Schema validation (Rule 4) is performed via ParseDocumentRequest.from_raw()
before any application-layer call.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_parse_document(req: https_fn.CallableRequest) -> dict
⋮----
"""
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    All external input is validated through ParseDocumentRequest before
    reaching the application layer (Rule 4).
    """
runtime = get_document_pipeline()
⋮----
schema = ParseDocumentRequest.from_raw(req.data or {})
⋮----
# Derive bucket / object_path from the validated URI.
path_part = schema.gcs_uri.split("gs://", 1)[1]
⋮----
# ── 初始化 Firestore document ───────────────────────────────────────────
⋮----
# ── 同步解析 ─────────────────────────────────────────────────────────────
start_time = time.time()
⋮----
parsed = runtime.process_document_gcs(
extraction_ms = int((time.time() - start_time) * 1000)
⋮----
json_object_path = runtime.layout_json_path(object_path)
json_gcs_uri = runtime.upload_json(
⋮----
rag = ingest_document_for_rag(
⋮----
else:  # "form"
json_object_path = runtime.form_json_path(object_path)
````

## File: fn/src/interface/handlers/rag_query_handler.py
````python
"""
HTTPS Callable — handle_rag_query：RAG 查詢（Step 7）。

Schema validation (Rule 4) is performed via RagQueryRequest.from_raw()
before any application-layer call.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_rag_query(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：RAG 查詢（Step 7）."""
uid = _extract_auth_uid(req)
⋮----
schema = RagQueryRequest.from_raw(
⋮----
code = (
⋮----
require_ready = (
max_age_days = schema.max_age_days if schema.max_age_days is not None else RAG_QUERY_DEFAULT_MAX_AGE_DAYS
⋮----
result = execute_rag_query(
response = {
````

## File: fn/src/interface/handlers/rag_reindex_handler.py
````python
"""
HTTPS Callable — handle_rag_reindex_document：手動觸發文件 RAG 重新索引。

Schema validation (Rule 4) is performed via RagReindexRequest.from_raw()
before any application-layer call.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion."""
runtime = get_document_pipeline()
⋮----
schema = RagReindexRequest.from_raw(req.data or {})
⋮----
json_bytes = runtime.download_bytes(
parsed_payload: dict = (
⋮----
text = str(parsed_payload.get("text", "")).strip()
⋮----
# Enrich from the JSON payload when schema fields were left empty.
source_gcs_uri = schema.source_gcs_uri or str(
⋮----
workspace_id = schema.workspace_id
⋮----
workspace_id = str(parsed_payload.get("workspace_id", "")).strip()
⋮----
workspace_id = str(
⋮----
filename = schema.filename
⋮----
filename = (
⋮----
page_count = schema.page_count
⋮----
page_count = int(parsed_payload.get("page_count", 0) or 0)
⋮----
# Read stored layout chunks; passes None when absent (falls back to char-split).
layout_chunks: list[dict] | None = parsed_payload.get("chunks") or None
⋮----
rag = ingest_document_for_rag(
````

## File: fn/src/interface/handlers/storage.py
````python
"""
Storage 觸發器 — 監聽 GCS 物件建立事件，自動送 Document AI 解析。

流程：
    GCS object.finalized（uploads/ 前綴）
        → 建立初始 Firestore document（status=processing）
        → Document AI 直接從 GCS URI 讀取
        → 將解析全文以 JSON 格式寫回 GCS（files/ 前綴，同目錄結構）
        → 更新 Firestore 輕量索引（status=completed，含 json_gcs_uri）
        → 如失敗，記錄 error

Firestore 只存索引（供 /dev-tools 顯示已上傳檔案），
完整解析結果透過 json_gcs_uri 讀取 GCS JSON 檔。
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
# 只處理這個資料夾下的上傳檔案（空字串 = 處理整個 bucket）
WATCH_PREFIX: str = os.environ.get("WATCH_PREFIX", "uploads/")
⋮----
# 支援的 MIME 類型對照表（副檔名 → MIME）
_MIME_MAP: dict[str, str] = {
⋮----
def _mime_from_path(object_path: str) -> str | None
⋮----
"""Best-effort account scope binding for storage-triggered uploads.

    Priority:
    1) custom metadata field `account_id`
    2) path convention: uploads/{accountId}/...
    3) fallback: None (reject write)
    """
⋮----
from_meta = str(event_metadata.get("account_id", "")).strip()
⋮----
prefix = f"{WATCH_PREFIX}"
⋮----
remainder = object_path[len(prefix):]
# uploads/{accountId}/file.pdf
⋮----
candidate = remainder.split("/", 1)[0].strip()
⋮----
def _extract_workspace_id(event_metadata: dict | None) -> str | None
⋮----
workspace_id = str(event_metadata.get("workspace_id", "")).strip()
⋮----
def _extract_display_filename(object_path: str, event_metadata: dict | None) -> str
⋮----
candidates: tuple[Any, ...] = ()
⋮----
candidates = (
⋮----
filename = str(candidate or "").strip()
⋮----
"""
    Cloud Storage on_object_finalized 觸發器。

    - 只處理 WATCH_PREFIX 下、且為支援 MIME 類型的檔案。
    - 初始化 → Document AI 解析 → 更新 Firestore
    - 異常時記錄至 Firestore。
    """
runtime = get_document_pipeline()
data = event.data
⋮----
bucket_name: str = data.bucket
object_path: str = data.name or ""
size_bytes: int = int(data.size or 0)
⋮----
# ── 路徑過濾 ────────────────────────────────────────────────────────────
⋮----
mime_type = _mime_from_path(object_path)
⋮----
account_id = _extract_account_id(object_path, data.metadata)
⋮----
workspace_id = _extract_workspace_id(data.metadata)
⋮----
# doc_id 由實際儲存物件名稱推導；顯示檔名則優先使用上傳時的 custom metadata。
storage_filename = os.path.basename(object_path)
display_filename = _extract_display_filename(object_path, data.metadata)
⋮----
gcs_uri = f"gs://{bucket_name}/{object_path}"
⋮----
# ── Step 1: 初始化 Firestore document ──────────────────────────────────
⋮----
# ── Step 2: Document AI 解析（Layout Parser） ─────────────────────────
start_time = time.time()
⋮----
parsed = runtime.process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type, parser="layout")
extraction_ms = int((time.time() - start_time) * 1000)
⋮----
# ── Step 3: 將解析全文寫回 GCS（files/ 前綴，.layout.json 副檔名）─
json_object_path = runtime.layout_json_path(object_path)
json_data = {
json_gcs_uri = runtime.upload_json(
⋮----
# ── Step 4: 更新 Firestore 索引（layout 欄位）──────────────────────
⋮----
# ── Step 5/6: RAG ingestion（embed + vector + ready）───────────────
⋮----
rag = ingest_document_for_rag(
````

## File: fn/src/interface/schemas/__init__.py
````python

````

## File: fn/src/interface/schemas/parse_document.py
````python
"""
Input schema for parse_document HTTPS Callable (Rule 4 — Contract / Schema).

All data entering the system through this function must pass through this
schema before being forwarded to the application layer.  Validation raises
ValueError so that the handler can convert it to a typed HttpsError.
"""
⋮----
_MIME_MAP: dict[str, str] = {
⋮----
_ALLOWED_MIMES: frozenset[str] = frozenset(_MIME_MAP.values())
⋮----
@dataclass
class ParseDocumentRequest
⋮----
"""Validated input contract for the parse_document callable."""
⋮----
account_id: str
workspace_id: str
gcs_uri: str
doc_id: str
filename: str
mime_type: str
size_bytes: int
run_rag: bool
parser: str  # "layout" | "form" | "ocr"
⋮----
@classmethod
    def from_raw(cls, raw: dict) -> "ParseDocumentRequest"
⋮----
"""Parse and validate raw request data.

        Raises:
            ValueError: if any required field is missing or invalid.
        """
account_id = str(raw.get("account_id", "")).strip()
⋮----
workspace_id = str(raw.get("workspace_id", "")).strip()
⋮----
gcs_uri = str(raw.get("gcs_uri", "")).strip()
⋮----
# Derive doc_id and filename from URI when not provided explicitly.
path_part = gcs_uri.split("gs://", 1)[1]
storage_filename = os.path.basename(path_part)
⋮----
doc_id = str(raw.get("doc_id", "")).strip() or default_doc_id
filename = (
⋮----
mime_type = str(raw.get("mime_type", "")).strip()
⋮----
resolved = _MIME_MAP.get(ext.lower())
⋮----
mime_type = resolved
⋮----
size_bytes = int(raw.get("size_bytes", 0) or 0)
⋮----
size_bytes = 0
⋮----
run_rag = bool(raw.get("run_rag", True))
⋮----
parser = str(raw.get("parser", "layout")).strip().lower()
````

## File: fn/src/interface/schemas/rag_query.py
````python
"""
Input schema for rag_query HTTPS Callable (Rule 4 — Contract / Schema).

All data entering the system through this function must pass through this
schema before being forwarded to the application layer.
"""
⋮----
@dataclass
class RagQueryRequest
⋮----
"""Validated input contract for the rag_query callable."""
⋮----
uid: str
account_id: str
workspace_id: str
query: str
top_k: int | None
max_age_days: int | None
taxonomy_filters: list[str]
require_ready: bool | None
⋮----
@classmethod
    def from_raw(cls, uid: str, raw: dict, default_require_ready: bool) -> "RagQueryRequest"
⋮----
"""Parse and validate raw request data.

        Args:
            uid: authenticated user ID (already extracted from auth context).
            raw: raw request payload dict.
            default_require_ready: server-side default for require_ready flag.

        Raises:
            ValueError: if any required field is missing or invalid.
        """
⋮----
account_id = str(raw.get("account_id", "")).strip()
⋮----
workspace_id = str(raw.get("workspace_id", "")).strip()
⋮----
query = str(raw.get("query", "")).strip()
⋮----
top_k: int | None = None
raw_top_k = raw.get("top_k")
⋮----
top_k = int(raw_top_k)
⋮----
top_k = None
⋮----
max_age_days: int | None = None
raw_age = raw.get("max_age_days")
⋮----
max_age_days = int(raw_age)
⋮----
max_age_days = None
⋮----
raw_filters = raw.get("taxonomy_filters")
⋮----
taxonomy_filters = [
⋮----
taxonomy_filters = []
⋮----
require_ready: bool | None = None
raw_ready = raw.get("require_ready")
⋮----
require_ready = raw_ready
⋮----
text = str(raw_ready).strip().lower()
⋮----
require_ready = True
⋮----
require_ready = False
````

## File: fn/src/interface/schemas/rag_reindex.py
````python
"""
Input schema for rag_reindex_document HTTPS Callable (Rule 4 — Contract / Schema).

All data entering the system through this function must pass through this
schema before being forwarded to the application layer.
"""
⋮----
@dataclass
class RagReindexRequest
⋮----
"""Validated input contract for the rag_reindex_document callable."""
⋮----
account_id: str
doc_id: str
json_gcs_uri: str
source_gcs_uri: str
workspace_id: str
filename: str
page_count: int
⋮----
@classmethod
    def from_raw(cls, raw: dict) -> "RagReindexRequest"
⋮----
"""Parse and validate raw request data.

        Raises:
            ValueError: if any required field is missing or invalid.
        """
account_id = str(raw.get("account_id", "")).strip()
⋮----
doc_id = str(raw.get("doc_id", "")).strip()
⋮----
json_gcs_uri = str(raw.get("json_gcs_uri", "")).strip()
⋮----
source_gcs_uri = str(raw.get("source_gcs_uri", "")).strip()
workspace_id = str(raw.get("workspace_id", "")).strip()
⋮----
filename = (
⋮----
page_count = int(raw.get("page_count", 0) or 0)
⋮----
page_count = 0
````

## File: fn/src/interface/__init__.py
````python

````

## File: fn/tests/__init__.py
````python

````

## File: fn/tests/conftest.py
````python
SRC_DIR = Path(__file__).resolve().parents[1] / "src"
````

## File: fn/tests/test_domain_repository_gateways.py
````python
class _FakeRagQueryGateway
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
⋮----
def get_query_cache(self, cache_key: str) -> dict | None
⋮----
def save_query_cache(self, cache_key: str, payload: dict) -> None
⋮----
def to_query_vector(self, query: str) -> list[float]
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict]
⋮----
def query_search(self, query: str, top_k: int) -> list[dict]
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str
⋮----
class _FakeRagIngestionGateway
⋮----
def embed_texts(self, texts: list[str], model: str) -> list[list[float]]
⋮----
def upsert_vectors(self, items: list[dict], namespace: str = "") -> None
⋮----
def upsert_search_documents(self, documents: list[dict]) -> int
⋮----
def redis_set_json(self, key: str, value: dict, ttl_seconds: int = 0) -> None
⋮----
class _FakeDocumentPipelineGateway
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> dict
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def parsed_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict) -> str
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
⋮----
def test_register_gateways_WithAllGatewayTypes_RetrievesExactInstances() -> None
⋮----
rag_query_gateway = _FakeRagQueryGateway()
rag_ingestion_gateway = _FakeRagIngestionGateway()
document_pipeline_gateway = _FakeDocumentPipelineGateway()
⋮----
def test_applicationGatewayShim_AfterDomainRegistration_ReturnsIdenticalInstances() -> None
````

## File: fn/tests/test_input_schemas.py
````python
"""
Unit tests for interface/schemas/ — Rule 4 (Contract / Schema) compliance.

Verifies that all HTTPS Callable input schemas reject invalid inputs and
accept valid inputs before reaching the application layer.
"""
⋮----
# ── ParseDocumentRequest ──────────────────────────────────────────────────────
⋮----
class TestParseDocumentRequest
⋮----
def test_fromRaw_WithValidPdf_ReturnsSchema(self) -> None
⋮----
raw = {
schema = ParseDocumentRequest.from_raw(raw)
⋮----
def test_fromRaw_WithExplicitDocId_UsesProvidedDocId(self) -> None
⋮----
def test_fromRaw_WithRunRagFalse_SetsRunRagFalse(self) -> None
⋮----
def test_fromRaw_WithParserOcr_AcceptsOcrParser(self) -> None
⋮----
def test_fromRaw_InfersMimeFromExtension_WhenMimeOmitted(self) -> None
⋮----
def test_fromRaw_MissingAccountId_RaisesValueError(self) -> None
⋮----
def test_fromRaw_MissingWorkspaceId_RaisesValueError(self) -> None
⋮----
def test_fromRaw_InvalidGcsUri_RaisesValueError(self) -> None
⋮----
def test_fromRaw_UnknownExtensionWithoutMime_RaisesValueError(self) -> None
⋮----
# ── RagQueryRequest ───────────────────────────────────────────────────────────
⋮----
class TestRagQueryRequest
⋮----
def test_fromRaw_WithValidInput_ReturnsSchema(self) -> None
⋮----
schema = RagQueryRequest.from_raw(
⋮----
def test_fromRaw_WithTopK_ParsesInt(self) -> None
⋮----
def test_fromRaw_WithTaxonomyFilters_NormalizesStrings(self) -> None
⋮----
def test_fromRaw_EmptyUid_RaisesValueError(self) -> None
⋮----
def test_fromRaw_MissingQuery_RaisesValueError(self) -> None
⋮----
# ── RagReindexRequest ─────────────────────────────────────────────────────────
⋮----
class TestRagReindexRequest
⋮----
def test_fromRaw_WithMinimalValidInput_ReturnsSchema(self) -> None
⋮----
schema = RagReindexRequest.from_raw(raw)
⋮----
def test_fromRaw_MissingDocId_RaisesValueError(self) -> None
⋮----
def test_fromRaw_MissingJsonGcsUri_RaisesValueError(self) -> None
⋮----
def test_fromRaw_WithPageCount_ParsesInt(self) -> None
````

## File: fn/tests/test_rag_ingestion_text.py
````python
"""Unit tests for domain/services/rag_ingestion_text.py — Layout Parser path."""
⋮----
def test_layoutChunksToRagChunks_WithValidChunks_ReturnsExpectedShape() -> None
⋮----
layout_chunks = [
⋮----
result = layout_chunks_to_rag_chunks(layout_chunks)
⋮----
first = result[0]
assert first["text"] == "採購訂單標頭"  # whitespace stripped
⋮----
# char_start / char_end are schema-compat fields
⋮----
second = result[1]
⋮----
def test_layoutChunksToRagChunks_WithEmptyTextChunk_SkipsChunk() -> None
⋮----
def test_layoutChunksToRagChunks_WithEmptyInput_ReturnsEmptyList() -> None
⋮----
def test_layoutChunksToRagChunks_WithMissingOptionalFields_UsesDefaults() -> None
⋮----
layout_chunks = [{"text": "只有文字欄位"}]
⋮----
chunk = result[0]
````

## File: fn/.env.example
````
# fn/.env.example
# 複製為 fn/.env 後填入實際值，再執行 fn/ 的 Cloud Functions。
# 唯一真實來源：fn/src/core/config.py
# 未列出的變數（UPLOAD_BUCKET、GCP_REGION、DOCAI_LOCATION）僅定義於
# config.py 但從未被其他模組引用，不需在此設定。

# ── OpenAI ───────────────────────────────────────────────────────────────────
# 必填
OPENAI_API_KEY=

# 選填（預設值已可正常運作）
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1024
OPENAI_LLM_MODEL=gpt-4o-mini
OPENAI_TIMEOUT_SECONDS=30
OPENAI_MAX_RETRIES=2

# ── Document AI（US region） ──────────────────────────────────────────────────
# 選填（預設值指向現行 US processors，勿改為 eu 或 global）
DOCAI_API_ENDPOINT=us-documentai.googleapis.com
DOCAI_LAYOUT_PROCESSOR_NAME=projects/65970295651/locations/us/processors/929c4719f45b1eee
DOCAI_FORM_PROCESSOR_NAME=projects/65970295651/locations/us/processors/7318076ba71e0758

# ── Upstash Redis ─────────────────────────────────────────────────────────────
# 必填
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── Upstash Vector ────────────────────────────────────────────────────────────
# 必填
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=

# ── Upstash Search ────────────────────────────────────────────────────────────
# 必填
UPSTASH_SEARCH_REST_URL=
UPSTASH_SEARCH_REST_TOKEN=
UPSTASH_SEARCH_INDEX=

# 選填
UPSTASH_SEARCH_TIMEOUT_SECONDS=8

# ── QStash ────────────────────────────────────────────────────────────────────
# 必填
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
QSTASH_RAG_AUDIT_URL=

# 選填
QSTASH_URL=https://qstash-us-east-1.upstash.io

# ── RAG Pipeline ─────────────────────────────────────────────────────────────
# 選填（調整會影響 chunk 品質與查詢行為）
RAG_VECTOR_NAMESPACE=rag-docs
RAG_CHUNK_SIZE_CHARS=1200
RAG_CHUNK_OVERLAP_CHARS=150
RAG_QUERY_TOP_K=5
RAG_QUERY_CACHE_TTL_SECONDS=300
RAG_QUERY_RATE_LIMIT_MAX=30
RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS=60
RAG_QUERY_DEFAULT_MAX_AGE_DAYS=365
RAG_QUERY_REQUIRE_READY_STATUS=true
RAG_DOC_CACHE_TTL_SECONDS=2592000
RAG_REDIS_PREFIX=rag
````

## File: fn/AGENTS.md
````markdown
# fn — Agent Guide

## Purpose

`fn/` 是 Python Cloud Functions 的 worker 層，負責 ingestion、parsing、chunking、embedding 與 background job 等需要高資源消耗或可重試的批次作業。

> **遷移說明**：`fn/` 取代舊的 `fn/`，採相同 Hexagonal Architecture，
> 全面對齊 `.github/copilot-instructions.md` 20 條 Mandatory Compliance Rules。

---

## Runtime Boundary

| 執行時 | 負責項目 |
|---|---|
| `fn/` (Python) | parse、clean、taxonomy、chunk、embed、persistence pipeline |
| Next.js (`src/`) | upload UX、browser-facing API、response orchestration |

兩者互動**只透過**：
- QStash 訊息
- Firestore trigger
- 事件契約

---

## Route Here When

- 需要解析、清洗文件內容（PDF、Markdown、HTML）
- 需要呼叫 Document AI（Layout Parser / Form Parser）
- 需要 chunk、embed、存入向量資料庫（Upstash Vector）
- 需要可重試的背景作業或批次處理
- 需要 Firestore 寫入（ingestion 管線）

## Route Elsewhere When

- 需要 browser-facing API 或即時回應 → `src/app/`
- 需要 use case 業務邏輯（workspace、notion、notebooklm 邊界） → `src/modules/<context>/`
- 需要 session / auth / permission 判斷 → `src/modules/iam/`

---

## Architecture（Hexagonal）

```text
fn/src/
├─ app/           # 應用入口（bootstrap、container、設定）
├─ application/   # use cases、DTO、ports、application services
├─ domain/        # entities、value objects、repositories、domain services（零外部依賴）
├─ infrastructure/# Firestore、Storage、Document AI、OpenAI、Upstash adapters
├─ interface/     # Cloud Function handler（inbound adapter）+ schema validation
└─ core/          # 全層共用常數、config（環境變數唯一入口）
```

**依賴方向**（不可逆）：
```
interface → application → domain ← infrastructure
app → interface / application / infrastructure / core
domain → only core
```

詳細架構規範見 [README.md](README.md)。

---

## Document AI Processors（US Region）

⚠️ 兩個 processor 均位於 **US region**，client endpoint 必須使用 `us-documentai.googleapis.com`。

| Processor | 用途 | Resource Name |
|---|---|---|
| **Layout Parser（主）** | 語意分塊（標題、段落、表格各自成 chunk） | `projects/65970295651/locations/us/processors/929c4719f45b1eee` |
| **Form Parser（副）** | 結構化欄位擷取（PO號、金額、日期、供應商） | `projects/65970295651/locations/us/processors/7318076ba71e0758` |

### 雙通道設計

```text
GCS Document
    ├─ Layout Parser  →  ParsedDocument.chunks   →  RAG 語意分塊（主）
    └─ Form Parser    →  ParsedDocument.entities  →  結構化欄位（副，best-effort）
```

- 主通道（Layout Parser）失敗 → 整體 pipeline 失敗（拋例外）
- 副通道（Form Parser）失敗 → 記錄 `WARNING`，以空 `entities` 繼續（不阻斷主流程）

### 環境變數

| 變數 | 預設值 | 說明 |
|---|---|---|
| `DOCAI_LAYOUT_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/929c4719f45b1eee` | Layout Parser（主，不可空） |
| `DOCAI_FORM_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/7318076ba71e0758` | Form Parser（設空字串可停用） |
| `DOCAI_API_ENDPOINT` | `us-documentai.googleapis.com` | 不可改為 eu 或 global |

---

## Mandatory Compliance Mapping

| Rule | 在 fn/ 的體現 |
|---|---|
| Rule 4 — Contract / Schema | `interface/schemas/` 驗證所有 Cloud Function input |
| Rule 10 — Failure Strategy | 每個外部呼叫皆有 raise / warning / dead-letter 路徑 |
| Rule 12 — Hexagonal Architecture | `domain/` 零 SDK import；所有外部依賴在 `infrastructure/` |
| Rule 13 — Dependency Direction | interface → application → domain ← infrastructure（不可逆） |
| Rule 15 — Observability | 所有跨層呼叫使用 `logging.getLogger(__name__)`，不用 print |

---

## Cloud Functions Entry Points

| 函式名稱 | 觸發類型 | 說明 |
|---|---|---|
| `on_document_uploaded` | Storage trigger（`UPLOAD_BUCKET`） | GCS 新物件 → Document AI → Firestore |
| `parse_document` | HTTPS Callable | 手動觸發解析，回傳解析摘要 |
| `rag_query` | HTTPS Callable | RAG 檢索 + 生成查詢 |
| `rag_reindex_document` | HTTPS Callable | 手動重新 chunk + embed 文件 |

---

## Development Checklist

修改 `fn/` 時，依序確認：

1. **依賴方向**：`domain/` 是否引入了外部 SDK？ → 移到 `infrastructure/`
2. **Schema 驗證**：新的 Cloud Function input 是否在 `interface/schemas/` 驗證？
3. **Failure Strategy**：新的外部呼叫是否定義了失敗路徑（raise / warning / dead-letter）？
4. **Observability**：新的跨層呼叫是否用 `logger.info/warning/error` 記錄？
5. **US Endpoint**：Document AI client 是否仍使用 `us-documentai.googleapis.com`？
6. **Tests**：`tests/` 中是否有對應覆蓋？

---

## Validation Commands

```bash
cd fn
python -m compileall -q .
python -m pytest tests/ -v
```
````

## File: fn/main.py
````python
"""
fn — Firebase Functions (Python) 入口檔
========================================

所有 Firebase Function 都在這裡用裝飾器宣告；
實際邏輯委派給 interface/handlers/ 下的各模組。

部署：
    firebase deploy --only functions

本機模擬：
    firebase emulators:start --only functions,storage,firestore
"""
⋮----
SRC_ROOT = Path(__file__).resolve().parent / "src"
⋮----
# ── Firebase Admin SDK 初始化（app/bootstrap 之中）──────────────────────
import app.bootstrap  # noqa: F401  — 副作用：呼叫 firebase_admin.initialize_app()
⋮----
# ── 全域選項 ─────────────────────────────────────────────────────────────────
⋮----
# ── Cloud Storage 觸發器 ──────────────────────────────────────────────────────
⋮----
"""GCS 物件建立後自動觸發 Document AI 解析流程。"""
⋮----
# ── HTTPS Callable ────────────────────────────────────────────────────────────
⋮----
@https_fn.on_call()
def parse_document(req: https_fn.CallableRequest) -> dict
⋮----
"""手動觸發 Document AI 解析，回傳解析摘要。"""
⋮----
@https_fn.on_call()
def rag_query(req: https_fn.CallableRequest) -> dict
⋮----
"""RAG 檢索 + 生成查詢。"""
⋮----
@https_fn.on_call()
def rag_reindex_document(req: https_fn.CallableRequest) -> dict
⋮----
"""手動重新整理文件（normalization + ingestion）。"""
````

## File: fn/README.md
````markdown
# fn — Python Cloud Functions 架構規範

`fn/` 是 Python Cloud Functions worker 層，負責 ingestion、parsing、chunking、embedding 與 background job。
這份規範以「路徑級依賴」為核心，看完整路徑判斷依賴方向，而非單看資料夾名稱。

> **遷移說明**：`fn/` 取代舊的 `fn/`，依相同 Hexagonal Architecture 重建，
> 全面對齊 `.github/copilot-instructions.md` 的 20 條 Mandatory Compliance Rules。

---

## 0. Document AI 雙通道設計（US Region）

⚠️ 兩個 processor 均位於 **US region**，`DOCAI_API_ENDPOINT` 必須為 `us-documentai.googleapis.com`。

| Processor | 用途 | 完整 Resource Name |
|---|---|---|
| **Layout Parser（主）** | 語意分塊：標題、段落、表格各自成 chunk，保留溯源引用鏈 | `projects/65970295651/locations/us/processors/929c4719f45b1eee` |
| **Form Parser（副）** | 結構化欄位擷取：PO號、金額、日期、供應商等 KV entity | `projects/65970295651/locations/us/processors/7318076ba71e0758` |

**API Endpoint（強制）**：
```
https://us-documentai.googleapis.com/v1/...
```

### 雙通道流程

```text
GCS Document
    ├─ Layout Parser  → ParsedDocument.chunks   → RAG 語意分塊（chunking_strategy="layout-v1"）
    └─ Form Parser    → ParsedDocument.entities → 結構化欄位存 JSON GCS（best-effort）
```

- **主通道（Layout Parser）**若回傳空輸出（0 page 且無 text/chunk）→ 自動改走後備 OCR/Form processor 補齊文字，再繼續流程
- **主通道（Layout Parser）**API 失敗（拋例外）→ 整體 pipeline 失敗（Rule 10）
- **副通道（Form Parser）**失敗 → 記錄 `WARNING`，以空 `entities` 繼續，不阻斷主流程（Rule 10）

### 環境變數

| 變數 | 預設值 | 說明 |
|---|---|---|
| `DOCAI_LAYOUT_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/929c4719f45b1eee` | Layout Parser 資源名稱（主通道，不可空） |
| `DOCAI_FORM_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/7318076ba71e0758` | Form Parser 資源名稱（設為空字串可停用副通道） |
| `DOCAI_OCR_PROCESSOR_NAME` | ``（預設空） | Layout 空輸出時使用的 OCR 後備 processor（選填，建議 US region） |
| `DOCAI_API_ENDPOINT` | `us-documentai.googleapis.com` | **不可改為 eu 或 global** |
| `DOCAI_LOCATION` | `us` | processor 所在 region |

### Form Parser 擷取欄位（AP8 採購訂購單示例）

| 欄位 | Document AI Entity Type |
|---|---|
| 訂購單號 | `id` / 自定義 KV |
| 供應商 | `organization` |
| 買方 | `organization` |
| 金額小計 | `price` / `quantity` |
| 交貨日期 | `date_time` |
| 聯絡人 | `person` + `phone` + `email` |

---

## 1. 全域依賴方向（Rule 12、13）

```text
interface  → application → domain
infrastructure → application → domain
app        → interface / application / infrastructure / core
core       → all layers（只允許向外）
domain     → only core（零框架依賴）
```

**禁止反向**：`domain` 不得 import `infrastructure`、`application`、`interface`。

---

## 2. 目錄結構

```text
fn/
├─ src/
│  ├─ app/                    # 應用入口
│  │  ├─ bootstrap/           # Firebase Admin SDK 一次初始化
│  │  ├─ container/           # DI / runtime_dependencies
│  │  ├─ config/              # 僅 app-layer 設定（功能開關等）
│  │  └─ settings/            # 部署環境設定覆寫
│  ├─ application/            # Use Cases、DTO、Ports、Services、Mappers
│  │  ├─ use_cases/           # 業務流程編排（不含 domain invariant）
│  │  ├─ dto/                 # 跨層傳輸物件（不含 domain entity）
│  │  ├─ ports/               # Port 介面（input / output）
│  │  │  ├─ input/
│  │  │  └─ output/
│  │  ├─ services/            # Application services（不含 domain rule）
│  │  └─ mappers/             # domain ↔ DTO 轉換
│  ├─ domain/                 # 純業務規則（零外部依賴）
│  │  ├─ entities/            # 聚合、子實體
│  │  ├─ value_objects/       # 不可變值對象
│  │  ├─ repositories/        # Repository 介面（僅介面）
│  │  ├─ services/            # Domain services（無狀態業務邏輯）
│  │  ├─ events/              # Domain events
│  │  └─ exceptions/          # Domain exceptions
│  ├─ infrastructure/         # 外部依賴實作（永遠在最外層）
│  │  ├─ external/
│  │  │  └─ documentai/       # Document AI client（US endpoint）
│  │  ├─ persistence/
│  │  │  ├─ firestore/        # Firestore repository 實作
│  │  │  └─ storage/          # GCS client
│  │  ├─ cache/               # Redis / Upstash cache
│  │  ├─ audit/               # QStash audit publisher
│  │  └─ external/
│  │     └─ openai/           # OpenAI embeddings / LLM
│  ├─ interface/              # Function handler（inbound adapter）
│  │  ├─ handlers/            # Cloud Functions handler 實作
│  │  └─ schemas/             # Input schema validation（Pydantic / dataclass）
│  └─ core/                   # 全層共用常數、型別、config
│     └─ config.py            # 所有環境變數讀取（唯一真實來源）
├─ tests/                     # pytest 單元測試
├─ main.py                    # Firebase Functions 入口（裝飾器宣告）
├─ requirements.txt
├─ requirements-dev.txt
├─ AGENTS.md                  # Agent 任務指引
└─ README.md                  # 本文件
```

---

## 3. 層級職責（Rule 12、17、18）

| 路徑前綴 | 職責 | 禁止 |
|---|---|---|
| `domain/` | 業務規則、不變量、Entity、Value Object、Repository 介面 | import Firebase、HTTP、ORM、任何 SDK |
| `application/` | Use case 編排、DTO、Port 定義、Application service | 直接呼叫 SDK；包含 domain invariant |
| `infrastructure/` | Port 實作、Firestore repo、Storage client、Document AI client | 包含 business rule；反向依賴 domain 實作 |
| `interface/` | Cloud Function handler、input schema 驗證 | 直接呼叫 repository；bypass use case |
| `core/` | 環境變數、常數、工具函式 | 依賴 domain/application/infrastructure |
| `app/` | Bootstrap、DI container、全域選項 | 包含 business logic |

---

## 4. Schema 驗證規則（Rule 4）

所有進入系統的外部輸入（Cloud Function request、Storage event）必須先通過 schema 驗證，才能傳遞給 use case。

```python
# ✅ 正確：interface/handlers/ 在呼叫 use case 前先驗證
from interface.schemas.parse_document import ParseDocumentRequest
req_data = ParseDocumentRequest(**raw_data)   # raises ValidationError if invalid
result = handle_parse_document_use_case(req_data)

# ❌ 錯誤：直接將 req.data 傳給 use case
result = ingest_document_for_rag(**req.data)
```

---

## 5. Failure Strategy（Rule 10）

| 呼叫類型 | 策略 |
|---|---|
| Layout Parser（主通道） | 失敗時拋例外，pipeline 整體中止 |
| Form Parser（副通道） | 失敗時 `logger.warning`，以空 `entities` 繼續 |
| OpenAI Embeddings | 失敗時拋例外，由上層 retry / dead-letter |
| Upstash Search 同步 | 失敗時 `logger.warning`，不阻斷主流程 |
| Redis doc summary | 失敗時 `logger.warning`，不阻斷主流程 |
| Firestore 寫入 | 失敗時拋例外，由上層 retry |

---

## 6. 命名規則（Rule 3）

| 概念 | 命名 | 禁止 |
|---|---|---|
| Use case 函式 | `verb_noun(…)` e.g. `ingest_document_for_rag` | `doXxx`, `processXxx` |
| Repository 介面 | `XxxGateway` / `XxxRepository` | `IXxx`, `XxxService`（用於 domain service） |
| Domain event | 過去式 e.g. `DocumentIngested` | 現在式 |
| DTO | `XxxRequest` / `XxxResult` / `XxxJob` | `XxxData`, `XxxPayload`（除非已在 glossary） |
| Config 常數 | `UPPER_SNAKE_CASE` | camelCase |

---

## 7. RAG Pipeline 流程

```text
1. Cloud Storage trigger → on_document_uploaded
2. interface/handlers/storage.py → handle_object_finalized
3. application/services/document_pipeline.py → orchestrate
4. infrastructure/external/documentai/client.py → process_document_gcs_with_form
   ├─ Layout Parser → ParsedDocument.chunks
   └─ Form Parser   → ParsedDocument.entities (best-effort)
5. application/use_cases/rag_ingestion.py → ingest_document_for_rag
   ├─ layout_chunks 非空 → layout_chunks_to_rag_chunks (chunking_strategy="layout-v1")
   └─ layout_chunks 為空 → chunk_text char-split (chunking_strategy="char-split-v2")
6. gateway.embed_texts → OpenAI text-embedding-3-small
7. gateway.upsert_vectors → Upstash Vector
8. gateway.upsert_search_documents → Upstash Search (best-effort)
9. gateway.redis_set_json → Upstash Redis doc summary (best-effort)
10. infrastructure/persistence/firestore/document_repository.py → mark status=ready
```

---

## 8. 驗證指令

```bash
cd fn
python -m compileall -q .
python -m pytest tests/ -v
```

---

## 9. 相關文件

- `.github/copilot-instructions.md` — 全系統 20 條 Mandatory Compliance Rules
- `.github/instructions/cloud-functions.instructions.md` — Cloud Functions 邊界規則
- `.github/instructions/rag-architecture.instructions.md` — RAG 架構規則
- `docs/structure/system/architecture-overview.md` — 主域關係圖
````

## File: fn/requirements-dev.txt
````
# Dev/test dependencies (not deployed to Cloud Functions)
pytest>=8.0.0,<9.0.0
pytest-mock>=3.14.0,<4.0.0
````

## File: fn/requirements.txt
````
# Firebase Functions runtime
firebase-functions>=0.4.2,<1.0.0

# Firebase Admin SDK - Firestore / Auth / Storage admin APIs
firebase-admin>=6.5.0,<7.0.0

# Google Cloud Document AI - synchronous & async document processing
google-cloud-documentai<3.0.0

# Google Cloud Firestore - explicit dependency for type hints & features
google-cloud-firestore<3.0.0

# GCS helper used by the storage service layer
google-cloud-storage<3.0.0

# OpenAI SDK for embeddings and LLM calls
openai>=1.40.0,<2.0.0

# Upstash Python SDKs (Vector/Redis used in RAG; QStash used for async audit event)
upstash-vector>=0.8.0,<1.0.0
upstash-redis>=1.0.0,<2.0.0
upstash-search>=0.1.1,<1.0.0
qstash>=3.0.0,<4.0.0
````

## File: fn/src/app/container/runtime_dependencies.py
````python
logger = logging.getLogger(__name__)
⋮----
class InfraRagQueryGateway
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
⋮----
def get_query_cache(self, cache_key: str) -> dict[str, Any] | None
⋮----
def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None
⋮----
def to_query_vector(self, query: str) -> list[float]
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]
⋮----
def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str
⋮----
class InfraRagIngestionGateway
⋮----
def embed_texts(self, texts: list[str], model: str) -> list[list[float]]
⋮----
def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any
⋮----
def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int
⋮----
def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None
⋮----
class InfraDocumentPipelineGateway
⋮----
@staticmethod
    def _looks_like_empty_layout(parsed: ParsedDocument) -> bool
⋮----
@staticmethod
    def _synthesize_chunks_from_text(text: str) -> list[dict[str, Any]]
⋮----
lines = [line.strip() for line in text.splitlines() if line.strip()]
⋮----
chunks: list[dict[str, Any]] = []
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout") -> Any
⋮----
# parser == "layout" (default)
layout_parsed = process_document_gcs(
⋮----
fallback_processor = DOCAI_OCR_PROCESSOR_NAME or DOCAI_FORM_PROCESSOR_NAME
⋮----
fallback_parsed = process_document_gcs(
fallback_text = (fallback_parsed.text or layout_parsed.text or "").strip()
# Layout path may return [] when processor yields no semantic chunks.
fallback_chunks = (
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def parsed_json_path(self, upload_object_path: str) -> str
⋮----
def layout_json_path(self, upload_object_path: str) -> str
⋮----
def form_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
⋮----
def register_runtime_dependencies() -> None
````