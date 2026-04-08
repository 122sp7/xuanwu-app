## Phase: impl
## Task: complete imported draft page result foundation
## Date: 2026-04-08

### Scope
- Upgraded source Draft Knowledge Page creation so imported content is written as tiptapJson instead of a legacy plain-text block.
- Fixed RichTextEditor load timing so persisted blocks are loaded after the editor instance becomes ready.

### Decisions / Findings
- The missing page content was not only a file-processing issue; RichTextEditor could skip loading persisted content because its loading effect did not depend on the editor instance.
- Writing imported content as a plain text block was structurally weak because the editor prefers a tiptapJson-backed block and would later create a second block on edit.
- createKnowledgeDraftFromSourceDocument now seeds one canonical tiptapJson block containing metadata and parsed excerpt paragraphs.

### Validation / Evidence
- npm run lint passed.
- npm run build passed.

### Deviations / Risks
- No live upload/browser verification was run in-session because the tested PDF is not present in the workspace and the active runtime under test may be remote.
- If the user tests a deployed environment, frontend hosting must be redeployed before this fix is visible.

### Open Questions
- Next iteration can split parsed content into section-aware blocks instead of a single import draft document.