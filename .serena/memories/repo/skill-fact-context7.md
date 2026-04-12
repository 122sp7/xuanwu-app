# Skill Fact: Context7 (Official Documentation Authority)

**Type**: API verification and documentation skill  
**Authority**: MCP tool; official framework/library documentation sources  
**Application Scope**: API signatures, version behavior, config schema, framework details, breaking changes  

---

## Core Rule: 99.99% Confidence Threshold

**Before answering, planning, or writing code that depends on**:
- API signatures, parameters, return types
- Version compatibility or breaking changes
- Configuration file schemas (Next.js, Firebase, Zod, etc.)
- Default behavior or version-specific features

**Verify confidence**: If below 99.99%, query Context7 first.

**Why**: Model memory becomes stale; frameworks release updates constantly. Even high-confidence assertions can diverge after minor version bumps.

---

## Forced Workflow

### Step 1: Scope to Single Library + Single Topic
Narrow the question to avoid mixing frameworks in one query.

| Good | Bad |
|------|-----|
| "Next.js Server Actions: form submission API" | "Next.js and React hooks and async/await" |
| "Firebase Firestore: field deletion patterns" | "Firebase storage everything" |
| "Zod: branded type validation" | "All Zod features" |

### Step 2: Resolve Library ID
Call `mcp_context7_resolve-library-id` with library name.

Result: Context7-compatible ID (e.g., `/vercel/next.js`, `/mongodb/docs`)

**Exception**: If user provides ID directly (e.g., `/vercel/next.js/v16`), skip to Step 3.

### Step 3: Fetch Official Docs
Call `mcp_context7_get-library-docs` with:
- **context7CompatibleLibraryID**: ID from Step 2 (or provided)
- **mode**: `"code"` for APIs/signatures/examples; `"info"` for concepts/architecture/migration
- **topic**: Narrow focus (e.g., "server actions", "firestore rules")
- **page**: 1 (default); increase if first page insufficient

### Step 4: Use First Page
Parse returned documentation. If insufficient, retry with same topic, `page: 2` (or 3, 4...).

### Step 5: Answer Based on Fetched Documentation
State clearly: "Per Context7 docs for [library]..." 

Do NOT fall back to model memory if Context7 document says something different.

---

## Self-Consistency Rules

| Rule | Why | When It Matters |
|------|-----|---|
| **Resolve first, then fetch** | Prevents guessing library IDs | Ambiguous library names (e.g., "React") |
| **One library per query** | Prevents cross-framework confusion | Mixing Next.js + Firebase + Zod in one ask |
| **Topic stays narrow** | Reduces noise; easier pagination | "hooks" not "all of React" |
| **mode: "code" for APIs** | Gives signatures and examples | API uncertainty |
| **mode: "info" for concepts** | Gives rationale and architecture | Understanding behavior, breaking changes, design patterns |
| **Paginate if needed** | First page may be overview only | Deep API reference topic |
| **Always cite Context7** | Prevents confusion with model heuristics | Answer could diverge from user's local version |

---

## Xuanwu-Specific Usage Patterns

| Scenario | Pattern |
|----------|---------|
| **Verify Next.js Server Action contract** | Resolve `/vercel/next.js`, mode="code", topic="server actions" |
| **Check Firebase Firestore rules syntax** | Resolve `/firebase/firestore`, mode="code", topic="security rules", page as needed |
| **Understand Zod schema validation** | Resolve `/zod/zod`, mode="code", topic="schema validation" |
| **Confirm Genkit flow definition API** | Resolve `/vercel/genkit`, mode="code", topic="flow definition" |
| **Check TanStack Query (React Query) patterns** | Resolve `/tanstack/query`, mode="info", topic="query patterns" |

---

## When NOT to Use Context7

| Situation | Use Instead |
|-----------|---|
| General algorithm question (no framework dependency) | Standard LLM reasoning |
| Domain logic design (business rules, not tech) | Hexagonal DDD skill + AGENTS.md |
| Process/collaboration questions | Alistair Cockburn skill |
| Simplification/reduction questions | Occam's Razor skill |
| Codebase structure questions | xuanwu-app-skill |
| Serena MCP usage questions | Serena MCP skill |

---

## Decision Tree

```
Question involves:
  library/framework API, config, version, breaking change?
    YES → 99.99% confident in answer without checking?
            NO → Use Context7 (resolve → fetch → cite)
            YES → Can provide answer + cite where it comes from
                  (state: "Per Context7" or "From model memory, not verified")
    
    NO → Check if another skill applies
         (Cockburn, Hexagonal DDD, Occam) or just reason directly
```

---

## Error Handling

| Error | Recovery |
|---|---|
| Resolve ID fails (ambiguous name) | Clarify with user; try more specific name |
| Docs page seems incomplete | Increase `page` parameter; try different `topic` |
| Context7 contradicts model memory | Trust Context7 document; update answer; note the divergence |
| Topic too broad (returns > 1000 tokens/page) | Narrow topic further; paginate if needed |

---

## Citations

- Context7 MCP tool (Upstash)
- MCP documentation official sources library-by-library
- Xuanwu: context7 SKILL.md, copilot-instructions.md (Context7 requirement)
