---
title: Type-Check Before Tests
impact: HIGH
impactDescription: Catches errors faster than running the full test suite
tags: ci, type-check, typescript, workflow
---

## Type-Check Before Tests

**Impact: HIGH**

Always run TypeScript type-checking before running tests. Type errors are cheaper to fix than test failures, and they provide immediate feedback on import and interface mismatches.

**Workflow order:**

1. `npm run lint` — ESLint (catches import violations, unused vars)
2. `npm run build` — Next.js build (includes TypeScript type-checking)
3. Run tests (if build passes)

**Incorrect (running tests first):**

```bash
npm test                    # ❌ Tests may fail due to type errors
npm run build               # Only checked after tests failed
```

**Correct (lint → build → test):**

```bash
npm run lint                # ✅ Catches ESLint violations first
npm run build               # ✅ Type-checks and builds
npm test                    # ✅ Only runs after types are clean
```

**Why this matters:**
- A type error in a module boundary (`index.ts`) will cascade into dozens of test failures
- Fixing the type error is one change; debugging failed tests is many
- The `npm run build` step catches missing exports, wrong types, and broken imports across all modules
