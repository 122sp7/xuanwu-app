# Spec-Driven Development Workflow

This workflow is **opt-in**. Use it when explicitly requested by saying "use spec-driven development" or "follow the spec workflow".

## Design Documents

Design documents for features in development live under `docs/design/` (or in a feature subdirectory under `docs/`).

Each spec follows this structure:

```
docs/design/{feature}/
├── CLAUDE.md           # Feature-specific instructions (read this first)
├── design.md           # The specification
├── implementation.md   # Current status and what's done
├── decisions.md        # Why decisions were made
├── prompts.md          # Reusable prompts
├── future-work.md      # What's deferred
└── screenshots/        # Documentation screenshots
```

**Workflow:**

1. Read the spec's `CLAUDE.md` for specific instructions
2. Read `design.md` to understand what we're building
3. Check `implementation.md` for current status
4. Find the relevant code in the codebase
5. Implement in small pieces, update `implementation.md` after each

---

## When Implementing Features (Spec Mode)

1. **Check for design doc** in `docs/design/` — if it exists, follow it
2. **If no spec exists** — ask if you should create one first
3. **Look at existing patterns** — find similar code and follow conventions (see [`agents/knowledge-base.md`](agents/knowledge-base.md))
4. **Update implementation.md** — mark what's done after each piece
5. **Update decisions.md** — when choosing between approaches

---

## Creating a New Spec

When user asks to build a new feature:

1. Create the directory: `mkdir -p docs/design/{feature-name}`
2. Explore the codebase to understand existing patterns
3. Write `design.md` with technical spec
4. Write `CLAUDE.md` with feature-specific instructions
5. Initialize `implementation.md` with "not-started" status
6. Ask user to review before implementing

---

## Updating Spec Files

### implementation.md — After completing each piece:

```markdown
## Status: in-progress

## Completed
- [x] Domain entities and repository interface
- [x] Firebase repository implementation

## In Progress
- Server Actions

## Next Steps
1. UI components
2. Tests

## Session Notes
### 2024-01-15
- Done: Added domain entities, created Firebase repo
- Next: Implement Server Actions
```

### decisions.md — When choosing between approaches:

```markdown
## ADR-001: Use Firestore Sub-Collection for Chunks

### Context
Need to store document chunks for RAG retrieval.

### Options
1. Single `chunks` top-level collection — simpler queries, harder access control
2. Sub-collection under `documents` — better scoping, follows existing pattern

### Decision
Sub-collection for better scoping and consistency with the existing data model.

### Consequences
- Queries must specify the parent document path
- Access rules inherit from the parent document
```

---

## Don't (When Using Spec-Driven Development)

- Don't implement features without checking for a design doc first
- Don't skip updating `implementation.md` after completing work
- Don't make architectural decisions without recording them in `decisions.md`
