# Files

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

## File: fn/src/app/__init__.py
````python

````

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

## File: fn/src/application/__init__.py
````python

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

## File: fn/src/application/ports/__init__.py
````python

````

## File: fn/src/application/ports/input/__init__.py
````python

````

## File: fn/src/application/ports/output/__init__.py
````python

````

## File: fn/src/application/services/__init__.py
````python

````

## File: fn/src/core/__init__.py
````python

````

## File: fn/src/domain/__init__.py
````python

````

## File: fn/src/domain/events/__init__.py
````python

````

## File: fn/src/domain/exceptions/__init__.py
````python

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

## File: fn/src/infrastructure/__init__.py
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

## File: fn/src/infrastructure/external/__init__.py
````python

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

## File: fn/src/infrastructure/persistence/__init__.py
````python

````

## File: fn/src/infrastructure/persistence/firestore/__init__.py
````python

````

## File: fn/src/infrastructure/persistence/storage/__init__.py
````python

````

## File: fn/src/interface/__init__.py
````python

````

## File: fn/src/interface/schemas/__init__.py
````python

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

## File: fn/tests/__init__.py
````python

````

## File: fn/tests/conftest.py
````python
SRC_DIR = Path(__file__).resolve().parents[1] / "src"
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

## File: fn/src/application/dto/__init__.py
````python
"""Application DTOs."""
⋮----
__all__ = [
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
⋮----
@dataclass(frozen=True)
class RagQueryEffectPlan
⋮----
cache_key: str
query: str
top_k: int
citation_count: int
vector_hits: int
search_hits: int
⋮----
@dataclass(frozen=True)
class RagQueryExecution
⋮----
response: dict[str, Any]
effect_plan: RagQueryEffectPlan | None = None
````

## File: fn/src/application/services/authorization.py
````python
def get_authorization() -> AuthorizationGateway
````

## File: fn/src/application/services/document_pipeline.py
````python
def get_document_parser() -> DocumentParserGateway
⋮----
def get_document_artifact_gateway() -> DocumentArtifactGateway
⋮----
def get_document_status_gateway() -> DocumentStatusGateway
````

## File: fn/src/application/services/rag_query_effects.py
````python
logger = logging.getLogger(__name__)
⋮----
effects_gateway = effects_gateway or get_rag_query_effects_gateway()
````

## File: fn/src/application/use_cases/__init__.py
````python
"""Application use cases."""
⋮----
__all__ = [
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
response = RagQueryResult(
````

## File: fn/src/core/auth_errors.py
````python
class UnauthenticatedError(PermissionError)
⋮----
"""Raised when a callable command requires an authenticated actor."""
⋮----
class AuthorizationError(PermissionError)
⋮----
"""Raised when an actor lacks access to the requested scope."""
````

## File: fn/src/core/storage_uri.py
````python
def parse_gs_uri(gs_uri: str) -> tuple[str, str]
⋮----
path_part = gs_uri.split("gs://", 1)[1]
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
def delete_search_documents_by_doc(doc_id: str) -> int
⋮----
"""刪除屬於指定 doc_id 的所有搜尋索引文件（依 ID 前綴 `{doc_id}:`）。

    使用 Upstash Search SDK 的 prefix delete，與 vector 刪除搭配使用，
    確保 Upstash Search 與 Upstash Vector 的資料一致性。

    Args:
        doc_id: 文件識別碼，對應 search doc ID 格式 ``{doc_id}:{i:04d}``。

    Returns:
        int: 實際刪除的文件數量（0 表示無資料、未設定或操作失敗）。
    """
⋮----
prefix = f"{doc_id}:"
⋮----
result = index.delete(prefix=prefix)
⋮----
deleted = result
⋮----
deleted = int(result.deleted or 0)
⋮----
deleted = int(result.get("deleted", 0))
⋮----
deleted = 0
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

## File: fn/src/infrastructure/gateways/__init__.py
````python

````

## File: fn/src/infrastructure/gateways/document_artifact_gateway.py
````python
"""Infrastructure implementation of DocumentArtifactGateway."""
⋮----
class InfraDocumentArtifactGateway
⋮----
def parsed_json_path(self, upload_object_path: str) -> str
⋮----
def layout_json_path(self, upload_object_path: str) -> str
⋮----
def form_json_path(self, upload_object_path: str) -> str
⋮----
def ocr_json_path(self, upload_object_path: str) -> str
⋮----
def genkit_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
````

## File: fn/src/infrastructure/gateways/document_parser_gateway.py
````python
"""Infrastructure implementation of DocumentParserGateway."""
⋮----
logger = logging.getLogger(__name__)
⋮----
class InfraDocumentParserGateway
⋮----
@staticmethod
    def _looks_like_empty_layout(parsed: ParsedDocument) -> bool
⋮----
@staticmethod
    def _synthesize_chunks_from_text(text: str) -> list[dict[str, Any]]
⋮----
lines = [line.strip() for line in text.splitlines() if line.strip()]
⋮----
layout_parsed = process_document_gcs(
⋮----
fallback_processor = DOCAI_OCR_PROCESSOR_NAME or DOCAI_FORM_PROCESSOR_NAME
⋮----
fallback_parsed = process_document_gcs(
fallback_text = (fallback_parsed.text or layout_parsed.text or "").strip()
fallback_chunks = (
````

## File: fn/src/infrastructure/gateways/document_rate_limit_gateway.py
````python
"""Infrastructure implementation of DocumentRateLimitGateway."""
⋮----
class InfraDocumentRateLimitGateway
````

## File: fn/src/infrastructure/gateways/document_status_gateway.py
````python
"""Infrastructure implementation of DocumentStatusGateway."""
⋮----
class InfraDocumentStatusGateway
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
````

## File: fn/src/infrastructure/gateways/rag_ingestion_gateway.py
````python
"""Infrastructure implementation of RagIngestionGateway.

Handles embedding generation, vector/search upsert, Redis metadata
writes, and stale-vector cleanup — all delegated to focused clients.
"""
⋮----
logger = logging.getLogger(__name__)
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
def delete_vectors_by_doc(self, doc_id: str, namespace: str = "") -> int
⋮----
deleted_vec = _delete_vectors_by_doc(doc_id=doc_id, namespace=namespace)
deleted_search = _delete_search_documents_by_doc(doc_id=doc_id)
````

## File: fn/src/infrastructure/gateways/rag_query_effects_gateway.py
````python
"""Infrastructure implementation of RagQueryEffectsGateway."""
⋮----
class InfraRagQueryEffectsGateway
⋮----
def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None
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
auth_gateway = get_authorization()
⋮----
require_ready = (
max_age_days = schema.max_age_days if schema.max_age_days is not None else RAG_QUERY_DEFAULT_MAX_AGE_DAYS
⋮----
execution = execute_rag_query(
result = execution.response
⋮----
response = {
````

## File: fn/tests/test_rag_query_use_case.py
````python
class _FakeRagQueryGateway
⋮----
def __init__(self, *, cached: dict | None = None) -> None
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
⋮----
def get_query_cache(self, cache_key: str) -> dict | None
⋮----
def to_query_vector(self, query: str) -> list[float]
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict]
⋮----
def query_search(self, query: str, top_k: int) -> list[dict]
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str
⋮----
def test_execute_rag_query_with_cache_hit_returns_no_effect_plan() -> None
⋮----
execution = execute_rag_query(
⋮----
def test_execute_rag_query_with_generated_answer_returns_effect_plan() -> None
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

## File: fn/src/application/use_cases/parse_document_command.py
````python
"""Authorized command wrapper for parse-document callable entry."""
⋮----
auth_gateway = auth_gateway or get_authorization()
status_gateway = status_gateway or get_document_status_gateway()
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
# ── 刪除舊向量（冪等保護：先清除再 upsert，防止 orphan chunks）──────────
# 失敗時僅警告，不中斷 ingestion：向量索引的舊資料頂多造成 stale 結果，
# 而中斷 ingestion 會讓文件永遠無法被查詢，危害更大。
⋮----
deleted = gateway.delete_vectors_by_doc(doc_id=doc_id, namespace=RAG_VECTOR_NAMESPACE)
⋮----
except Exception as del_exc:  # noqa: BLE001  — best-effort; ingestion must proceed
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

## File: fn/src/application/use_cases/rag_reindex_command.py
````python
"""Authorized command wrapper for rag-reindex callable entry."""
⋮----
auth_gateway = auth_gateway or get_authorization()
status_gateway = status_gateway or get_document_status_gateway()
````

## File: fn/src/infrastructure/external/upstash/vector_client.py
````python
"""
Upstash Vector 客戶端 — 向量 upsert / query / delete 操作。

Chunk ID 命名慣例：``{doc_id}:{i:04d}``，其中 ``:`` 為分隔符。
``delete_vectors_by_doc`` 使用 prefix ``{doc_id}:`` 刪除同份文件的所有 chunk 向量。
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
def delete_vectors_by_doc(doc_id: str, namespace: str = "") -> int
⋮----
"""刪除屬於指定 doc_id 的所有向量（依 ID 前綴 `{doc_id}:`）。

    使用 Upstash Vector SDK 的 prefix delete，一次清除整份文件的所有 chunk
    向量，避免重新索引後留下孤立 (orphan) chunk 資料。

    Args:
        doc_id:    文件識別碼，對應 chunk ID 格式 ``{doc_id}:{i:04d}``。
        namespace: Upstash Vector 命名空間（與 upsert 時一致）。

    Returns:
        int: 實際刪除的向量數量（0 表示無向量或操作失敗）。
    """
⋮----
prefix = f"{doc_id}:"
⋮----
result = index.delete(prefix=prefix, namespace=namespace)
⋮----
deleted = result
⋮----
deleted = int(result.deleted or 0)
⋮----
deleted = int(result.get("deleted", 0))
⋮----
deleted = 0
⋮----
"""查詢 Upstash Vector，統一輸出為 list[dict]。"""
⋮----
result = index.query(
⋮----
result = index.query(vector=vector, top_k=top_k, namespace=namespace)
⋮----
candidates = result.get("result") or result.get("matches") or result.get("data") or []
````

## File: fn/src/infrastructure/gateways/rag_query_gateway.py
````python
"""Infrastructure implementation of RagQueryGateway."""
⋮----
class InfraRagQueryGateway
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
⋮----
def get_query_cache(self, cache_key: str) -> dict[str, Any] | None
⋮----
def to_query_vector(self, query: str) -> list[float]
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]
⋮----
def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str
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
def ocr_json_path(upload_object_path: str) -> str
⋮----
"""
    OCR Parser 解析結果的 GCS 路徑。

    範例：
        uploads/org/ws/file.pdf  ->  files/org/ws/file.ocr.json
    """
⋮----
def genkit_json_path(upload_object_path: str) -> str
⋮----
"""
    Genkit-AI 解析結果的 GCS 路徑。

    範例：
        uploads/org/ws/file.pdf  ->  files/org/ws/file.genkit.json
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

## File: fn/src/interface/handlers/__init__.py
````python
__all__ = [
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

## File: fn/tests/test_command_use_cases.py
````python
class _FakeAuthorizationGateway
⋮----
def __init__(self) -> None
⋮----
def assert_actor_can_access_account(self, *, actor_id: str, account_id: str) -> None
⋮----
def assert_workspace_belongs_account(self, *, account_id: str, workspace_id: str) -> None
⋮----
class _FakeDocumentStatusGateway
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def test_execute_parse_document_command_authorizes_then_runs_pipeline(monkeypatch) -> None
⋮----
auth_gateway = _FakeAuthorizationGateway()
status_gateway = _FakeDocumentStatusGateway()
cmd = ParseDocumentCommand(
⋮----
def _fake_execute_parse_document(inner_cmd: ParseDocumentCommand) -> ParseDocumentResult
⋮----
result = execute_parse_document_command(
⋮----
def test_execute_parse_document_command_records_error_on_failure(monkeypatch) -> None
⋮----
def _fake_execute_parse_document(_: ParseDocumentCommand) -> ParseDocumentResult
⋮----
def test_execute_rag_reindex_command_authorizes_then_runs_use_case(monkeypatch) -> None
⋮----
cmd = RagReindexCommand(
⋮----
def _fake_execute_rag_reindex(inner_cmd: RagReindexCommand) -> RagReindexResult
⋮----
result = execute_rag_reindex_command(
⋮----
def test_execute_rag_reindex_command_records_error_on_failure(monkeypatch) -> None
⋮----
def _fake_execute_rag_reindex(_: RagReindexCommand) -> RagReindexResult
````

## File: fn/tests/test_po_extraction.py
````python
"""
Unit tests for domain/services/po_extraction.py.

Tests cover the ABB 訂購單 AP8 format (document 4510250181-AP8_v0-8150.PDF):
  - 54 line items numbered 10–540 in steps of 10
  - Classification into 施工作業 / 費用管銷
  - Dense text format from Document AI OCR output
"""
⋮----
# ── classify_po_task ──────────────────────────────────────────────────────────
⋮----
class TestClassifyPoTask
⋮----
def test_scada_installation_is_work(self) -> None
⋮----
def test_fiber_splicing_is_work(self) -> None
⋮----
def test_panel_transport_is_work(self) -> None
⋮----
def test_fire_seal_is_work(self) -> None
⋮----
def test_foundation_work_is_work(self) -> None
⋮----
def test_high_altitude_fee_is_cost(self) -> None
⋮----
# ends with 費 → 費用管銷
⋮----
def test_sanitation_fee_is_cost(self) -> None
⋮----
def test_document_fee_is_cost(self) -> None
⋮----
def test_software_control_is_cost(self) -> None
⋮----
def test_substation_management_is_cost(self) -> None
⋮----
# 管理N人 pattern
⋮----
def test_supervision_fee_is_cost(self) -> None
⋮----
def test_insurance_is_cost(self) -> None
⋮----
def test_waste_disposal_is_cost(self) -> None
⋮----
def test_profit_and_misc_is_cost(self) -> None
⋮----
def test_wu_section_forces_cost(self) -> None
⋮----
# Section 伍 (雜項費用) is always 費用管銷 regardless of description
⋮----
def test_jiu_section_forces_cost(self) -> None
⋮----
def test_5d_cost_is_cost(self) -> None
⋮----
def test_site_office_is_cost(self) -> None
⋮----
# ── extract_po_line_items ─────────────────────────────────────────────────────
⋮----
# Minimal AP8 text excerpt with two items representing both categories.
_AP8_EXCERPT = (
⋮----
class TestExtractPoLineItems
⋮----
def test_extractsItemNumbers(self) -> None
⋮----
items = extract_po_line_items(_AP8_EXCERPT)
item_nos = [item["item_no"] for item in items]
⋮----
def test_item10_isWork(self) -> None
⋮----
item10 = next((i for i in items if i["item_no"] == 10), None)
⋮----
def test_item210_isCost(self) -> None
⋮----
item210 = next((i for i in items if i["item_no"] == 210), None)
⋮----
def test_itemsAreSortedByNumber(self) -> None
⋮----
nos = [i["item_no"] for i in items]
⋮----
def test_emptyText_returnsEmpty(self) -> None
⋮----
def test_nonPoText_returnsEmpty(self) -> None
⋮----
def test_descriptionIsNonEmpty(self) -> None
⋮----
def test_categoryIsOnlyTwoValues(self) -> None
⋮----
def test_deduplication_whenItemAppearsMoreThanOnce(self) -> None
⋮----
"""Items that appear twice in OCR text (multi-page PDF) must be returned once."""
duplicated = _AP8_EXCERPT + _AP8_EXCERPT  # simulate page-repeat
items = extract_po_line_items(duplicated)
⋮----
# No item_no should appear more than once
⋮----
def test_subtotalPatternHandlesSpaceBeforeAmount(self) -> None
⋮----
"""「小計 721,619」(space after 小計) must still locate the section header."""
# Item 90 from AP8 PDF crosses a page break and has 小計 {space} amount
text = (
items = extract_po_line_items(text)
item90 = next((i for i in items if i["item_no"] == 90), None)
⋮----
def test_descriptionDoesNotContainPriceData(self) -> None
⋮----
"""Price/discount tokens from OCR must not leak into item descriptions."""
⋮----
desc = item["description"]
⋮----
# ── po_line_items_to_rag_chunks ───────────────────────────────────────────────
⋮----
class TestPoLineItemsToRagChunks
⋮----
def test_chunkContainsCategoryAndItemNo(self) -> None
⋮----
line_items = [
chunks = po_line_items_to_rag_chunks(line_items)
⋮----
chunk = chunks[0]
⋮----
def test_emptyInput_returnsEmpty(self) -> None
⋮----
def test_charStartIsZeroAndCharEndIsTextLength(self) -> None
⋮----
chunk = po_line_items_to_rag_chunks(line_items)[0]
````

## File: fn/src/application/ports/output/gateways.py
````python
"""Backward-compatible application-layer re-export of domain repository contracts."""
⋮----
__all__ = [
````

## File: fn/src/application/use_cases/parse_document_pipeline.py
````python
"""
Parse-document application use case.

Orchestrates the full parse pipeline for a single document:
    init Firestore → Document AI parse → write JSON artifact to GCS
    → update Firestore state → (optionally) ingest into RAG index.

Both the HTTPS Callable handler and the Storage trigger handler
delegate to this use case, keeping interface-layer files thin.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
class ParsedDocumentLike(Protocol)
⋮----
text: str
page_count: int
chunks: list[dict[str, Any]]
entities: list[dict[str, Any]]
⋮----
@dataclass
class ParseDocumentCommand
⋮----
"""Input contract for the parse-document use case."""
⋮----
doc_id: str
gcs_uri: str
bucket_name: str
object_path: str
filename: str
size_bytes: int
mime_type: str
account_id: str
workspace_id: str
parser: str = "layout"   # "layout" | "ocr" | "form" | "genkit"
run_rag: bool = True
⋮----
@dataclass
class ParseDocumentResult
⋮----
"""Output contract for the parse-document use case."""
⋮----
parser: str
⋮----
extraction_ms: int
json_gcs_uri: str
rag_chunk_count: int | None = None
rag_vector_count: int | None = None
⋮----
"""Orchestrate the full parse pipeline for a single document.

    Raises:
        Exception: propagated from DocumentAI / GCS / Firestore calls;
                   callers are responsible for error recording.
    """
parser_gateway = parser_gateway or get_document_parser()
artifact_gateway = artifact_gateway or get_document_artifact_gateway()
status_gateway = status_gateway or get_document_status_gateway()
⋮----
start_time = time.time()
parsed = parser_gateway.process_document_gcs(
extraction_ms = int((time.time() - start_time) * 1000)
⋮----
json_gcs_uri = _write_artifact_and_update_state(
⋮----
layout_chunks = parsed.chunks if cmd.parser == "layout" else None
⋮----
rag = ingest_for_rag(
⋮----
rag_chunk_count = rag.chunk_count
rag_vector_count = rag.vector_count
⋮----
"""Write the JSON artifact to GCS and update the Firestore state field.

    Returns the GCS URI of the written artifact.
    """
base = {
⋮----
json_path = artifact_gateway.layout_json_path(cmd.object_path)
data = {**base, "text": parsed.text, "chunk_count": len(parsed.chunks), "chunks": parsed.chunks}
json_gcs_uri = artifact_gateway.upload_json(
⋮----
json_path = artifact_gateway.ocr_json_path(cmd.object_path)
data = {
⋮----
json_path = artifact_gateway.form_json_path(cmd.object_path)
⋮----
# "genkit"
json_path = artifact_gateway.genkit_json_path(cmd.object_path)
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
# OCR Processor — 高品質全頁文字擷取通道（AP8採購訂單等密集表格 PDF 推薦）。
# AP8 PO 4510250181：54 個明細（項次 10–540，步進 10），需 OCR 完整擷取中文描述。
# https://us-documentai.googleapis.com/v1/projects/65970295651/locations/us/processors/f88dfd0407416be7:process
DOCAI_OCR_PROCESSOR_NAME: str = os.environ.get(
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

## File: fn/src/domain/repositories/__init__.py
````python
"""Domain repository contracts."""
⋮----
__all__ = [
````

## File: fn/src/domain/services/po_extraction.py
````python
"""
Domain Service — Purchase Order (PO) line item extraction and classification.

Pure business logic — no infrastructure dependency.

Supports the ABB 訂購單 AP8 format (document 4510250181-AP8_v0-8150.PDF):
  - 54 line items numbered 10–540 in steps of 10
  - Two task categories: 施工作業 (construction) / 費用管銷 (expense management)
  - Dense text format produced by Document AI OCR / Layout Parser

Dependency: stdlib only.
"""
⋮----
# ── Chinese numeral character class used in section headers ─────────────────
_CHINESE_NUMERALS = "一二三四五六七八九十壹貳參肆伍陸柒捌玖拾"
⋮----
# Pattern: item number (10–540, step 10) at word boundary
_ITEM_NO_PATTERN = re.compile(r"(?<!\d)(\d{2,3})(?=\s)")
⋮----
# Pattern: 小計 + amount signals end of price data; description follows.
# The space between 小計 and the amount is optional — items crossing page
# breaks in the AP8 PDF produce "小計 721,619" (with space).
_SUBTOTAL_PATTERN = re.compile(r"小計\s*[\d,，.]+\s*")
⋮----
# Pattern: section header 「（中文数字）」
_SECTION_HEADER_PATTERN = re.compile(
⋮----
# Pattern to truncate description at noise boundaries within a single OCR line:
# next-item anchor (e.g. "330 3RDTW"), summary totals, or ABB page footer.
# Note: "ABB Ltd." is intentionally vendor-specific — this service is scoped to
# the ABB AP8 訂購單 format (document 4510250181); see module docstring.
_DESCRIPTION_STOP_PATTERN = re.compile(r"\d{2,3}\s+3RDTW|未稅總計|ABB Ltd\.")
⋮----
# ── Classification rules ─────────────────────────────────────────────────────
⋮----
# Section numerals whose entire section is 費用管銷.
# Specific to the ABB AP8 訂購單 4510250181 section structure:
#   伍 = Section 5 （伍）雜項費用 (Miscellaneous Expenses — management headcount, safety, site floor protection)
#   玖 = Section 9 （玖）利潤及雜費 (Profit and Miscellaneous Fees)
# Sections 一–肆 and 柒–捌 contain a mix; classification falls through to
# _COST_DESCRIPTION_PATTERNS for per-item discrimination.
_COST_SECTION_CHARS: frozenset[str] = frozenset(["伍", "玖"])
⋮----
# Description-level patterns that force 費用管銷, regardless of section
_COST_DESCRIPTION_PATTERNS: list[re.Pattern[str]] = [
⋮----
re.compile(r"費$"),           # ends with 費 (e.g., 高空作業費, 工程衛生費)
re.compile(r"費用"),          # 費用 anywhere
re.compile(r"管理\d*人"),     # management headcount (e.g., 管理1人*4個月)
re.compile(r"監工"),          # supervision
re.compile(r"工安費"),        # safety fee
re.compile(r"保險"),          # insurance
re.compile(r"分攤"),          # cost allocation
re.compile(r"廢棄物"),        # waste disposal
re.compile(r"5D"),            # 5D cost
re.compile(r"利潤"),          # profit
re.compile(r"圖控與軟體"),    # SCADA software deliverable (cost item)
re.compile(r"圖面製作"),      # drawing / document fee
re.compile(r"工務所"),        # site office
⋮----
def classify_po_task(description: str, section_char: str = "") -> Literal["施工作業", "費用管銷"]
⋮----
"""Classify a PO line item as 施工作業 or 費用管銷.

    Args:
        description: Chinese task description text.
        section_char: Chinese numeral from the section header (e.g., "伍").

    Returns:
        "施工作業" or "費用管銷"
    """
# Section-level override takes precedence
⋮----
# Description-level pattern matching
⋮----
def extract_po_line_items(text: str) -> list[dict[str, Any]]
⋮----
"""Extract structured line items from AP8 PO raw text.

    Document AI (OCR / Layout Parser) produces dense text where each line item
    is formatted as::

        "{item_no} {product_code} SET {price}... 小計{total}（{section}）{description}"

    This function locates each item's Chinese section header and description
    after the price block and returns a structured list.

    Args:
        text: Raw text from Document AI output for the PO document.

    Returns:
        Sorted list (by item_no) of dicts with keys:
            item_no (int): 10, 20, … 540
            section (str): e.g., "（一）SCADA站內工程"
            section_char (str): e.g., "一"
            description (str): task description text
            category (str): "施工作業" or "費用管銷"
            raw_snippet (str): first 200 chars of the matched segment
    """
# Normalize horizontal whitespace for reliable pattern matching
normalized = re.sub(r"[ \t]+", " ", text)
⋮----
items: list[dict[str, Any]] = []
⋮----
# Split on item boundaries: digit(s) followed by the ABB product code prefix
# or a Chinese description marker so we get one segment per line item.
segment_pattern = re.compile(
segments = list(segment_pattern.finditer(normalized))
⋮----
item_no_str = match.group(1)
⋮----
item_no = int(item_no_str)
⋮----
# Validate item number is in the expected AP8 range (10–540, step 10)
⋮----
# Extract the text segment for this item
start = match.start()
end = segments[idx + 1].start() if idx + 1 < len(segments) else len(normalized)
segment = normalized[start:end]
⋮----
# Find 小計 to locate where the price block ends
subtotal_match = _SUBTOTAL_PATTERN.search(segment)
description_zone = segment[subtotal_match.end():] if subtotal_match else segment
⋮----
# Extract section header + leading description from the description zone
header_match = _SECTION_HEADER_PATTERN.search(description_zone)
⋮----
section_char = header_match.group(1).strip()
description_raw = (header_match.group(2) or "").strip()
# Truncate at noise boundaries (next-item anchor or summary totals)
description_raw = _DESCRIPTION_STOP_PATTERN.split(description_raw, maxsplit=1)[0].strip()
⋮----
# Collect any remaining text after the section header (may continue on next line)
after_header = description_zone[header_match.end():].strip()
# Limit to first sentence/clause; stop at new section, page-break, next item, or totals
extra = re.split(r"[（\n]|ABB Ltd\.|(?=\d{2,3}\s+3RDTW)|未稅總計", after_header, maxsplit=1)[0].strip()
# Only append extra if it starts with Chinese text (genuine description continuation).
# ASCII-leading text (e.g., "Ref: 6591401)折扣…") is leaked price data — discard.
# Known limitation: descriptions that legitimately start with English terms
# (e.g., "RTU盤內…") will not be extended by extra; they are however already
# fully captured by _SECTION_HEADER_PATTERN group 2 in practice.
⋮----
description_raw = (description_raw + " " + extra).strip()
⋮----
description = re.sub(r"\s+", " ", description_raw).strip()
⋮----
section_label = f"（{section_char}）"
category = classify_po_task(description, section_char)
⋮----
# De-duplicate: the PDF's multi-page layout causes identical items to appear
# more than once in the OCR text.  Keep the first occurrence per item_no
# because it tends to come from the main table (cleaner formatting).
seen: set[int] = set()
deduped: list[dict[str, Any]] = []
⋮----
"""Convert extracted PO line items to RAG chunk format.

    Each line item becomes one chunk, preserving category metadata so the
    RAG pipeline can filter by 施工作業 / 費用管銷.

    Args:
        line_items: Output of extract_po_line_items().

    Returns:
        list of dicts compatible with the RAG ingestion pipeline.
    """
result: list[dict[str, Any]] = []
⋮----
text = (
````

## File: fn/src/infrastructure/gateways/authorization_gateway.py
````python
"""Infrastructure implementation of AuthorizationGateway."""
⋮----
class FirestoreAuthorizationGateway
⋮----
def assert_actor_can_access_account(self, *, actor_id: str, account_id: str) -> None
⋮----
db = fb_firestore.client()
snap = db.collection("accounts").document(account_id).get()
⋮----
data = snap.to_dict() or {}
owner_id = str(data.get("ownerId", "")).strip()
member_ids = data.get("memberIds") if isinstance(data.get("memberIds"), list) else []
member_set = {str(item or "").strip() for item in member_ids}
⋮----
def assert_workspace_belongs_account(self, *, account_id: str, workspace_id: str) -> None
⋮----
snap = db.collection("workspaces").document(workspace_id).get()
⋮----
bound_account_id = str(data.get("accountId", "")).strip()
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
# merge=True keeps previously written parser artifacts (layout/form/ocr/genkit)
# so multiple parser JSON outputs can coexist on the same document.
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
"""
    更新 OCR Parser 解析結果（不覆蓋 Layout/Form 欄位）。
    """
⋮----
"""
    更新 Genkit-AI 解析結果（不覆蓋其他 parser 欄位）。
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
parser: str  # "layout" | "form" | "ocr" | "genkit"
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

## File: fn/AGENTS.md
````markdown
# fn Agent Rules

## ROLE

- The agent MUST treat fn as the Python worker runtime for heavy, retryable ingestion and retrieval pipelines.
- The agent MUST keep fn focused on callable/trigger handlers, orchestration use-cases, and infrastructure gateways.
- The agent MUST preserve runtime split between fn and src.

## DOMAIN BOUNDARIES

- The agent MUST keep Next.js browser-facing orchestration outside fn.
- The agent MUST keep business rules and value objects in domain and orchestration in application.
- The agent MUST NOT place Firebase Web SDK or UI/session logic in fn.
- The agent MUST preserve hexagonal dependency flow interface -> application -> domain <- infrastructure.

## TOOL USAGE

- The agent MUST validate callable input schemas before use-case execution.
- The agent MUST validate environment-variable usage against src/core/config.py.
- The agent MUST use tests for behavior validation and compile checks for syntax safety.

## EXECUTION FLOW

- The agent MUST follow this order:
    1. Confirm ownership belongs to fn runtime.
    2. Identify affected layer (interface/application/domain/infrastructure).
    3. Update layer-local code only.
    4. Run py compile and tests.
    5. Report contracts and runtime impacts.

## DATA CONTRACT

- The agent MUST keep callable payload contracts explicit and version-safe.
- The agent MUST keep Firestore/GCS document fields consistent with gateway and schema usage.
- The agent MUST keep cross-runtime payload mirrors aligned with TypeScript contracts.

## CONSTRAINTS

- The agent MUST NOT bypass authorization checks for callable entry points.
- The agent MUST NOT add hidden side effects outside declared gateways.
- The agent MUST NOT couple fn directly to src module internals.

## ERROR HANDLING

- The agent MUST fail fast on invalid schema input.
- The agent MUST report auth failures and external-service failures explicitly.
- The agent MUST keep retry behavior idempotent where required.

## CONSISTENCY

- The agent MUST keep Cloud Function declarations aligned with interface handlers.
- The agent MUST keep AGENTS as routing/rules and README as operator overview.
- The agent MUST keep runtime split language consistent across fn and src docs.

## SECURITY

- The agent MUST preserve callable auth and tenant/account scope boundaries.
- The agent MUST keep secrets in Secret Manager/env and never hardcode credentials.
- The agent MUST avoid leaking sensitive payloads in logs and examples.

## Cloud Functions Index

| Function | Trigger Type | Core Handler |
|---|---|---|
| on_document_uploaded | Storage trigger | handle_object_finalized |
| parse_document | HTTPS callable | handle_parse_document |
| rag_query | HTTPS callable | handle_rag_query |
| rag_reindex_document | HTTPS callable | handle_rag_reindex_document |

## Route Here When

- You change parse/chunk/embed/reindex/query pipeline behavior.
- You modify callable schemas, worker orchestration, or gateway implementations.
- You change RAG cache/rate-limit/audit publish behavior in worker runtime.

## Route Elsewhere When

- Browser-facing upload UX and route composition: [../src/app/AGENTS.md](../src/app/AGENTS.md)
- Module-level UX or server actions: [../src/modules/AGENTS.md](../src/modules/AGENTS.md)
- Firestore/Storage security policy files at repo root: [../AGENTS.md](../AGENTS.md)

## Validation Commands

```bash
cd fn
python -m compileall -q .
python -m pytest tests/ -v
```

## Quick Links

- Pair: [README.md](README.md)
- Runtime entry: [main.py](main.py)
- Config authority: [src/core/config.py](src/core/config.py)
- Runtime DI: [src/app/container/runtime_dependencies.py](src/app/container/runtime_dependencies.py)
- Cross-runtime contract reference: [../docs/structure/contexts/ai/cross-runtime-contracts.md](../docs/structure/contexts/ai/cross-runtime-contracts.md)
````

## File: fn/src/application/use_cases/rag_reindex.py
````python
"""
RAG reindex application use case.

Downloads the layout JSON artifact from GCS, enriches missing fields,
then re-runs the RAG ingestion pipeline and marks the document ready.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
@dataclass
class RagReindexCommand
⋮----
"""Input contract for the rag-reindex use case."""
⋮----
doc_id: str
json_gcs_uri: str
account_id: str
# Optional fields — enriched from the stored JSON artifact when absent.
source_gcs_uri: str = ""
workspace_id: str = ""
filename: str = ""
page_count: int = 0
⋮----
@dataclass
class RagReindexResult
⋮----
"""Output contract for the rag-reindex use case."""
⋮----
chunk_count: int
vector_count: int
raw_chars: int
normalized_chars: int
normalization_version: str
language_hint: str
⋮----
"""Download the layout JSON, enrich fields, re-ingest into RAG index.

    Raises:
        ValueError: when required fields are absent from both cmd and the stored JSON.
        Exception:  propagated from GCS / embedding / vector calls.
    """
artifact_gateway = artifact_gateway or get_document_artifact_gateway()
status_gateway = status_gateway or get_document_status_gateway()
⋮----
json_bytes = artifact_gateway.download_bytes(
payload: dict = json.loads(json_bytes.decode("utf-8")) if json_bytes else {}
⋮----
text = str(payload.get("text", "")).strip()
⋮----
source_gcs_uri = cmd.source_gcs_uri or str(payload.get("source_gcs_uri", "")).strip()
⋮----
workspace_id = cmd.workspace_id
⋮----
workspace_id = str(payload.get("workspace_id", "")).strip()
⋮----
workspace_id = str((payload.get("metadata") or {}).get("space_id", "")).strip()
⋮----
filename = cmd.filename
⋮----
filename = (
⋮----
page_count = cmd.page_count
⋮----
page_count = int(payload.get("page_count", 0) or 0)
⋮----
layout_chunks: list[dict] | None = payload.get("chunks") or None
⋮----
rag = ingest_for_rag(
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
storage_filename = os.path.basename(object_path)
display_filename = _extract_display_filename(object_path, data.metadata)
⋮----
gcs_uri = f"gs://{bucket_name}/{object_path}"
⋮----
status_gateway = get_document_status_gateway()
````

## File: fn/tests/test_domain_repository_gateways.py
````python
class _FakeRagQueryGateway
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
⋮----
def get_query_cache(self, cache_key: str) -> dict | None
⋮----
def to_query_vector(self, query: str) -> list[float]
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict]
⋮----
def query_search(self, query: str, top_k: int) -> list[dict]
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str
⋮----
class _FakeRagQueryEffectsGateway
⋮----
def save_query_cache(self, cache_key: str, payload: dict) -> None
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
def delete_vectors_by_doc(self, doc_id: str, namespace: str = "") -> int
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
def layout_json_path(self, upload_object_path: str) -> str
⋮----
def form_json_path(self, upload_object_path: str) -> str
⋮----
def ocr_json_path(self, upload_object_path: str) -> str
⋮----
def genkit_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict) -> str
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
⋮----
def test_register_gateways_WithAllGatewayTypes_RetrievesExactInstances() -> None
⋮----
rag_query_gateway = _FakeRagQueryGateway()
rag_query_effects_gateway = _FakeRagQueryEffectsGateway()
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
def test_fromRaw_WithParserGenkit_AcceptsGenkitParser(self) -> None
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

## File: fn/README.md
````markdown
# fn

## PURPOSE

fn 是 Python Cloud Functions worker runtime，處理重度、可重試的 ingestion / indexing / query pipeline。
本層與 Next.js browser-facing orchestration 分離，確保 runtime 邊界清楚。
fn 內部遵循 hexagonal 分層，domain 層保持技術無關。

## GETTING STARTED

在 repo 根目錄執行：

```bash
cd fn
pip install -r requirements.txt -r requirements-dev.txt
python -m compileall -q .
python -m pytest tests/ -v
```

若要本機整合測試，可在 repo 根目錄執行 Firebase Emulator。

## ARCHITECTURE

fn 的層次：

- interface：callable/storage handler + schema 驗證
- application：use-case orchestration
- domain：protocol、規則、value objects
- infrastructure：外部服務與持久化實作

依賴方向固定為 interface -> application -> domain <- infrastructure。

## PROJECT STRUCTURE

- [main.py](main.py)：Cloud Functions 宣告入口
- [src/interface](src/interface)：handlers 與輸入 schema
- [src/application](src/application)：use-cases、dto、services
- [src/domain](src/domain)：業務規則與 protocol
- [src/infrastructure](src/infrastructure)：external/cache/audit/persistence/gateways
- [tests](tests)：pytest 測試

## DEVELOPMENT RULES

- MUST keep callable auth and input validation at interface boundary.
- MUST keep business invariants in domain, not infrastructure.
- MUST keep worker behavior idempotent for retryable paths.
- MUST keep Next.js UI/session concerns outside fn.

## AI INTEGRATION

fn 承擔 Document AI 解析、RAG ingestion、RAG query 等 worker 能力。
AI 代理修改 fn 時，需同步檢查 callable 契約、gateway 介面與跨運行時 DTO mirror。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Command reference: [../docs/tooling/commands-reference.md](../docs/tooling/commands-reference.md)
- Strategic authority: [../docs/README.md](../docs/README.md)
- AI context contracts: [../docs/structure/contexts/ai](../docs/structure/contexts/ai)

## USABILITY

- 新開發者可在 5 分鐘內完成依賴安裝與測試執行。
- 可在 3 分鐘內定位修改層級（interface/application/domain/infrastructure）。
````

## File: fn/src/interface/handlers/rag_reindex_handler.py
````python
"""
HTTPS Callable — handle_rag_reindex_document：手動觸發文件 RAG 重新索引。

Schema validation (Rule 4) is performed via RagReindexRequest.from_raw()
before any application-layer call.  All orchestration is delegated to the
rag_reindex use case.
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion."""
actor_id = _extract_auth_uid(req)
⋮----
schema = RagReindexRequest.from_raw(req.data or {})
⋮----
result = execute_rag_reindex_command(
````

## File: fn/src/domain/repositories/rag.py
````python
class RagQueryGateway(Protocol)
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str: ...
⋮----
def get_query_cache(self, cache_key: str) -> dict[str, Any] | None: ...
⋮----
def to_query_vector(self, query: str) -> list[float]: ...
⋮----
def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]: ...
⋮----
def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]: ...
⋮----
def generate_answer(self, *, query: str, context_block: str) -> str: ...
⋮----
class RagQueryEffectsGateway(Protocol)
⋮----
def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None: ...
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
def delete_vectors_by_doc(self, doc_id: str, namespace: str = "") -> int: ...
⋮----
class DocumentParserGateway(Protocol)
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout") -> Any: ...
⋮----
class DocumentRateLimitGateway(Protocol)
⋮----
class DocumentStatusGateway(Protocol)
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None: ...
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None: ...
⋮----
class DocumentArtifactGateway(Protocol)
⋮----
def parsed_json_path(self, upload_object_path: str) -> str: ...
⋮----
def layout_json_path(self, upload_object_path: str) -> str: ...
⋮----
def form_json_path(self, upload_object_path: str) -> str: ...
⋮----
def ocr_json_path(self, upload_object_path: str) -> str: ...
⋮----
def genkit_json_path(self, upload_object_path: str) -> str: ...
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str: ...
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes: ...
⋮----
class AuthorizationGateway(Protocol)
⋮----
def assert_actor_can_access_account(self, *, actor_id: str, account_id: str) -> None: ...
⋮----
def assert_workspace_belongs_account(self, *, account_id: str, workspace_id: str) -> None: ...
⋮----
class DocumentPipelineGateway(
⋮----
"""Backward-compatible composite port built from the split document ports."""
⋮----
_rag_query_gateway: RagQueryGateway | None = None
_rag_query_effects_gateway: RagQueryEffectsGateway | None = None
_rag_ingestion_gateway: RagIngestionGateway | None = None
_document_parser_gateway: DocumentParserGateway | None = None
_document_rate_limit_gateway: DocumentRateLimitGateway | None = None
_document_status_gateway: DocumentStatusGateway | None = None
_document_artifact_gateway: DocumentArtifactGateway | None = None
_document_pipeline_gateway: DocumentPipelineGateway | None = None
_authorization_gateway: AuthorizationGateway | None = None
_composed_document_pipeline_gateway: DocumentPipelineGateway | None = None
⋮----
def register_rag_query_gateway(gateway: RagQueryGateway) -> None
⋮----
_rag_query_gateway = gateway
⋮----
def get_rag_query_gateway() -> RagQueryGateway
⋮----
def register_rag_query_effects_gateway(gateway: RagQueryEffectsGateway) -> None
⋮----
_rag_query_effects_gateway = gateway
⋮----
def get_rag_query_effects_gateway() -> RagQueryEffectsGateway
⋮----
def register_rag_ingestion_gateway(gateway: RagIngestionGateway) -> None
⋮----
_rag_ingestion_gateway = gateway
⋮----
def get_rag_ingestion_gateway() -> RagIngestionGateway
⋮----
def register_document_parser_gateway(gateway: DocumentParserGateway) -> None
⋮----
_document_parser_gateway = gateway
⋮----
def get_document_parser_gateway() -> DocumentParserGateway
⋮----
def register_document_rate_limit_gateway(gateway: DocumentRateLimitGateway) -> None
⋮----
_document_rate_limit_gateway = gateway
⋮----
def get_document_rate_limit_gateway() -> DocumentRateLimitGateway
⋮----
def register_document_status_gateway(gateway: DocumentStatusGateway) -> None
⋮----
_document_status_gateway = gateway
⋮----
def get_document_status_gateway() -> DocumentStatusGateway
⋮----
def register_document_artifact_gateway(gateway: DocumentArtifactGateway) -> None
⋮----
_document_artifact_gateway = gateway
⋮----
def get_document_artifact_gateway() -> DocumentArtifactGateway
⋮----
def register_authorization_gateway(gateway: AuthorizationGateway) -> None
⋮----
_authorization_gateway = gateway
⋮----
def get_authorization_gateway() -> AuthorizationGateway
⋮----
def register_document_pipeline_gateway(gateway: DocumentPipelineGateway) -> None
⋮----
_document_pipeline_gateway = gateway
⋮----
class _ComposedDocumentPipelineGateway
⋮----
"""Legacy compatibility facade over the split document ports."""
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout") -> Any
⋮----
def init_document(self, **kwargs: Any) -> None
⋮----
def update_parsed(self, **kwargs: Any) -> None
⋮----
def update_parsed_layout(self, **kwargs: Any) -> None
⋮----
def update_parsed_form(self, **kwargs: Any) -> None
⋮----
def update_parsed_ocr(self, **kwargs: Any) -> None
⋮----
def update_parsed_genkit(self, **kwargs: Any) -> None
⋮----
def mark_rag_ready(self, **kwargs: Any) -> None
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
def ocr_json_path(self, upload_object_path: str) -> str
⋮----
def genkit_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
⋮----
def get_document_pipeline_gateway() -> DocumentPipelineGateway
⋮----
_composed_document_pipeline_gateway = _ComposedDocumentPipelineGateway()
````

## File: fn/src/app/container/runtime_dependencies.py
````python
"""Dependency registration — thin composer wiring gateways into the registry.

Each gateway implementation lives in its own module under
infrastructure/gateways/ following SRP. This file only wires them.
"""
⋮----
def register_runtime_dependencies() -> None
````

## File: fn/src/interface/handlers/parse_document.py
````python
"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。

Schema validation (Rule 4) is performed via ParseDocumentRequest.from_raw()
before any application-layer call.  All pipeline orchestration is delegated
to the parse_document_pipeline use case.
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
actor_id = _extract_auth_uid(req)
⋮----
schema = ParseDocumentRequest.from_raw(req.data or {})
````