- Project: xuanwu-app (Next.js 16, React 19, TypeScript 5, Node.js 24), a personal- and organization-oriented Knowledge Platform built as a modular monolith with Hexagonal DDD boundaries.
- Purpose: bring documents, notes, knowledge pages, knowledge-base articles, structured data, and external sources into governable workspaces so knowledge can be preserved, verified, retrieved, reasoned over, and turned into executable work.
- Main runtimes:
  - Next.js App Router in `src/app/` owns user-facing UI, auth/session, orchestration, uploads, and streaming AI responses.
  - Python worker in `py_fn/` owns ingestion, parsing, chunking, embedding, and background processing.
- Key directories: `src/app/`, `src/modules/`, `packages/`, `py_fn/`, `docs/`, `.github/`
- Documentation entrypoints: `docs/README.md`, `docs/architecture-overview.md`

## Single-Layer Module & App Structure (2026-04-17+)

| Path | Role |
|---|---|
| `src/modules/<context>/` | 唯一 Hexagonal DDD 實作層（`modules/` 根目錄已刪除） |
| `src/app/` | 唯一 Next.js App Router（`app/` 根目錄已刪除） |

- `src/modules/template/` is the COMPLETE reference scaffold — copy when starting new modules
- `src/app/AGENT.md` + `src/app/README.md` are the routing authority