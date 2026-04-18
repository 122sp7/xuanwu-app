# Platform API Architecture Rules

## Two-Layer API Model

**Infrastructure API** (low-level / module-internal):
- Ownership: platform
- Consumers: notion, notebooklm only
- Content: Runtime contracts (Firestore, Storage, Genkit)
- Usage: Data persistence and external tool invocation, NO business logic hiding

**Platform Service API** (high-level / system-wide):
- Ownership: platform
- Consumers: workspace, notion, notebooklm (all)
- Content: Cross-domain contracts (Auth, Permission, File, AI)
- Usage: Governance, entitlement, multi-tenant isolation

## Access Rules (ACL Reference)

| Caller | Firestore | Storage | Genkit | Auth | Permission | File | AI |
|--------|-----------|---------|--------|------|------------|------|-----|
| workspace | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| notion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅* | ✅ |
| notebooklm | ✅ | ✅ | ✅ | ✅ | ✅ | ✅* | ✅ |

*File API required for ownership/entitlement/multi-tenant concerns

## Semantic Distinction

- `uploadUserFile(file, ownerId)` → semantic contract (governance layer)
- `Storage.upload(path)` → mechanism contract (how bytes move)
- Never conflate the two.

## Governance Invariants

1. Each module owns its domain-local adapters (iam, billing, ai, platform, workspace, notion, notebooklm)
2. notion/notebooklm: Use Infrastructure APIs for local persistence; use Platform Service APIs for cross-domain operations (file ownership, auth, permission)
3. workspace: NEVER direct Infrastructure API access — always via Platform Service APIs
4. cross-domain: ALL operations route through Platform Service APIs or published language
5. ubiquitous language: upstream-owned (Actor, Tenant ← iam; Entitlement ← billing; fileId ← platform)

## Cockburn Principle

Lightest structure: exactly two layers, no more, protecting real boundaries (runtime vs governance, local vs cross-domain).

## Citation
- Updated: AGENTS.md (formalized NotionAPI/NotebookLMAPI section)
- Date: 2026年4月12日
- Decision: Codify two-layer API model to prevent governance bypass and clarify module access patterns.
