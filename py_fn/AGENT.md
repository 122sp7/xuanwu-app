# py_fn — Agent Guide

## Purpose

`py_fn/` 是 Python Cloud Functions 的 worker 層，負責 ingestion、parsing、chunking、embedding 與 background job 等需要高資源消耗或可重試的批次作業。

## Runtime Boundary

- `py_fn/` 處理：parse、clean、taxonomy、chunk、embed、persistence pipeline
- Next.js 處理：upload UX、browser-facing API、response orchestration
- 兩者互動只透過 QStash 訊息、Firestore trigger 或事件契約

## Route Here When

- 需要解析、清洗文件內容（PDF、Markdown、HTML）
- 需要 chunk、embed、存入向量資料庫
- 需要可重試的背景作業或批次處理

## Route Elsewhere When

- 需要 browser-facing API 或即時回應 → `src/app/`
- 需要 use case 業務邏輯 → `src/modules/<context>/`

## Architecture

`py_fn/src/` 採用同樣的 Hexagonal Architecture 分層：
- `app/` — 應用入口（config、bootstrap、container、settings）
- `application/` — use cases、DTO、ports、services、mappers
- `domain/` — entities、value objects、repositories、events
- `infrastructure/` — Firestore、Storage、AI SDK adapters

詳細架構規範見 [README.md](README.md)。
