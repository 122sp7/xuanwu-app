Scope:
- Consolidate duplicate workspace shell tabs that rendered the same notion/notebooklm surfaces.
- Keep existing deep links and saved sidebar preferences backward-compatible.

Decisions / Findings:
- Canonical top-level workspace tabs are now Knowledge, Notebook, and AiChat.
- Legacy URL tab aliases normalize as follows:
  - NotionKnowledge -> Knowledge
  - NotebookSynthesis -> Notebook
  - NotebookConversation -> AiChat
- Legacy nav preference ids normalize as follows:
  - notion-knowledge -> knowledge
  - notebook-synthesis -> notebook
  - notebook-conversation -> ai-chat
- Sidebar/default nav order no longer includes the duplicate tab entries.
- WorkspaceDetailRouteScreen redirects legacy alias URLs to canonical query values.

Files / Implementation:
- workspace tab registry and alias normalization in modules/workspace/interfaces/web/navigation/workspace-tabs.ts
- preference/order migration in modules/workspace/interfaces/web/navigation/workspace-nav-items.ts and nav-preferences-data.ts
- active tab normalization in WorkspaceDetailScreen, WorkspaceSidebarSection, and workspace-quick-access.tsx
- legacy URL redirect in WorkspaceDetailRouteScreen
- duplicate rendering branches removed from WorkspaceCrossModuleTabSurface

Validation / Evidence:
- npm run lint: pass with pre-existing warnings only, no new errors
- npm run build: pass
- Next.js MCP get_errors on port 3000: no runtime errors detected in active browser sessions

Deviations / Risks:
- Current Serena tool surface in this session does not expose explicit prune-index or restart-language-server commands, so memory was updated but Serena LSP/index refresh could only be approximated via successful validation and active project state.

Open Questions:
- Whether to remove now-unused legacy localization keys for NotionKnowledge / NotebookSynthesis / NotebookConversation from localized JSON files in a separate cleanup pass.