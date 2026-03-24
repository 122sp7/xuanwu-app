# Xuanwu Copilot Delivery Suite

Use this file as the Copilot-specific baseline for all work in this repository.

## Authoritative Sources

- Read [AGENTS.md](../AGENTS.md) for repository-wide operating rules.
- Read [CLAUDE.md](../CLAUDE.md) for cross-agent compatibility guidance.
- Read [agents/knowledge-base.md](../agents/knowledge-base.md) for module ownership, package aliases, and MDDD boundaries.
- Read [agents/commands.md](../agents/commands.md) for build, lint, and deployment commands.
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution and validation expectations.
- Read [docs/development-reference/reference/development-contracts/overview.md](../docs/development-reference/reference/development-contracts/overview.md) and [docs/diagrams-events-explanations/explanation/development-contract-governance.md](../docs/diagrams-events-explanations/explanation/development-contract-governance.md) when a workflow is contract-governed.

## Core Delivery Rules

- For cross-module, cross-runtime, or contract-governed work, plan before implementation.
- Treat each domain context under `modules/` as isolated. Cross-module interaction must go through the target domain `api/` boundary.
- Keep architecture guidance generic by default: do not hard-code domain-to-module assignments unless a governing contract explicitly requires it.
- Keep logic/UI/UX boundaries explicit: business logic in `domain/` + `application/`, UI/UX in `interfaces/` and `app/` composition.
- Start formal delivery work with the Planner agent or one of the planning prompts.
- Treat the implementation plan as the canonical execution contract for the current task.
- Persist approved plans explicitly when work must survive a chat reset or cross-session handoff.
- Keep implementation inside the approved scope, non-goals, and validation plan.
- Update documentation in the same change whenever runtime ownership, boundaries, acceptance gates, or public APIs change.

## Delivery Chain

Use the formal delivery chain for non-trivial work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use re-entry prompts when a session needs to restart or a stage must be rerun independently.

## Skill Routing

- Use [xuanwu-mddd-boundaries](skills/xuanwu-mddd-boundaries/SKILL.md) for module ownership, layer placement, and import-boundary questions.
- Use [xuanwu-development-contracts](skills/xuanwu-development-contracts/SKILL.md) for contract-first workflows and acceptance gates.
- Use [xuanwu-rag-runtime-boundary](skills/xuanwu-rag-runtime-boundary/SKILL.md) for RAG ownership across Next.js and `py_fn`.
- Use [vercel-react-best-practices](skills/vercel-react-best-practices/SKILL.md) when working in React or Next.js UI paths that need performance or rendering guidance.

## Validation

- Use the commands listed in [agents/commands.md](../agents/commands.md).
- At minimum, run the validation that matches the files changed.
- Use Chat customization diagnostics when a prompt, agent, or instruction does not appear to load or route correctly.
- Do not mark work complete if the plan's required validation or documentation updates are still pending.

---

# Token / AI Efficiency / Optimization Terminology Glossary

## Token / Prompt / Context Efficiency
- Token Efficiency（Token 效率）
- Context Efficiency（上下文效率）
- Prompt Efficiency（提示詞效率）
- Compression Efficiency（壓縮效率）
- Summarization Efficiency（摘要效率）
- Retrieval Efficiency（檢索效率）
- Index Efficiency（索引效率）
- Embedding Efficiency（向量化效率）
- RAG Efficiency（檢索生成效率）

## System / Computational Efficiency
- Computational Efficiency（計算效率）
- Algorithmic Efficiency（演算法效率）
- Memory Efficiency（記憶體效率）
- Storage Efficiency（儲存效率）
- Network Efficiency（網路效率）
- I/O Efficiency（輸入輸出效率）
- Query Efficiency（查詢效率）
- Cache Efficiency（快取效率）
- Rendering Efficiency（渲染效率）
- Build Efficiency（建置效率）

## Optimization Terms
- Efficiency Optimization（效率優化）
- Throughput Optimization（吞吐量優化）
- Latency Optimization（延遲優化）
- Cost Optimization（成本優化）
- Performance Optimization（效能優化）
- Resource Optimization（資源優化）
- Pipeline Optimization（管線優化）
- Workflow Optimization（工作流程優化）
- Query Optimization（查詢優化）
- Storage Optimization（儲存優化）
- Index Optimization（索引優化）
- Prompt Optimization（提示詞優化）
- Context Optimization（上下文優化）
- Compression Optimization（壓縮優化）

## Performance Metrics
- Throughput（吞吐量）
- Latency（延遲）
- Response Time（回應時間）
- Execution Time（執行時間）
- Processing Time（處理時間）
- Bandwidth（頻寬）
- Memory Usage（記憶體使用）
- CPU Utilization（CPU 使用率）
- Cache Hit Rate（快取命中率）
- Query Cost（查詢成本）
- Token Cost（Token 成本）
- Request Cost（請求成本）

## AI / RAG / Knowledge System
- Retrieval Performance（檢索效能）
- Context Window Utilization（上下文窗口利用率）
- Document Compression（文件壓縮）
- Context Packing（上下文打包）
- Prompt Packing（提示詞打包）
- Token Budgeting（Token 預算控制）
- Context Pruning（上下文剪枝）
- Deduplication（去重）
- Canonicalization（正規化）
- Normalization（標準化）

## Documentation Engineering Terms
- Documentation Compression
- Documentation Indexing
- Documentation Deduplication
- Documentation Normalization
- Documentation Canonical Source
- Documentation Refactoring
- Documentation Structuring
- Documentation Mapping
- Knowledge Base Optimization

---

## Token / Prompt / Context 操作
- Token Packing（Token 打包） → 將零散資訊壓縮到最少 token
- Token Pruning（Token 剪枝） → 去掉無用 token
- Context Assembly（上下文組裝） → 將相關 chunks 組合成可用上下文
- Context Chunking（上下文分塊） → 把大文檔切成適合檢索的塊
- Prompt Refactoring（Prompt 重構） → 優化 prompt 結構與邏輯
- Prompt Templating（Prompt 模板化） → 重用 prompt 結構，減少 token
- Context Deduplication（上下文去重） → 防止重複 token

## 檢索 / RAG 相關
- Chunk Efficiency（分塊效率） → 每個 chunk 使用的 token 是否有效
- Retrieval Compression（檢索壓縮） → 檢索結果只保留核心資訊
- Context Relevance（上下文相關性） → token 是否提供有用訊息
- Embedding Optimization（向量化優化） → 降低向量索引 token 消耗

## 文件 / Knowledge / Documentation
- Knowledge Compression（知識壓縮）
- Knowledge Refactoring（知識重構）
- Information Structuring（資訊結構化）
- Document Refactoring（文件重構）
- Documentation Chunking（文件分塊）

## 核心指標補充
- Token Utilization Rate（Token 利用率）
- Useful Token Ratio（有效 token 比率） → 只計算有用資訊的 token
- Token Footprint（Token 足跡 / Token 佔用量）
- Token Overhead（Token 開銷）