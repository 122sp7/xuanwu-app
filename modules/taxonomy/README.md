# Taxonomy Domain

## 🎯 Purpose
負責語意分類與知識結構

## 🧠 Responsibilities
- Category（tree）
- Tags
- Relations（graph）

## ❌ Not Responsible
- document content
- vector search
- AI

## 📂 Structure
- domain → category / tag model
- application → manage taxonomy
- infrastructure → Firestore
- interfaces → API

## 📊 Model

Category
- id
- name
- parentId

Tag
- id
- name

Relation
- from
- to
- type

## 📌 Key Rule
Taxonomy = 跨 domain 語意層（不可耦合 document）