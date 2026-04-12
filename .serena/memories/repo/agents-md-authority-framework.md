# AGENTS.md — Architectural Authority & Compliance Framework

**Type**: Repository-scoped strategic fact  
**Established**: 2026-04-12  
**Authority Level**: 🔴 SUPREME (supersedes all module-level rules)  
**Status**: Stable + Violation-remediation protocol established

---

## What AGENTS.md Declares (Turn 9-10)

### 1. Two-Layer API Model

| API Layer | Ownership | Consumers | Boundary |
|-----------|-----------|-----------|----------|
| **Infrastructure API** | platform | notion, notebooklm ONLY | Firestore, Storage, Genkit (low-level) |
| **Platform Service API** | platform | all modules (platform, workspace, notion, notebooklm) | Auth, Permission, File, AI (high-level) |

Rule: workspace ❌ Infrastructure APIs; workspace ✅ Service APIs  
Enforcement: AGENTS.md § "API Architecture Rules"

### 2. Four Main Domains + Ubiquitous Language

**Strategic Inventory** (38 subdomains total):
- platform (23 baseline + 4 gap) 
- workspace (4 baseline + 4 gap)
- notion (6 baseline + 3 gap)
- notebooklm (5 baseline + 4 gap)

**Published Language Tokens** (11 total):
- actor reference → platform.Actor (never mix with Membership)
- entitlement signal → platform.entitlement (never mix with feature-flag)
- ai capability signal → platform.ai ONLY (notion/notebooklm CONSUME, never OWN)
- knowledge artifact reference → notion (reference only, no transfer)
- workspaceId → workspace (never replaces local keys)
- + 6 more tokens with canonical domains and constraints

**Module Ownership Guardrails** (8 concerns):
- AI routing: platform OWNS; notion/notebooklm NEVER OWN
- Knowledge artifacts: notion OWNS; others REFERENCE ONLY
- Conversation/synthesis: notebooklm OWNS; others CONSUME
- + 5 more ownership constraints

Enforcement: AGENTS.md § "Four Main Domains"

### 3. Dependency Direction (Fixed)

```
platform → workspace → notion → notebooklm
platform → notion
platform → notebooklm
workspace → notebooklm
```

✅ Allowed: upstream → downstream  
❌ Forbidden: downstream → upstream (circular dependencies)

Enforcement: AGENTS.md § "Dependency Direction Rules"

---

## Compliance Protocol

### Finding Violations
1. grep patterns target: Infrastructure API calls in workspace, platform imports in modules, notion→notebooklm direct calls, terminology mixing
2. Scope: All 4 modules scanned for specific rule violations
3. Severity: CRITICAL (ownership breach), MEDIUM (terminology pollution)

### Fixing Violations
**Three-Tier Approach**:
1. **Documentation** (low-risk) — Add JSDoc explaining published language mapping
2. **Marking** (medium-risk) — Add migration notes + TODO + effort estimate
3. **Migration** (high-risk) — Phase-based content moves with validation checkpoints

**Authority for Remediation**:
- AGENTS.md rules are source of truth
- Module AGENT.md must conform to AGENTS.md
- Code must conform to module AGENT.md

---

## Known Violations (2026-04-12 Audit)

| Violation | Module | Fix Status | Authority |
|-----------|--------|-----------|-----------|
| notebooklm/ai owns AI capability | notebooklm | Documentation + Planned migration | AGENTS.md § ownership guardrails |
| NotionKnowledgePageGateway calls notion.api directly | notebooklm | Marked with TODO + migration notes | AGENTS.md § context map |
| workspace/audit uses "actorId" terminology | workspace | Fixed with published language docs | AGENTS.md § ubiquitous language |

All violations remediated or have clear remediation path. tsc/eslint PASSING.

---

## Why This Matters

- **Before**: Module boundaries were implicit; terminology mixed across contexts
- **After**: AGENTS.md makes all rules explicit; violations are detectable and prioritizable
- **Benefits**: 
  - Linters can enforce context map rules (future: eslint plugin)
  - Architects can review violations against written authority
  - New code submissions can self-check against AGENTS.md
  - Onboarding is clearer: read AGENTS.md first, then module-level AGENT.md

---

## Future Maintenance

### Each Session
- Before coding: check AGENTS.md for relevant rules
- After major changes: grep for violations using established patterns
- Update AGENTS.md if rules evolve (with ADR reference)

### Each PR
- Verify no new modules own "ai", "workflow", "analytics", "integration", "versioning" in violation of cross-domain duplicate resolution
- Verify context map not inverted (no downstream → upstream imports)
- Verify terminology consistency with AGENTS.md glossary

### Version Bumps
- Update AGENTS.md § "Module Ownership Guardrails" if a new subdomain is created
- Update AGENTS.md § "Published Language Tokens" if ubiquitous language evolves
- Reference ADR if decision changes

---

## Citations

- AGENTS.md: `d:\GitHub\122sp7\xuanwu-app\AGENTS.md` (complete strategic framework)
- Module AGENT.md files: each bounded context's implementation-level rules
- docs/bounded-contexts.md, subdomains.md, ubiquitous-language.md: Context7-verified sources

---

## Commit Message Template (for future reference)

```
feat(architecture): [module] [change]

- Change: ...
- AGENTS.md rule: Section "..."
- Authority: ...
- Violation fixed: [if applicable] AGENTS.md rule "..."
```
