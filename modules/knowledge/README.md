# Knowledge Domain

## 🎯 Purpose
系統的 Source of Truth，負責文件與結構資料。

## 🧠 Responsibilities
- Document / Collection
- Chunk（raw text）
- Versioning
- ACL（org / workspace）

## ❌ Not Responsible
- embedding
- vector search
- AI

## 📂 Structure
- domain → entities（Document, Chunk）
- application → usecases（create/update）
- infrastructure → Firestore
- interfaces → API

## 📊 Data Model
Document
- id
- title
- content
- version
- taxonomyRef
- visibility

Chunk
- documentId
- content
- order

## 🔐 Security
- orgId 必填
- 所有查詢必須帶 ACL filter

## 📌 Key Rule
Chunk 屬於 Knowledge，不屬於 Retrieval