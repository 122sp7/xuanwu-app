# NotebookLM Factory → Internal Composition Refactor

## Scope
- Session continuation from notion interfaces factory cleanup
- Extended same composition helper pattern to notebooklm interfaces

## Actions Taken

### Created composition helper files
- `modules/notebooklm/interfaces/source/composition/adapters.ts` — makeSourceFileAdapter, makeRagDocumentAdapter, makeSourceDocumentCommandAdapter, makeParsedDocumentAdapter, makeSourcePipelineAdapter, makeKnowledgePageGateway, waitForParsedDocument
- `modules/notebooklm/interfaces/notebook/composition/adapters.ts` — makeNotebookRepo
- `modules/notebooklm/interfaces/conversation/composition/adapters.ts` — makeThreadRepo

### Rewired interfaces (6 files)
- `interfaces/source/_actions/source-processing.actions.ts` → `../composition/adapters`
- `interfaces/source/_actions/source-pipeline.actions.ts` → `../composition/adapters`
- `interfaces/source/_actions/source-file.actions.ts` → `../composition/adapters`
- `interfaces/source/queries/source-file.queries.ts` → `../composition/adapters`
- `interfaces/notebook/_actions/generate-notebook-response.actions.ts` → `../composition/adapters`
- `interfaces/conversation/_actions/thread.actions.ts` → `../composition/adapters`

### Deleted obsolete subdomain api factories
- `modules/notebooklm/subdomains/source/api/factories.ts`
- `modules/notebooklm/subdomains/notebook/api/factories.ts`
- `modules/notebooklm/subdomains/conversation/api/factories.ts`

## Status of notion taxonomy/relations
- `interfaces/taxonomy/_actions/` and `interfaces/relations/_actions/` are `.gitkeep` only
- No infrastructure adapters exist for taxonomy or relations yet
- No composition helpers created — Occam: no infrastructure to wire → no helper needed yet
- When infrastructure is added, follow the same pattern as source/composition/adapters.ts

## Validation
- `npm run lint` → EXIT:0 (0 errors, 0 warnings)

## Governance Rule
- `api/` must not expose repository factories or internal composition helpers
- Internal wiring helpers belong in `interfaces/<subdomain>/composition/` or `infrastructure/` paths
- (Rule added to `.github/instructions/architecture-core.instructions.md` in prior session)
