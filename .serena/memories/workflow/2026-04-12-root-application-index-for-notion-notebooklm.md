# Scope
- Added root application indexes for notion and notebooklm to expose subdomain use-cases and DTO contracts.
- Target folders: modules/notion/application/{use-cases,dtos}, modules/notebooklm/application/{use-cases,dtos}.

# Decisions
- Use root index files as discoverability layer only; business behavior remains in subdomain application layers.
- Root notion application indexes aggregate authoring/collaboration/database use-cases and authoring/collaboration/database/knowledge DTOs.
- Root notebooklm application indexes aggregate notebook/source/synthesis use-cases and conversation/notebook/source DTOs.
- Removed .gitkeep placeholders from the four root application target folders and replaced with explicit index.ts files.
- Updated ESLint boundaries rule: main-domain-application can depend on same-domain subdomain-application.

# Validation
- npm run lint: pass with baseline 3 existing warnings (no new warnings from root application indexes).
- npm run build: pass.

# Outcome
- Global scanning can discover notion/notebooklm application capabilities directly at root application paths.
- Lint boundaries now align with context-wide application aggregation within a bounded context.
- Dependency direction remains interfaces -> application -> domain <- infrastructure.
