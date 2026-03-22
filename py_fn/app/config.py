"""
專案層級常數 — 從環境變數讀取，讓同一份程式碼在 dev / staging / prod 皆可用。
"""

import os

# ── GCP 基礎設定 ────────────────────────────────────────────────────────────
GCP_PROJECT: str = "65970295651"
GCP_REGION: str = os.environ.get("FUNCTION_REGION", "asia-southeast1")

# ── Cloud Storage ────────────────────────────────────────────────────────────
# 上傳等待 Document AI 處理的暫存 bucket
UPLOAD_BUCKET: str = os.environ.get("UPLOAD_BUCKET", f"{GCP_PROJECT}.appspot.com")

# ── Document AI ──────────────────────────────────────────────────────────────
# 格式： projects/{project}/locations/{location}/processors/{processor_id}
DOCAI_PROCESSOR_NAME: str = (
    "projects/65970295651/locations/asia-southeast1/processors/ce1eedab7b277f54"
)
DOCAI_LOCATION: str = "asia-southeast1"
DOCAI_API_ENDPOINT: str = "asia-southeast1-documentai.googleapis.com"

# ── Firestore ────────────────────────────────────────────────────────────────
# 解析結果寫入的 collection 路徑（{docId} 由呼叫端填入）
PARSED_RESULTS_COLLECTION: str = "parsed_documents"
