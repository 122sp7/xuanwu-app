# AGENTS.md Violations Found & Fix Plan

## Critical Violations

### 1. ❌ notebooklm/ai Subdomain
**Location**: modules/notebooklm/subdomains/ai/  
**Violation**: AGENTS.md Rule — "platform.ai is unique; notion & notebooklm CONSUME only, never OWN `ai` subdomain"  
**Evidence**: README states "⚠️ 此子域為過渡性（Transitional）邊界" — marked as TRANSITIONAL but still exists  
**Fix**: Remove notebooklm/ai subdomain entirely; all AI capability should flow through platform.ai  
**Severity**: 🔴 CRITICAL

### 2. ❌ notebooklm → notion Direct API Call
**Location**: modules/notebooklm/subdomains/source/infrastructure/adapters/NotionKnowledgePageGatewayAdapter.ts:12  
**Code**: `import { addKnowledgeBlock, createKnowledgePage } from "@/modules/notion/api"`  
**Violation**: AGENTS.md Rule — "notion → notebooklm context relationship must use published language tokens (knowledge artifact reference, attachment reference, taxonomy hint)"  
**Issue**: Adapter directly calls notion.api instead of through published language contract  
**Fix**: Extract published language tokens into a gateway port; adapt through port interface, not direct API call  
**Severity**: 🔴 CRITICAL

### 3. ⚠️ workspace/audit Uses "actorId" Naming
**Location**: modules/workspace/subdomains/audit/infrastructure/firebase/FirebaseAuditRepository.ts:31  
**Code**: `actorId: typeof data.actorId === "string" ? data.actorId : "system"`  
**Violation**: AGENTS.md Rule — "Never mix Actor + Membership terminology. Actor = identity (platform), Membership = workspace participation"  
**Issue**: workspace.audit is using platform.Actor terminology directly instead of consuming as "actor reference" published language token  
**Fix**: Rename to `initiatorId` or `emitterId`; document that workspace receives platform's "actor reference" token  
**Severity**: 🟡 MEDIUM (terminology pollution)

## Remediation Plan

| Violation | Type | Action | Module | Effort |
|-----------|------|--------|--------|--------|
| notebooklm/ai subdomain | Breach | Remove directory + refs | notebooklm | 1-2h |
| NotionKnowledgePageGateway | Breach | Extract port; adapt through interface | notebooklm+notion | 2-3h |
| workspace audit actorId | Pollution | Rename + doc as published language token | workspace | 1h |

## Validation Approach

1. Remove notebooklm/ai; verify no imports remain
2. Extract Notion gateway port; refactor adapter through port boundary
3. Rename workspace.audit actorId → initiatorId; document published language mapping
4. Run eslint/tsc to verify no new violations
5. Verify context-map still holds: platform → workspace (actor reference)

## Authority Reference

AGENTS.md sections:
- "Module Ownership Guardrails" — AI capability routing owned by platform only
- "Context Map (Upstream → Downstream)" — notion → notebooklm relationship via published language
- "Published Language Token Glossary" — actor reference constraint, Membership separation
