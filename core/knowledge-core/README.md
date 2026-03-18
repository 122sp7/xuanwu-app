# Knowledge Core

## Overview
Core domain for AI-ready knowledge system (RAG compatible)

---

## Flow

Knowledge → Taxonomy → Retrieval → Governance → Integration → Analytics → Knowledge

---

## Architecture

- domain: core logic
- application: use cases
- infrastructure: firebase / db
- interfaces: api / ai

---

## Data Flow

API / AI
↓
Application
↓
Domain
↓
Repository
↓
Infrastructure

---

## Principles

- Strict separation
- AI through UseCase only
- No direct DB access outside infrastructure
