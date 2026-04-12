# AGENTS.md Four Domains and Ubiquitous Language

## Updated Structure

AGENTS.md now contains comprehensive four-domain architectural reference:

1. **Strategic Overview Table** — Main Domain Map with baseline + gap subdomains count
2. **Ubiquitous Language** — Domain Key Terms table and Published Language columns
3. **Context Map (Upstream → Downstream)** — ASCII diagram showing platform → workspace/notion/notebooklm hierarchy
4. **Published Language Token Glossary** — 11 tokens with canonical domains and constraints
5. **Dependency Direction Rules** — Fixed upstream flow and anti-patterns
6. **Module Ownership Guardrails** — Ownership table for all major concerns

## Key Rules Formalized

- platform owns: identity, permission, entitlement, AI capability routing, tenant isolation
- workspace owns: workspace lifecycle, membership, sharing, scheduling, audit, feed
- notion owns: knowledge artifact authoring, taxonomy, relations, publishing, versioning
- notebooklm owns: conversation, notebook, note, source, synthesis (RAG pipeline)

## Published Language Constraints

- Actor ≠ Membership (never mix identity with workspace participation)
- Entitlement signal ≠ feature-flag payload
- platform.ai is the unique `ai` subdomain; notion/notebooklm are consumers only
- KnowledgeArtifact reference is read-only (no ownership transfer)
- workspaceId never replaces local primary keys

## Upstream → Downstream Flow

Fixed hierarchy: platform → workspace/notion/notebooklm → workspace → notion/notebooklm → notion → notebooklm
Never reverse; always use published language + Service APIs for cross-domain.

## Storage Location

AGENTS.md now serves as the Copilot-visible authority for:
- API layer rules (Infrastructure vs Platform Service)
- Governance invariants
- Four-domain overview with baseline/gap split
- Ubiquitous language and naming constraints
- Context map and dependency direction

## Citation

File: AGENTS.md  
sections: "Four Main Domains" (new)
Date: 2026年4月12日
Decision: Codify four-domain architecture and ubiquitous language in AGENTS.md to prevent Copilot drift from docs/contexts/* authority.
