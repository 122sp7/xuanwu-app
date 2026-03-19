# ADR 008: RAG Observability SLO and Acceptance Gates

## 狀態 (Status)
Accepted

## 背景 (Context)

企業級 RAG 若沒有一致的觀測指標與驗收門檻，會造成：

1. 新功能是否上線無明確判準。
2. 問題發生時無法快速定位在 ingestion 或 query。
3. 團隊對品質的共識只停留在主觀描述。

## 決策 (Decision)

建立 RAG 的共用觀測模型、SLO 與驗收閘門，作為所有後續 ADR 的落地基線。

## 設計細節 (Design)

### 1. Metrics taxonomy

#### Ingestion metrics

- upload success rate
- processing success rate
- processing latency
- parse failure rate
- embedding latency
- ready transition latency

#### Query metrics

- query request rate
- retrieval latency
- generation latency
- end-to-end latency
- no-context rate
- citation completeness rate

#### Enhancement metrics

- hybrid merge latency
- rerank latency
- cache hit rate
- feedback write success rate

#### Reliability metrics

- error rate by errorCode
- retry success rate
- dead-letter count

### 2. SLO baseline

本 ADR 不固定數值，但固定 SLO 類別：

1. Availability SLO
2. Latency SLO
3. Quality SLO
4. Isolation SLO

說明：

- Availability: ingestion 與 query 可用性
- Latency: P50/P95/P99
- Quality: citation completeness、feedback 正向率
- Isolation: cross-tenant leakage = 0 容忍

### 3. Acceptance gates

功能進入正式上線前，至少需通過：

1. Ingestion gate: uploaded -> ready 成功率達標
2. Query gate: e2e latency 與 no-context rate 在門檻內
3. Isolation gate: tenant / workspace filter 驗證通過
4. Observability gate: trace 與 metrics 可完整追蹤

### 4. Trace model

每次 query 與 ingestion 任務需至少可串接：

- requestId
- traceId
- documentId
- tenantId
- workspaceId

traceId 應貫穿 upload、processing、query、generation。

### 5. Incident response hints

當 query 品質下降時，優先檢查：

1. ingestion success 與 parse error trend
2. vector retrieval latency 與空結果比例
3. rerank 或 cache 新版本是否啟用
4. taxonomy 分佈是否異常

## 後果 (Consequences)

### 正面影響

1. 所有 RAG 變更都能用同一套門檻評估。
2. 問題定位更快，跨團隊溝通成本下降。
3. 上線與回退決策更可審計。

### 負面影響

1. 初期需投入可觀測系統與儀表建立成本。
2. 指標過多時需要治理與維護策略。

## Operational Notes

- SLO 數值應由產品階段與實際流量另行設定，並記錄在 runbook。
- 每次重大版本變更前需重跑 acceptance gates。
- 若未通過 isolation gate，不可發布。