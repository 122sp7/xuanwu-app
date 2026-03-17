# Retrieval Domain

## 🎯 Purpose
負責 indexing + search（語意檢索）

## 🧠 Responsibilities
- Embedding
- Vector index（Upstash）
- Search（vector / hybrid）
- Filter（taxonomy / org）

## ❌ Not Responsible
- document 管理
- taxonomy 定義
- AI orchestration

## 📂 Structure
- domain → search model
- application → index/search usecases
- infrastructure → Upstash
- interfaces → API

## 🔄 Index Flow
1. 接收 chunk
2. embedding
3. upsert 到 Upstash

## 🔍 Search Flow
1. query embedding
2. vector search
3. filter（org + taxonomy）
4. return chunk ids

## 📌 Key Rule
Retrieval = index layer（不是 source of truth）