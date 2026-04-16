# Files

## File: py_fn/.gitignore
````
# Python bytecode
__pycache__/

# Python virtual environment
venv/
*.local
````

## File: py_fn/.serena/.gitkeep
````

````

## File: py_fn/docs/.gitkeep
````

````

## File: py_fn/main.py
````python
"""
py_fn — Firebase Functions (Python) 入口檔
==========================================

所有 Firebase Function 都在這裡用裝飾器宣告；
實際邏輯委派給 app/handlers/ 下的各模組。

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
# 監聽 UPLOAD_BUCKET 內的新物件 → Document AI 解析 → 寫入 Firestore
⋮----
"""GCS 物件建立後自動觸發 Document AI 解析流程。"""
⋮----
# ── HTTPS Callable ────────────────────────────────────────────────────────────
# 供前端或後端服務主動呼叫，按需解析單一 GCS 物件
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

## File: py_fn/README.md
````markdown
# py_fn 架構規範（路徑級依賴版）

這份規範重點是「看完整路徑判斷依賴」，不是看資料夾名稱。
例如 services 這個名字在 application 和 domain 都存在，但它們是不同層，規則不同。

## 1. 全域依賴方向

```text
interface -> application -> domain
infrastructure -> application -> domain
app -> interface / application / infrastructure / core
core -> all layers
domain -> only core
```

## 2. 目錄基準（含子資料夾）

```text
py_fn/src
├─ app
│  ├─ config
│  ├─ bootstrap
│  ├─ container
│  └─ settings
├─ application
│  ├─ use_cases
│  ├─ dto
│  ├─ services
│  ├─ ports
│  │  ├─ input
│  │  └─ output
│  └─ mappers
├─ domain
│  ├─ entities
│  ├─ value_objects
│  ├─ repositories
│  ├─ services
│  ├─ events
│  └─ exceptions
├─ infrastructure
│  ├─ cache
│  ├─ audit
│  ├─ persistence
│  │  ├─ firestore
│  │  ├─ storage
│  │  └─ vector
│  ├─ external
│  │  ├─ openai
│  │  ├─ genkit
│  │  └─ http
│  ├─ repositories
│  ├─ config
│  └─ logging
├─ interface
│  ├─ controllers
│  ├─ middleware
│  ├─ handlers
│  ├─ schemas
│  └─ routes
└─ core
   ├─ utils
   ├─ types
   ├─ constants
   ├─ exceptions
   └─ security
```

## 3. 各層職責摘要

### app
- 啟動、組裝、注入。
- 這一層可以依賴所有層，但不承載核心業務規則。

### application
- 放 use case、application service、ports、DTO、mappers。
- 負責流程編排，不直接依賴 infrastructure 實作。

### domain
- 放 entities、value objects、repositories 介面、domain services、events、exceptions。
- 是最核心的層，必須保持純淨。

### infrastructure
- 放 Firestore、Storage、Vector、外部 API、repository implementation。
- 只負責技術實作，不主導業務流程。

### interface
- 放 controllers、handlers、routes、schemas、middleware。
- 接外部請求、驗證輸入、呼叫 use case。

### core
- 放所有層可共用的 utils、types、constants、exceptions、security。
- core 本身不依賴任何外層。

## 4.1 值物件與 DTO 規劃

### 應放在 domain/value_objects
- 純資料語意、無基礎設施細節、可被多個 use case 重用。
- 例如：`RagQueryInput`、`RagCitation`、`RagQueryResult`。

### 應放在 application/dto
- 某個 use case 的輸入/輸出模型。
- 例如：`RagIngestionResult` 這種 use case 輸出摘要。

### 不應放進 domain/value_objects
- 外部服務供應商回傳模型。
- 例如：`ParsedDocument` 屬於 Document AI adapter 的回傳型別，保留在 infrastructure/external。

### 目前 py_fn 的落點範例
- `domain/value_objects/rag.py`: `RagQueryInput`, `RagCitation`, `RagQueryResult`
- `domain/repositories/rag.py`: `RagQueryGateway`, `RagIngestionGateway`, `DocumentPipelineGateway`
- `application/dto/rag.py`: `RagIngestionResult`
- `infrastructure/external/documentai/client.py`: `ParsedDocument`

## 4.2 同名資料夾的判讀規則

- services 只看名稱會誤判，必須看完整路徑
       - domain/services 是核心業務規則
       - application/services 是應用層編排
       - infrastructure/services 若存在，只能是技術 adapter；若可拆回更明確目錄，優先拆回 cache / audit / external / persistence
- repositories 也一樣
       - domain/repositories 是介面（contracts）
       - infrastructure/repositories 是實作（implementations）
- config 也一樣
       - app/config 是啟動與組裝配置
       - infrastructure/config 是技術配置
       - core/constants 才是跨層可共用常量

## 5. 路徑級依賴矩陣（最重要）

| From 路徑 | Allowed To Import |
| --- | --- |
| interface/routes | interface/controllers, interface/handlers, core |
| interface/controllers | application/use_cases, application/dto, domain, core |
| interface/handlers | application/use_cases, application/ports/input, core |
| interface/middleware | core |
| interface/schemas | core, 同層 schema 模組 |
| application/use_cases | domain, application/ports/output, application/dto, core |
| application/services | domain, application/ports/output, core |
| application/mappers | application/dto, domain, core |
| application/ports/input | domain, core |
| application/ports/output | domain, core |
| domain/entities | domain/value_objects, core |
| domain/value_objects | core |
| domain/services | domain/entities, domain/value_objects, domain/repositories, core |
| domain/repositories | domain/entities, domain/value_objects, core |
| domain/events | domain/entities, core |
| domain/exceptions | core |
| infrastructure/repositories | domain/repositories, domain/entities, infrastructure/persistence, core |
| infrastructure/cache | infrastructure/external, core |
| infrastructure/audit | infrastructure/external, core |
| infrastructure/persistence | domain/entities, domain/value_objects, core |
| infrastructure/external | application/ports/output, domain, core |
| infrastructure/config | core |
| infrastructure/logging | core |
| app/bootstrap | app/config, app/container, infrastructure, application, interface, core |
| app/container | infrastructure, application, domain, core |
| app/settings | core |
| core/* | 不可依賴任何外層 |

## 6. 明確禁止規則

- domain 不可 import application/interface/infrastructure/app
- application 不可 import infrastructure 實作
- interface 不可直接 import infrastructure（除非經 app 組裝注入後由 application port 提供）
- infrastructure 不可主導業務流程（流程應在 application/use_cases）

## 7. 標準依賴流

```text
route -> controller/handler -> use case -> domain -> repository interface
                                                     ^
                                                     |
                           repository implementation (infrastructure)
```

## 8. import 範例

### interface controller

```python
from application.use_cases.create_user import CreateUserUseCase
from interface.schemas.user_schema import CreateUserRequest
```

### application use case

```python
from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
```

### infrastructure repository implementation

```python
from domain.repositories.user_repository import UserRepository
from infrastructure.persistence.firestore.client import FirestoreClient
```

### app container

```python
from infrastructure.repositories.firestore_user_repository import FirestoreUserRepository
from application.use_cases.create_user import CreateUserUseCase
```

## 9. PR 檢查清單

- 是否用完整路徑判讀層級，而不是只看資料夾名稱
- domain 是否只依賴 core
- use case 是否只依賴抽象（ports/repository interface）
- infrastructure 是否只做技術實作
- app 是否是唯一組裝與注入入口

## 10. 附錄 A：快速記憶版

如果只想快速判斷，先記這張：

```text
Controller/Handler -> UseCase -> Domain -> Repository Interface
                                                                         ^
                                                                         |
                                                   Repository Implementation
                                                                         |
                                                                Database / API
```

對應路徑：

```text
interface/controllers or interface/handlers
application/use_cases
domain/entities or domain/services
domain/repositories
infrastructure/repositories
infrastructure/persistence or infrastructure/external
```

## 11. 附錄 B：高階流程圖

```text
HTTP Request
       -> interface (controller / handler)
       -> application (use case)
       -> domain (entity / service / repository interface)
       -> infrastructure (Firestore / Vector / API implementation)
```

## 12. 附錄 C：典型誤判案例

### services 同名但不同層
- `application/services/*` 可以編排流程，但不應放純領域規則。
- `domain/services/*` 才是純領域規則。

### repositories 同名但不同性質
- `domain/repositories/*` 是介面。
- `infrastructure/repositories/*` 是實作。

### config 同名但職責不同
- `app/config/*` 面向啟動與組裝。
- `infrastructure/config/*` 面向技術設定。
- 可跨層重用的常量優先放 `core/constants/*`。

## 13. 一句話總結

看完整路徑判斷層級，不看資料夾名稱猜責任。
````

## File: py_fn/requirements-dev.txt
````
-r requirements.txt
pytest>=8.3.0,<9.0.0
````

## File: py_fn/requirements.txt
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

## File: py_fn/src/app/__init__.py
````python
"""
App package — delegates Firebase Admin SDK initialization to app.bootstrap.
"""
⋮----
from app.bootstrap import *  # noqa: F401,F403
````

## File: py_fn/src/app/bootstrap/__init__.py
````python
"""
Firebase Admin SDK 初始化 — 整個 py_fn 只 initialize_app() 一次，
其他模組直接 import firebase_admin 即可取得已初始化的 app。
"""
⋮----
# Cloud Run / Cloud Functions 執行環境使用 ADC（Application Default Credentials）
# 本機測試時請先執行： gcloud auth application-default login
````

## File: py_fn/src/app/config/.gitkeep
````

````

## File: py_fn/src/app/container/.gitkeep
````

````

## File: py_fn/src/app/container/runtime_dependencies.py
````python
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
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> Any
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def parsed_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str
⋮----
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
⋮----
def register_runtime_dependencies() -> None
````

## File: py_fn/src/app/settings/.gitkeep
````

````

## File: py_fn/src/application/__init__.py
````python
"""Application layer package."""
````

## File: py_fn/src/application/dto/__init__.py
````python
"""Application DTOs."""
⋮----
__all__ = ["RagIngestionResult"]
````

## File: py_fn/src/application/dto/.gitkeep
````

````

## File: py_fn/src/application/dto/rag.py
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

## File: py_fn/src/application/mappers/.gitkeep
````

````

## File: py_fn/src/application/ports/input/.gitkeep
````

````

## File: py_fn/src/application/ports/output/.gitkeep
````

````

## File: py_fn/src/application/ports/output/gateways.py
````python
"""Backward-compatible application-layer re-export of domain repository contracts."""
⋮----
__all__ = [
````

## File: py_fn/src/application/services/.gitkeep
````

````

## File: py_fn/src/application/services/document_pipeline.py
````python
def get_document_pipeline() -> DocumentPipelineGateway
````

## File: py_fn/src/application/use_cases/__init__.py
````python
"""Application use cases."""
⋮----
__all__ = [
````

## File: py_fn/src/application/use_cases/rag_ingestion.py
````python
"""
RAG pipeline — ingestion use case (clean → chunk → embed → upsert).
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
"""Step 1~5: clean -> chunk -> metadata -> embed -> upsert vector。"""
gateway = gateway or get_rag_ingestion_gateway()
⋮----
raw_chars = len(text or "")
normalized = clean_text(text or "")
normalized_chars = len(normalized)
normalization_version = "v2"
language_hint = detect_language_hint(normalized)
⋮----
base_chunks = chunk_text(
⋮----
texts = [item["text"] for item in base_chunks]
vectors = gateway.embed_texts(texts, model=OPENAI_EMBEDDING_MODEL)
⋮----
now_iso = datetime.now(UTC).isoformat()
payload: list[dict[str, Any]] = []
⋮----
chunk_id = f"{doc_id}:{i:04d}"
⋮----
# Best effort: keep Upstash Search in sync with vector chunks.
⋮----
search_docs = [
⋮----
# 文件索引摘要寫入 Redis，方便後續檢視與治理。
````

## File: py_fn/src/application/use_cases/rag_query.py
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

## File: py_fn/src/core/__init__.py
````python
"""Core layer package."""
````

## File: py_fn/src/core/config.py
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
DOCAI_PROCESSOR_NAME: str = (
DOCAI_LOCATION: str = "asia-southeast1"
DOCAI_API_ENDPOINT: str = "asia-southeast1-documentai.googleapis.com"
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

## File: py_fn/src/core/constants/.gitkeep
````

````

## File: py_fn/src/core/exceptions/.gitkeep
````

````

## File: py_fn/src/core/security/.gitkeep
````

````

## File: py_fn/src/core/types/.gitkeep
````

````

## File: py_fn/src/core/utils/.gitkeep
````

````

## File: py_fn/src/domain/__init__.py
````python
"""Domain layer package."""
````

## File: py_fn/src/domain/aggregate/__init__.py
````python
"""Domain aggregate roots."""
````

## File: py_fn/src/domain/aggregate/.gitkeep
````

````

## File: py_fn/src/domain/entities/__init__.py
````python
"""Domain entities."""
````

## File: py_fn/src/domain/entities/.gitkeep
````

````

## File: py_fn/src/domain/events/__init__.py
````python
"""Domain events."""
````

## File: py_fn/src/domain/events/.gitkeep
````

````

## File: py_fn/src/domain/exceptions/__init__.py
````python
"""Domain exceptions."""
````

## File: py_fn/src/domain/exceptions/.gitkeep
````

````

## File: py_fn/src/domain/repositories/__init__.py
````python
"""Domain repository contracts."""
⋮----
__all__ = [
````

## File: py_fn/src/domain/repositories/.gitkeep
````

````

## File: py_fn/src/domain/repositories/rag.py
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
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> Any: ...
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None: ...
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None: ...
⋮----
def parsed_json_path(self, upload_object_path: str) -> str: ...
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

## File: py_fn/src/domain/services/__init__.py
````python
"""Domain services."""
⋮----
__all__ = [
````

## File: py_fn/src/domain/services/.gitkeep
````

````

## File: py_fn/src/domain/services/rag_ingestion_text.py
````python
"""
Domain Service — RAG ingestion text processing.

Pure business logic for text normalization, language detection, and
chunking.  No infrastructure dependency.
"""
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

## File: py_fn/src/domain/services/rag_result_filter.py
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

## File: py_fn/src/domain/value_objects/__init__.py
````python
"""Domain value objects."""
⋮----
__all__ = [
````

## File: py_fn/src/domain/value_objects/.gitkeep
````

````

## File: py_fn/src/domain/value_objects/rag.py
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

## File: py_fn/src/infrastructure/__init__.py
````python
"""Infrastructure layer package."""
````

## File: py_fn/src/infrastructure/audit/qstash.py
````python
logger = logging.getLogger(__name__)
⋮----
def publish_query_audit(*, query: str, top_k: int, citation_count: int, vector_hits: int, search_hits: int) -> None
````

## File: py_fn/src/infrastructure/cache/rag_query_cache.py
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

## File: py_fn/src/infrastructure/config/.gitkeep
````

````

## File: py_fn/src/infrastructure/external/__init__.py
````python
"""External service adapters."""
````

## File: py_fn/src/infrastructure/external/documentai/__init__.py
````python
"""Google Document AI integration."""
````

## File: py_fn/src/infrastructure/external/documentai/client.py
````python
"""
Document AI 服務層 — 封裝 google-cloud-documentai 的 process_document 呼叫。

用法：
    from infrastructure.external.documentai.client import process_document_bytes
    result = process_document_bytes(content=pdf_bytes, mime_type="application/pdf")
    print(result.text)
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
# 模組層級 client — 使用 asia-southeast1 regional endpoint
_client: documentai.DocumentProcessorServiceClient | None = None
⋮----
def _get_client() -> documentai.DocumentProcessorServiceClient
⋮----
client_options = {"api_endpoint": DOCAI_API_ENDPOINT}
_client = documentai.DocumentProcessorServiceClient(
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
⋮----
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
⋮----
raw_document = documentai.RawDocument(content=content, mime_type=mime_type)
request = documentai.ProcessRequest(
⋮----
response = client.process_document(request=request)
document = response.document
⋮----
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
⋮----
gcs_document = documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type)
````

## File: py_fn/src/infrastructure/external/openai/__init__.py
````python
"""OpenAI integration — client, embeddings, and LLM wrappers."""
⋮----
__all__ = [
````

## File: py_fn/src/infrastructure/external/openai/client.py
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

## File: py_fn/src/infrastructure/external/openai/embeddings.py
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

## File: py_fn/src/infrastructure/external/openai/llm.py
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

## File: py_fn/src/infrastructure/external/openai/rag_query.py
````python
def to_query_vector(query: str, *, model: str) -> list[float]
⋮----
def generate_answer(*, query: str, context_block: str) -> str
````

## File: py_fn/src/infrastructure/external/upstash/__init__.py
````python
"""Upstash integration (Vector / Redis / Search / QStash)."""
````

## File: py_fn/src/infrastructure/external/upstash/_base.py
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

## File: py_fn/src/infrastructure/external/upstash/clients.py
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

## File: py_fn/src/infrastructure/external/upstash/qstash_client.py
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

## File: py_fn/src/infrastructure/external/upstash/rag_query.py
````python
def query_vector(vector: list[float], top_k: int) -> list[dict]
⋮----
def query_search(query: str, top_k: int) -> list[dict]
````

## File: py_fn/src/infrastructure/external/upstash/redis_client.py
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

## File: py_fn/src/infrastructure/external/upstash/search_client.py
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

## File: py_fn/src/infrastructure/external/upstash/vector_client.py
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

## File: py_fn/src/infrastructure/logging/.gitkeep
````

````

## File: py_fn/src/infrastructure/persistence/__init__.py
````python
"""Persistence adapters."""
````

## File: py_fn/src/infrastructure/persistence/firestore/__init__.py
````python
"""Firestore persistence."""
````

## File: py_fn/src/infrastructure/persistence/firestore/document_repository.py
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

## File: py_fn/src/infrastructure/persistence/storage/__init__.py
````python
"""Cloud Storage persistence."""
````

## File: py_fn/src/infrastructure/persistence/storage/client.py
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

## File: py_fn/src/infrastructure/repositories/.gitkeep
````

````

## File: py_fn/src/interface/__init__.py
````python
"""Interface layer package."""
````

## File: py_fn/src/interface/controllers/.gitkeep
````

````

## File: py_fn/src/interface/handlers/__init__.py
````python
"""Interface layer entrypoint adapters for Firebase handlers."""
⋮----
__all__ = [
````

## File: py_fn/src/interface/handlers/_https_helpers.py
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

## File: py_fn/src/interface/handlers/https.py
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

## File: py_fn/src/interface/handlers/parse_document.py
````python
"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_parse_document(req: https_fn.CallableRequest) -> dict
⋮----
"""
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析。
    Firestore 會記錄完整的 lifecycle（processing → completed/error）。
    """
runtime = get_document_pipeline()
data: dict = req.data or {}
account_id = str(data.get("account_id", "")).strip()
workspace_id = str(data.get("workspace_id", "")).strip()
⋮----
gcs_uri: str = data.get("gcs_uri", "").strip()
⋮----
run_rag = bool(data.get("run_rag", True))
⋮----
# 解析 GCS URI 得到儲存檔名，並允許呼叫端覆蓋 doc_id。
path_part = gcs_uri.split("gs://", 1)[1]  # "bucket/path/to/file.pdf"
storage_filename = os.path.basename(path_part)     # "file.pdf"
default_doc_id, ext = os.path.splitext(storage_filename)   # "file", ".pdf"
doc_id = str(data.get("doc_id", "")).strip() or default_doc_id
filename = (
⋮----
# 推測 MIME 類型
mime_type = data.get("mime_type", "").strip()
⋮----
_mime_map = {
mime_type = _mime_map.get(ext.lower())
⋮----
size_bytes = data.get("size_bytes", 0)
⋮----
# ── 初始化 Firestore document ───────────────────────────────────────────
⋮----
# 解析 gs://bucket/path，取得 bucket 與 object_path
⋮----
# ── 同步解析（保持函數活躍直到完成） ─────────────────────────────────────
start_time = time.time()
⋮----
parsed = runtime.process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
extraction_ms = int((time.time() - start_time) * 1000)
⋮----
# 解析結果全文寫回 GCS JSON（與 uploads 目錄結構對應）
json_object_path = runtime.parsed_json_path(object_path)
json_gcs_uri = runtime.upload_json(
⋮----
# Step 5/6: RAG ingestion（可由呼叫端明確關閉，支援人工決策式流程）
⋮----
rag = ingest_document_for_rag(
⋮----
# 立即回覆（無論成功或失敗，Firestore 狀態已更新）
⋮----
"status": "processing",  # 前端應監聽 Firestore 的實際狀態
````

## File: py_fn/src/interface/handlers/rag_query_handler.py
````python
"""
HTTPS Callable — handle_rag_query：RAG 查詢（Step 7）。
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_rag_query(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：RAG 查詢（Step 7）。"""
uid = _extract_auth_uid(req)
⋮----
data: dict = req.data or {}
query = str(data.get("query", "")).strip()
account_id = str(data.get("account_id", "")).strip()
workspace_id = str(data.get("workspace_id", "")).strip()
⋮----
top_k = data.get("top_k")
⋮----
top_k_int = int(top_k) if top_k is not None else None
⋮----
top_k_int = None
⋮----
max_age_days = int(data.get("max_age_days")) if data.get("max_age_days") is not None else None
⋮----
max_age_days = None
⋮----
taxonomy_filters = _parse_taxonomy_filters(data.get("taxonomy_filters"))
require_ready = _to_bool(data.get("require_ready"), RAG_QUERY_REQUIRE_READY_STATUS)
⋮----
result = execute_rag_query(
response = {
````

## File: py_fn/src/interface/handlers/rag_reindex_handler.py
````python
"""
HTTPS Callable — handle_rag_reindex_document：手動觸發文件 RAG 重新索引。
"""
⋮----
logger = logging.getLogger(__name__)
⋮----
def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion。"""
runtime = get_document_pipeline()
data: dict = req.data or {}
⋮----
account_id = str(data.get("account_id", "")).strip()
doc_id = str(data.get("doc_id", "")).strip()
json_gcs_uri = str(data.get("json_gcs_uri", "")).strip()
source_gcs_uri = str(data.get("source_gcs_uri", "")).strip()
workspace_id = str(data.get("workspace_id", "")).strip()
filename = (
⋮----
page_count = int(data.get("page_count", 0) or 0)
⋮----
page_count = 0
⋮----
json_bytes = runtime.download_bytes(bucket_name=bucket_name, object_path=object_path)
parsed_payload = json.loads(json_bytes.decode("utf-8")) if json_bytes else {}
⋮----
text = str(parsed_payload.get("text", "")).strip()
⋮----
source_gcs_uri = str(parsed_payload.get("source_gcs_uri", "")).strip()
⋮----
workspace_id = str(parsed_payload.get("workspace_id", "")).strip()
⋮----
workspace_id = str((parsed_payload.get("metadata") or {}).get("space_id", "")).strip()
⋮----
page_count = int(parsed_payload.get("page_count", 0) or 0)
⋮----
rag = ingest_document_for_rag(
````

## File: py_fn/src/interface/handlers/storage.py
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
# ── Step 2: Document AI 解析 ──────────────────────────────────────────
start_time = time.time()
⋮----
parsed = runtime.process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
extraction_ms = int((time.time() - start_time) * 1000)
⋮----
# ── Step 3: 將解析全文寫回 GCS（files/ 前綴，同目錄結構）──────────
json_object_path = runtime.parsed_json_path(object_path)
json_data = {
json_gcs_uri = runtime.upload_json(
⋮----
# ── Step 4: 更新 Firestore 索引（只存 metadata，不存全文）─────────
⋮----
# ── Step 5/6: RAG ingestion（embed + vector + ready）───────────────
⋮----
rag = ingest_document_for_rag(
````

## File: py_fn/src/interface/middleware/.gitkeep
````

````

## File: py_fn/src/interface/routes/.gitkeep
````

````

## File: py_fn/src/interface/schemas/.gitkeep
````

````

## File: py_fn/tests/conftest.py
````python
SRC_DIR = Path(__file__).resolve().parents[1] / "src"
````

## File: py_fn/tests/test_domain_repository_gateways.py
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

## File: py_fn/tests/test_parse_document_handler.py
````python
class _FakeParsedDocument
⋮----
def __init__(self, page_count: int = 3, text: str = "parsed content") -> None
⋮----
class _FakeRuntime
⋮----
def __init__(self) -> None
⋮----
def init_document(self, **kwargs) -> None
⋮----
def process_document_gcs(self, *, gcs_uri: str, mime_type: str) -> _FakeParsedDocument
⋮----
def parsed_json_path(self, upload_object_path: str) -> str
⋮----
def upload_json(self, *, bucket_name: str, object_path: str, data: dict) -> str
⋮----
def update_parsed(self, **kwargs) -> None
⋮----
def mark_rag_ready(self, **kwargs) -> None
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
⋮----
class _FakeRagResult
⋮----
chunk_count = 2
vector_count = 2
embedding_model = "text-embedding-3-small"
embedding_dimensions = 1024
raw_chars = 24
normalized_chars = 20
normalization_version = "v2"
language_hint = "en"
⋮----
def test_handleParseDocument_WithExplicitDocIdAndRunRagFalse_UsesProvidedDocId(monkeypatch) -> None
⋮----
runtime = _FakeRuntime()
⋮----
def _unexpected_rag(**kwargs)
⋮----
response = handle_parse_document(
⋮----
def test_handleParseDocument_WithoutDocId_KeepsDefaultRagBehavior(monkeypatch) -> None
````