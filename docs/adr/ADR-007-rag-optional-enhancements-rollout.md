# ADR 007: RAG Optional Enhancements Rollout

## 狀態 (Status)
Accepted

## 背景 (Context)

Hybrid search、rerank、cache、feedback 都是企業級常見需求，但若同時上線，通常會導致：

1. 效果歸因困難。
2. 成本與延遲暴增。
3. 問題定位無法判斷是 retrieval、rerank 還是 cache 造成。

因此需要定義分階段 rollout，而非一次全部打開。

## 決策 (Decision)

optional enhancements 採四階段 rollout：

1. Phase 1: Vector baseline only
2. Phase 2: Hybrid retrieval
3. Phase 3: Re-ranking
4. Phase 4: Cache and feedback loop

每一階段都必須在前一階段達標後再啟用。

## 設計細節 (Design)

### 1. Phase 1: Vector baseline

能力：

- query embedding
- vector search
- top-k context
- generation + streaming

驗收：

- baseline latency 可接受
- citation 完整
- tenant isolation 無誤

### 2. Phase 2: Hybrid retrieval

能力：

- vector results
- keyword/BM25 results
- merge policy

驗收：

- recall 提升
- latency 增幅在可控範圍
- 不影響 tenant/workspace filter gate

### 3. Phase 3: Re-ranking

能力：

- top-k rerank
- top-n selection

驗收：

- 精準度提升
- rerank latency 可控
- 回答引用不失真

### 4. Phase 4: Cache and feedback

能力：

- query cache
- feedback write
- 離線調整 ranking/prompt

驗收：

- cache hit rate 達標
- 回應品質不因快取退化
- feedback schema 可用於後續調整

### 5. Rollback rules

任一 phase 若出現以下情況可回退：

1. P95 latency 超過既定門檻
2. answer quality 顯著下降
3. tenant 隔離風險
4. 成本異常飆升

回退時僅關閉該 phase 新增能力，保留 Phase 1 baseline。

## 後果 (Consequences)

### 正面影響

1. 功能與品質可逐段驗證。
2. 問題定位與成本控管更容易。
3. enhancement 不會直接污染核心流程。

### 負面影響

1. 上線節奏較慢。
2. 需要更多實驗設計與觀測儀表。

## Operational Notes

- 每個 phase 啟用前需定義 target metrics。
- phase 間切換建議使用 feature flag。
- 回退流程需事先演練。