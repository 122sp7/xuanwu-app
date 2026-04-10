# NotebookLM

本文件依 Context7 參考 DDD / Hexagonal 模組邊界與責任分離原則整理。以下缺口子域依本次任務前提，視為目前專案尚未落地但主域設計上應補齊的子域。

## Current Subdomains

| Subdomain | Role |
|---|---|
| ai | AI 模型調用與提示工程 |
| conversation | 對話 Thread 與 Message 生命週期 |
| note | 輕量筆記與知識連結 |
| notebook | Notebook 組合與管理 |
| source | 來源文件追蹤與引用 |
| synthesis | RAG 合成、摘要與洞察生成 |
| versioning | 對話版本與快照策略 |

## Missing Gap Subdomains

| Proposed Subdomain | Why Needed | Gap If Missing |
|---|---|---|
| ingestion | 承接來源匯入、正規化、切片前清理與可引用化處理 | source 會同時承擔追蹤與前處理，導致來源生命週期過重 |
| retrieval | 承接查詢到片段的召回、排序與檢索策略 | synthesis 缺少穩定上游邊界，RAG 能力會被塞進 source 或 ai |
| grounding | 承接 citation、provenance、answer-to-source 對齊與可追溯性 | source 存在但輸出無法保證可驗證引用，會放大 hallucination 風險 |
| evaluation | 承接對話與 synthesis 的品質評估、回歸基準與效果量測 | analytics 只能做使用量觀測，無法承接模型輸出品質的正典語言 |

## Recommended Order

1. retrieval
2. grounding
3. ingestion
4. evaluation