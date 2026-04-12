# Scope
- Added root application indexes for notion and notebooklm to expose subdomain use-cases and DTO contracts.
- Target folders: modules/notion/application/{use-cases,dtos}, modules/notebooklm/application/{use-cases,dtos}.

# Decisions
- Use root index files as discoverability layer only; business behavior remains in subdomain application layers.
- Root notion application indexes aggregate authoring/collaboration/database/knowledge plus placeholder exports for relations/taxonomy application roots.
- Root notebooklm application indexes aggregate notebook/source/synthesis use-cases and conversation/notebook/source DTOs.
- Removed .gitkeep placeholders in all four root application target folders.

# Validation
- npm run lint: pass (0 errors, 3 existing warnings unchanged).
- npm run build: pass.

# Outcome
- Global scanning can now discover notion/notebooklm application capabilities directly at root application paths without diving into subdomain trees first.
- Layer direction preserved: interfaces -> application -> domain <- infrastructure.
