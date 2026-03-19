# AI Domain

## 🎯 Purpose
負責 AI orchestration（RAG），不擁有資料，只組裝 knowledge / taxonomy / retrieval。

## 🧠 Responsibilities
- RAG flow（Genkit）
- Prompt pipeline
- Context assembling
- Citation generation

## ❌ Not Responsible
- 不儲存資料
- 不做 vector search
- 不做 embedding
- 不管理 taxonomy

## 🔄 Flow
1. 接收 user query
2. 呼叫 retrieval 取得 chunks
3. 注入 taxonomy / metadata
4. 組 prompt
5. 呼叫 LLM
6. 回傳 answer + citation

## 📂 Structure
- application → RAG usecases
- domain → prompt model / policy
- infrastructure → Genkit adapter
- interfaces → API routes

## 🔗 Dependencies
- retrieval（必要）
- knowledge（hydration）
- taxonomy（filter/context）

## 📌 Key Rule
AI = orchestration only（不可持有資料）