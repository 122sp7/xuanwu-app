# Memory Index — xuanwu-app

**Bootstrap instructions:** Read this file first, then load the numbered memories in order. Only load migration/* and ui/* memories when working in those areas.

**Last updated:** 2026-03-20 | Branch: `copilot/update-knowledge-development-docs`

---

## Core Memories (load in order)

| Memory | Description |
|--------|-------------|
| `00-project-overview` | Stack versions, directory slices, npm scripts, Python functions summary |
| `01-architecture-index` | MDDD + Hexagonal architecture, CommandResult pattern, dependency direction |
| `02-module-index` | All 17 modules, ports/ presence, core/ modules status |
| `03-runtime-entrypoints` | App Router routes, API routes, providers |
| `04-commands-and-checks` | Dev, build, lint, deploy commands |
| `05-environment-and-integrations` | Firebase, Upstash, Genkit, env var patterns |

---

## Domain Documentation (load when relevant)

| Memory | Description |
|--------|-------------|
| `06-docs-and-contracts` | **docs/ structure**: 11 RAG ADRs, 7 delivery contracts, architecture docs, design diagrams, Python ADRs |
| `07-python-functions` | Python Firebase Functions: rag_ingestion + document_ai bounded contexts, deploy pattern |

---

## Migration Track (load when working on specific modules)

| Memory | Description |
|--------|-------------|
| `migration/schedule-mddd-progress` | Schedule MDDD: domain complete, 4 use-cases, 6 Firebase adapters ALL DONE, next = UI |
| `migration/task-slice-progress` | Task module slice migration status |
| `migration/taxonomy-slice-progress` | Taxonomy slice migration status |
| `migration/workspace-interface-hook` | Workspace interface hooks patterns |
| `migration/workspace-screen-component` | Workspace screens: WorkspaceHubScreen, WorkspaceDetailScreen, DailyTab, MembersTab |
| `migration/workspace-shell-phase` | Workspace shell phase migration |

---

## UI Track

| Memory | Description |
|--------|-------------|
| `ui/shell-consistency` | Shell layout consistency rules and patterns |

---

## Key Facts (quick reference)

- **Active branch / PR**: `copilot/update-documentation-for-firebase-functions` — Relocated `functions-python` to root (ADR-012); all `libs/` content now cleared
- **Schedule MDDD**: Domain + Infrastructure COMPLETE; UI integration is the next milestone
- **Delivery contracts**: always read `docs/reference/development-contracts/<module>-contract.md` before implementing
- **Python functions**: `functions-python/` — deploy with `npm run deploy:functions:python`
- **namespace-core**: scaffolded only (all .gitkeep) — do not assume it has working code
- **knowledge module**: `modules/knowledge` EXISTS and is LIVE — owns workspace Knowledge tab + RAG documents list (WorkspaceKnowledgeTab)
- **file module**: `RagDocumentRecord` has complete metadata fields. `getWorkspaceRagDocuments(workspace)` is now exported.
- **Organization knowledge tab**: lists all workspaces with status + ready ratio + clickable links to workspace Knowledge tab
- **Document AI**: OCR Extractor (`1516a32299c1709e`) extracts text from binary files; OCR Classifier (`17f1013111dec644`) classifies document type. Both in `asia-southeast1`. Activated when `DOCUMENTAI_PROJECT_ID` env var is set.
- **rag_ingestion pipeline**: now uses `DocumentAiRagParser` (binary read + OCR) and `DocumentAiTaxonomyClassifier` when Document AI is enabled; falls back to passthrough. `ProcessedTextWriter` saves extracted text to Storage + patches Firestore `indexedAtISO`/`chunkCount`.
- **Validate with**: `npm run lint` or `npm run build` (no `typecheck` or `check` script on this branch); Python: `pytest tests/` in `functions-python/`
