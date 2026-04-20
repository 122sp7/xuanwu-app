"""
專案層級常數 — 從環境變數讀取，讓同一份程式碼在 dev / staging / prod 皆可用。
"""

import os

# ── GCP 基礎設定 ────────────────────────────────────────────────────────────
GCP_PROJECT: str = "65970295651"
GCP_REGION: str = os.environ.get("FUNCTION_REGION", "asia-southeast1")

# -- Cloud Storage ----------------------------------------
# Firebase Storage bucket (from firebase.json storage.bucket)
UPLOAD_BUCKET: str = os.environ.get(
    "UPLOAD_BUCKET", "xuanwu-i-00708880-4e2d8.firebasestorage.app"
)

# ── Document AI ──────────────────────────────────────────────────────────────
# 格式： projects/{project}/locations/{location}/processors/{processor_id}
#
# ⚠️  兩個 processor 均位於 US region，endpoint 必須使用 us-documentai.googleapis.com
# Layout Parser  → https://us-documentai.googleapis.com/v1/projects/65970295651/locations/us/processors/929c4719f45b1eee:process
# Form Parser    → https://us-documentai.googleapis.com/v1/projects/65970295651/locations/us/processors/7318076ba71e0758:process

DOCAI_LOCATION: str = "us"
DOCAI_API_ENDPOINT: str = "us-documentai.googleapis.com"

# Layout Parser — 保留表格結構與段落語意邊界的主要 Processor（混合文件首選）
# AP8 採購訂購單：多層嵌套表格 + 大量段落文字，Layout Parser 輸出 context-aware chunks
DOCAI_LAYOUT_PROCESSOR_NAME: str = os.environ.get(
    "DOCAI_LAYOUT_PROCESSOR_NAME",
    "projects/65970295651/locations/us/processors/929c4719f45b1eee",
).strip()

# Form Parser — 結構化欄位擷取副通道（PO號、金額、日期、供應商等 KV entity）
# 若未設定則使用預設 US Form Parser；設為空字串可停用副通道
DOCAI_FORM_PROCESSOR_NAME: str = os.environ.get(
    "DOCAI_FORM_PROCESSOR_NAME",
    "projects/65970295651/locations/us/processors/7318076ba71e0758",
).strip()

# OCR Processor — 高品質全頁文字擷取通道（AP8採購訂單等密集表格 PDF 推薦）。
# AP8 PO 4510250181：54 個明細（項次 10–540，步進 10），需 OCR 完整擷取中文描述。
# https://us-documentai.googleapis.com/v1/projects/65970295651/locations/us/processors/f88dfd0407416be7:process
DOCAI_OCR_PROCESSOR_NAME: str = os.environ.get(
    "DOCAI_OCR_PROCESSOR_NAME",
    "projects/65970295651/locations/us/processors/f88dfd0407416be7",
).strip()

# 舊版 asia-southeast1 processor — 已棄用，保留供向下相容
_DOCAI_PROCESSOR_NAME_LEGACY: str = (
    "projects/65970295651/locations/asia-southeast1/processors/ce1eedab7b277f54"
)

# ── OpenAI (Embeddings / LLM) ───────────────────────────────────────────────
OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_EMBEDDING_MODEL: str = os.environ.get(
    "OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"
)
OPENAI_EMBEDDING_DIMENSIONS: int = int(os.environ.get("OPENAI_EMBEDDING_DIMENSIONS", "1024"))
OPENAI_LLM_MODEL: str = os.environ.get("OPENAI_LLM_MODEL", "gpt-4o-mini")
OPENAI_TIMEOUT_SECONDS: float = float(os.environ.get("OPENAI_TIMEOUT_SECONDS", "30"))
OPENAI_MAX_RETRIES: int = int(os.environ.get("OPENAI_MAX_RETRIES", "2"))

# ── Upstash (Vector / Redis / Search / QStash) ─────────────────────────────
UPSTASH_REDIS_REST_URL: str = os.environ.get("UPSTASH_REDIS_REST_URL", "").strip()
UPSTASH_REDIS_REST_TOKEN: str = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "").strip()

UPSTASH_VECTOR_REST_URL: str = os.environ.get("UPSTASH_VECTOR_REST_URL", "").strip()
UPSTASH_VECTOR_REST_TOKEN: str = os.environ.get("UPSTASH_VECTOR_REST_TOKEN", "").strip()

UPSTASH_SEARCH_REST_URL: str = os.environ.get("UPSTASH_SEARCH_REST_URL", "").strip()
UPSTASH_SEARCH_REST_TOKEN: str = os.environ.get("UPSTASH_SEARCH_REST_TOKEN", "").strip()
UPSTASH_SEARCH_INDEX: str = os.environ.get("UPSTASH_SEARCH_INDEX", "").strip()
UPSTASH_SEARCH_TIMEOUT_SECONDS: float = float(os.environ.get("UPSTASH_SEARCH_TIMEOUT_SECONDS", "8"))

QSTASH_URL: str = os.environ.get("QSTASH_URL", "https://qstash-us-east-1.upstash.io").strip()
QSTASH_TOKEN: str = os.environ.get("QSTASH_TOKEN", "").strip()
QSTASH_CURRENT_SIGNING_KEY: str = os.environ.get("QSTASH_CURRENT_SIGNING_KEY", "").strip()
QSTASH_NEXT_SIGNING_KEY: str = os.environ.get("QSTASH_NEXT_SIGNING_KEY", "").strip()
QSTASH_RAG_AUDIT_URL: str = os.environ.get("QSTASH_RAG_AUDIT_URL", "").strip()

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
    "1",
    "true",
    "yes",
    "on",
)
RAG_DOC_CACHE_TTL_SECONDS: int = int(os.environ.get("RAG_DOC_CACHE_TTL_SECONDS", "2592000"))
RAG_REDIS_PREFIX: str = os.environ.get("RAG_REDIS_PREFIX", "rag").strip()
