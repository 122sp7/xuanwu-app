- Project: xuanwu-app (Next.js 16, React 19, TypeScript 5, Node.js 24), a personal- and organization-oriented Knowledge Platform built as a modular monolith with Hexagonal DDD boundaries.
- Purpose: bring documents, notes, knowledge pages, knowledge-base articles, structured data, and external sources into governable workspaces so knowledge can be preserved, verified, retrieved, reasoned over, and turned into executable work.
- Main runtimes:
  - Next.js App Router in `app/` (canonical) / `src/app/` (new distillation target) owns user-facing UI, auth/session, orchestration, uploads, and streaming AI responses.
  - Python worker in `py_fn/` owns ingestion, parsing, chunking, embedding, and background processing.
- Key directories: `app/`, `src/app/`, `modules/`, `src/modules/`, `packages/`, `py_fn/`, `docs/`, `.github/`
- Documentation entrypoints: `docs/README.md`, `docs/architecture-overview.md`

## ⚠ Two-Layer Module Structure (DO NOT confuse)

| Path | Role | Status |
|---|---|---|
| `modules/<context>/` | Full Hexagonal DDD (strategic boundary authority) | 18 contexts, production |
| `src/modules/<context>/` | Lean distilled skeleton (implementation target) | 9 modules, under construction |

- `src/modules/template/` is the COMPLETE reference scaffold — copy when starting new modules
- `src/app/` is the NEW Next.js routing target (see `src/app/AGENT.md` + `src/app/README.md`)
- `app/` is the CURRENT production routing layer (still canonical until migration completes)

## ⚠ Two-Layer App Structure (DO NOT confuse)

| Path | Role |
|---|---|
| `app/` | Current production Next.js App Router |
| `src/app/` | New distillation-target App Router (same route groups, cleaner composition) |