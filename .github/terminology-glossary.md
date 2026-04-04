---
title: Terminology Glossary
description: Xuanwu terminology for token/prompt/context efficiency, system performance, optimization, and AI/RAG systems.
---

# Terminology Glossary

Reference for Xuanwu project terminology across token efficiency, system performance, and knowledge engineering.

## Token / Prompt / Context Efficiency

- **Token Efficiency** (Token 效率)
- **Context Efficiency** (上下文效率)
- **Prompt Efficiency** (提示詞效率)
- **Compression Efficiency** (壓縮效率)
- **Summarization Efficiency** (摘要效率)
- **Retrieval Efficiency** (檢索效率)
- **Embedding Efficiency** (向量化效率)

## System / Computational Efficiency

- **Computational Efficiency** (計算效率)
- **Algorithmic Efficiency** (演算法效率)
- **Memory Efficiency** (記憶體效率)
- **Storage Efficiency** (儲存效率)
- **Network Efficiency** (網路效率)
- **Cache Efficiency** (快取效率)
- **Rendering Efficiency** (渲染效率)
- **Build Efficiency** (建置效率)

## Optimization Terms

- **Efficiency Optimization** (效率優化)
- **Throughput Optimization** (吞吐量優化)
- **Latency Optimization** (延遲優化)
- **Cost Optimization** (成本優化)
- **Performance Optimization** (效能優化)
- **Query Optimization** (查詢優化)
- **Pipeline Optimization** (管線優化)

## Performance Metrics

- **Throughput** (吞吐量)
- **Latency** (延遲)
- **Response Time** (回應時間)
- **Execution Time** (執行時間)
- **Memory Usage** (記憶體使用)
- **CPU Utilization** (CPU 使用率)
- **Cache Hit Rate** (快取命中率)
- **Token Cost** (Token 成本)

## AI / RAG / Knowledge System

- **Retrieval Performance** (檢索效能)
- **Context Window Utilization** (上下文窗口利用率)
- **Document Compression** (文件壓縮)
- **Context Packing** (上下文打包)
- **Token Budgeting** (Token 預算控制)
- **Context Pruning** (上下文剪枝)
- **Deduplication** (去重)
- **Canonicalization** (正規化)

## Token / Prompt / Context Operations

- **Token Packing** — 將零散資訊壓縮到最少 token
- **Token Pruning** — 去掉無用 token
- **Context Assembly** — 將相關 chunks 組合成可用上下文
- **Context Chunking** — 把大文檔切成適合檢索的塊
- **Prompt Refactoring** — 優化 prompt 結構與邏輯
- **Context Deduplication** — 防止重複 token

## Retrieval / RAG

- **Chunk Efficiency** — 每個 chunk 使用的 token 是否有效
- **Retrieval Compression** — 檢索結果只保留核心資訊
- **Context Relevance** — token 是否提供有用訊息
- **Embedding Optimization** — 降低向量索引 token 消耗

## Documentation Engineering

- **Knowledge Compression** (知識壓縮)
- **Knowledge Refactoring** (知識重構)
- **Documentation Chunking** (文件分塊)
- **Documentation Deduplication** (文件去重)
- **Documentation Normalization** (文件正規化)

## Core Metrics

- **Token Utilization Rate** (Token 利用率)
- **Useful Token Ratio** — 只計算有用資訊的 token
- **Token Footprint** (Token 佔用量)
- **Token Overhead** (Token 開銷)

## DDD 戰略設計術語 (Strategic Design)

本節術語遵循 Vaughn Vernon《Implementing Domain-Driven Design》(IDDD) 規範。Copilot 生成程式碼時必須查閱並遵守。

- **Ubiquitous Language** (通用語言) — 領域專家與開發者共用的詞彙體系，所有命名必須以此為準。
- **Bounded Context** (限界上下文) — 每個 `modules/<context>/` 資料夾代表一個獨立的限界上下文，擁有自己的通用語言。
- **Context Map** (上下文地圖) — 描述各限界上下文之間關係的可視化模型。
- **Anti-Corruption Layer** (防腐層) — 防止外部系統概念污染領域模型的轉換介面，放置於 `infrastructure/` 層。
- **Shared Kernel** (共用核心) — 多個限界上下文共用的領域知識，本專案使用 `modules/shared/` 承載。
- **Open Host Service** (開放主機服務) — 透過公開的 `api/` 合約提供服務給其他限界上下文。
- **Published Language** (發布語言) — 模組 `api/` 層定義的公開合約型別（DTOs、Facade 介面）。

## DDD 戰術設計術語 (Tactical Design)

- **Aggregate Root** (聚合根) — 聚合的唯一入口點，負責保護業務不變數，持有 `_domainEvents` 陣列並提供 `pullDomainEvents()` 方法。
- **Aggregate** (聚合) — 由聚合根管理的一組相關領域物件，保證資料一致性的邊界。
- **Entity** (實體) — 具有唯一識別碼的領域物件，以識別碼判斷相等性。
- **Value Object** (值對象) — 無識別碼、不可變、以值內容判斷相等性的領域物件，使用 Zod 品牌型別實作。
- **Domain Event** (領域事件) — 捕捉領域中已發生的業務事實，命名使用**過去式**，包含 `eventId` 與 `occurredAt`（ISO string）欄位。
- **Repository** (儲存庫) — 聚合的持久化抽象介面，定義在 `domain/repositories/`，實作在 `infrastructure/`。
- **Domain Service** (領域服務) — 不屬於任何實體或值對象的無狀態業務邏輯，放置於 `domain/services/`。
- **Use Case** (使用案例) — `application/use-cases/` 層的單一業務操作，協調領域物件完成業務目標。
- **Application Service** (應用服務) — 等同於 Use Case，協調聚合、儲存庫與事件發布。
- **Factory Method** (工廠方法) — 聚合根的靜態 `create()` 方法，封裝建立邏輯並產生初始領域事件。
- **Invariant** (不變數) — 聚合必須在任何時候都保護的業務規則，違規時拋出 `Error`。
- **Anemic Domain Model** (貧血領域模型) — 反模式，只有資料屬性無業務邏輯的類別，應避免。
